const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play Rock, Paper, Scissors!'),
  async execute(interaction) {
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('rock')
          .setLabel('Rock')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('paper')
          .setLabel('Paper')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('scissors')
          .setLabel('Scissors')
          .setStyle(ButtonStyle.Primary),
      );

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Rock, Paper, Scissors')
      .setDescription('Choose your move!');

    await interaction.reply({ embeds: [embed], components: [row] });

    const filter = i => i.customId === 'rock' || i.customId === 'paper' || i.customId === 'scissors';
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      const botChoices = ['rock', 'paper', 'scissors'];
      const botChoice = botChoices[Math.floor(Math.random() * botChoices.length)];

      const userChoice = i.customId;
      const result = determineWinner(userChoice, botChoice);

      embed.setDescription(`You chose ${userChoice}\nI chose ${botChoice}\nResult: ${result}`);
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

function determineWinner(player, bot) {
  if (player === bot) return 'It\'s a tie!';
  if (
    (player === 'rock' && bot === 'scissors') ||
    (player === 'paper' && bot === 'rock') ||
    (player === 'scissors' && bot === 'paper')
  ) {
    return 'You won!';
  } else {
    return 'You lost!';
  }
}
