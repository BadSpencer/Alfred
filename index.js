const {
    AkairoClient
} = require('discord-akairo');
const {
    owner, token, prefix
} = require('./config.js');
const Enmap = require("enmap");


const client = new AkairoClient({
    ownerID: owner,
    prefix: prefix,

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

client.config = require("./config.js");
client.logger = require("./utils/logger");
client.db = require("./utils/db");
client.games =  require("./utils/games");
client.exp =  require("./utils/exp");


client.db_settings = new Enmap({
    name: "settings"
});
client.db_userdata = new Enmap({
    name: "userdata"
});
client.db_games = new Enmap({
    name: "games"
});
client.db_usergame = new Enmap({
    name: "usergame"
});

client.db_userlog = new Enmap({
    name: "userlog"
});

client.login(token);