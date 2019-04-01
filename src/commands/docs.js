module.exports = {
  name: 'docs',
  description: 'Get the documentation link for the corresponding text channel. Use argument usage or help to get a more detailed usage information.',
  emoji: ":closed_book:",
  requiredPermission: "MANAGE_CHANNELS",
  exceptionalPermission: true,
  execute(message, options) {
    const fs = require('fs');
    const { MessageEmbed } = require('discord.js');

    const argument = options.args[0];
    const curChannel = message.channel.id;

    function writeToJSON(curChannel, url = undefined) {
      if (options.data.docs.hasOwnProperty(curChannel)) {
        delete options.data.docs[curChannel];
        fs.writeFile("./src/botdata.json", JSON.stringify(options.data, null, 2), function (err) {
          if (err) return console.log(err);
        });
        console.log('[' + new Date().toLocaleTimeString() + ']', `User ${message.member.nickname || message.member.user.username} has deleted the documentation link for channel ${message.channel.name}`);
      } else {
        options.data.docs[curChannel] = url;
        fs.writeFile("./src/botdata.json", JSON.stringify(options.data, null, 2), function (err) {
          if (err) return console.log(err);
        });
        console.log('[' + new Date().toLocaleTimeString() + ']', `User ${message.member.nickname || message.member.user.username} has added the documentation link for channel ${message.channel.name} with the url: ${url}`);
      }
      console.log('[' + new Date().toLocaleTimeString() + ']', 'Docs change written to config.');
    }

    if (!argument) {
      if (options.data.docs.hasOwnProperty(curChannel)) {
        message.reply(`this channel's documentation is: **${options.data.docs[curChannel]}**`);
      } else {
        message.reply("this text channel has no documentation link assigned.");
      }

    } else if (argument == "help" || argument == "usage") {
      const embed = new MessageEmbed()
        .setTitle('Docs command usage:')
        .setColor('GREY')
        .setDescription(`
          Command usage: ${options.cfg.prefix}docs <add|remove> <documentation link>
          If no command is specified, the bot will reply with the current documentation link set for its corresponding text channel.
          The add/set command assigns a documentation link to this text channel.
          The remove/delete command deletes the documentation link set to this text channel.
        `);
      message.channel.send(embed);

    } else if (argument == "add" || argument == "set") {
      if (options.data.docs.hasOwnProperty(curChannel)) {
        message.reply("a documentation link is already available for this text channel.");
      } else {
        const url = options.args[1];
        if (url) {
          writeToJSON(curChannel, url)
          message.reply(`you've changed this text channel's documentation link to: **${url}**`);
        } else {
          message.reply("you need to especify a url to save.");
        }
      }

    } else if (argument == "remove" || argument == "delete") {
      if (!options.data.docs.hasOwnProperty(curChannel)) {
        message.reply("this text channel has no documentation link set.");
      } else {
        writeToJSON(curChannel)
        message.reply("you've deleted this text channel's documentation link.");
      }

    } else {
      message.reply("I didn't recognize the argument you've given me.");
    }

  }
};