// skip.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the currently playing song.'),
    async execute(interaction, distube) {
        try {
            const queue = distube.getQueue(interaction.guildId);
            if (!queue) return interaction.reply({ content: 'There is nothing in the queue right now!', ephemeral: true });

            const song = await queue.skip();
            interaction.reply({ content: `Skipped! Now playing: ${song.name}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: `Error: ${error}`, ephemeral: true });
        }
    },
};
