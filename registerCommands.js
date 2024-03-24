// registerCommands.js

const fs = require('fs');
const { clientId, token } = require('./config.json');

async function registerSlashCommands() {
    try {
        const url = `https://discord.com/api/v9/applications/${clientId}/commands`;

        const slashCommands = JSON.parse(fs.readFileSync('./slashCommands.json'));

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bot ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(slashCommands),
        });

        if (response.ok) {
            console.log('Successfully registered application (/) commands.');
        } else {
            console.error('Failed to register application (/) commands:', await response.text());
        }
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
}

module.exports = registerSlashCommands;
