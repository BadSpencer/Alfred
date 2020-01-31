require('dotenv').config();
const { AkairoClient } = require('discord-akairo');




const client = new AkairoClient({
    ownerID: process.env.OWNER_ID, 
    prefix: '!', 
    handleEdits: true,
    commandUtil: true,
    commandUtilLifetime: 600000,
    commandDirectory: './commands/',
    inhibitorDirectory: './inhibitors/',
    listenerDirectory: './events/'
}, {
    disableEveryone: true
});

// Base de données
const Enmap = require("enmap");

client.settings = new Enmap({
    name: "settings"
  });

client.login(process.env.DISCORD_TOKEN);