const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Change the volume of the currently playing song.')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Volume level from 1 to 100')
                .setRequired(false)
        ),
    async execute(interaction, distube) {
        try {
            await interaction.deferReply({ ephemeral: false });

            const volume = interaction.options.getInteger('amount');
            const queue = distube.getQueue(interaction.guildId);

            if (!queue) {
                return interaction.editReply('There is nothing in the queue right now!');
            }

            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
                return interaction.editReply('You need to be in the same voice channel.');
            }

            if (volume === null) {
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setDescription(`Current **volume**: \`${queue.volume}\`%`);

                return interaction.editReply({ embeds: [embed] });
            }

            if (volume < 1 || volume > 100) {
                return interaction.editReply('Please provide a number between 1 and 100.');
            }

            await distube.setVolume(interaction.guildId, volume);

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setDescription(`\`🔊\` | **Changed volume to:** \`${volume}\`%`);

            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription(`Error: ${error.message}`);

            interaction.editReply({ embeds: [embed] });
        }
    },
};
