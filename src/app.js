const {Client, MessageEmbed} = require('discord.js');

const cfg = require('./config/settings.json');

const client = new Client();

// updatePresence()
// Updates the presence of the bot. Argument is still pending...
function updatePresence() {
  const presence = 'in Greencoast Studios!';
  client.user.setPresence({
    activity: {
      name: presence,
      type: "PLAYING"
    }
  }).then(console.log('[' + new Date().toLocaleTimeString() + ']', `Presence changed to: ${presence}.`))
  .catch(console.error);
}

client.on('ready', () => {
  console.log('[' + new Date().toLocaleTimeString() + ']', 'Ready!');
  updatePresence();
});

client.on('message', async message => {
  if (!message.guild || !message.content.startsWith(cfg.prefix) || message.author.bot) return;

  const args = message.content.slice(cfg.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
});

client.on("reconnecting", () => {
  console.log('[' + new Date().toLocaleTimeString() + ']', 'Trying to reconnect...');
});

client.on("disconnect", () => {
  console.log('[' + new Date().toLocaleTimeString() + ']', 'Lost connection.');
});

client.on("error", error => {
  console.log('[' + new Date().toLocaleTimeString() + ']', 'Something went wrong with the connection to the WebSocket.');
  console.error(error);
});

client.login(cfg.discord_token);