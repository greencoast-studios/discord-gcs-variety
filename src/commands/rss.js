const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { Logger } = require('logger');
const logger = new Logger();

module.exports = {
  name: 'rss',
  description: "An RSS feed that updates in a set text channel. Use argument usage for a more detailed usage mesage.",
  emoji: ":newspaper:",
  requiredPermission: "MANAGE_CHANNELS",
  exceptionalPermission: false,
  writesToData: true,
  execute(message, options) {
    const argument = options.args[0];

    function subscribeToFeed(url, firstEntry) {
      if (!url) {
        message.reply("you need to especify a RSS url to save.");
      } else if((url.startsWith("https://") || url.startsWith("http://") && !url.includes(" "))) {
        if (firstEntry) {
          options.data.rss.subscribedItems = [url];
        } else {
          if (options.data.rss.subscribedItems.includes(url)) {
            message.reply("I'm already subscribed to that RSS feed.");
            return;
          } else {
            options.data.rss.subscribedItems.push(url);
          }
        }

        fs.writeFile("./src/config/botdata.json", JSON.stringify(options.data, null, 2), function (err) {
          if (err) return logger.error(err);
        });
        logger.info(`User ${message.member.nickname || message.member.user.username} has subscribed to RSS: ${url}`);
        logger.info('RSS change written to config.');

        options.feeder.add({
          url: url,
          refresh: 300
        })

        message.reply(`you've subscribed to the RSS: **${url}**`);
      } else {
        message.reply("your RSS url doesn't seem to be correct. Make sure it begins with **https://** or **http://**.");
      }
    }

    function unsubscribeFromFeed(index) {
      if (isNaN(index) || index < 1 || index > options.data.rss.subscribedItems.length) {
        message.reply(`that item does not exist in the list of subscribed feeds. Use **${options.cfg.prefix}rss list** to see a list of subscribed feeds.`);
        return;
      }

      if (options.data.rss.subscribedItems.length > 0) {
        const deletedURL = options.data.rss.subscribedItems.splice(index - 1, 1).pop();
        fs.writeFile("./src/config/botdata.json", JSON.stringify(options.data, null, 2), function (err) {
          if (err) return logger.error(err);
        });
        logger.info(`User ${message.member.nickname || message.member.user.username} has unsubscribed from ${deletedURL}`);
        logger.info('RSS change written to config.');

        options.feeder.remove(deletedURL);

        message.reply(`succesfully unsubscribed from **${deletedURL}**`);
      } else {
        message.reply("you're not subscribed to any RSS feed.");
      }
    }

    if (argument == "add" || argument == "subscribe") {
      if (!options.data.rss.hasOwnProperty("subscribedItems")) {
        subscribeToFeed(options.args[1], true);
      } else {
        subscribeToFeed(options.args[1], false);
      }
    } else if (argument == "delete" || argument == "unsubscribe") {
      unsubscribeFromFeed(options.args[1]);
    } else if (argument == "list") {
      const numberEmojis = [':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:'];

      function indexToEmoji(index) {
        index++;
        let result = "";
        while (index > 10) {
          const entry = index % 10;
          result = `${numberEmojis[entry]} ${result}`;
          index = Math.floor(index / 10);
        }
        return `${numberEmojis[index]} ${result}`.trimEnd()
      }

      if (options.data.rss.subscribedItems.length > 0) {
        let entryList = [];
        let messageToPush = "";
        let toPush = false;
        let skippedPush = undefined;
  
        for (let i = 0; i < options.data.rss.subscribedItems.length; i++) {
          if (toPush) {
            messageToPush = messageToPush.concat('\n', `${indexToEmoji(skippedPush)} **${options.data.rss.subscribedItems[skippedPush]}**`);
          }
          if (messageToPush.length < 1024 - options.data.rss.subscribedItems[i].length) {
            messageToPush = messageToPush.concat('\n', `${indexToEmoji(i)} **${options.data.rss.subscribedItems[i]}**`);
            toPush = false;
          } else {
            entryList.push(messageToPush);
            messageToPush = "";
            skippedPush = i;
            toPush = true;
          }
        }
        if (toPush) {
          messageToPush = messageToPush.concat('\n', `${indexToEmoji(skippedPush)} **${options.data.rss.subscribedItems[skippedPush]}**`);
        }
        entryList.push(messageToPush);
  
        const embed = new MessageEmbed()
          .setTitle('List of subscribed RSS feeds:')
          .setColor('GREY')
        for (let i = 0; i < entryList.length; i++) {
          embed.addField(`Page ${i + 1}:`, entryList[i]);
        }
        message.channel.send(embed);
      } else {
        message.reply("you're not subscribed to any RSS feeds.");
      }
      
    } else if (argument == "help" || argument == "usage") {
      const embed = new MessageEmbed()
      .setTitle('RSS command usage:')
      .setColor('GREY')
      .setDescription(`
        Subscribe to a new RSS feed with: ${options.cfg.prefix}rss add|subscribe <rss url>
        Unsubscribe from an RSS feed with: ${options.cfg.prefix}rss delete|unsubscribe <index>
        List all the susbcribed RSS feeds with: ${options.cfg.prefix}rss list
      `);
    message.channel.send(embed);
    } else {
      message.reply("I didn't recognize the argument you've given me.");
    }
  }
};