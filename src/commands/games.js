module.exports = {
  name: 'games',
  description: "Sends the game servers' IP address.",
  emoji: ':joystick:',
  execute(message, options) {
    message.reply(`the IP of our game servers is: **${options.data.reminder.games}**`);
  }
};