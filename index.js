const {
    AkairoClient,
    CommandHandler,
    ListenerHandler,
    ClientUtil,
    Command,
    SQLiteProvider
} = require('discord-akairo');
require('dotenv').config();
/*
const {
    AkairoClient
} = require('discord-akairo');
*/


const client = new AkairoClient({
    ownerID: process.env.OWNER_ID,
    prefix: process.env.PREFIX,

    emitters: {
        process
    },

    handleEdits: true,
    commandUtilLifetime: 300000,
    commandDirectory: './commands/',
    inhibitorDirectory: './inhibitors/',
    listenerDirectory: './events/',
    // CommandRelated
    automateCategories: true,
    commandUtil: true
}, {
    disableEveryone: true
});

client.login(process.env.DISCORD_TOKEN);