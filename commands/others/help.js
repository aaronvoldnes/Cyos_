// ping.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Ping!'),
  async execute(interaction) {
    await interaction.reply(`help is not coming`);
  },
};
