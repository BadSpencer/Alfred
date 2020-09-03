const Discord = require("discord.js");
const datamodel = require("./datamodel");
const colors = require("./colors");
const constants = require("./constants");
const moment = require("moment");
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage,
    promptMessage
} = require("./messages");

module.exports = (client) => {

    client.activityCheck = async () => {
        client.log(`Méthode: exp/activityCheck`, "debug");
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        const games = client.gamesGetActive();

        const roleMembers = guild.roles.cache.find(r => r.name == settings.memberRole);

        if (!games) return;

        guild.members.cache.forEach(member => {
            if (member.roles.cache.has(roleMembers.id)) {
                let presenceGame = client.presenceGetGameName(member.presence);
                if (presenceGame) {
                    const game = client.gamesGet(presenceGame);
                    if (game) {
                        client.usergameUpdateLastPlayed(game, member);
                        client.usergameAddXP(member, game);
                        client.memberLogPlay(member, game);
                    }
                }
                if (member.voice.channel && member.voice.channel.name !== settings.AFKChannel && member.voice.channel.name !== settings.quietChannel) {
                    client.memberLogVoice(member);
                };
            }
        });

    };

    client.memberLogVoice = (member, timestamp = null, xpGained = 1) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };

        client.userdataLog(timestamp, member, "VOICE", `${member.displayName} est dans le salon ${member.voice.channel.name}`, null, member.voice.channel.name, null, null, null, null, null, null, null, null, xpGained);
    };

    client.memberLogPlay = (member, game, timestamp = null, xpGained = 1) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        if (member.roles.cache.has(game.roleID)) {
            client.userdataLog(timestamp, member, "PLAY", `${member.displayName} joue à ${game.name}`, game.id, null, null, null, null, null, null, null, null, null, xpGained);
        } else {
            client.userdataLog(timestamp, member, "PLAY", `${member.displayName} joue à ${game.name}`, game.id, null, null, null, null, null, null, null, null, null, 0);
        }
    };

    client.memberLogText = (member, message, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        if (message.content.length > 150) {
            client.userdataLog(timestamp, member, "TEXT", null, null, null, message.id, message.content, null, null, null, null, null, null, 100);
        } else {
            client.userdataLog(timestamp, member, "TEXT", null, null, null, message.id, message.content, null, null, null, null, null, null, 25);
        }
    };

    client.memberLogCmd = (member, command, message, timestamp = null, xpGained = 5) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.userdataLog(timestamp, member, "CMD", `${member.displayName} à lancé la commande ${command.id}`, null, null, message.id, message.content, command, null, null, null, null, null, xpGained);
    };

    client.memberLogReactIn = (member, partyMember, message, emoji, timestamp = null, xpGained = 10) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.userdataLog(timestamp, member, "REACTIN", `Réaction reçue ${emoji} de la part de ${partyMember.displayName} (${xpGained})`, null, null, message.id, message.content, null, partyMember.id, emoji, null, null, null, xpGained);
    };

    client.memberLogReactOut = (member, partyMember, message, emoji, timestamp = null, xpGained = 5) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.userdataLog(timestamp, member, "REACTOUT", `Réaction avec ${emoji} pour ${partyMember.displayName} (${xpGained})`, null, null, message.id, message.content, null, partyMember.id, emoji, null, null, null, xpGained);
    };

    client.memberLogServerJoin = (member, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.userdataLog(timestamp, member, "SERVERJOIN", `${member.displayName} à rejoint le serveur`, null, null, null, null, null, null, null, null, null, null, 0);
    };

    client.memberLogServerQuit = (member, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.userdataLog(timestamp, member, "SERVERQUIT", `${member.displayName} à quitté le serveur`, null, null, null, null, null, null, null, null, null, null, 0);
    };

    client.memberLogNote = (member, partyMember, note, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.userdataLog(timestamp, member, "NOTE", `Note pour ${member.displayName} par ${partyMember.displayName}`, null, null, null, null, null, partyMember.id, null, null, null, note, 0);
    };

    client.memberLogKick = (member, partyMember, note, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.userdataLog(timestamp, member, "SERVERKICK", `${member.displayName} à été kické du serveur par ${partyMember.displayName}`, null, null, null, null, null, partyMember.id, null, null, null, note, 0);
    };

    client.memberLogBan = (member, partyMember, note, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.userdataLog(timestamp, member, "SERVERBAN", `${member.displayName} à été banni du serveur par ${partyMember.displayName}`, null, null, null, null, null, partyMember.id, null, null, null, note, 0);
    };

    client.memberLogNick = (member, nickOld, nickNew, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.userdataLog(timestamp, member, "NICK", `${nickOld} s'appelle désormais ${nickNew}`, null, null, null, null, null, null, null, nickOld, nickNew, null, 0);
    };

    client.memberLogGameJoin = (member, game, timestamp = null, xpGained = 20) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.userdataLog(timestamp, member, "GAMEJOIN", `${member.displayName} à rejoint le jeu ${game.name}`, game.id, null, null, null, null, null, null, null, null, null, xpGained);
    };

    client.memberLogGameQuit = (member, game, timestamp = null, xpGained = 10) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.userdataLog(timestamp, member, "GAMEQUIT", `${member.displayName} à quitté le jeu ${game.name}`, game.id, null, null, null, null, null, null, null, null, null, xpGained);
    };

    client.memberLogGameIdle = (member, game, timestamp = null, xpGained = 10) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.userdataLog(timestamp, member, "GAMEIDLE", `${member.displayName} à été retiré du groupe de ${game.name} pour inactivité`, game.id, null, null, null, null, null, null, null, null, null, xpGained);
    };

    client.memberLogMember = (member, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.userdataLog(timestamp, member, "MEMBER", `${member.displayName} à été accepté en tant que membre`, null, null, null, null, null, null, null, null, null, null, 0);
    };


    client.userdataLog = (timestamp, member, type, comment, gameID, voiceChannelName, messageID, messageContent, command, partyMemberID, emoji, nickOld, nickNew, note, xpGained) => {
        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const userdata = client.userdataGet(member.id);

        if (timestamp === null) {
            timestamp = +new Date;
        };
        let date = moment(timestamp).format('DD.MM.YYYY');
        let time = moment(timestamp).format('HH:mm');
        let currentTypeXP = client.userdataGetCurrentXP(member.id, type);


        switch (type) {
            case "VOICE":
                let memberLogVoice = client.db_memberLog.find(memberLog =>
                    memberLog.memberID === member.id &&
                    memberLog.createdDate === date &&
                    memberLog.type === "VOICE" &&
                    memberLog.voiceChannelName === voiceChannelName);
                if (memberLogVoice) {
                    if (currentTypeXP >= settings.maxVoiceXPPerDay) {
                        memberLogVoice.xpMaxReached = true;
                    } else {
                        memberLogVoice.xpGained += xpGained;
                    }
                } else {
                    memberLogVoice = Object.assign({}, datamodel.tables.memberLog);
                    memberLogVoice.key = client.db_memberLog.autonum;
                    memberLogVoice.createdAt = timestamp;
                    memberLogVoice.createdDate = date;
                    memberLogVoice.createdTime = time;
                    memberLogVoice.memberID = member.id;
                    memberLogVoice.type = type;
                    memberLogVoice.comment = comment;
                    memberLogVoice.voiceChannelName = voiceChannelName;
                    memberLogVoice.xpGained += xpGained;
                }
                client.db_memberLog.set(memberLogVoice.key, memberLogVoice);
                if (memberLogVoice.xpMaxReached === false && xpGained > 0) {
                    client.userdataAddXP(member, xpGained)
                }
                break;

            case "PLAY":
                let memberLogPlay = client.db_memberLog.find(memberLog =>
                    memberLog.memberID === member.id &&
                    memberLog.createdDate === date &&
                    memberLog.type === "PLAY" &&
                    memberLog.gameID === gameID);

                if (memberLogPlay) {
                    if (currentTypeXP >= settings.maxPlayXPPerDay) {
                        memberLogPlay.xpMaxReached = true;
                    } else {
                        memberLogPlay.xpGained += xpGained;
                    }
                } else {
                    memberLogPlay = Object.assign({}, datamodel.tables.memberLog);
                    memberLogPlay.key = client.db_memberLog.autonum;
                    memberLogPlay.createdAt = timestamp;
                    memberLogPlay.createdDate = date;
                    memberLogPlay.createdTime = time;
                    memberLogPlay.memberID = member.id;
                    memberLogPlay.type = type;
                    memberLogPlay.comment = comment;
                    memberLogPlay.gameID = gameID;
                };
                client.db_memberLog.set(memberLogPlay.key, memberLogPlay);
                if (memberLogPlay.xpMaxReached === false && xpGained > 0) {
                    client.userdataAddXP(member, xpGained)
                }
                break;

            case "TEXT":
                let memberLogText = Object.assign({}, datamodel.tables.memberLog);
                memberLogText.key = client.db_memberLog.autonum;
                memberLogText.createdAt = timestamp;
                memberLogText.createdDate = date;
                memberLogText.createdTime = time;
                memberLogText.memberID = member.id;
                memberLogText.type = type;
                memberLogText.comment = comment;
                memberLogText.messageID = messageID;
                memberLogText.messageContent = messageContent;
                if (currentTypeXP >= settings.maxTextXPPerDay) {
                    memberLogText.xpMaxReached = true;
                } else {
                    memberLogText.xpGained += xpGained;
                }
                client.db_memberLog.set(memberLogText.key, memberLogText);
                if (memberLogText.xpMaxReached === false && xpGained > 0) {
                    client.userdataAddXP(member, xpGained)
                }
                break;

            case "CMD":
                let memberLogCmd = Object.assign({}, datamodel.tables.memberLog);
                memberLogCmd.key = client.db_memberLog.autonum;
                memberLogCmd.createdAt = timestamp;
                memberLogCmd.createdDate = date;
                memberLogCmd.createdTime = time;
                memberLogCmd.memberID = member.id;
                memberLogCmd.type = type;
                memberLogCmd.comment = comment;
                memberLogCmd.commandID = command.id;
                memberLogCmd.messageContent = messageContent;
                if (currentTypeXP >= settings.maxCmdXPPerDay) {
                    memberLogCmd.xpMaxReached = true;
                } else {
                    memberLogCmd.xpGained += xpGained;
                }
                client.db_memberLog.set(memberLogCmd.key, memberLogCmd);
                if (memberLogCmd.xpMaxReached === false && xpGained > 0) {
                    client.userdataAddXP(member, xpGained)
                }
                break;

            case "REACTIN":
                let memberLogReactIn = Object.assign({}, datamodel.tables.memberLog);
                memberLogReactIn.key = client.db_memberLog.autonum;
                memberLogReactIn.createdAt = timestamp;
                memberLogReactIn.createdDate = date;
                memberLogReactIn.createdTime = time;
                memberLogReactIn.memberID = member.id;
                memberLogReactIn.type = type;
                memberLogReactIn.comment = comment;
                memberLogReactIn.messageID = messageID;
                memberLogReactIn.messageContent = messageContent;
                memberLogReactIn.partyMemberID = partyMemberID;
                memberLogReactIn.emoji = emoji;

                if (currentTypeXP >= settings.maxReactInXPPerDay) {
                    memberLogReactIn.xpMaxReached = true;
                } else {
                    memberLogReactIn.xpGained += xpGained;
                }
                client.db_memberLog.set(memberLogReactIn.key, memberLogReactIn);
                if (memberLogReactIn.xpMaxReached === false && xpGained > 0) {
                    client.userdataAddXP(member, xpGained)
                }
                break;

            case "REACTOUT":
                let memberLogReactOut = Object.assign({}, datamodel.tables.memberLog);
                memberLogReactOut.key = client.db_memberLog.autonum;
                memberLogReactOut.createdAt = timestamp;
                memberLogReactOut.createdDate = date;
                memberLogReactOut.createdTime = time;
                memberLogReactOut.memberID = member.id;
                memberLogReactOut.type = type;
                memberLogReactOut.comment = comment;
                memberLogReactOut.messageID = messageID;
                memberLogReactOut.messageContent = messageContent;
                memberLogReactOut.partyMemberID = partyMemberID;
                memberLogReactOut.emoji = emoji;

                if (currentTypeXP >= settings.maxReactInXPPerDay) {
                    memberLogReactOut.xpMaxReached = true;
                } else {
                    memberLogReactOut.xpGained += xpGained;
                }
                client.db_memberLog.set(memberLogReactOut.key, memberLogReactOut);
                if (memberLogReactOut.xpMaxReached === false && xpGained > 0) {
                    client.userdataAddXP(member, xpGained)
                }
                break;

            case "SERVERJOIN":
            case "SERVERQUIT":
                let memberLogServerJoinQuit = Object.assign({}, datamodel.tables.memberLog);
                memberLogServerJoinQuit.key = client.db_memberLog.autonum;
                memberLogServerJoinQuit.createdAt = timestamp;
                memberLogServerJoinQuit.createdDate = date;
                memberLogServerJoinQuit.createdTime = time;
                memberLogServerJoinQuit.memberID = member.id;
                memberLogServerJoinQuit.type = type;
                memberLogServerJoinQuit.comment = comment;
                client.db_memberLog.set(memberLogServerJoinQuit.key, memberLogServerJoinQuit);

                break;

            case "SERVERKICK":
            case "SERVERBAN":
            case "NOTE":
                let memberLogServerKickBan = Object.assign({}, datamodel.tables.memberLog);
                memberLogServerKickBan.key = client.db_memberLog.autonum;
                memberLogServerKickBan.createdAt = timestamp;
                memberLogServerKickBan.createdDate = date;
                memberLogServerKickBan.createdTime = time;
                memberLogServerKickBan.memberID = member.id;
                memberLogServerKickBan.type = type;
                memberLogServerKickBan.comment = comment;
                memberLogServerKickBan.note = note;
                memberLogServerKickBan.partyMemberID = partyMemberID;
                client.db_memberLog.set(memberLogServerKickBan.key, memberLogServerKickBan);

                break;

            case "MEMBER":
                let memberLogServerMember = Object.assign({}, datamodel.tables.memberLog);
                memberLogServerMember.key = client.db_memberLog.autonum;
                memberLogServerMember.createdAt = timestamp;
                memberLogServerMember.createdDate = date;
                memberLogServerMember.createdTime = time;
                memberLogServerMember.memberID = member.id;
                memberLogServerMember.type = type;
                memberLogServerMember.comment = comment;
                memberLogServerMember.note = note;
                memberLogServerMember.partyMemberID = partyMemberID;
                client.db_memberLog.set(memberLogServerMember.key, memberLogServerMember);

            case "NICK":
                let memberLogServerNick = Object.assign({}, datamodel.tables.memberLog);
                memberLogServerNick.key = client.db_memberLog.autonum;
                memberLogServerNick.createdAt = timestamp;
                memberLogServerNick.createdDate = date;
                memberLogServerNick.createdTime = time;
                memberLogServerNick.memberID = member.id;
                memberLogServerNick.type = type;
                memberLogServerNick.comment = comment;
                memberLogServerNick.nickOld = nickOld;
                memberLogServerNick.nickNew = nickNew;
                client.db_memberLog.set(memberLogServerNick.key, memberLogServerNick);

                break;

            case "GAMEJOIN":
            case "GAMEQUIT":
            case "GAMEIDLE":
                let memberLogServerGameJoinQuit = Object.assign({}, datamodel.tables.memberLog);
                memberLogServerGameJoinQuit.key = client.db_memberLog.autonum;
                memberLogServerGameJoinQuit.createdAt = timestamp;
                memberLogServerGameJoinQuit.createdDate = date;
                memberLogServerGameJoinQuit.createdTime = time;
                memberLogServerGameJoinQuit.memberID = member.id;
                memberLogServerGameJoinQuit.type = type;
                memberLogServerGameJoinQuit.comment = comment;
                memberLogServerGameJoinQuit.gameID = gameID;

                client.db_memberLog.set(memberLogServerGameJoinQuit.key, memberLogServerGameJoinQuit);
                break;

            default:
                break;
        }
    };

    client.userdataAddXP = (member, amount = 1) => {
        client.log(`Méthode: exp/userdataAddXP`, "debug");
        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const userdata = client.userdataGet(member.id);
        const roleMembers = client.roleMemberGet(guild, settings);

        if (member.roles.cache.has(roleMembers.id)) {
            userdata.xp += amount;
            let newLevel = client.xpGetLevel(userdata.xp);
            if (newLevel > userdata.level) {
                userdata.level = newLevel;
                client.userLevelUp(member, newLevel);
                client.log(`Niveau supérieur pour ${member.displayName} qui est désormais level ${newLevel})`)
            };
            client.userdataSet(userdata);
            client.log(`XP pour ${member.displayName}: ${amount}`, "debug");
        }
    };

    client.usergameAddXP = (member, game, amount = 1) => {
        client.log(`Méthode: exp/usergameAddXP`, "debug");
        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const usergame = client.usergameGet(member, game);

        usergame.xp += amount;
        let newLevel = client.xpGetLevel(usergame.xp);
        if (newLevel > usergame.level) {
            usergame.level = newLevel;
            client.log(`Jeu ${game.name}: Niveau supérieur pour ${member.displayName} qui est désormais level ${newLevel})`)
        };
        client.usergameSet(usergame);

        client.log(`usergameXP pour ${member.displayName} sur ${game.name} (${amount})`, "debug");

        let date = moment().format('DD.MM.YYYY');
        let key = `${date}-${member.id}-${game.id}`;

        let usergameXP = client.db_usergameXP.get(key);
        if (!usergameXP) {
            client.log(`usergameXP créé`, "debug");
            usergameXP = Object.assign({}, datamodel.tables.usergameXP);
            usergameXP.key = key;
            usergameXP.date = date;
            usergameXP.memberID = member.id;
            usergameXP.gameID = game.id;
        }
        usergameXP.totalXP += amount;
        client.db_usergameXP.set(key, usergameXP);

    };

    client.userdataGetCurrentXP = (memberID, type) => {
        let date = +new Date;
        let createdDate = moment(date).format('DD.MM.YYYY');
        let memberLogs = client.db_memberLog.filterArray(
            (memberLog) => memberLog.memberID === memberID &&
            memberLog.createdAt === createdDate &&
            memberLog.type === type);

        let XP = 0;
        for (const memberLog of memberLogs) {
            XP += memberLog.xpGained;
        }

        return XP;
    };

    client.xpGetLevel = (xp) => {
        client.log(`Méthode: exp/xpGetLevel`, "debug");
        let coef = 600;
        // L = (25 + sqrt(25 * 25 - 4 * 25 * (-X) ))/ (2 * 25)
        let level = Math.floor(Math.floor(coef + Math.sqrt(coef * coef - 4 * coef * (-xp))) / (coef * 2));
        return level;
    };
    client.levelGetXP = async (level) => {
        client.log(`Méthode: exp/levelGetXP`, "debug");
        let coef = 600;
        // L = (25 + sqrt(25 * 25 - 4 * 25 * (-X) ))/ (2 * 25)
        let xp = Math.floor((coef * (level * level)) - (coef * level));
        return xp;
    };
    client.userLevelUp = async (member, level) => {
        client.log(`Méthode: exp/userLevelUp`, "debug");
        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = client.db_settings.get(guild.id);

        //let channel = guild.channels.cache.find(c => c.name === settings.welcomeMemberChannel);
        let channel = guild.channels.cache.find(c => c.name === settings.commandsTestChannel);

        let embed = new Discord.MessageEmbed();
        let indexLevel = parseInt(level);

        client.log(client.textes.get("EXP_LOG_LEVELUP", member, level));

        if (indexLevel == 1) {
            embed.setTitle(client.textes.get("EXP_MESSAGE_INFORMATIONS_TITRE"));
            embed.setDescription(client.textes.get("EXP_MESSAGE_INFORMATIONS_DESCRIPTION", member));
            embed.setColor(colors['darkgreen']);
            embed.setThumbnail(client.user.avatarURL())
            channel.send(embed);
        } else {
            embed.setAuthor(member.displayName, member.user.avatarURL());
            embed.setTitle(client.textes.get("EXP_MESSAGE_LEVELUP_TITRE"));
            embed.setDescription(client.textes.get("EXP_MESSAGE_LEVELUP_DESCRIPTION", member, level));
            embed.setColor(colors['darkgreen']);
            embed.setThumbnail(constants.images.levels[indexLevel]);
            channel.send(embed);
        }
    };

}