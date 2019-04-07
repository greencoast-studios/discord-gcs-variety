module.exports = {
  name: 'poll',
  description: 'Create a poll with up to 10 options. The first argument should be a question and the next ones are the available options. If only a question is issued, start the poll with yes/no options.',
  emoji: ":bar_chart:",
  maxOptions: 10,
  requiredPermission: null,
  exceptionalPermission: false,
  writesToData: false,
  execute(message, options) {
    const { MessageEmbed } = require('discord.js');
    const { Logger } = require('logger');
    
    const logger = new Logger();
    const spacesInsideQuotesRegEx = /('.*?'|".*?"|\S+)/gi;
    const DESC_LIMIT = 2048;

    // since matching spaces outside single or double quotes isn't as easy as it seems, we'll rejoin the args, match them with a certain regex and then split them again.
    let args = options.args.join(' ')
    args = args.match(spacesInsideQuotesRegEx)
    // get rid of quotation marks in the edges
    for (index in args) {
      if ((args[index].startsWith('"') || args[index].startsWith("'")) && (args[index].endsWith('"') || args[index].endsWith("'"))) {
        args[index] = args[index].slice(1, -1);
      }
    }

    if (!args) {
      message.reply(`you need to at least specify a question and optionally up to 10 answers. For a more detailed explanation type: **${options.cfg.prefix}poll usage**`);
      return;
    }

    if ((args[0] == "help" || args[0] == "usage") && args.length == 1) {
      const embed = new MessageEmbed()
        .setTitle("Poll command usage:")
        .setColor("GREY")
        .setDescription(`
          Command usage: ${options.cfg.prefix}poll <question> <option 1> <option 2> <option 3> ...
          The poll will send a message with the available options to a specified question with a reaction to match every answer.
          The poll can have maximum 10 options.
          If only a question is specified, the poll will start with yes/no reactions.
        `);
      
      message.channel.send(embed);

    } else if (args.length == 1) {
      if (!args[0].endsWith("?")) args[0] = args[0].concat("", "?");

      const pollString = `:bar_chart: **${args[0]}**`;

      if (pollString.length < DESC_LIMIT) {
        const embed = new MessageEmbed()
          .setTitle("Poll:")
          .setColor("GREY")
          .setDescription(pollString);

        message.channel.send(embed)
          .then( msg => {
            msg.react("\u{1F44D}");
            msg.react("\u{1F44E}");
          })
          .catch(err => logger.error(err));

      } else {
        message.reply("your poll is too long to display.");
      }
    } else if (args.length > 1 && args.length <= this.maxOptions + 1) {
      if (!args[0].endsWith("?")) args[0] = args[0].concat("", "?");

      const reactionsArr = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':ten:'];

      let pollString = `:bar_chart: **${args[0]}**`;
      for (let i = 1; i < args.length; i++) {
        pollString = pollString.concat("\n", `${reactionsArr[i - 1]} **${args[i]}**`);
      }

      if (pollString.length < DESC_LIMIT) {
        const embed = new MessageEmbed()
          .setTitle("Poll:")
          .setColor("GREY")
          .setDescription(pollString);

        message.channel.send(embed)
          .then( msg => {
            const numberEmojis = ["\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"];
            for (var i = 1; i < args.length; i++) {
              msg.react(numberEmojis[i]);
            }
          })
          .catch(err => logger.error(err));

      } else {
        message.reply("your poll is too long to display.");
      }
    } else {
      message.reply("your poll needs to have between 1 and 10 options to choose from.");
    }
  }
};