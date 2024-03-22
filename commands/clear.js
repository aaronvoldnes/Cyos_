// clear.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clears messages in the channel.')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to clear (max 100)')
        .setRequired(true)),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    // Check if the amount is valid
    if (amount <= 0 || amount > 100) {
      return interaction.reply('Please provide a valid number of messages to clear (1-100).');
    }

    // Fetch messages and check their age
    const messages = await interaction.channel.messages.fetch({ limit: amount });
    const now = Date.now();
    const fourteenDaysAgo = now - (14 * 24 * 60 * 60 * 1000);

    const messagesToDelete = messages.filter(message =>
      !message.pinned && (now - message.createdTimestamp) < fourteenDaysAgo
    );

    // Check if there are messages to delete
    if (messagesToDelete.size === 0) {
      return interaction.reply('No eligible messages to clear.');
    }

    // Delete messages
    try {
      await interaction.channel.bulkDelete(messagesToDelete, true);
    } catch (error) {
      console.error(error);
      return interaction.reply('There was an error while clearing messages.');
    }

    // Check if the interaction is still valid before replying
    if (!interaction.replied) {
      return interaction.reply(`Cleared ${messagesToDelete.size} messages.`);
    }
  },
};
