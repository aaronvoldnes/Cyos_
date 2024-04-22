const { setUserLevel, getUserLevel, getLeaderboard } = require('../functions/mongodb');

// Function to send level up message and update user rank
async function handleLevelUpMessage(guildId, userId, newLevel, client) {
    // Set user's new level in the database
    await setUserLevel(guildId, userId, newLevel);

    // Get updated leaderboard
    const leaderboard = await getLeaderboard();

    // Find user's rank in the leaderboard
    const userRank = leaderboard.findIndex(entry => entry.serverId === guildId && entry.highestCount === newLevel);

    // Send level up message to the user
    const user = await client.users.fetch(userId);
    user.send(`Congratulations! You leveled up to level ${newLevel}! Your rank: ${userRank + 1}`);
}

module.exports = {
    startRankingLogic: function (client) {
        client.on("messageCreate", async function (message) {
            if (message.author.bot) return;

            const guildId = message.guild?.id;
            const userId = message.author.id;
            const currentLevel = await getUserLevel(guildId, userId);
            const messageThreshold = 10; // Adjust as per preference

            // Calculate new level based on message count
            const newLevel = Math.floor(message.member.messages.cache.size / messageThreshold);

            // Check if user leveled up
            if (newLevel > currentLevel) {
                // Update user's level and send level up message
                await handleLevelUpMessage(guildId, userId, newLevel, client);
            }
        });
    }
};
