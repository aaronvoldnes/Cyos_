// ping.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription("Replies with the bot's ping."),
  async execute(interaction) {
    const ping = Date.now() - interaction.createdTimestamp;

    // Creating the embed
    const embed = new EmbedBuilder()
      .setColor('#3E4856')
      .setTitle('Pong')
      .setDescription(`Cyos's latency is ${ping}ms.`);

    await interaction.reply({ embeds: [embed] });
  },
};
