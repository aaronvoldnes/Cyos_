// ban.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user.')
    .addUserOption(option => option.setName('user').setDescription('The user to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the ban')),
  async execute(interaction) {
    if (!interaction.guild) {
      return await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
    }

    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const userToBan = interaction.options.getUser('user');
    const rawReason = interaction.options.getString('reason');
    const reason = rawReason?.slice(0, 255) || 'No reason provided';

    if (!userToBan) {
      return await interaction.reply({ content: 'Invalid user.', ephemeral: true });
    }

    try {
      await interaction.guild.members.ban(userToBan, { reason: reason });
      await interaction.reply({ content: `${userToBan.tag} has been banned👋. Reason: ${reason}`, ephemeral: true });

      console.log(`User ${userToBan.tag} has been banned by ${interaction.user.tag}. Reason: ${reason}`);
    } catch (error) {
      console.error(error);

      if (error.code === 50013) {
        await interaction.reply({ content: 'I do not have permission to ban members.', ephemeral: true });
      } else if (error.code === 10026) {
        await interaction.reply({ content: 'Invalid user. Make sure the user is still in the server.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while trying to ban the user.', ephemeral: true });
      }
    }
  },
};
