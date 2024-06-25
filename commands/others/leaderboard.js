const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getLeaderboard } = require('../../functions/mongodb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Display the server leaderboard.'),
  async execute(interaction) {
    const leaderboard = await getLeaderboard();
    const client = interaction.client;

    if (leaderboard.length > 0) {
      const embed = new EmbedBuilder()
        .setColor(0x0000FF)
        .setTitle('Server Leaderboard')
        .setTimestamp();

      leaderboard.forEach(({ serverId, highestCount }, index) => {
        const guild = client.guilds.cache.get(serverId);
        const serverName = guild ? guild.name : 'Unknown Server';
        embed.addFields({
          name: `#${index + 1} Server: ${serverName} (${serverId})`,
          value: `Highest Count: ${highestCount}`,
          inline: false
        });
      });

      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.reply("Leaderboard is empty.");
    }
  },
};
