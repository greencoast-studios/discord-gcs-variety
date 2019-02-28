module.exports = {
  name: 'website',
  description: "Sends the organization's website URL.",
  emoji: ':desktop:',
  execute(message, options) {
    message.reply(`our website URL is: **${options.data.website}**`);
  }
};