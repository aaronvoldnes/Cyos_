const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banner')
    .setDescription('View the banner of a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user whose banner you want to view.')
        .setRequired(false)),
  async execute(interaction) {
    let user = interaction.options.getUser('user') || interaction.user;

    if (!user.banner) {
      try {
        user = await interaction.client.users.fetch(user.id, { force: true });
      } catch (error) {
        console.error('Error fetching user:', error);
        await interaction.reply('Error fetching user information.');
        return;
      }
    }

    const bannerEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`Banner of ${user.username}`)
      .setImage(user.bannerURL({ dynamic: true, size: 4096 }));

    await interaction.reply({ embeds: [bannerEmbed] });
  },
};
