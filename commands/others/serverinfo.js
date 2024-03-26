const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Displays information about the server.'),
  async execute(interaction) {
    const guild = interaction.guild;
    const guildOwner = await guild.fetchOwner();

    // Total messages in server
    let totalMessages = 0;
    guild.channels.cache.forEach(channel => {
      if (channel.type === 'GUILD_TEXT') {
        totalMessages += channel.messages.cache.size;
      }
    });

    const serverInfo = [
      `**Server Name:** ${guild.name}`,
      `**Server ID:** ${guild.id}`,
      `**Created At:** ${guild.createdAt.toDateString()}`,
      `**Region:** ${guild.region}`,
      `**Member Count:** ${guild.memberCount}`,
      `**Owner:** ${guildOwner.user.tag}`,
      `**Total Messages:** ${totalMessages}`
    ];

    // Number of boosts
    const boosts = guild.premiumSubscriptionCount || 0;
    serverInfo.push(`**Boosts:** ${boosts}`);

    // List of roles
    const roleList = guild.roles.cache
      .filter(role => role.name !== '@everyone') // Exclude @everyone role
      .map(role => role.name)
      .join(', ');
    serverInfo.push(`**Roles:** ${roleList}`);

    // Calculate joins per week if bot is member of the guild
    if (guild.me) {
      const joinedAt = guild.me.joinedAt;
      const currentTime = new Date();
      const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
      const weeks = Math.round((currentTime - joinedAt) / millisecondsPerWeek);
      serverInfo.push(`**Joins per Week:** ${weeks}`);
    }

    await interaction.reply({ content: serverInfo.join('\n') });
  },
};
