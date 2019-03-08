module.exports = {
  name: 'clear',
  description: 'Enter an integer argument defining the amount of messages to erase above the current message.',
  emoji: ":no_good:",
  timeout: 5000,
  execute(message, options) {

    const numberOfMessages = Number(options.args[0]);
    const messageLimit = 20;

    if (numberOfMessages < 1 || numberOfMessages > messageLimit || isNaN(numberOfMessages) || !numberOfMessages) {
      message.reply(`choose a number of messages to delete under ${messageLimit}.`);
    } else {
      message.channel.bulkDelete(numberOfMessages + 1, true)
        .then(() => {
          console.log('[' + new Date().toLocaleTimeString() + ']', `User ${message.member.nickname || message.member.user.username} has deleted ${numberOfMessages} messages in channel ${message.channel.name}.`);
          message.reply(`has deleted ${numberOfMessages} message(s).`)
            .then( reply => {
              reply.delete({ timeout: this.timeout });
            })
            .catch(console.error);
        })
        .catch(error => {
          console.error(error);
          if (error == "DiscordAPIError: Missing Permissions") {
            message.reply("I don't have enough permissions to do that. Make sure I can **Manage Messages**.");
          } else {
            message.reply("there's been a problem trying to remove the messages. Make sure you're not trying to remove messages older than 2 weeks.");
          }
        });
    }
  }
};