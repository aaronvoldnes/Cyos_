const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

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
                const embed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setDescription('Resumed the song for you.');

                interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                queue.pause();
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('Paused the song for you.');

                interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while processing this command!', ephemeral: true });
        }
    },
};
