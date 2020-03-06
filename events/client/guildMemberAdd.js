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

        client.logger.log(client.textes.get("LOG_EVENT_USER_JOIN_SERVER", member));
        client.members.serverJoinNotification(client, member);
        client.members.serverJoinInformation(client, member);
    }
}

module.exports = guildMemberAddListener;