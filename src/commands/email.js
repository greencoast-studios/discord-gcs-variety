module.exports = {
  name: 'email',
  description: "Sends the organization's email address.",
  emoji: ':mailbox_with_mail:',
  requiredPermission: null,
  exceptionalPermission: false,
  writesToData: false,
  execute(message, options) {
    message.reply(`our email address is: **${options.data.reminder.email}**.`);
  }
};