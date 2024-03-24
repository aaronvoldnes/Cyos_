// autoplay.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Toggle autoplay for the current queue.'),
    async execute(interaction, distube) {
        try {
            const queue = distube.getQueue(interaction.guildId);
            if (!queue) return interaction.reply({ content: 'There is nothing in the queue right now!' });

            const autoplay = queue.toggleAutoplay();
            interaction.reply({ content: `AutoPlay: \`${autoplay ? 'On' : 'Off'}\`` });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while processing this command!' });
        }
    },
};
