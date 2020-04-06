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
        let client = this.client;

        client.log(client.textes.get("LOG_EVENT_USER_JOIN_SERVER", member));
        client.serverJoinNotification(member);
        client.serverJoinInformation(member);
    }
}

module.exports = guildMemberAddListener;