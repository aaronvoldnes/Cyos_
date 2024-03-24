const { SlashCommandBuilder } = require('discord.js');
const { setWelcomeMessage, setWelcomeChannel } = require('../../functions/mongodb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcomemsg')
    .setDescription('Set the welcome channel and message for new users')
    .addChannelOption(option => option.setName('channel').setDescription('Select the welcome channel').setRequired(true))
    .addStringOption(option => option.setName('message').setDescription('Enter the welcome message')),

  async execute(interaction) {
    try {
      // Check user permissions
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return await interaction.reply({
          content: 'You do not have permission to use this command!',
          ephemeral: true,
        });
      }

      const guildId = interaction.guild.id;
      const channelId = interaction.options.getChannel('channel').id;
      const welcomeMessage = interaction.options.getString('message');

      // Check bot permissions
      const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
      if (!botMember.permissionsIn(channelId).has('SEND_MESSAGES')) {
        return await interaction.reply({
          content: 'I do not have permission to send messages in the specified welcome channel.',
          ephemeral: true,
        });
      }

      // Update welcome channel and message in the database
      await setWelcomeChannel(guildId, channelId);
      await setWelcomeMessage(guildId, channelId, welcomeMessage);

      // Provide success feedback to the user
      const embed = {
        color: 0x00ff00,
        title: 'Welcome Channel and Message Set',
        description: `Welcome channel and message set for new users:\nChannel: <#${channelId}>\nMessage: ${welcomeMessage}`,
      };
      return await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error setting welcome channel and message:', error);

      // Provide error feedback to the user
      const errorEmbed = {
        color: 0xff0000,
        title: 'Error',
        description: 'There was an error while trying to set the welcome channel and message.',
      };
      return await interaction.reply({ embeds: [errorEmbed] });
    }
  },
};
