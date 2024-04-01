const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('View the avatar of a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user whose avatar you want to view.')
        .setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;

    const avatarEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`Avatar of ${user.username}`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }));

    await interaction.reply({ embeds: [avatarEmbed] });
  },
};
