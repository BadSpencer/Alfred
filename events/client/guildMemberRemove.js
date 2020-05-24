const {
    Listener
} = require('discord-akairo');
const chalk = require('chalk');
const moment = require('moment');


class guildMemberRemoveListener extends Listener {
    constructor() {
        super('guildMemberRemove', {
            emitter: 'client',
            event: 'guildMemberRemove'
        });
    }

    exec(member) {
        let client = this.client;
        client.log(`EVENT: ${this.emitter}/${this.event}`, 'debug');

        client.log(client.textes.get("LOG_EVENT_USER_QUIT_SERVER", member));

        let userdata = client.db_userdata.get(member.id);
        let date = moment().format('DD.MM.YYYY');

        if (userdata.logs.find(log => log.event == "KICK" && log.date == date)) {
            client.modLog(client.textes.get("MOD_NOTIF_SERVER_KICK", member));
        } else {
            if (userdata.logs.find(log => log.event == "BAN" && log.date == date)) {
                //client.serverBanNotification(member);
                client.modLog(client.textes.get("MOD_NOTIF_SERVER_BAN", member));
            } else {
                client.serverQuitNotification(member);
                client.userdataAddLog(userdata, member, "QUIT", "A quitté le discord");
                client.modLog(client.textes.get("MOD_NOTIF_SERVER_QUIT", member));
            }
        }



    }
}

module.exports = guildMemberRemoveListener;