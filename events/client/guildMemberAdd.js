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

            let memberLogs = client.db_memberLog.filterArray(memberLog =>
                memberLog.memberID === member.id &&
                memberLog.type === 'SERVERQUIT' ||
                memberLog.type === 'SERVERKICK' ||
                memberLog.type === 'SERVERBAN');

            memberLogs.sort(function (a, b) {
                return a.createdAt - b.createdAt;
            }).reverse();

            this.client.modLogEmbed(client.textes.get("MOD_NOTIF_SERVER_JOIN_AGAIN", member, userdata, memberLogs[0]), 'REJOIN');
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