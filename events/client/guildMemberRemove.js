const {
    Listener
} = require("discord-akairo");
const chalk = require('chalk');
const moment = require('moment');


class guildMemberRemoveListener extends Listener {
    constructor() {
        super('guildMemberRemove', {
            emitter: 'client',
            event: 'guildMemberRemove'
        });
    }

    async exec(member) {
        let client = this.client;
        client.log(`EVENT: ${this.emitter}/${this.event}`, "debug");

        client.log(client.textes.get("LOG_EVENT_USER_QUIT_SERVER", member.user));


        const fetchedKickLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });
        const fetchedBanLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD',
        });

        const kickLog = fetchedKickLogs.entries.first();
        const banLog = fetchedBanLogs.entries.first();

        const dateNow = +new Date;


        if (banLog) {
            const banDate = +new Date(banLog.createdAt);
            const banDuration = dateNow - banDate;

            if (banLog.target.id === member.id && banDuration < 10000) {
                client.serverBanNotification(banLog.target, banLog.executor, banLog.reason);
                client.memberLogBan(kickLog.target.id, kickLog.executor.id, kickLog.reason);
                client.modLog(client.textes.get("MOD_NOTIF_SERVER_BAN", kickLog.target, kickLog.executor, kickLog.reason));
                return
            }
        }
        if (kickLog) {
            const kickDate = +new Date(kickLog.createdAt);
            const kickDuration = dateNow - kickDate;

            if (kickLog.target.id === member.id && kickDuration < 10000) {
                client.serverKickNotification(kickLog.target, kickLog.executor, kickLog.reason);
                client.memberLogKick(kickLog.target.id, kickLog.executor.id, kickLog.reason);
                client.modLog(client.textes.get("MOD_NOTIF_SERVER_KICK", kickLog.target, kickLog.executor, kickLog.reason));
                return
            }
        }
        client.memberLogServerQuit(member.id);
        client.serverQuitNotification(member.user);
        client.modLog(client.textes.get("MOD_NOTIF_SERVER_QUIT", member));
    }


}

module.exports = guildMemberRemoveListener;