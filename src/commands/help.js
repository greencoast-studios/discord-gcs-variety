module.exports = {
  name: 'help',
  description: "Sends a list of the commands available as an embed message.",
  emoji: ':question:',
  execute(message, options) {
    const { MessageEmbed } = require('discord.js');

    let commandsArr = [];
    let messageToPush = "";
    let toPush = false;
    let skippedPush = undefined;

    for (let cmd of options.command) {
      if (toPush) {
        messageToPush = messageToPush.concat('\n', `${skippedPush[1].emoji} **${options.cfg.prefix}${skippedPush[1].name}** - ${skippedPush[1].description}`);
      }
      if (messageToPush.length < 1024 - cmd[1].description.length) {
        messageToPush = messageToPush.concat('\n', `${cmd[1].emoji} **${options.cfg.prefix}${cmd[1].name}** - ${cmd[1].description}`);
        toPush = false;
      } else {
        commandsArr.push(messageToPush);
        messageToPush = "";
        skippedPush = cmd;
        toPush = true;
      }
    }
    commandsArr.push(messageToPush)

    const embed = new MessageEmbed()
    .setTitle('List of available commands:')
    .setColor('GREY')
    .setThumbnail('https://i.imgur.com/Tqnk48j.png')
    for (let i = 0; i < commandsArr.length; i++) {
      embed.addField(`Page ${i + 1}:`, commandsArr[i]);
    }
    message.channel.send(embed);
  }
};