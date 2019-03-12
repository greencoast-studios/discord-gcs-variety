module.exports = {
  name: 'lmgtfy',
  description: 'Let me Google that for you. Place a query and the bot will reply with a link to your Google search.',
  emoji: ":face_palm: ",
  requiredPermission: null,
  exceptionalPermission: false,
  execute(message, options) {
    if (options.args[0]) {
      let query = options.args.join("+");
      message.reply(`Here's your results: https://google.com/search?q=${query}`);
    } else {
      message.reply(`you need to place a query in order to use this command.`);
    }
  }
};