module.exports = {
  name: 'games',
  description: "Sends the game servers' IP address.",
  emoji: ':joystick:',
  requiredPermission: null,
  exceptionalPermission: false,
  writesToData: false,
  execute(message, options) {
    message.reply(`the IP of our game servers is: **${options.data.reminder.games}**`);
  }
};