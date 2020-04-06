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
        
        client.log(client.textes.get("LOG_EVENT_USER_QUIT_SERVER", member));
        client.serverQuitNotification(member);
    }
}

module.exports = guildMemberRemoveListener;