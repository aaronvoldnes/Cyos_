const { getUserLevel } = require('../../functions/mongodb'); // Import MongoDB function to get user level

module.exports = {
    data: {
        name: 'rank',
        description: 'Show your rank based on messages sent and time spent in voice channels.',
    },
    async execute(interaction) {
        // Calculate user's rank
        const userLevel = await getUserLevel(interaction.guildId, interaction.user.id);
        interaction.reply({ content: `Your level: ${userLevel}`, ephemeral: true });
    },
};
