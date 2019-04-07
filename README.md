# Greencoast Variety Discord Bot

This is a simple bot that is used in the private Greencoast Studios' Discord server, it is mainly used to remind its members of certain things.

## Requirements

To self-host this bot you'll need the following:

* [git](https://git-scm.com/)
* [node.js](https://nodejs.org/en/)

## Dependencies

| Dependency:                                                        | Description:                                                        |
|--------------------------------------------------------------------|---------------------------------------------------------------------|
| [discord.js](https://github.com/discordjs/discord.js)              | A powerful JavaScript library for interacting with the Discord API. |
| [fs](https://www.npmjs.com/package/fs)                             | File system utilities for Node.js.                                  |
| [rss-feed-emitter](https://www.npmjs.com/package/rss-feed-emitter) | Super RSS News Feed aggregator written in Node.js and ES6.          |
| [logger](https://github.com/moonstar-x/logger)                     | A small logger module for Node.js.                                  |

## Installation

In order to self-host this bot, first you'll need to clone this repository.

    git clone https://github.com/greencoast-studios/discord-gcs-variety.git

Then, rename the file `settings.json.example` to `settings.json` and edit the file with your own Discord Token, the prefix you wish to use and the ID of the channel where RSS feeds should be sent. If you don't have a discord token yet, you can see a guide on how to create it [here](https://github.com/moonstar-x/discord-downtime-notifier/wiki).

Install the dependencies with:

    npm install

And run the bot with:

    npm start

## Usage

Type `$prefix help` in a text channel to receive a list of all the available commands.

## Authors

This bot was made by [moonstar-x](https://github.com/moonstar-x) and [tanb01](https://github.com/tanb01) of [Greencoast Studios](https://github.com/greencoast-studios).