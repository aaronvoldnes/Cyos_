// serverinfo.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Displays information about the server.'),
  async execute(interaction) {
    const guild = interaction.guild;
    const guildOwner = await guild.fetchOwner();

    const serverInfoEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Server Information')
      .addField('Server Name', guild.name)
      .addField('Server ID', guild.id)
      .addField('Created At', guild.createdAt.toDateString())
      .addField('Region', guild.region)
      .addField('Member Count', guild.memberCount)
      .addField('Owner', guildOwner.user.tag);

    // Number of boosts
    const boosts = guild.premiumSubscriptionCount || 0;
    serverInfoEmbed.addField('Boosts', boosts);

    // List of roles
    const roleList = guild.roles.cache
      .filter(role => role.name !== '@everyone') // Exclude @everyone role
      .map(role => role.name)
      .join(', ');
    serverInfoEmbed.addField('Roles', roleList);

    // Calculate joins per week
    const joinedAt = guild.me.joinedAt;
    const currentTime = new Date();
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    const weeks = Math.round((currentTime - joinedAt) / millisecondsPerWeek);
    serverInfoEmbed.addField('Joins per Week', weeks);

    await interaction.reply({ embeds: [serverInfoEmbed] });
  },
};
