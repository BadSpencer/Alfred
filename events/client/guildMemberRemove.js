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
        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const roleMembers = guild.roles.cache.find(r => r.name === settings.memberRole);
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
                let executor = banLog.executor;
                let reason = banLog.reason;

                if (reason == null) {
                    reason = `Aucune raison spécifiée`
                }

                if (banLog.executor.id === client.user.id) {
                    let memberLog = client.db_memberLog.filterArray(memberLog =>
                        memberLog.memberID === member.id &&
                        memberLog.type === "SERVERBAN");

                    memberLog.sort(function (a, b) {
                        return a.createdAt - b.createdAt;
                    }).reverse();
                    executor = guild.members.cache.get(memberLog[0].partyMemberID);
                    reason = memberLog[0].note;
                }


                client.serverBanNotification(banLog.target, executor, reason);
                client.memberLogBan(banLog.target.id, executor.id, reason);
                client.modLogEmbed(client.textes.get("MOD_NOTIF_SERVER_BAN", banLog.target, executor, reason), 'BAN');
                return
            }
        }
        if (kickLog) {
            const kickDate = +new Date(kickLog.createdAt);
            const kickDuration = dateNow - kickDate;

            if (kickLog.target.id === member.id && kickDuration < 10000) {
                let executor = kickLog.executor;
                let reason = kickLog.reason;

                if (reason == null) {
                    reason = `Aucune raison spécifiée`
                }

                if (kickLog.executor.id === client.user.id) {
                    let memberLog = client.db_memberLog.filterArray(memberLog =>
                        memberLog.memberID === member.id &&
                        memberLog.type === "SERVERKICK");

                    memberLog.sort(function (a, b) {
                        return a.createdAt - b.createdAt;
                    }).reverse();
                    executor = guild.members.cache.get(memberLog[0].partyMemberID);
                    reason = memberLog[0].note;
                }


                client.serverKickNotification(kickLog.target, executor, reason);
                client.memberLogKick(kickLog.target.id, executor.id, reason);
                client.modLogEmbed(client.textes.get("MOD_NOTIF_SERVER_KICK", kickLog.target, executor, reason), 'KICK');
                return
            }
        }
        client.memberLogServerQuit(member.id);
        if (member.roles.cache.has(roleMembers.id)) {
            client.serverQuitNotification(member.user);
        }

        client.modLogEmbed(client.textes.get("MOD_NOTIF_SERVER_QUIT", member), 'QUIT');
    }


}

module.exports = guildMemberRemoveListener;