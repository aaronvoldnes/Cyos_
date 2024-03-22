// bot.js

const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const { connectToDatabase, getWelcomeChannel, getWelcomeMessage } = require('./functions/mongodb');
const { DisTube } = require('distube');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
});



const distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
});


const slashCommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

client.commands = new Map();
client.textCommands = new Map();

async function loadSlashCommands() {
    try {
        for (const file of slashCommandFiles) {
            const command = require(`./commands/${file}`);
            if (command && command.data && command.data.name) {
                client.commands.set(command.data.name, command);
            } else {
                console.error(`Error loading slash command from file ${file}: Invalid command structure`);
            }
        }
    } catch (error) {
        console.error('Error loading slash commands:', error);
    }
}

async function loadEvents() {
    try {
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

client.login(token).then(async () => {
    console.log('Bot logged in successfully.');
    await loadSlashCommands();
    await loadEvents();
}).catch(error => {
    console.error('Error logging in:', error);
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setBotStatus();
    setInterval(setBotStatus, 5000);
    connectToDatabase();
    setInterval(sendDataToMongoDB, 3600000);
});

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



client.on('commandDelete', (deletedCommand) => {
    console.log(`Command ${deletedCommand.data.name} was deleted.`);
});

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

async function sendDataToMongoDB() {
    try {
        console.log('Data sent to MongoDB successfully.');
    } catch (error) {
        console.error('Error sending data to MongoDB:', error);
    }
}

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

