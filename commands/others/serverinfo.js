const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Get information about the server'),

  async execute(interaction) {
    const guild = interaction.guild;
    
    if (!guild) {
      return interaction.reply({ content: "Server not found!", ephemeral: true });
    }


    const guildOwner = await guild.fetchOwner();
    const createdDate = guild.createdAt.toDateString();
    const memberCount = guild.memberCount;
    const boostLevel = guild.premiumTier;
    const serverIcon = guild.iconURL({ dynamic: true });
    const roles = guild.roles.cache.map(role => role.name).join(', ');

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`**${guild.name}** Server Information`)
      .setThumbnail(serverIcon)
      .addFields(
        { name: 'Server ID', value: guild.id },
        { name: 'Owner', value: `${guildOwner.user.tag}` },
        { name: 'Boost Level', value: boostLevel.toString() },
        { name: 'Created At', value: createdDate },
        { name: 'Member Count', value: memberCount.toString() },
        { name: 'Roles', value: roles }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
