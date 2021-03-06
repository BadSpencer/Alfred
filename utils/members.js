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

    client.memberGet = (memberID) => {
        const guild = client.getGuild();
        let guildMember = guild.members.cache.get(memberID);
        if (guildMember) {
            return guildMember;
        }
        return false;
    }

    client.memberGetDisplayNameByID = (memberID) => {
        let guildMember = client.memberGet(memberID);
        if (guildMember) {
            return guildMember.displayName;
        } else {
            let userdata = client.userdataGet(memberID);
            if (userdata) {
                return userdata.displayName;
            } else {
                return memberID;
            }
        }
    };
    // Message d'annonce lorsqu'un utilisateur est passé membre
    client.newMemberNotification = async (member) => {
        client.log(textes.get("LOG_EVENT_MEMBER_JOIN_MEMBERS", member));

        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        if (settings.welcomeMemberEnabled === false) return client.log(textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"), "warn");

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

        if (settings.welcomeMemberEnabled === false) return client.log(textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"), "warn");

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
        membersScores.sort(function (a, b) {
            return a.score - b.score;
        });
        membersScores.reverse();
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


    client.memberListPost = async (channel, option = 'tout') => {
        const guild = client.getGuild();
        let userdataList = [];
        switch (option) {
            case 'tout':
                userdataList = client.userdataGetAll(true);
                userdataList.sort(function (a, b) {
                    return a.username - b.username;
                }).reverse();
                break;
            default:
                userdataList = client.userdataSearch(option, true);
                userdataList.sort(function (a, b) {
                    return a.actif - b.actif;
                }).reverse();
                break;
        }

        let dateNow = +new Date;

        let memberList = [];
        let memberListOutput = [];
        for (const userdata of userdataList) {
            let memberListline = {
                "id": "",
                "actif": false,
                "displayName": "",
                "tag": "",
                "memberSince": "",
                "warn": 0,
                "level": 0,
                "xp": 0,
                "credit": 0,
                "karma": 0,
                "notes": 0
            };
            let memberLogs = await client.memberNotesGet(userdata.id);
            let member = guild.members.cache.get(userdata.id);
            memberListline.id = userdata.id;
            memberListline.displayName = client.memberGetDisplayNameByID(userdata.id);
            memberListline.memberSince = moment.duration(userdata.joinedAt - dateNow).locale("fr").humanize(true);
            memberListline.warn = userdata.warn;
            memberListline.level = userdata.level;
            memberListline.xp = userdata.xp;
            memberListline.credit = userdata.credit;
            memberListline.karma = userdata.karma;
            memberListline.notes = memberLogs.length;
            if (member) {
                memberListline.actif = true;
                memberListline.tag = member.user.username;
            } else {
                memberListline.actif = false;
                memberListline.tag = 'non trouvé';
            }
            memberList.push(memberListline);
        };

        memberList.sort(function (a, b) {
            return a.xp - b.xp;
        }).reverse();

        for (memberListline of memberList) {

            if (memberListline.actif) {
                memberListOutput.push(`◽️**${memberListline.displayName}** (${memberListline.tag}) - ${memberListline.id}`);
                memberListOutput.push(`◾️Lvl:**${memberListline.level}** XP:**${memberListline.xp}** K: **${memberListline.karma}** Cr:**${memberListline.credit}** Avert:**${memberListline.warn}** Notes:**${memberListline.notes}**\n`);
            } else {
                // memberListOutput.push(`◾️${memberListline.displayName} (${memberListline.id})`);
            }


        }
        await client.arrayToEmbed(memberListOutput, 20, `Liste de membres`, channel);
    };

    client.memberNotesGet = async (memberID) => {
        let memberLogs = client.db_memberLog.filterArray(memberLog =>
            memberLog.memberID === memberID &&
            memberLog.type === 'NOTE' ||
            memberLog.type === 'WARN');

        memberLogs.sort(function (a, b) {
            return a.createdAt - b.createdAt;
        }).reverse();

        return memberLogs;
    };

    client.memberNotesGetAll = async () => {
        let memberLogs = client.db_memberLog.filterArray(memberLog =>
            memberLog.type === 'NOTE' ||
            memberLog.type === 'WARN');

        memberLogs.sort(function (a, b) {
            return a.createdAt - b.createdAt;
        }).reverse();

        return memberLogs;
    };

    client.memberNotesCount = async (memberID) => {
        let memberNotesLogs = await client.memberNotesGet(memberID);
        if (memberNotesLogs) {
            return memberNotesLogs.length;
        } else {
            return 0;
        }
    }

    client.memberNotesPost = async (memberID, channel) => {

        let memberLogs = await client.memberNotesGet(memberID);
        let memberNotes = [];

        if (memberLogs) {
            for (const memberLog of memberLogs) {
                if (memberLog.type == 'WARN') {
                    memberNotes.push(`⚠️**${memberLog.key}** \`${moment(memberLog.createdAt).format('DD.MM.YYYY')} ${moment(memberLog.createdAt).format('HH:mm')}\` par <@${memberLog.partyMemberID}>`);
                } else {
                    memberNotes.push(`◽️**${memberLog.key}** \`${moment(memberLog.createdAt).format('DD.MM.YYYY')} ${moment(memberLog.createdAt).format('HH:mm')}\` par <@${memberLog.partyMemberID}>`);
                }
                memberNotes.push(`${memberLog.note}`);
                memberNotes.push(``);

            }
        }

        if (memberNotes.length > 0) {
            await client.arrayToEmbed(memberNotes, 12, `Notes pour ${client.memberGetDisplayNameByID(memberID)}`, channel);
        } else {
            warnMessage(`Aucune note trouvée pour ${client.memberGetDisplayNameByID(memberID)}`, channel);
        }

    };

    client.memberUpdateWarn = async () => {
        let userdatas = client.userdataGetAll(true);

        for (userdata of userdatas) {
            let memberLogs = client.db_memberLog.filterArray(memberLog =>
                memberLog.memberID === userdata.id &&
                memberLog.type === 'WARN');

            userdata.warn = memberLogs.length;
            client.userdataSet(userdata);
        }

    };

    client.memberNotesList = async (channel) => {

        let memberLogs = await client.memberNotesGetAll();
        let memberNotes = [];

        if (memberLogs) {
            for (const memberLog of memberLogs) {
                if (memberLog.type == 'WARN') {
                    memberNotes.push(`⚠️**${memberLog.key}** <@${memberLog.memberID}> \`${moment(memberLog.createdAt).format('DD.MM.YYYY')} ${moment(memberLog.createdAt).format('HH:mm')}\` par <@${memberLog.partyMemberID}>`);
                } else {
                    memberNotes.push(`◽️**${memberLog.key}** <@${memberLog.memberID}> \`${moment(memberLog.createdAt).format('DD.MM.YYYY')} ${moment(memberLog.createdAt).format('HH:mm')}\` par <@${memberLog.partyMemberID}>`);
                }
                memberNotes.push(`${memberLog.note}`);
                memberNotes.push(``);
            }
        }

        if (memberNotes.length > 0) {
            await client.arrayToEmbed(memberNotes, 12, `Liste des notes`, channel);
        } else {
            warnMessage(`Aucune note trouvée`, channel);
        }

    };


}