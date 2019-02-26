module.exports = {
  name: 'help',
  description: "Sends a list of the commands available as an embed message.",
  emoji: ':question:',
  execute(message, options) {
    const { MessageEmbed } = require('discord.js');

    let embedCommandContent = "";

    for (let cmd of options.command) {
      embedCommandContent = embedCommandContent.concat('\n', `${cmd[1].emoji} **${options.cfg.prefix}${cmd[1].name}** - ${cmd[1].description}`);
    }
    
    const embed = new MessageEmbed()
    .setTitle('List of available commands:')
    .setColor('GREY')
    .setThumbnail('https://i.imgur.com/Tqnk48j.png')
    .addField('You can use the following commands with this bot:', embedCommandContent);

    message.channel.send(embed);
  }
};