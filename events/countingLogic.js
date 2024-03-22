const { getCountingChannelId, setNextCount, getNextCount } = require('../functions/mongodb');

// Map to store the last user ID who sent a number
const lastUserMap = new Map();

async function startCountingGame(client) {
  client.on("messageCreate", async function (message) {
    if (message.author.bot) return;

    const serverId = message.guild?.id;
    const countingChannelId = await getCountingChannelId(serverId);

    if (countingChannelId && message.channel.id === countingChannelId) {
      const userId = message.author.id;
      const num = parseInt(message.content);

      if (!isNaN(num)) {
        const nextCount = await getNextCount(serverId);

        if (num === nextCount) {
          // Check if the user is the next in line to send a number
          if (!lastUserMap.has(serverId) || lastUserMap.get(serverId) !== userId) {
            lastUserMap.set(serverId, userId);

            await setNextCount(serverId, nextCount + 1);
            message.react("✅");
          } else {
            message.react("🚫");
            message.reply(`You can't send more than one number in a row. Wait for someone else to send the next number.`);
          }
        } else {
          message.react("❌");
          message.reply(`Wrong Number. Correct Number is **${nextCount}**! Restart the counting with typing **1** in the chat!`);

          await setNextCount(serverId, 1);
          lastUserMap.delete(serverId); // Reset last user when counting restarts
        }
      } else {
        message.react("⚠️");
        const currentCount = await getNextCount(serverId);
        message.reply(`Invalid input. Please type **${currentCount}** to continue the count`);
      }
    }
  });
}

module.exports = startCountingGame;
