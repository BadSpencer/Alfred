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


        let userdata = client.db_userdata.get(member.id);
        if (userdata) {
            client.userdataAddLog(member, member, "JOIN", "A rejoint le discord");
            client.serverJoinNotification(member);

            setTimeout(function () {
                client.serverJoinInformationAgain(member);
            }, 5000);

            client.modLog(client.textes.get("MOD_NOTIF_SERVER_JOIN_AGAIN", member));
        } else {
            client.userdataCreate(member);
            client.serverJoinNotification(member);
            setTimeout(function () {
                client.serverJoinInformation(member);
            }, 5000);


            client.modLog(client.textes.get("MOD_NOTIF_SERVER_JOIN", member));
        }

    }
}

module.exports = guildMemberAddListener;