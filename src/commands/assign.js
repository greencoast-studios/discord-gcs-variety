module.exports = {
  name: 'assign',
  description: 'Assign a default role for new members, mention the role you wish to assign. Using argument "usage" or "help" will display a more detailed message.',
  emoji: ":spy:",
  execute(message, options) {
    const fs = require('fs');
    const { MessageEmbed } = require('discord.js');

    // setNewDefaultRole(newRole:String, type:String)
    // Writes to the data json file the new default role for new members with type (bot or regular user)
    // newRole should be a mention to the desired role which gets transformed to it's ID and stripped from any character.
    function setNewDefaultRole(newRole, type) {

      function writeToJSON(role) {
        if (options.data.assign.hasOwnProperty(type)) {
          options.data.assign[type] = newRole;
          fs.writeFile("./src/botdata.json", JSON.stringify(options.data, null, 2), function (err) {
            if (err) return console.log(err);
          })
          console.log('[' + new Date().toLocaleTimeString() + ']', `User ${message.member.nickname} has changed the default ${type} role to ${role.name}.`);
          console.log('[' + new Date().toLocaleTimeString() + ']', 'Role change written to config.');
          message.reply(`${type} default role has been changed to ${role}.`);
        } else {
          console.error(Error("Unexpected Type."));
          message.reply("something went wrong when trying to write to the configuration file.");
        }
      }

      // Originally empty
      if (!newRole) {
        message.member.guild.roles.fetch(options.data.assign[type])
          .then(role => message.reply(`current default role set for ${type} is ${role}.`))
          .catch(console.error);
        return
      } 

      const numberRegex = /[^0-9]+/gi;
      newRole = newRole.replace(numberRegex, "")

      // Empty after regex
      if (!newRole) {
        message.reply('role does not exist on server.');
      } else {
        message.member.guild.roles.fetch(newRole)
          .then(role => {
            // fetch() returns null when the role does not exist.
            if (!role) {
              message.reply('role does not exist on server.');
            } else {
              if (type == "bot") {
                writeToJSON(role);
              } else if (type == "user") {
                writeToJSON(role);
              } else {
                message.reply(`${type} is not a valid role type. Please use either *bot* for bots or *user* for regular users.`);
              }
            }
          })
          .catch(console.error);
      }
    }

    const type = options.args[0];
    if (type == "usage" || type == "help") {
      const embed = new MessageEmbed()
        .setTitle('Assign command usage:')
        .setColor('GREY')
        .setDescription(`
          Command usage: ${options.cfg.prefix}assign type <@role>
          If no role is specified, the bot will reply with the current default role set to the type selected (*bot* or *user*).
          If a role is specified, the bot will change the default role set up for the type selected (*bot* or *user*).
        `);
      message.channel.send(embed);
      return;
    }
    if (type) {
      setNewDefaultRole(options.args[1], type)
    } else {
      message.reply('you need to specify a role type.');
    }
  },

  autoAssign(member, options) {
    if (member.user.bot) {
      console.log('[' + new Date().toLocaleTimeString() + ']', `Bot ${member.nickname} has joined.`);
      member.guild.roles.fetch(options.data.assign.bot)
        .then(role => member.roles.add(role))
        .catch(console.error);
    } else {
      console.log('[' + new Date().toLocaleTimeString() + ']', `User ${member.nickname} has joined.`);
      member.guild.roles.fetch(options.data.assign.user)
        .then(role => member.roles.add(role))
        .catch(console.error);
    }
  }
};