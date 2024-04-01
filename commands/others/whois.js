const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whois')
    .setDescription('Get information about a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to get information about')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);

    if (!user) {
      return interaction.reply({ content: "User not found!", ephemeral: true });
    }

    const joinedDiscord = user.createdAt.toDateString();
    const joinedServer = member.joinedAt.toDateString();
    const nickname = member.nickname || 'None';
    const totalTime = getTotalTime(user.createdAt);

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`**${nickname}'s** Information`) 
      .addFields(
        { name: 'Username', value: user.username },
        { name: 'Nickname', value: nickname },
        { name: 'User ID', value: user.id },
        { name: 'Joined Discord', value: joinedDiscord },
        { name: 'Joined Server', value: joinedServer },
        { name: 'Total Time on Discord', value: totalTime }
      );

    await interaction.reply({ embeds: [embed] });
  },
};

function getTotalTime(joinDate) {
  const currentTime = new Date();
  const totalTimeMs = currentTime - joinDate;
  const totalTimeDays = Math.floor(totalTimeMs / (1000 * 60 * 60 * 24));
  return `${totalTimeDays} days`;
}
