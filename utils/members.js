const constants = require("./constants");
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('./messages');
const colors = require("./colors");
const Discord = require("discord.js");
const textes = new (require("./textes.js"));
const moment = require("moment");

module.exports = (client) => {
    // Message d'annonce lorsqu'un utilisateur est passé membre
    client.newMemberNotification = async (member) => {
        client.log(textes.get("LOG_EVENT_MEMBER_JOIN_MEMBERS", member));

        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        if (settings.welcomeMemberEnabled !== "true") return client.log(textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"), "warn");

        let welcomeMemberChannel = guild.channels.cache.find((channel) => channel.name === settings.welcomeMemberChannel);

        if (welcomeMemberChannel) {
            const welcomeMessage = new Discord.MessageEmbed()
                .setTimestamp()
                .setColor(colors['darkgreen'])
                .setThumbnail(member.user.avatarURL())
                .setDescription(textes.get("MEMBER_NEW_MEMBER_NOTIFICATION", member));
            welcomeMemberChannel.send(welcomeMessage);
        };
        client.modLog(textes.get("MOD_NOTIF_NEW_MEMBER", member));
    };
    // Message d'acceuil lorsqu'un utilisateur est passé membre
    client.newMemberWelcome = async (member) => {
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        if (settings.welcomeMemberEnabled !== "true") return client.log(textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"), "warn");

        let welcomeMemberChannel = guild.channels.cache.find(c => c.name === settings.welcomeMemberChannel);

        if (welcomeMemberChannel) {
            const welcomeMessage = new Discord.MessageEmbed()
                //.setTitle(client.textes.get("MEMBER_MESSAGE_ACCUEIL_TITRE", member))
                .setColor(colors['darkorange'])
                .setThumbnail(client.user.avatarURL())
                .setDescription(textes.get("MEMBER_MESSAGE_ACCUEIL_DESCRIPTION", member));
            welcomeMemberChannel.send(welcomeMessage);
        };

    };

    client.memberExperienceAdd = async (member, type, amount, reason = null, game = null) => {

        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = client.db_settings.get(guild.id);
        const userdata = client.db_userdata.get(member.id);

        const roleMembers = guild.roles.cache.find((role) => role.name === settings.memberRole);

        if (roleMembers) {
            if (member.roles.cache.has(roleMembers.id)) {

            }
        } else {
            client.log(textes.get("ERROR_SETTINGS_ROLE_MEMBERS_NOT_FOUND", settings.memberRole), "error")
        }
    };

    client.membersGetScore = (memberID) => {
        let now = +new Date;
        let fromTimestamp = +new Date(moment(now).subtract(5, 'days').startOf('day'));
        let toTimestamp = +new Date(moment(now).subtract(1, 'days').endOf('day'));

        let score = 0;

        let memberLogs = client.db_memberLog.filterArray(memberLog =>
            memberLog.memberID === memberID &&
            memberLog.createdAt > fromTimestamp &&
            memberLog.createdAt < toTimestamp);

        if (memberLogs) {
            for (const memberLog of memberLogs) {
                score += memberLog.xpGained;
            }
        }
        return score;
    };

    client.membersGetExpDetail = (nbDays = 5) => {

        let userdatas = client.userdataGetAll(true);

        let expDetail = [];
        let days = [];
        for (var i = 0; i < nbDays; i++) {
            days.push(moment().subtract(i, 'days').format('DD.MM.YYYY'));
        };

        for (const day of days) {
            expDetail.push(`**${day}**`);
            for (const userdata of userdatas) {

                let memberLogs = client.db_memberLog.filterArray(memberLog =>
                    memberLog.memberID === userdata.id &&
                    memberLog.createdDate === day);

                let totalExp = 0;
                let voiceExp = 0;
                let gameExp = 0;
                let textExp = 0;
                let reactInExp = 0;
                let reactOutExp = 0;
                for (const memberLog of memberLogs) {
                    totalExp += memberLog.xpGained;

                    switch (memberLog.type) {
                        case "VOICE":
                            voiceExp += memberLog.xpGained;
                            break;
                        case "PLAY":
                            gameExp += memberLog.xpGained;
                            break;
                        case "TEXT":
                            textExp += memberLog.xpGained;
                            break;
                        case "REACTIN":
                            reactInExp += memberLog.xpGained;
                            break;
                        case "REACTOUT":
                            reactOutExp += memberLog.xpGained;
                            break;
                        default:
                            break;
                    }
                }
                if (totalExp > 0) {
                    expDetail.push(`${userdata.displayName}: **${totalExp}** (${voiceExp}/${gameExp}/${textExp}/${reactInExp}/${reactOutExp})`);
                    // expDetail.push(`V:${voiceExp} P:${gameExp} T:${textExp} Ri:${reactInExp} Ro:${reactOutExp}`);
                }
            };
        };

        return expDetail;
    };

    client.membersGetTopScores = () => {
        let userdatas = client.userdataGetAll(true);
        let membersScores = [];

        for (const userdata of userdatas) {
            let memberScore = {
                "memberID": "",
                "score": 0
            };
            memberScore.memberID = userdata.id;
            memberScore.score = client.membersGetScore(userdata.id);
            membersScores.push(memberScore);
        }
        return membersScores;
    };

    client.membersGetTopXP = () => {
        let userdatas = client.userdataGetAll(true);
        let membersXP = [];

        for (const userdata of userdatas) {
            let memberXP = {
                "memberID": "",
                "level": 0,
                "xp": 0
            };
            memberXP.memberID = userdata.id;
            memberXP.level = userdata.level;
            memberXP.xp = userdata.xp;
            membersXP.push(memberXP)
        }
        return membersXP;
    };

}