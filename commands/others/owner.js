const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('owner')
    .setDescription('Replies with the bot\'s Creator.'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Cyos Creator')
      .setDescription('The creator of Cyos is [xr_n](https://discord.com/idiot).');

    await interaction.reply({ embeds: [embed] });
  },
};
