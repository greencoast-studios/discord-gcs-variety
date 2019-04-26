const fs = require('fs');
const { Logger } = require('logger');
const { MessageEmbed } = require('discord.js');

const logger = new Logger();

module.exports = {
  name: 'greeting',
  description: 'Set up the server greeting.',
  emoji: ":wave:",
  requiredPermission: "ADMINISTRATOR",
  exceptionalPermission: false,
  writesToData: true,
  execute(message, options) {

    function writeToJSON(op = 0, newChannel = null) {
      fs.writeFile("./src/config/botdata.json", JSON.stringify(options.data, null, 2), function (err) {
        if (err) return logger.error(err);
      });

      const enabledMessage = options.data.greeting.enabled ? `User ${message.member.displayName} has enabled greetings.` : `User ${message.member.displayName} has disabled greetings.`
      const messageToLog = op == 0 ? `User ${message.member.displayName} has changed the greetings channel to ${newChannel.name}.` : enabledMessage;
      logger.info(messageToLog);
      logger.info('Greeting change written to config.');
    }

    if (!options.args[0]) {
      message.reply(`you need to input arguments. Use **${options.cfg.prefix}greeting help** for a more detailed message on how to use this command.`);
      return;
    }

    switch (options.args[0]) {
      case "set":
        if (!options.args[1]) {
          if (options.data.greeting.hasOwnProperty('channel')) {
            const curChannel = message.guild.channels.filter(channel => channel.id == options.data.greeting.channel).first();

            if (!curChannel) {
              message.reply(`the previously set channel does not exist. To set a new channel use **${options.cfg.prefix}greeting set** and mention the channel that you want to set.`);
            } else {
              message.reply(`greetings are currently being sent to: ${curChannel}. To set a new one use **${options.cfg.prefix}greeting set** and mention the channel that you want to set.`);
            }

          } else {
            message.reply('you need to mention the text channel that you want to set.');
          }
          return;
        }

        const numberRegex = /[^0-9]+/gi;
        const textChannel = options.args[1].replace(numberRegex, '');

        if (!textChannel) {
          message.reply('text channel does not exist on server.');
          return;
        }

        const newChannel = message.guild.channels.filter(channel => channel.id == textChannel).first();
        if (!newChannel) {
          message.reply('text channel does not exist on server.');
          return;
        }

        if (newChannel.type != "text") {
          message.reply('the specified channel is not a text channel.');
          return;
        }

        if (!newChannel.viewable) {
          message.reply(`I can't see the ${newChannel} text channel. Maybe I don't have permissions to access it?`);
        }


        if (options.data.greeting.hasOwnProperty('channel')) {
          if (options.data.greeting.channel == newChannel.id) {
            message.reply(`greetings are already being sent to the ${newChannel} text channel.`);
          } else {
            options.data.greeting.channel = newChannel.id;
            writeToJSON(0, newChannel);
            message.reply(`greetings are now being sent to the ${newChannel} text channel.`);
          }
        } else {
          options.data.greeting = {
            channel: newChannel.id,
            enabled: true
          };
          writeToJSON(0, newChannel);
          message.reply(`greetings are now being sent to the ${newChannel} text channel.`);
        }
        break;

      case "enable":
        if (options.data.greeting.hasOwnProperty('enabled')) {
          if (options.data.greeting.enabled) {
            message.reply('greetings are already enabled.');
          } else {
            options.data.greeting.enabled = true;
            writeToJSON(1);
            message.reply('greetings are now enabled.');

          }
        } else {
          message.reply(`you need to first set up a channel where I should send the greetings. You can do this by running **${options.cfg.prefix}greeting set** and mention the channel that you want to set.`);
        }
        break;
      case "disable":
        if (options.data.greeting.hasOwnProperty('enabled')) {
          if (!options.data.greeting.enabled) {
            message.reply('greetings are already disabled.');
          } else {
            options.data.greeting.enabled = false;
            writeToJSON(1);
            message.reply('greetings are now disabled.');
          }
        } else {
          message.reply(`you need to first set up a channel where I should send the greetings. You can do this by running **${options.cfg.prefix}greeting set** and mention the channel that you want to set.`);
        }
        break;
      case "help" || "usage":
        const embed = new MessageEmbed()
          .setTitle('Greeting command usage.')
          .setColor('GRAY')
          .setDescription(`
            **${options.cfg.prefix}assign set <channel_mention>** - Mention the channel that you want to set to send the greetings.
            **${options.cfg.prefix}assign enable** - Enable the greetings.
            **${options.cfg.prefix}assign disable** - Disable the greetings.
          `)

        message.channel.send(embed);
        break;
    }
  },
  greet(member, options, greetType) {
    const greetEnum = {
      'greet': `Everyone! Welcome our newest member ${member}.`,
      'goodbye': `Everyone! Say goodbye to ${member}, you'll be missed.`
    }

    if (!greetEnum.hasOwnProperty(greetType)) throw new Error('Greet type is not valid!');

    if (options.data.greeting.hasOwnProperty('enabled') && options.data.greeting.enabled) {
      const channel = member.guild.channels.filter(channel => channel.id == options.data.greeting.channel).first();
      if (!channel) {
        member.guild.owner.send(`User **${member}** has joined **${member.guild.name}** but I couldn't greet them because the previously set channel no longer exists.`);
        return;
      }

      channel.send(greetEnum[greetType])
        .then(() => logger.info(`Greeted ${member.displayName} of ${member.guild.name}.`))
        .catch(err => {
          if (err == 'DiscordAPIError: Missing Permissions') {
            member.guild.owner.send(`User **${member}** has joined **${member.guild.name}** but I couldn't greet them because I don't have enough permissions to send messages to the previously set channel.`);
          } else if (err == 'DiscordAPIError: Unknown Channel') {
            member.guild.owner.send(`User **${member}** has joined **${member.guild.name}** but I couldn't greet them because the previously set channel no longer exists.`);
          } else {
            member.guild.owner.send(`User **${member}** has joined **${member.guild.name}** but I couldn't greet them because something unexpected happened.`);
            logger.error(err);
          }
        });
    }
  }
};