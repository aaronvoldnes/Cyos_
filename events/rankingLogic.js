const {
    getUserLevel,
    setUserLevel,
    getUserNextLevel,
    setUserNextLevel,
  } = require('../functions/mongodb');
  
  // Map to store the last user ID and timestamp who sent a message
  const lastUserTimestampMap = new Map();
  
  // Store the status of rank logic for each server
  const rankLogicStatus = {};
  
  const COOLDOWN_DURATION = 60 * 1000; // 1 minute cooldown
  const XP_PER_MESSAGE = 10;
  
  async function levelUpUser(message) {
    const serverId = message.guild?.id;
    const userId = message.author.id;
  
    if (isRankLogicEnabled(serverId)) {
      if (canUserGainExperience(serverId)) {
        const userLevel = await getUserLevel(serverId, userId);
        const userNextLevel = await getUserNextLevel(serverId, userId);
  
        const updatedExperience = userNextLevel + XP_PER_MESSAGE;
  
        if (updatedExperience >= getNextLevelExperience(userLevel)) {
          await setUserLevel(serverId, userId, userLevel + 1);
          await setUserNextLevel(serverId, userId, 0);
  
          const welcomeMessage = await getWelcomeMessage(serverId, message.channel.id);
          const formattedMessage = welcomeMessage.replace('{username}', message.author.username).replace('{level}', userLevel + 1);
          message.channel.send(formattedMessage);
        } else {
          await setUserNextLevel(serverId, userId, updatedExperience);
        }
      }
    }
  }
  
  function canUserGainExperience(serverId) {
    const lastTimestamp = lastUserTimestampMap.get(serverId);
    return !lastTimestamp || Date.now() - lastTimestamp > COOLDOWN_DURATION;
  }
  
  function getNextLevelExperience(level) {
    return 100 * level; // Adjust the formula as needed
  }
  
  function isRankLogicEnabled(guildId) {
    // Check if rank logic is enabled for the specified server
    return rankLogicStatus[guildId] === true;
  }
  
  // Add an event listener for message events
  function handleRankingMessages(client) {
    client.on('messageCreate', (message) => {
      if (!message.author.bot) {
        levelUpUser(message);
      }
    });
  }
  
  module.exports = { levelUpUser, handleRankingMessages, isRankLogicEnabled };
  