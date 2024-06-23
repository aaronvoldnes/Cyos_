const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, EmbedBuilder } = require('discord.js');
const { setAutoRole } = require('../../functions/mongodb'); // Adjust path as per your project structure
const config = require('../../config.json'); // Adjust path as per your project structure

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setautorole')
    .setDescription('Set the auto role for new users')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Select the auto role')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      // Check user permissions
      if (!interaction.member.permissions.has("ADMINISTRATOR")) {
        return await interaction.reply({
          content: 'You do not have permission to use this command!',
          ephemeral: true,
        });
      }

      const guildId = interaction.guild.id;
      const roleId = interaction.options.getRole('role').id;

      // Update auto role in the database
      await setAutoRole(guildId, roleId);

      // Create embed for confirmation
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Auto Role Set')
        .setDescription(`New users will automatically receive the <@&${roleId}> role.`);

      // Provide success feedback to the user
      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error('Error setting auto role:', error);

      // Provide error feedback to the user
      const errorEmbed = new MessageEmbed()
        .setColor(config.embed.errorColor)
        .setTitle('Error')
        .setDescription('There was an error while trying to set the auto role.')
        .setFooter(config.embed.footer);

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
