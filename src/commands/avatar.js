module.exports = {
  name: 'avatar',
  description: 'Change the avatar of the bot to the image URL specified, if no argument is given, it returns the current avatar.',
  emoji: ":grinning:",
  execute(message, options) {
    const args = options.args.join(' ');

    if (args.length > 0) {
      options.user.setAvatar(args)
        .then(user => {
          console.log('[' + new Date().toLocaleTimeString() + ']', `Avatar has been changed by user ${message.member.nickname}.`);
          message.reply('avatar has been changed successfully.');
        })
        .catch( error => {
          console.error(error);
          message.reply('a problem has ocurred when changing the avatar, make sure the specified URL is an image.')
        });
    } else {
      message.reply(`current avatar is set to: ${options.user.avatarURL('png')}`);
    }
  }
};