const {
    AkairoClient
} = require('discord-akairo');
require('dotenv').config();



const client = new AkairoClient({
    ownerID: process.env.OWNER_ID,
    prefix: process.env.PREFIX,

    emitters: {
        process
    },

    defaultPrompt: {
        timeout: message => 'Vous vaez mis trop de temps à répondre. Commande annulée',
        ended: message => 'Trop de tentatives. Commandes annulée',
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

client.login(process.env.DISCORD_TOKEN);