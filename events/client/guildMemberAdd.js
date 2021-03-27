const {
    Listener
} = require("discord-akairo");
const chalk = require('chalk');
const moment = require('moment');


class guildMemberAddListener extends Listener {
    constructor() {
        super('guildMemberAdd', {
            emitter: 'client',
            event: 'guildMemberAdd'
        });
    }

    exec(member) {
        let client = this.client;

        this.client.memberLogServerJoin(member.id);

        let userdata = this.client.userdataGet(member.id);
        if (userdata) {
            setTimeout(function () {
                client.serverJoinInformationAgain(member);
            }, 500);

            this.client.modLogEmbed(client.textes.get("MOD_NOTIF_SERVER_JOIN_AGAIN", member, userdata), 'REJOIN');
        } else {
            this.client.userdataCreate(member);
            setTimeout(function () {
                client.serverJoinInformation(member);
            }, 500);


            client.modLogEmbed(client.textes.get("MOD_NOTIF_SERVER_JOIN", member), 'JOIN');
        }

    }
}

module.exports = guildMemberAddListener;