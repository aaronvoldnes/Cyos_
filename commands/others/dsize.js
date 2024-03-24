const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('randomd')
    .setDescription('Generates a random-sized "8====D" for you.'),
  async execute(interaction) {
    // Generate random number of equals signs (between 1 and 25)
    const equalsCount = Math.floor(Math.random() * 25) + 1;
    const dSize = '8' + '='.repeat(equalsCount) + 'D';

    // Reply with the generated random "8====D"
    await interaction.reply(dSize);
  },
};
