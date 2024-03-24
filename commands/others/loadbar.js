// loadbar.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('loadbar')
      .setDescription('Replies with a loadbar.'),
    async execute(interaction) {
        await interaction.deferReply({ content: 'Loading... (0/10)', ephemeral: true });
        for (let i = 1; i <= 10; i++) {
            await new Promise(resolve => setTimeout(resolve, 300));
            await interaction.editReply(`Loading... (${i}/10)`);
        }
        await interaction.editReply('You just wasted more than 10 seconds on watching a loadbar!');
    },
};
