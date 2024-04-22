const { setLevelSystemConfig } = require('../../functions/mongodb'); // Import MongoDB functions for storing level system configuration

module.exports = {
    data: {
        name: 'levelsystem',
        description: 'Enable or disable the ranking/level system for the server.',
        options: [
            {
                name: 'enable',
                description: 'Enable the level system for the server.',
                type: 'SUB_COMMAND',
            },
            {
                name: 'disable',
                description: 'Disable the level system for the server.',
                type: 'SUB_COMMAND',
            },
            {
                name: 'setchannel',
                description: 'Set the channel for level up messages.',
                type: 'SUB_COMMAND',
                options: [
                    {
                        name: 'channel',
                        description: 'The channel for level up messages.',
                        type: 'CHANNEL',
                        required: true,
                    },
                ],
            },
        ],
    },
    async execute(interaction) {
        // Check if user is an admin
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You must be an administrator to use this command.', ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'enable') {
            // Enable the level system
            await setLevelSystemConfig(interaction.guildId, true);
            return interaction.reply({ content: 'Level system enabled for this server.', ephemeral: true });
        } else if (subcommand === 'disable') {
            // Disable the level system
            await setLevelSystemConfig(interaction.guildId, false);
            return interaction.reply({ content: 'Level system disabled for this server.', ephemeral: true });
        } else if (subcommand === 'setchannel') {
            const channel = interaction.options.getChannel('channel');
            if (!channel || channel.type !== 'GUILD_TEXT') {
                return interaction.reply({ content: 'Please provide a text channel.', ephemeral: true });
            }
            // Set the channel for level up messages
            // You can implement this part as per your requirement
            return interaction.reply({ content: `Level up messages will be sent in ${channel}`, ephemeral: true });
        }
    },
};
