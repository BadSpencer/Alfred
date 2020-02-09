const {
    AkairoClient
} = require('discord-akairo');
//require('dotenv').config();
const Enmap = require("enmap");

const config = require('./config.json');
const client = new AkairoClient({
    ownerID: process.env.OWNER_ID,
    prefix: process.env.PREFIX,

    emitters: {
        process
    },

    defaultPrompt: {
        timeout: message => 'Vous avez mis trop de temps à répondre. Commande annulée',
        ended: message => 'Trop de tentatives. Commande annulée',
        cancel: message => 'Commandes annulée',
        cancelWord: 'annuler',
        retries: 2,
        time: 30000
    },

    allowMention: true,
    handleEdits: true,
    commandUtilLifetime: 300000,
    commandDirectory: './commands/',
    inhibitorDirectory: './inhibitors/',
    listenerDirectory: './events/',

    automateCategories: true,
    commandUtil: true
}, {
    disableEveryone: true
});

require("./utils/fonctions.js")(client);
const DbUtils = require('./utils/dbutils');
client.db = new DbUtils(client);


client.db_settings = new Enmap({
    name: "settings"
  });
client.db_userdata = new Enmap({
    name: "userdata"
  });

client.login(config.token);