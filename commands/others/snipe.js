// snipe.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('Snipes the last deleted message in the channel.'),
  async execute(interaction) {
    const fetchedMessages = await interaction.channel.messages.fetch({ limit: 5 });
    const snipedMessage = fetchedMessages.find(msg => msg.deleted);

    if (!snipedMessage) {
      await interaction.reply('There are no recently deleted messages to snipe.');
      return;
    }

    const snipeEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setDescription(snipedMessage.content)
      .setAuthor(snipedMessage.author.tag, snipedMessage.author.avatarURL())
      .setTimestamp(snipedMessage.createdAt);

    await interaction.reply({ embeds: [snipeEmbed] });
  },
};
