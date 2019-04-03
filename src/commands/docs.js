module.exports = {
  name: 'docs',
  description: 'Get the documentation link for the corresponding text channel. Use argument usage or help to get a more detailed usage information.',
  emoji: ":closed_book:",
  requiredPermission: "MANAGE_CHANNELS",
  exceptionalPermission: true,
  writesToData: true,
  execute(message, options) {
    const fs = require('fs');
    const { MessageEmbed } = require('discord.js');

    const argument = options.args[0];
    const curChannel = message.channel.id;

    function addURL(url, firstEntry) {
      if (!url) {
        message.reply("you need to especify an url to save.");
      } else if ((url.startsWith("https://") || url.startsWith("http://")) && !url.includes(" ")) {
        if (firstEntry) {
          options.data.docs[curChannel] = [url];
        } else {
          if (options.data.docs[curChannel].includes(url)) {
            message.reply("this documentation link is already assigned to this channel.");
            return;
          } else {
            options.data.docs[curChannel].push(url);
          }
        }

        fs.writeFile("./src/config/botdata.json", JSON.stringify(options.data, null, 2), function (err) {
          if (err) return console.log(err);
        });
        console.log('[' + new Date().toLocaleTimeString() + ']', `User ${message.member.nickname || message.member.user.username} has added the documentation link for channel ${message.channel.name} with the url: ${url}`);
        console.log('[' + new Date().toLocaleTimeString() + ']', 'Docs change written to config.');
        message.reply(`you've added **${url}** to this channel's documentation links.`);
      } else {
        message.reply("your url doesn't seem to be correct. Make sure it begins with **https://** or **http://**.");
      }
    } 
    
    function deleteURL(index) {
      if (index < 1 || index > options.data.docs[curChannel].length || isNaN(index)) {
        message.reply(`that item does not exist in the documentation links list. Use **${options.cfg.prefix}docs** to see a list of the available documentation links.`);
        return;
      }

      if (options.data.docs.hasOwnProperty(curChannel)) {
        const deletedURL = options.data.docs[curChannel].splice(index - 1, 1).pop();
        fs.writeFile("./src/config/botdata.json", JSON.stringify(options.data, null, 2), function (err) {
          if (err) return console.log(err);
        });
        console.log('[' + new Date().toLocaleTimeString() + ']', `User ${message.member.nickname || message.member.user.username} has deleted the documentation link ${deletedURL} for channel ${message.channel.name}`);
        console.log('[' + new Date().toLocaleTimeString() + ']', 'Docs change written to config.');
        message.reply(`succesfully deleted **${deletedURL}** from this channel's documentation links.`);
      } else {
        message.reply("this text channel has no documentation links to remove.");
      }
    }
 
    if (!argument) {
      if (options.data.docs.hasOwnProperty(curChannel) && options.data.docs[curChannel].length > 0) {
        const numberEmojis = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':ten:'];

        let entryList = [];
        let messageToPush = "";
        let toPush = false;
        let skippedPush = undefined;

        for (let i = 0; i < options.data.docs[curChannel].length; i++) {
          if (toPush) {
            messageToPush = messageToPush.concat('\n', `${numberEmojis[skippedPush]} **${options.data.docs[curChannel][skippedPush]}**`);
          }
          if (messageToPush.length < 1024 - options.data.docs[curChannel][i].length) {
            messageToPush = messageToPush.concat('\n', `${numberEmojis[i]} **${options.data.docs[curChannel][i]}**`);
            toPush = false;
          } else {
            entryList.push(messageToPush);
            messageToPush = "";
            skippedPush = i;
            toPush = true;
          }
        }
        if (toPush) {
          messageToPush = messageToPush.concat('\n', `${numberEmojis[skippedPush]} **${options.data.docs[curChannel][skippedPush]}**`);
        }
        entryList.push(messageToPush);

        const embed = new MessageEmbed()
          .setTitle('List of available documentation links for this channel:')
          .setColor('GREY')
        for (let i = 0; i < entryList.length; i++) {
          embed.addField(`Page ${i + 1}:`, entryList[i]);
        }
        message.channel.send(embed);
      } else {
        message.reply("this text channel has no documentation links available.");
      }

    } else if (argument == "help" || argument == "usage") {
      const embed = new MessageEmbed()
        .setTitle('Docs command usage:')
        .setColor('GREY')
        .setDescription(`
          If no argument is specified, the bot will reply with the current documentation link indexed list for its corresponding text channel.
          Add a new documentation link to this text channel with: ${options.cfg.prefix}docs add <link>
          Delete a documentation link with: ${options.cfg.prefix}docs remove|delete <index>
          Check the index with: ${options.cfg.prefix}docs 
        `);
      message.channel.send(embed);

    } else if (argument == "add") {
      if (!options.data.docs.hasOwnProperty(curChannel)) {
        addURL(options.args[1], true);
      } else if (options.data.docs[curChannel].length <= 10) {
        addURL(options.args[1], false);
      } else {
        message.reply("you have reached the limit of documentation links for this channel, please delete one and retry.");
      }

    } else if (argument == "remove" || argument == "delete") {
      deleteURL(options.args[1]);

    } else {
      message.reply("I didn't recognize the argument you've given me.");
    }

  }
};