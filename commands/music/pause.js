// pause.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause or resume the currently playing song.'),
    async execute(interaction, distube) {
        try {
            const queue = distube.getQueue(interaction.guildId);
            if (!queue) return interaction.reply({ content: 'There is nothing in the queue right now!', ephemeral: true });

            if (queue.paused) {
                queue.resume();
                interaction.reply({ content: 'Resumed the song for you :)', ephemeral: true });
            } else {
                queue.pause();
                interaction.reply({ content: 'Paused the song for you :)', ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while processing this command!', ephemeral: true });
        }
    },
};
