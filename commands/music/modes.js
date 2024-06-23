const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mode')
        .setDescription('MUSIC: Adjust the mode settings of the bot.')
        .addStringOption(option =>
            option.setName('preset')
                .setDescription('EThe filter to apply or remove.')
                .setRequired(true)
                .addChoices(
                    { name: 'Bass Boost', value: 'bassboost' },
                    { name: 'Treble', value: 'treble' },
                    { name: 'Pop', value: 'pop' },
                    { name: 'Rock', value: 'rock' },
                    { name: 'Jazz', value: 'jazz' },
                )
        ),
    async execute(interaction, distube) {
        try {
            await interaction.deferReply({ ephemeral: false });

            const preset = interaction.options.getString('preset');
            const queue = distube.getQueue(interaction.guildId);

            if (!queue) {
                return interaction.editReply('There is nothing in the queue right now!');
            }

            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
                return interaction.editReply('You need to be in the same voice channel.');
            }

            const equalizerPresets = {
                bassboost: [ { band: 0, gain: 0.6 }, { band: 1, gain: 0.67 }, { band: 2, gain: 0.67 }, { band: 3, gain: 0.67 }, { band: 4, gain: -0.5 }, { band: 5, gain: -0.5 }, { band: 6, gain: -0.5 }, { band: 7, gain: -0.5 }, { band: 8, gain: -0.5 }, { band: 9, gain: -0.5 }, { band: 10, gain: -0.5 }, { band: 11, gain: -0.5 }, { band: 12, gain: -0.5 }, { band: 13, gain: -0.5 }, { band: 14, gain: -0.5 } ],
                treble: [ { band: 0, gain: -0.5 }, { band: 1, gain: -0.5 }, { band: 2, gain: -0.5 }, { band: 3, gain: -0.5 }, { band: 4, gain: 0.15 }, { band: 5, gain: 0.15 }, { band: 6, gain: 0.15 }, { band: 7, gain: 0.15 }, { band: 8, gain: 0.15 }, { band: 9, gain: 0.15 }, { band: 10, gain: 0.15 }, { band: 11, gain: 0.15 }, { band: 12, gain: 0.15 }, { band: 13, gain: 0.15 }, { band: 14, gain: 0.15 } ],
                pop: [ { band: 0, gain: -0.3 }, { band: 1, gain: -0.25 }, { band: 2, gain: 0.25 }, { band: 3, gain: 0.4 }, { band: 4, gain: 0.35 }, { band: 5, gain: 0 }, { band: 6, gain: -0.3 }, { band: 7, gain: -0.25 }, { band: 8, gain: 0.25 }, { band: 9, gain: 0.4 }, { band: 10, gain: 0.35 }, { band: 11, gain: 0 }, { band: 12, gain: 0 }, { band: 13, gain: 0 }, { band: 14, gain: 0 } ],
                rock: [ { band: 0, gain: 0.3 }, { band: 1, gain: 0.25 }, { band: 2, gain: 0.2 }, { band: 3, gain: 0.1 }, { band: 4, gain: -0.05 }, { band: 5, gain: -0.2 }, { band: 6, gain: -0.25 }, { band: 7, gain: -0.3 }, { band: 8, gain: -0.3 }, { band: 9, gain: -0.3 }, { band: 10, gain: -0.2 }, { band: 11, gain: -0.2 }, { band: 12, gain: -0.2 }, { band: 13, gain: -0.2 }, { band: 14, gain: -0.2 } ],
                jazz: [ { band: 0, gain: -0.2 }, { band: 1, gain: -0.1 }, { band: 2, gain: 0 }, { band: 3, gain: 0.1 }, { band: 4, gain: 0.2 }, { band: 5, gain: 0.3 }, { band: 6, gain: 0.2 }, { band: 7, gain: 0.1 }, { band: 8, gain: 0 }, { band: 9, gain: -0.1 }, { band: 10, gain: -0.2 }, { band: 11, gain: -0.3 }, { band: 12, gain: -0.2 }, { band: 13, gain: -0.1 }, { band: 14, gain: 0 } ],
            };

            if (!equalizerPresets[preset]) {
                return interaction.editReply('Invalid preset selected.');
            }

            await distube.setFilter(queue, equalizerPresets[preset]);

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setDescription(`\`🎚️\` | **Equalizer preset set to:** \`${preset}\``);

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
