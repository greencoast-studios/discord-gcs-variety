const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'randomizer',
  description: 'Issue this command with a list of commands and the bot will reply you with a randomly selected option.',
  emoji: ":twisted_rightwards_arrows:",
  requiredPermission: null,
  exceptionalPermission: false,
  writesToData: false,
  execute(message, options) {
    // getRandomElement(arr:Array)
    // Returns a random element from an array.
    function getRandomElement(arr) {
      return arr[Math.floor(Math.random() * arr.length)]
    }

    if ((options.args[0] == "help" || options.args[0] == "usage") && options.args.length == 1) {
      const embed = new MessageEmbed()
        .setTitle("Randomizer command usage:")
        .setColor("GREY")
        .setDescription(`
          Command usage: ${options.cfg.prefix}randomizer <option 1> <option 2> <option 3> <option 4> ...
          The command will reply with a random option given by the issuer. You need to specify at least 2 options.
        `);
      
      message.channel.send(embed);
    } else if (options.args.length > 1) {
      const answer = getRandomElement(options.args);
      message.reply(`the magic conch has answered: **${answer}**.`);
    } else {
      message.reply("you need to specify at least 2 options.");
    }
  }
};