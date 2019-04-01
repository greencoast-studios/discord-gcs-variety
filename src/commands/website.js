module.exports = {
  name: 'website',
  description: "Sends the organization's website URL.",
  emoji: ':desktop:',
  requiredPermission: null,
  exceptionalPermission: false,
  writesToData: false,
  execute(message, options) {
    message.reply(`our website URL is: **${options.data.reminder.website}**`);
  }
};