const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('randomd')
    .setDescription('Get a random "D" representation')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to get randomd')
        .setRequired(false)),

  async execute(interaction) {
    let user = interaction.options.getUser('user');
    
    if (!user) {
      user = interaction.user;
    }
    
    const randomLength = Math.floor(Math.random() * 25) + 1;
    const dRepresentation = "8" + "=".repeat(randomLength) + "D";

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`${user.username}'s Random D`)
      .setDescription(dRepresentation);

    await interaction.reply({ embeds: [embed] });
  },
};
