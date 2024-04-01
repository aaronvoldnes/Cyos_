const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Generates a random meme.'),
  async execute(interaction) {
    try {
      const memes = await fetchMemesFromImgflip();

      if (!memes || !Array.isArray(memes) || memes.length === 0) {
        throw new Error('Invalid or empty meme data.');
      }

      const randomMeme = getRandomMeme(memes);
      const customTextOptions = [
        'When the elevator door opens right as you approach',
        'Remembering where you left your keys without retracing steps',
        'Putting on a pair of pants and finding a 20-dollar bill',
        'When your phone battery lasts the entire day without charging',
        'Finding the TV remote right where you left it',
        'That feeling when your favorite song comes on the radio',
        'When you successfully navigate through automated customer service',
        'Getting an unexpected compliment from a stranger',
        'When you open the fridge and find your favorite snack',
        'Waking up and realizing its the weekend',
        'When your computer updates without restarting in the middle of work',
        'Getting a full nights sleep without waking up once',
        'The joy of a perfectly ripe avocado',
        'Finding a matching pair of socks in the first try',
        'When someone holds the door open for you',
        'That moment you remember someones name on the first try',
        'When you correctly predict the ending of a movie',
        'Getting the last slice of pizza without having to fight for it',
        'Discovering a new favorite book',
        'When you make it through a Monday without a single hiccup',
        'The satisfaction of a perfectly poured cup of coffee',
        'Successfully folding a fitted sheet',
        'When autocorrect changes a word, but its actually funnier',
        'Finding a parking spot right in front of the gym entrance',
        'Remembering to bring an umbrella on a rainy day',
        'When the microwave timer stops at 0 right as you open the door',
        'The feeling of warm clothes fresh out of the dryer',
        'Successfully parallel parking on a crowded street',
        'When you catch something you dropped before it hits the ground',
        'The satisfaction of a well-organized to-do list',
        'Opening a new jar without needing assistance',
        'That moment you realize its a three-day weekend',
        'Successfully changing the roll of toilet paper',
        'Finding a shopping cart with perfectly working wheels',
        'When you remember a password without using the forgot password link',
        'Successfully removing a sticker without leaving residue',
        'The joy of finding a lost sock while doing laundry',
        'When the elevator arrives just as you press the button',
        'Getting a compliment on your haircut',
        'The pleasure of a perfectly cooked piece of toast',
        'When you arrive at the bus stop just in time for the bus',
        'The satisfaction of peeling the plastic off a new electronic device',
        'Successfully navigating a busy shopping mall without getting lost',
        'When someone saves you a seat in a crowded room',
        'The relief of finding a public restroom when you really need one',
        'When the vending machine dispenses two snacks instead of one',
        'Finding a pen that writes smoothly on the first try',
        'Successfully assembling furniture without leftover parts',
        'That feeling when you guess the correct password on the first attempt',
        'The joy of popping bubble wrap',
        'When you find your lost phone in the last place you look',
        'Successfully tying a shoelace without it coming undone',
        'The satisfaction of a freshly made bed',
        'Getting a perfect score on a quiz you didn’t study for',
        'When you find your favorite show already playing on TV',
        'Successfully cracking a hard-boiled egg without breaking the yolk',
        'The joy of a perfectly timed high-five',
        'Waking up and realizing you still have time to sleep',
        'When the internet connection is faster than expected',
        'The relief of finding your car in a crowded parking lot',
        'Successfully folding a map back to its original state',
        'That moment you catch a green light in heavy traffic',
        'When your package arrives earlier than the estimated delivery date',
        'Successfully skipping a rock across a pond multiple times',
        'The pleasure of a well-tuned musical instrument',
        'Finding the TV remote in the couch cushions',
        'When you remember someones birthday without a reminder',
        'The satisfaction of perfectly peeling a hard-boiled egg',
        'Successfully parallel parking on the first attempt',
        'When someone else takes care of the dishes after a meal',
        'The joy of discovering a new favorite restaurant',
        'Getting the last parking spot in a crowded lot',
        'Successfully folding a fitted sheet without assistance',
        'The pleasure of sipping a hot beverage on a cold day',
        'When your favorite song plays on shuffle',
        'The relief of finding a restroom when you really have to go',
        'Successfully navigating through a crowded subway station',
        'The satisfaction of a well-made sandwich',
        'When you find the perfect GIF for the moment',
        'Successfully opening a tricky jar lid on your own',
        'The joy of finishing a crossword puzzle without help',
        'Waking up and realizing you have no work or obligations',
        'When you find a parking meter with time still on it',
        'Successfully navigating through a maze',
        'The pleasure of a perfectly ripe piece of fruit',
        'Discovering a new favorite podcast',
        'Successfully removing a sticker without tearing it',
        'When your phone autocorrects to a funnier word',
        'The satisfaction of a smooth and quick commute',
        'Successfully guessing someones password (just kidding!)'
      ];

      const randomText = getRandomText(customTextOptions);

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setDescription(`**${randomText}**`)
        .setImage(randomMeme.url);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching or processing memes:', error);
      await interaction.reply('An error occurred while fetching or processing memes.');
    }
  },
};

function getRandomMeme(memes) {
  return memes[Math.floor(Math.random() * memes.length)];
}

function getRandomText(textOptions) {
  return textOptions[Math.floor(Math.random() * textOptions.length)];
}

async function fetchMemesFromImgflip() {
  try {
    const response = await axios.get('https://api.imgflip.com/get_memes');
    const memes = response.data.data.memes;
    return memes;
  } catch (error) {
    throw new Error(`Error fetching memes from Imgflip: ${error.message}`);
  }
}
