// ping.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with the bot\'s ping.'),
  async execute(interaction) {
    const ping = Date.now() - interaction.createdTimestamp;
    await interaction.reply(`Pong! Cyos's latency is ${ping}ms.`);
  },
};
