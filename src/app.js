const {Client, Collection} = require('discord.js');
const fs = require('fs');
const optionalRequire = require('optional-require')(require);

const cfg = require('./config/settings.json');
const data = optionalRequire('./botdata.json') || createDataFile('./src/botdata.json')
console.log('[' + new Date().toLocaleTimeString() + ']', "Bot data file loaded successfully.");

function createDataFile(filename) {
  // Synchronous file creation.
  console.log('[' + new Date().toLocaleTimeString() + ']', "Bot data file not found. Creating...");
  fs.writeFileSync(filename, JSON.stringify({}, null, 2), function(err) {
    if (err) return console.log(err);
  });
  console.log('[' + new Date().toLocaleTimeString() + ']', "Bot data file created!");
}

const client = new Client();
client.commands = new Collection();

const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// updatePresence()
// Updates the presence of the bot. Argument is still pending to design.
function updatePresence() {
  const presence = `${cfg.prefix}help`;
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

  const options = {
    args: args,
    cfg: cfg,
    data: data,
    command: client.commands,
    user: client.user
  };

  if (!client.commands.has(command)) return;

  function executeCommand() {
    try {
      console.log('[' + new Date().toLocaleTimeString() + ']', `User ${message.member.nickname || message.member.user.username} issued command ${command}.`);
      client.commands.get(command).execute(message, options);
    } catch (error) {
      console.error(error);
      message.reply("there's been a problem executing your command.");
    }
  }

  const requiredPermission = client.commands.get(command).requiredPermission;
  if (requiredPermission) {
    if (message.member.hasPermission(requiredPermission)) {
      executeCommand();
    } else {
      // let regular users (without perms) to run commands that have a different functionality when no argument is given.
      if (client.commands.get(command).exceptionalPermission && !args.length) {
        executeCommand()
      } else {
        message.reply("you do not have the required permissions to run this command.");
      }
    }
  } else {
    executeCommand();
  }
});

client.on("guildMemberAdd", async member => {
  const options = {
    data: data
  }
  client.commands.get("assign").autoAssign(member, options);
});

client.on("guildMemberRemove", async member => {
  
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