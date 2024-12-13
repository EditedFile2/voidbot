const config = require('../config.json')
const { Client, IntentsBitField, Partials, EmbedBuilder } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const logger = require('./utils/logger');


const client = new Client({
  restRequestTimeout: 60000,
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.DirectMessages
  ],
  partials: [
    Partials.GuildMember,
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.ThreadMember
  ]
});

process.on('uncaughtException', function (error) {
  logger.log(error);
});

eventHandler(client);

client.login(config.discord_token);

