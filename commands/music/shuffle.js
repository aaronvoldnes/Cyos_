// shuffle.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the song queue.'),
    async execute(interaction, distube) {
        try {
            const queue = distube.getQueue(interaction.guildId);
            if (!queue) return interaction.reply({ content: 'There is nothing in the queue right now!', ephemeral: true });

            queue.shuffle();
            interaction.reply({ content: 'Shuffled songs in the queue', ephemeral: true });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while processing this command!', ephemeral: true });
        }
    },
};
