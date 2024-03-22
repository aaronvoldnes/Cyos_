// music.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song.')
    .addStringOption(option =>
      option.setName('song')
        .setDescription('Enter a song URL or query to search.')
        .setRequired(true)
    ),
  async execute(interaction, distube) {
    const string = interaction.options.getString('song');
    if (!string) return interaction.reply({ content: 'Please enter a song URL or query to search.', ephemeral: true });

    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'You must be in a voice channel!', ephemeral: true });
    }

    await interaction.deferReply();

    try {
      await distube.play(interaction.member.voice.channel, string, {
        member: interaction.member,
        textChannel: interaction.channel,
        message: null, 
      });
      interaction.editReply({ content: 'Song added to the queue!' });
    } catch (error) {
      console.error(error);
      interaction.followUp({ content: 'There was an error while processing this command!', ephemeral: true });
    }
  },
};
