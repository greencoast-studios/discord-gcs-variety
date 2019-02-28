module.exports = {
  name: 'blog',
  description: "Sends the organization's blog URL.",
  emoji: ':pencil:',
  execute(message, options) {
    message.reply(`the URL to our Wordpress blog is: **${options.data.blog}**`);
  }
};