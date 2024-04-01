const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { setCountingChannelId, getCountingChannelId } = require('../../functions/mongodb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('counting')
    .setDescription('Start counting game'),

  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
      return;
    }

    const guildId = interaction.guild.id;
    const channelId = interaction.channel.id;

    try {
      await setCountingChannelId(guildId, channelId);

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Counting Game Started')
        .setDescription('The counting game has been started in this channel! Get ready to count!');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);

      await interaction.reply('There was an error while trying to set the counting channel ID!');
    }
  },
};
