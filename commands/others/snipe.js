// commands/others/snipe.js

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription('Retrieve the most recently deleted message.'),

    async execute(interaction, snipes, client) {
        try {
            const snipedMessage = snipes.get(interaction.channelId);

            if (!snipedMessage) {
                await interaction.reply({ content: 'There are no recently deleted messages in this channel.', ephemeral: true });
                return;
            }

            const embed = new EmbedBuilder()
                .setAuthor(snipedMessage.author.tag, snipedMessage.author.displayAvatarURL())
                .setDescription(snipedMessage.content)
                .setTimestamp(snipedMessage.timestamp)
                .setColor('#ff0000');

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error executing snipe command:', error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};
