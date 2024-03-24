// queue.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Display the current song queue.'),
    async execute(interaction, distube) {
        try {
            const queue = distube.getQueue(interaction.guildId);
            if (!queue) return interaction.reply({ content: 'There is nothing playing!', ephemeral: true });

            const q = queue.songs
                .map((song, i) => `${i === 0 ? 'Playing:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
                .join('\n');
            interaction.reply({ content: `**Server Queue**\n${q}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while processing this command!', ephemeral: true });
        }
    },
};
