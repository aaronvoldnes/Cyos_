const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

// Array of guild IDs where the command is allowed to be used
const permittedGuilds = ['1058904632803463228', '1082640260976087071'];

// Map to store voice connections for each guild
const voiceConnections = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('24-7')
        .setDescription('Keep the bot 24/7 in the same voice channel as the user'),

    async execute(interaction) {
        // Check if the command is being used in a permitted guild
        if (!permittedGuilds.includes(interaction.guildId)) {
            return interaction.reply({ content: 'This command is not permitted in this guild!', ephemeral: true });
        }

        const voiceChannel = interaction.member.voice.channel;

        // Check if the member is in a voice channel
        if (!voiceChannel) {
            return interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
        }

        try {
            // Check if the bot is already connected to the voice channel
            let connection = voiceConnections.get(interaction.guildId);
            if (!connection || connection.joinConfig.channelId !== voiceChannel.id) {
                // If not connected or connected to a different channel, join the channel
                connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                });

                voiceConnections.set(interaction.guildId, connection);

                // Handle connection states
                await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
            }

            interaction.reply({ content: `Bot is now 24/7 in your voice channel: ${voiceChannel.name}!`, ephemeral: true });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while trying to join the voice channel.', ephemeral: true });
        }
    },
};
