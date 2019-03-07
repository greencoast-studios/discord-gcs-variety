module.exports = {
  name: 'email',
  description: "Sends the organization's email address.",
  emoji: ':mailbox_with_mail:',
  execute(message, options) {
    message.reply(`our email address is: **${options.data.reminder.email}**.`);
  }
};