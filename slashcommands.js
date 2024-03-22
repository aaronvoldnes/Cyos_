// slashcommands.js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId } = require('./config.json');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command && command.data && command.data.name) {
    commands.push(command.data.toJSON());
  } else {
    console.error(`Error loading command from file ${file}: Invalid command structure`);
  }
}

const rest = new REST({ version: '9' }).setToken(token);
const client_Id = clientId;
const guildId = null; // Set to null for global commands

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      guildId
        ? Routes.applicationGuildCommands(client_Id, guildId)
        : Routes.applicationCommands(client_Id),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error refreshing application (/) commands:', error);
  }
})();
