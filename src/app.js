const { Client, Collection } = require('discord.js');
const fs = require('fs');
const RssFeedEmitter = require('rss-feed-emitter');
const { Logger } = require('logger');

const logger = new Logger();

const settingsFilename = './config/settings.json';
const dataFilename = './config/botdata.json';

let initialConn = false;

const cfg = require(settingsFilename);
const data = loadDataFile(dataFilename);
logger.info("Bot data file loaded successfully.");

function loadDataFile(filename) {
  if (fs.existsSync(`${__dirname}/${filename}`)) {
    return require(filename);
  } else {
    logger.warn("Bot data file not found. Creating...");
    fs.writeFileSync(`${__dirname}/${filename}`, JSON.stringify({}, null, 2), function (err) {
      if (err) return logger.error(err);
    });
    logger.info("Bot data file created!");
    return require(filename);
  }
}

function addWritableCommandToJSON(command) {
  if (data.hasOwnProperty(command)) {
    logger.info(`${command} has been found in bot data, skipping...`);
    return;
  } else {
    logger.warn(`${command} has not been found, adding to bot data.`);
    data[command] = {};
    fs.writeFile(`${__dirname}/${dataFilename}`, JSON.stringify(data, null, 2), function (err) {
      if (err) return logger.error(err);
    });
    logger.info(`${command} has been added to bot data.`);
  }
}

const client = new Client();
const feeder = new RssFeedEmitter();
client.commands = new Collection();

const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  if (command.writesToData) {
    addWritableCommandToJSON(file.slice(0, -3));
  }
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
    }).then(logger.info(`Presence changed to: ${presence}.`))
    .catch(err => logger.error(err));
}

if (data.rss.hasOwnProperty("subscribedItems")) {
  for (item of data.rss.subscribedItems) {
    feeder.add({
      url: item,
      refresh: 300
    })
    logger.info(`Listening to RSS feed: ${item}`);
  }
}

client.on('ready', () => {
  logger.info('Ready!');
  updatePresence();

  if (!initialConn) {
    feeder.on('new-item', item => {
      client.channels.fetch(cfg.rss_channel_id)
        .then(channel => channel.send(`**New RSS Entry:** ${item.title}\n**Date Published:** ${item.date}\n**Author:** ${item.author}\n**Read More:** ${item.link}`))
        .catch(err => logger.error(err));
    })
    initialConn = true;
  }

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
    user: client.user,
    feeder: feeder
  };

  if (!client.commands.has(command)) return;

  function executeCommand() {
    try {
      logger.info(`User ${message.member.nickname || message.member.user.username} issued command ${command}.`);
      client.commands.get(command).execute(message, options);
    } catch (error) {
      logger.error(error);
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
  client.commands.get("greeting").greet(member, options, 'greet');
});

client.on("guildMemberRemove", async member => {
  const options = {
    data: data
  }
  client.commands.get("greeting").greet(member, options, 'goodbye');
});

client.on("reconnecting", () => {
  logger.warn('Trying to reconnect...');
});

client.on("disconnect", () => {
  logger.warn('Lost connection.');
});

client.on("error", error => {
  logger.error('Something went wrong with the connection to the WebSocket.');
  logger.error(error);
});

client.login(cfg.discord_token)