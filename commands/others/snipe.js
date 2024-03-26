// ping.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('Snipe last deleted message'),
  async execute(interaction) {
    await interaction.reply(`snipe is coming soon`);
  },
};
