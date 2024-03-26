const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filter')
        .setDescription('Manage filters for the music queue')
        .addStringOption(option =>
            option.setName('filter')
                .setDescription('The filter to apply/remove. Type "off" to clear all filters.')
                .setRequired(false)
                .addChoices(
                    { name: 'Off', value: 'off' },
                    { name: '3D', value: '3d' },
                    { name: 'Bass Boost', value: 'bassboost' },
                    { name: 'Echo', value: 'echo' },
                    { name: 'Karaoke', value: 'karaoke' },
                    { name: 'Nightcore', value: 'nightcore' },
                    { name: 'Vaporwave', value: 'vaporwave' },
                    { name: 'Flanger', value: 'flanger' },
                    { name: 'Gate', value: 'gate' },
                    { name: 'Haas', value: 'haas' },
                    { name: 'Reverse', value: 'reverse' },
                    { name: 'Surround', value: 'surround' },
                    { name: 'MCompand', value: 'mcompand' },
                    { name: 'Phaser', value: 'phaser' },
                    { name: 'Tremolo', value: 'tremolo' },
                    { name: 'Earwax', value: 'earwax' }
                )),
    async execute(interaction, distube) {
        try {
            const queue = distube.getQueue(interaction.guildId);
            if (!queue) return interaction.reply({ content: 'There is nothing in the queue right now!', ephemeral: true });

            const filter = interaction.options.getString('filter');
            if (!filter) {
                return interaction.reply({ content: `Please specify a filter to apply/remove. Type "off" to clear all filters.`, ephemeral: true });
            }

            if (filter === 'off') {
                queue.filters.clear();
            } else if (Object.keys(distube.filters).includes(filter)) {
                if (queue.filters.has(filter)) {
                    queue.filters.remove(filter);
                } else {
                    queue.filters.add(filter);
                }
            } else {
                return interaction.reply({ content: 'Not a valid filter', ephemeral: true });
            }

            interaction.reply({ content: 'Filter updated', ephemeral: true });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while processing this command!', ephemeral: true });
        }
    }
};
