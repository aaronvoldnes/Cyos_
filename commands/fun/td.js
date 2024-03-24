const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('td')
    .setDescription('Play Truth or Dare in Discord!'),
  async execute(interaction) {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('truth')
          .setLabel('Truth')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('dare')
          .setLabel('Dare')
          .setStyle(ButtonStyle.Primary),
      );

    const embed = new EmbedBuilder()
      .setColor(0xFF5733)
      .setTitle('Truth or Dare')
      .setDescription('Choose Truth or Dare!');

    await interaction.reply({ embeds: [embed], components: [row] });

    const filter = i => i.customId === 'truth' || i.customId === 'dare';
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      let response;
      if (i.customId === 'truth') {
        // Truth logic - you can customize this part
        response = 'Share a fun fact about yourself in the voice chat.';
      } else {
        // Dare logic - you can customize this part
        response = 'Change your profile picture to a meme for the next 10 minutes. If you don\'t, send a voice message confessing your love for your favorite game in the Discord channel.';
      }

      embed.setDescription(response);
      await i.update({ embeds: [embed], components: [] });
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        embed.setDescription('Time is up. You took too long to choose!');
        interaction.editReply({ embeds: [embed], components: [] });
      }
    });
  },
};
