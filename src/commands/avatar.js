let timeFromLastExecution = undefined;
// cooldown is in ms, 600000 ms = 10 mins
const cooldown = 600000;

module.exports = {
  name: 'avatar',
  description: `Change the avatar of the bot to the image URL specified, if no argument is given, it returns the current avatar. Setting the avatar has a cooldown of ${cooldown / 60000} minutes.`,
  emoji: ":grinning:",
  execute(message, options) {
    const args = options.args.join(' ');

    // showTimeRemaining(timeRemaining:Int) -> String
    // Receives an integer (time in milliseconds) and generates an user readable string showing minutes and seconds.
    function showTimeRemaining(timeRemaining) {
      const totalTime = Math.floor(timeRemaining / 1000);
      const minutes = Math.floor(totalTime / 60);
      const seconds = totalTime % 60;

      let result = [];
      // timeArr violates the definition of an array (all elements same type), so this solution isn't very elegant.
      const timeArr = [minutes, "minutes", seconds, "seconds"];
      for (let i = 0; i < timeArr.length; i+=2) {
        if (timeArr[i] !== 0) {
          result.push(timeArr[i], timeArr[i + 1]);
        }
      }
      return result.join(' ');
    }

    if (args.length > 0) {
      const curTime = Date.now();
      const intervalOfExection = curTime - timeFromLastExecution;

      if (intervalOfExection > cooldown || !timeFromLastExecution) {
        options.user.setAvatar(args)
          .then(user => {
            timeFromLastExecution = curTime;
            console.log('[' + new Date().toLocaleTimeString() + ']', `Avatar has been changed by user ${message.member.nickname || message.member.user.username}.`);
            message.reply('avatar has been changed successfully.');
          })
          .catch( error => {
            console.error(error);
            message.reply('a problem has ocurred when changing the avatar, make sure the specified URL is an image.')
          });
      } else {
        const timeRemaining = cooldown - intervalOfExection;
        console.log('[' + new Date().toLocaleTimeString() + ']', `User ${message.member.nickname || message.member.user.username} has hit a cooldown and needs to wait ${showTimeRemaining(timeRemaining)} more.`);
        message.reply(`you need to wait ${showTimeRemaining(timeRemaining)} more before issuing this command again.`);
      }
    } else {
      message.reply(`current avatar is set to: ${options.user.avatarURL('png')}`);
    }
  }
};