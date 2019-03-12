module.exports = {
  name: 'github',
  description: "Sends the organization's GitHub page.",
  emoji: ':tools:',
  requiredPermission: null,
  exceptionalPermission: false,
  execute(message, options) {
    message.reply(`our GitHub Organization URL is: **${options.data.reminder.github}**`);
  }
};