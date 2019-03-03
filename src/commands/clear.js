module.exports = {
  name: 'clear',
  description: 'Enter an integer argument defining the amount of messages to erase above the current message.',
  emoji: ":no_good:",

  execute(message, options) {

    const numberOfMessages = options.args[0];
    const messageLimit = 20;

    if (numberOfMessages < 1 || numberOfMessages > messageLimit || isNaN(numberOfMessages) || !numberOfMessages) {
      message.reply(`choose a number of messages to delete under ${messageLimit}.`);
    } else {
      message.channel.bulkDelete(numberOfMessages)
        .then(() => {
          console.log('[' + new Date().toLocaleTimeString() + ']', `User ${message.member.nickname || message.member.user.username} has deleted ${numberOfMessages} messages in channel ${message.channel.name}.`);
          message.reply(`has deleted ${numberOfMessages}.`);
        })
        .catch(console.error);
    }
  }
};