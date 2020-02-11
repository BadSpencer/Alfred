const {
Listener
} = require('discord-akairo');
const chalk = require('chalk');
const moment = require('moment');


class guildMemberAddListener extends Listener {
    constructor() {
        super('guildMemberAdd', {
            emitter: 'client',
            eventName: 'guildMemberAdd'
        });
    }

    exec(member) {
        let newMember = `Nouvel utilisateur ${member.displayName} à rejoint le serveur` 
        this.client.logger.log(`${newMember}`);
    }
}

module.exports = guildMemberAddListener;