module.exports = {
  name: 'github',
  description: "Sends the organization's GitHub page.",
  emoji: ':tools:',
  execute(message, options) {
    message.reply(`our GitHub Organization URL is: **${options.data.github}**`);
  }
};