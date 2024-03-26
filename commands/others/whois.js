const { SlashCommandBuilder } = require('@discordjs/builders');

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

    if (!user) {
      return interaction.reply({ content: "User not found!", ephemeral: true });
    }

    const joinedDiscord = user.createdAt.toDateString();
    const joinedServer = interaction.guild.members.cache.get(user.id).joinedAt.toDateString();
    const totalTime = getTotalTime(user.createdAt);

    const userInfo = [
      `**Username:** ${user.username}`,
      `**User ID:** ${user.id}`,
      `**Joined Discord:** ${joinedDiscord}`,
      `**Joined Server:** ${joinedServer}`,
      `**Total Time on Discord:** ${totalTime}`
    ];

    await interaction.reply({ content: userInfo.join('\n') });
  },
};

function getTotalTime(joinDate) {
  const currentTime = new Date();
  const totalTimeMs = currentTime - joinDate;
  const totalTimeDays = Math.floor(totalTimeMs / (1000 * 60 * 60 * 24));
  return `${totalTimeDays} days`;
}
