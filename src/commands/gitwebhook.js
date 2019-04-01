module.exports = {
  name: 'gitwebhook',
  description: "Sends the GitHub Webhook to use the update notification bot.",
  emoji: ':pushpin:',
  requiredPermission: null,
  exceptionalPermission: false,
  writesToData: false,
  execute(message, options) {
    message.reply(`for GitHub notifications, add the following webhook URL with content type set to **application/json**: ${options.data.reminder.gitwebhook}`);
  }
};