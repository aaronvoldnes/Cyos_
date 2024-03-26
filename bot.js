// bot.js

const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const { connectToDatabase, getWelcomeChannel, getWelcomeMessage } = require('./functions/mongodb');
const { DisTube } = require('distube');

// Import the function to register slash commands
const registerSlashCommands = require('./registerCommands');

// Create a new Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

// Initialize DisTube
const distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
});

// Map to store slash commands
client.commands = new Map();
client.textCommands = new Map();

// Function to load slash commands
async function loadSlashCommands() {
    try {
        const subFolders = fs.readdirSync('./commands', { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        for (const folder of subFolders) {
            const folderPath = `./commands/${folder}`;
            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const command = require(`${folderPath}/${file}`);
                if (command && command.data && command.data.name) {
                    client.commands.set(command.data.name, command);
                } else {
                    console.error(`Error loading slash command from file ${file} in folder ${folder}: Invalid command structure`);
                }
            }
        }
    } catch (error) {
        console.error('Error loading slash commands:', error);
    }
}

// Function to load events
async function loadEvents() {
    try {
        const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(`./events/${file}`);
            if (event && typeof event === 'function') {
                event(client, distube);
            } else {
                console.error(`Error loading event from file ${file}: Invalid event structure`);
            }
        }
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

// Log in to Discord and register slash commands
client.login(token).then(async () => {
    console.log('Bot logged in successfully.');
    await loadSlashCommands();
    await loadEvents();
    await registerSlashCommands(); // Register slash commands after logging in
}).catch(error => {
    console.error('Error logging in:', error);
});

// Event: Bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setBotStatus();
    setInterval(setBotStatus, 5000);
    connectToDatabase();
    setInterval(sendDataToMongoDB, 3600000);
});

// Event: Interaction with slash commands
client.on('interactionCreate', async (interaction) => {
    try {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (command) {
                await command.execute(interaction, distube);
            } else {
                console.error(`Unknown command: ${interaction.commandName}`);
            }
        }
    } catch (error) {
        console.error('Error executing interaction:', error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Event: Slash command deleted
client.on('commandDelete', (deletedCommand) => {
    console.log(`Command ${deletedCommand.data.name} was deleted.`);
});

// Event: New member joins guild
client.on('guildMemberAdd', async (member) => {
    const guildId = member.guild.id;
    const channelId = await getWelcomeChannel(guildId);
    const welcomeMessage = await getWelcomeMessage(guildId, channelId);

    if (channelId && welcomeMessage) {
        const formattedWelcomeMessage = welcomeMessage.replace('{username}', member.user.username);
        const welcomeChannel = member.guild.channels.cache.get(channelId);

        if (welcomeChannel) {
            await welcomeChannel.send(formattedWelcomeMessage);
        } else {
            console.error(`Welcome channel with ID ${channelId} not found.`);
        }
    }
});

// Function: Send data to MongoDB
async function sendDataToMongoDB() {
    try {
        console.log('Data sent to MongoDB successfully.');
    } catch (error) {
        console.error('Error sending data to MongoDB:', error);
    }
}

// Function: Set bot status
function setBotStatus() {
    try {
        const guildCount = client.guilds.cache.size;
        if (guildCount === 0) {
            console.log('Bot is not in any guilds yet.');
            return;
        }

        const randomGuild = Array.from(client.guilds.cache.values())[Math.floor(Math.random() * guildCount)];
        const statuses = [
            { name: `${guildCount} servers 😃`, type: ActivityType.Watching },
            { name: `${randomGuild.name} server`, type: ActivityType.Watching },
        ];

        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        client.user.setPresence({
            activities: [randomStatus],
        });
    } catch (error) {
        console.error('Error setting bot status:', error);
    }
}

module.exports = { client, distube };