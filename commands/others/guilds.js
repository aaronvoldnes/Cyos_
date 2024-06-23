const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js'); // Use MessageEmbed instead of EmbedBuilder

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guilds')
    .setDescription('Display information about all guilds the bot is in.'),

  async execute(interaction) {
    const guildInfoEmbed = new EmbedBuilder()
      .setTitle("Guild Information")
      .setDescription(
        interaction.client.guilds.cache.map(guild =>
          `**Guild Name:** ${guild.name}\n**Total Members:** ${guild.memberCount}\n**Guild ID:** ${guild.id}`
        ).join('\n\n')
      );

    await interaction.reply({ embeds: [guildInfoEmbed] });
  },
};
