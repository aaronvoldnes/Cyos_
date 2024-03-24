const { SlashCommandBuilder } = require('discord.js');
const { setCountingChannelId, getCountingChannelId } = require('../../functions/mongodb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('counting')
    .setDescription('Start counting game'),

  async execute(interaction) {
    // Check if the user has the ADMINISTRATOR permission
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
      return;
    }

    const guildId = interaction.guild.id;
    const channelId = interaction.channel.id;

    try {
      // Delete old channel IDs and store the new channel ID in MongoDB
      await setCountingChannelId(guildId, channelId);
      await interaction.reply(`Counting game started 😃`);
    } catch (error) {
      console.error(error);
      await interaction.reply('There was an error while trying to set the counting channel ID.');
    }
  },
};
