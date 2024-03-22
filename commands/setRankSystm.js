const { SlashCommandBuilder } = require('discord.js');
const { setWelcomeChannel, setWelcomeMessage, getWelcomeMessage } = require('../functions/mongodb');
const { enableRankLogic, disableRankLogic, isRankLogicEnabled } = require('../events/rankingLogic');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ranksetup')
    .setDescription('Enable or disable the rank system for the server')
    .addStringOption(option => option.setName('message').setDescription('Level-up message').setRequired(false)),

  async execute(interaction) {
    try {
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        return;
      }

      const guildId = interaction.guild.id;
      const channelId = interaction.channel.id;
      const customMessage = interaction.options.getString('message');

      const isRankSystemEnabled = isRankLogicEnabled(guildId);

      if (isRankSystemEnabled) {
        disableRankLogic(guildId);
        await interaction.reply('Rank system disabled successfully!');
      } else {
        await setWelcomeChannel(guildId, channelId);

        const defaultMessage = 'Congratulations {username}, you just leveled up to level {level}!';
        const welcomeMessage = customMessage || (await getWelcomeMessage(guildId, channelId)) || defaultMessage;
        await setWelcomeMessage(guildId, channelId, welcomeMessage);

        enableRankLogic(guildId);
        await interaction.reply('Rank system enabled successfully!');
      }
    } catch (error) {
      console.error('Error during rank system setup:', error);
      await interaction.reply('There was an error while trying to set up the rank system.');
    }
  },
};
