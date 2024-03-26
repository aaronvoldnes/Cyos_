// whois.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whois')
    .setDescription('Displays information about a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user you want to get information about.')
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);

    const whoisEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('User Information')
      .addField('Username', user.username)
      .addField('User ID', user.id)
      .addField('Joined Server At', member.joinedAt.toDateString())
      .addField('Joined Discord At', user.createdAt.toDateString())
      .setThumbnail(user.displayAvatarURL({ dynamic: true }));

    if (member.nickname) {
      whoisEmbed.addField('Nickname', member.nickname);
    }

    await interaction.reply({ embeds: [whoisEmbed] });
  },
};
