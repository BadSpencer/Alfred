const {
Listener
} = require('discord-akairo');
const chalk = require('chalk');
const moment = require('moment');


class guildMemberRemoveListener extends Listener {
    constructor() {
        super('guildMemberRemove', {
            emitter: 'client',
            eventName: 'guildMemberRemove'
        });
    }

    exec(member) {
        let newMember = `Nouvel utilisateur ${member.name} à quitté le serveur` 
        this.client.logger.log(`${newMember}`);
    }
}

module.exports = guildMemberRemoveListener;