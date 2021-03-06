module.exports = {
  name: 'ts',
  description: "Sends the TeamSpeak 3 server's IP address.",
  emoji: ':telephone_receiver:',
  requiredPermission: null,
  exceptionalPermission: false,
  writesToData: false,
  execute(message, options) {
    message.reply(`our TeamSpeak's IP is: **${options.data.reminder.ts}**`);
  }
};