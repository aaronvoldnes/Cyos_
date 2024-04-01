const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the song queue.'),
    async execute(interaction, distube) {
        try {
            const queue = distube.getQueue(interaction.guildId);
            if (!queue) return interaction.reply({ content: 'There is nothing in the queue right now!', ephemeral: true });

            queue.shuffle();
            
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setDescription('Shuffled songs in the queue');

            interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('There was an error while processing this command!');

            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
