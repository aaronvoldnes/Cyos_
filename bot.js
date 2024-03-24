// bot.js

const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const path = require('path');
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

const commandsFolder = './commands';
const eventsFolder = './events';
const functionsFolder = './functions';

const baseFolders = [
    path.join(__dirname, commandsFolder),
    path.join(__dirname, eventsFolder),
    path.join(__dirname, functionsFolder)
];

const distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
});

async function loadSlashCommands() {
    try {
        for (const baseFolder of baseFolders) {
            const commandFolders = fs.readdirSync(baseFolder);

            for (const folder of commandFolders) {
                const folderPath = path.join(baseFolder, folder);
                if (fs.statSync(folderPath).isDirectory()) {
                    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

                    for (const file of commandFiles) {
                        const command = require(path.join(folderPath, file));
                        if (command && command.data && command.data.name) {
                            if (!client.commands) client.commands = new Map();
                            client.commands.set(command.data.name, command);
                            console.log(`Registered slash command: ${command.data.name}`);
                        } else {
                            console.error(`Error loading slash command from file ${file}: Invalid command structure`);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error loading slash commands:', error);
    }
}

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

client.login(token).then(async () => {
    console.log('Bot logged in successfully.');
    await loadSlashCommands();
}).catch(error => {
    console.error('Error logging in:', error);
});
