module.exports = {
  name: 'blog',
  description: "Sends the organization's blog URL.",
  emoji: ':pencil:',
  requiredPermission: null,
  exceptionalPermission: false,
  writesToData: false,
  execute(message, options) {
    message.reply(`the URL to our Wordpress blog is: **${options.data.reminder.blog}**`);
  }
};