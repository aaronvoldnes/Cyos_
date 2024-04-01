const { MongoClient } = require('mongodb');
const { mongodb } = require('../config.json');

const mongoUri = mongodb;
let client; 

async function connectToDatabase() {
  try {
    if (!client || (client.topology && client.topology.isConnected())) {
      client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
      console.log('Connected to MongoDB');
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}


async function disconnectFromDatabase() {
  try {
    if (client && client.topology.isConnected()) {
      await client.close();
      console.log('Disconnected from MongoDB');
    }
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}


async function executeDatabaseOperation(operation) {
  try {
    if (!client || !client.topology.isConnected()) {
      throw new Error('Not connected to MongoDB');
    }

    return await operation(client.db('Cyos'));
  } catch (error) {
    console.error('Error executing database operation:', error);
    throw error;
  }
}



async function getCountingChannelId(guildId) {
  return await executeDatabaseOperation(async (database) => {
    const collection = database.collection('countingChannels');
    const result = await collection.findOne({ guildId });
    return result ? result.channelId : null;
  });
}

async function setCountingChannelId(guildId, channelId) {
  await executeDatabaseOperation(async (database) => {
    const collection = database.collection('countingChannels');

    console.log(`Storing guild ID: ${guildId}, Counting Channel ID: ${channelId}`);

    await collection.deleteMany({ guildId });

    await collection.insertOne({ guildId, channelId });

    console.log(`Guild ID: ${guildId} and Counting Channel ID: ${channelId} saved successfully`);
  });
}

async function getNextCount(guildId) {
  return await executeDatabaseOperation(async (database) => {
    const collection = database.collection('nextCounts');
    const result = await collection.findOne({ guildId });
    return result ? result.nextCount : 1;
  });
}

async function setNextCount(guildId, nextCount) {
  await executeDatabaseOperation(async (database) => {
    const collection = database.collection('nextCounts');

    console.log(`Storing guild ID: ${guildId}, Next Count: ${nextCount}`);

    await collection.deleteMany({ guildId, nextCount: { $lt: nextCount } });

    await collection.updateOne(
      { guildId },
      { $set: { guildId, nextCount } },
      { upsert: true }
    );

    console.log(`Guild ID: ${guildId} and Next Count: ${nextCount} saved successfully`);
  });
}

async function getWelcomeMessage(guildId, channelId) {
  return await executeDatabaseOperation(async (database) => {
    const collection = database.collection('welcomeMessages');
    const result = await collection.findOne({ guildId, channelId });
    return result ? result.message : null;
  });
}

async function setWelcomeMessage(guildId, channelId, messageContent) {
  await executeDatabaseOperation(async (database) => {
    const collection = database.collection('welcomeMessages');

    console.log(`Updating guild ID: ${guildId}, Channel ID: ${channelId}, Welcome Message: ${messageContent}`);

    await collection.updateOne(
      { guildId, channelId },
      { $set: { guildId, channelId, message: messageContent } },
      { upsert: true }
    );

    console.log(`Guild ID: ${guildId}, Channel ID: ${channelId}, Welcome Message: ${messageContent} updated successfully`);
  });
}

async function getWelcomeChannel(guildId) {
  return await executeDatabaseOperation(async (database) => {
    const collection = database.collection('welcomeChannels');
    const result = await collection.findOne({ guildId });
    return result ? result.channelId : null;
  });
}

async function setWelcomeChannel(guildId, channelId) {
  await executeDatabaseOperation(async (database) => {
    const collection = database.collection('welcomeChannels');

    console.log(`Storing guild ID: ${guildId}, Welcome Channel ID: ${channelId}`);

    await collection.deleteMany({ guildId });

    await collection.insertOne({ guildId, channelId });

    console.log(`Guild ID: ${guildId} and Welcome Channel ID: ${channelId} saved successfully`);
  });
}

async function getLeaderboard() {
  try {
    return await executeDatabaseOperation(async (database) => {
      const collection = database.collection('nextCounts');
      const allServers = await collection.find({}, { projection: { guildId: 1, _id: 0 } }).toArray();

      const leaderboardData = [];
      for (const server of allServers) {
        const { guildId } = server;
        const nextCount = await getNextCount(guildId);
        leaderboardData.push({ serverId: guildId, highestCount: nextCount - 1 });
      }

      leaderboardData.sort((a, b) => b.highestCount - a.highestCount);

      const top10 = leaderboardData.slice(0, 10);

      return top10;
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}


async function getUserLevel(guildId, userId) {
  return await executeDatabaseOperation(async (database) => {
    const collection = database.collection('userLevels');
    const result = await collection.findOne({ guildId, userId });
    return result ? result.level : 0;
  });
}

async function setUserLevel(guildId, userId, level) {
  await executeDatabaseOperation(async (database) => {
    const collection = database.collection('userLevels');

    console.log(`Setting User Level - Guild ID: ${guildId}, User ID: ${userId}, Level: ${level}`);

    await collection.updateOne(
      { guildId, userId },
      { $set: { guildId, userId, level } },
      { upsert: true }
    );

    console.log(`User Level set successfully`);
  });
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  getCountingChannelId,
  setCountingChannelId,
  getNextCount,
  setNextCount,
  getWelcomeMessage,
  setWelcomeMessage,
  getWelcomeChannel,
  setWelcomeChannel,
  getLeaderboard,
  getUserLevel,
  setUserLevel,
};
