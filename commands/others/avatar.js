// avatar.js
const { SlashCommandBuilder } = require('@discordjs/builders');

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
    const avatarEmbed = `Avatar of ${user.username}:\n${user.displayAvatarURL({ dynamic: true })}`;

    await interaction.reply(avatarEmbed);
  },
};
