const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const figlet = require('figlet');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ascii')
        .setDescription('Converts text to ASCII art')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to convert')
                .setRequired(true)),
    async execute(interaction) {
        const text = interaction.options.getString('text');

        figlet(text, function (err, data) {
            if (err) {
                return interaction.reply({ content: 'Something has gone wrong, please try again!', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTimestamp()
                .setDescription(`\`\`\`${data}\`\`\``);

            interaction.reply({ embeds: [embed] });
        });
    },
};
