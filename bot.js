require('dotenv').config();
const { AkairoClient } = require('discord-akairo');

const client = new AkairoClient({
    ownerID: '291545597205544971', 
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

client.login(process.env.DISCORD_TOKEN);