// ping.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('help.'),
  async execute(interaction) {
    await interaction.reply(`not working`);
  },
};
