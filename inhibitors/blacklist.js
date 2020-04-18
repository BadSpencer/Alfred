const { Inhibitor } = require('discord-akairo');

class Blacklist extends Inhibitor {
    constructor() {
        super('blacklist', {
            reason: 'blacklist'
        })
    }

    exec(message, command) {
        //const blacklist = ['291545597205544971'];
        const blacklist = [];
        return blacklist.includes(message.author.id); // true = coimmande bloquée
    }
}

module.exports = Blacklist;