module.exports = {
  name: 'prefix',
  description: 'Changes the prefix used by this bot. If no argument is given, display the current prefix.',
  emoji: ":a:",
  execute(message, options) {
    const fs = require('fs');

    function writeToJSON(newPrefix) {
      if (options.cfg.hasOwnProperty("prefix")) {
        options.cfg.prefix = newPrefix;
        fs.writeFile("./src/config/settings.json", JSON.stringify(options.cfg, null, 2), function(err) {
          if (err) return console.log(err);
        })
        console.log('[' + new Date().toLocaleTimeString() + ']', `User ${message.member.nickname || message.member.user.username} has changed the prefix to ${newPrefix}.`);
        console.log('[' + new Date().toLocaleTimeString() + ']', 'Prefix change written to config.');
        message.reply(`prefix has been changed to \` ${newPrefix} \`.`);
      } else {
        console.error(Error("Unexpected Type."));
        message.reply("something went wrong when trying to write to the configuration file.");
      }
    }

    function updatePresence(newPrefix) {
      const presence = `${newPrefix}help`;
      options.user.setPresence({
        activity: {
          name: presence,
          type: "PLAYING"
        }
      }).then(console.log('[' + new Date().toLocaleTimeString() + ']', `Presence changed to: ${presence}.`))
      .catch(console.error);
    }

    const newPrefix = options.args[0];

    if (options.args.length > 1) {
      message.reply(`your prefix may not contain a space.`);
    } else if (newPrefix) {
      writeToJSON(newPrefix);
      updatePresence(newPrefix);
    } else {
      message.reply(`current prefix is set to: \` ${options.cfg.prefix} \`.`);
    }
  }
};