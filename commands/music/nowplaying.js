const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Display the currently playing song.'),
    async execute(interaction, distube) {
        try {
            const queue = distube.getQueue(interaction.guildId);
            if (!queue || !queue.songs[0]) return interaction.reply({ content: 'There is nothing playing right now!', ephemeral: true });

            const song = queue.songs[0];

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Now Playing')
                .setDescription(`I'm playing **\`${song.name}\`**, by ${song.user}`);

            interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while processing this command!', ephemeral: true });
        }
    },
};
