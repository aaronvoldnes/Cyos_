const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guilds')
    .setDescription('Display information about all guilds the bot is in.'),

  async execute(interaction) {
    const guildInfoEmbed = new EmbedBuilder()
      .setTitle("Guild Information")
      .setDescription(
        interaction.client.guilds.cache.map(g =>
          `**Guild Name:** ${g.name}\n**Total Members:** ${g.members.cache.size}\n**Guild ID:** ${g.id}`
        ).join('\n\n')
      );

    await interaction.reply({ embeds: [guildInfoEmbed] });
  },
};
