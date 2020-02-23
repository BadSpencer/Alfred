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
        let client = this.client;
        
        client.logger.log(client.textes.get("LOG_EVENT_MEMBER_QUIT_SERVER", member));
        client.members.serverQuitNotification(client, member);
    }
}

module.exports = guildMemberRemoveListener;