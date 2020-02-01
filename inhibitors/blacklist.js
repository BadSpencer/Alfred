const { Inhibitor } = require('discord-akairo');

class BlacklistInhibitor extends Inhibitor {
    constructor() {
        super('blacklist', {
            reason: 'blacklist'
        })
    }

    exec(message) {
        //const blacklist = ['291545597205544971'];
        const blacklist = [];
        return blacklist.includes(message.author.id);
    }
}

module.exports = BlacklistInhibitor;