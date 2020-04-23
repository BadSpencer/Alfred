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
        cancel: message => 'Commande annulée',
        cancelWord: 'annuler',
        retries: 2,
        time: 30000
    },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    allowMention: true,
    aliasReplacement: /-/g,
    handleEdits: true,
    commandUtilLifetime: 300000,
    commandDirectory: './commands/',
    inhibitorDirectory: './inhibitors/',
    listenerDirectory: './events/',

    //automateCategories: true,
    commandUtil: true
}, {
    disableEveryone: true
});

client.config = require("./config.js");

client.logger = require("./utils/logger");
client.db = require("./utils/db");
client.games =  require("./utils/games");
client.exp =  require("./utils/exp");

require("./utils/core.js")(client);
require("./utils/logs.js")(client);
require("./utils/jeux.js")(client);
require("./utils/embeds.js")(client);
require("./utils/members.js")(client);
require("./utils/users.js")(client);



client.textes = new(require(`./utils/textes.js`));


client.db_settings = new Enmap({
    name: "settings"
});
client.db_userdata = new Enmap({
    name: "userdata"
});
client.db_games = new Enmap({
    name: "games"
});
client.db_gameservers = new Enmap({
    name: "gameservers"
});

client.db_gameserversPlayers = new Enmap({
    name: "gameserversPlayers"
});
client.db_usergame = new Enmap({
    name: "usergame"
});
client.db_embeds = new Enmap({
    name: "embeds"
});
client.db_userxplogs = new Enmap({
    name: "userxplogs"
});
client.db_postedEmbeds = new Enmap({
    name: "postedEmbeds"
});
client.db_astuces = new Enmap({
    name: "astuces"
});
client.db_citations = new Enmap({
    name: "citations"
});

client.db_messageslogs = new Enmap({
    name: "messageslogs"
});

client.build();
client.commandHandler.resolver.addType('game', word => {
    if (!word) return null;

    const game = client.db_games.find(game => game.name == word);
    if (game) {
        return game;
    }

    return null;
});
client.commandHandler.resolver.addType('userdata', word => {
    if (!word) return null;

    const userdata = client.db_userdata.find(record => record.id == word);
    if (userdata) {
        return userdata;
    }

    return null;
});

client.login(token);