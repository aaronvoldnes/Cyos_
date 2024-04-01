const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the currently playing song.'),
    async execute(interaction, distube) {
        try {
            const queue = distube.getQueue(interaction.guildId);
            if (!queue) return interaction.reply({ content: 'There is nothing in the queue right now!', ephemeral: true });

            const song = await queue.skip();
            
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setDescription(`Skipped! Now playing: ${song.name}`);

            interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription(`Error: ${error}`);

            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
