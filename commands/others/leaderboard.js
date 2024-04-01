// leaderboard.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getLeaderboard } = require('../../functions/mongodb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Display the server leaderboard.'),
  async execute(interaction) {
    const leaderboard = await getLeaderboard();
    if (leaderboard.length > 0) {
      const leaderboardMsg = leaderboard.map(({ serverId, highestCount }) => `Server: ${serverId} - Highest Count: ${highestCount}`).join('\n');
      await interaction.reply("Leaderboard:\n" + leaderboardMsg);
    } else {
      await interaction.reply("Leaderboard is empty.");
    }
  },
};
