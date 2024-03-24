const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord.js');


const allowedGuilds = ['1082640260976087071']; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('equalizer')
        .setDescription('Set equalizer settings.'),
    async execute(interaction, distube) {
        try {
            if (!allowedGuilds.includes(interaction.guildId)) {
                return interaction.reply({ content: 'You are not allowed to use this command in this guild.', ephemeral: true });
            }

            const queue = distube.getQueue(interaction.guildId);
            if (!queue) return interaction.reply({ content: 'There is nothing in the queue right now!', ephemeral: true });

            const level = interaction.options.getString('level');
            let bands;
            switch (level) {
                case 'bassboost_low':
                    bands = Array(3).fill(0).map((n, i) => ({ band: i, gain: 0.25 }));
                    break;
                case 'bassboost_medium':
                    bands = Array(3).fill(0).map((n, i) => ({ band: i, gain: 0.5 }));
                    break;
                case 'bassboost_high':
                    bands = Array(3).fill(0).map((n, i) => ({ band: i, gain: 0.75 }));
                    break;
                default:
                    return interaction.reply({ content: 'Invalid bass boost level!', ephemeral: true });
            }

            const volumeButtonsRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('increaseVolume')
                        .setLabel('+')
                        .setStyle(ButtonStyle.PRIMARY),
                    new ButtonBuilder()
                        .setCustomId('decreaseVolume')
                        .setLabel('-')
                        .setStyle(ButtonStyle.PRIMARY)
                );

            queue.setFilter("equalizer", bands);
            const replyMessage = await interaction.reply({ content: `Bass boost level set to \`${level}\`.`, ephemeral: true });

            await replyMessage.edit({ components: [volumeButtonsRow] });

            const filter = i => i.customId === 'increaseVolume' || i.customId === 'decreaseVolume';
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'increaseVolume') {
                } else if (i.customId === 'decreaseVolume') {
                }
            });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while processing this command!', ephemeral: true });
        }
    },
    addOptions: (command) => {
        command.addStringOption(option =>
            option.setName('level')
                .setDescription('Select a bass boost level.')
                .setRequired(true)
                .addChoice('Bass Boost Low', 'bassboost_low')
                .addChoice('Bass Boost Medium', 'bassboost_medium')
                .addChoice('Bass Boost High', 'bassboost_high'))
    }
};
