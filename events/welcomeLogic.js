// welcomeLogic.js
const { getWelcomeChannel, getWelcomeMessage } = require('../functions/mongodb');

module.exports = (client) => {
  client.on('guildMemberAdd', async (member) => {
    try {
      const guildId = member.guild.id;
      const channelId = await getWelcomeChannel(guildId);

      if (channelId) {
        const welcomeMessage = await getWelcomeMessage(guildId, channelId);

        if (welcomeMessage) {
          const formattedWelcomeMessage = welcomeMessage.replace('{username}', member.user.username);
          const welcomeChannel = member.guild.channels.cache.get(channelId);

          if (welcomeChannel) {
            await welcomeChannel.send(formattedWelcomeMessage);
          } else {
            console.error(`Welcome channel with ID ${channelId} not found.`);
          }
        } else {
          console.error(`Welcome message for channel ID ${channelId} not found.`);
        }
      } else {
        console.error(`Welcome channel ID not found for guild ID ${guildId}.`);
      }
    } catch (error) {
      console.error('Error in guildMemberAdd event:', error);
    }
  });
};
