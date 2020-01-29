const { AkairoClient } = require('discord-akairo');

const client = new AkairoClient({
    ownerID: '291545597205544971', // or ['123992700587343872', '86890631690977280']
    prefix: '/', // or ['?', '!']
    commandDirectory: './commands/'
}, {
    disableEveryone: true
});

client.login('NTUxNzE2OTcxNDg2NjQyMTgx.XTBhGA.bOpCX9ZqlVIPqfIBN2ptsbguNwc');