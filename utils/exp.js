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
                        client.memberLogPlay(member.id, game);
                    }
                }
                if (member.voice.channel && member.voice.channel.name !== settings.AFKChannel && member.voice.channel.name !== settings.quietChannel) {
                    client.memberLogVoice(member.id);
                };
            }
        });

    };

    client.memberLogVoice = (memberID, timestamp = null, xpGained = 1) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "VOICE", `${client.memberGetDisplayNameByID(memberID)} est dans le salon ${member.voice.channel.name}`, null, member.voice.channel.name, null, null, null, null, null, null, null, null, xpGained);
    };

    client.memberLogPlay = (memberID, game, timestamp = null, xpGained = 1) => {
        const guild = client.getGuild();
        if (timestamp === null) {
            timestamp = +new Date;
        };
        let member = guild.members.cache.get(memberID);
        if (member) {
            if (member.roles.cache.has(game.roleID)) {
                client.memberLog(timestamp, memberID, "PLAY", `${client.memberGetDisplayNameByID(memberID)} joue à ${game.name}`, game.id, null, null, null, null, null, null, null, null, null, xpGained);
            } else {
                client.memberLog(timestamp, memberID, "PLAY", `${client.memberGetDisplayNameByID(memberID)} joue à ${game.name} (pas dans le groupe)`, game.id, null, null, null, null, null, null, null, null, null, 0);
            }
        }
    };

    client.memberLogText = (memberID, message, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        if (message.content.length > 150) {
            client.memberLog(timestamp, memberID, "TEXT", `Message de ${client.memberGetDisplayNameByID(memberID)} dans ${message.channel.name}`, null, null, message.id, message.content, null, null, null, null, null, null, 100);
        } else {
            client.memberLog(timestamp, memberID, "TEXT", `Message long de ${client.memberGetDisplayNameByID(memberID)} dans ${message.channel.name}`, null, null, message.id, message.content, null, null, null, null, null, null, 25);
        }
    };

    client.memberLogCmd = (memberID, commandID, message, timestamp = null, xpGained = 5) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "CMD", `${client.memberGetDisplayNameByID(memberID)} à lancé la commande ${commandID}`, null, null, message.id, message.content, commandID, null, null, null, null, null, xpGained);
    };

    client.memberLogReactIn = (memberID, partyMemberID, message, emoji, timestamp = null, xpGained = 10) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "REACTIN", `${client.memberGetDisplayNameByID(memberID)} réaction reçue avec ${emoji} par ${client.memberGetDisplayNameByID(partyMemberID)} (${xpGained})`, null, null, message.id, message.content, null, partyMemberID, emoji, null, null, null, xpGained);
    };

    client.memberLogReactOut = (memberID, partyMemberID, message, emoji, timestamp = null, xpGained = 5) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "REACTOUT", `${client.memberGetDisplayNameByID(memberID)} réaction avec ${emoji} pour ${client.memberGetDisplayNameByID(partyMemberID)} (${xpGained})`, null, null, message.id, message.content, null, partyMemberID, emoji, null, null, null, xpGained);
    };

    client.memberLogServerJoin = (memberID, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "SERVERJOIN", `${client.memberGetDisplayNameByID(memberID)} à rejoint le serveur`, null, null, null, null, null, null, null, null, null, null, 0);
    };

    client.memberLogServerQuit = (memberID, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "SERVERQUIT", `${client.memberGetDisplayNameByID(memberID)} à quitté le serveur`, null, null, null, null, null, null, null, null, null, null, 0);
    };

    client.memberLogNote = (memberID, partyMemberID, note, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "NOTE", `Note pour ${client.memberGetDisplayNameByID(memberID)} par ${client.memberGetDisplayNameByID(partyMemberID)}`, null, null, null, null, null, partyMemberID, null, null, null, note, 0);
    };

    client.memberLogKick = (memberID, partyMemberID, note, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "SERVERKICK", `${client.memberGetDisplayNameByID(memberID)} à été kické du serveur par ${client.memberGetDisplayNameByID(partyMemberID)}`, null, null, null, null, null, partyMemberID, null, null, null, note, 0);
    };

    client.memberLogBan = (memberID, partyMemberID, note, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "SERVERBAN", `${client.memberGetDisplayNameByID(memberID)} à été banni du serveur par ${client.memberGetDisplayNameByID(partyMemberID)}`, null, null, null, null, null, partyMemberID, null, null, null, note, 0);
    };

    client.memberLogNick = (memberID, nickOld, nickNew, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "NICK", `${nickOld} s'appelle désormais ${nickNew}`, null, null, null, null, null, null, null, nickOld, nickNew, null, 0);
    };

    client.memberLogGameJoin = (memberID, game, timestamp = null, xpGained = 20) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "GAMEJOIN", `${client.memberGetDisplayNameByID(memberID)} à rejoint le jeu ${game.name}`, game.id, null, null, null, null, null, null, null, null, null, xpGained);
    };

    client.memberLogGameQuit = (memberID, game, timestamp = null, xpGained = 10) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "GAMEQUIT", `${client.memberGetDisplayNameByID(memberID)} à quitté le jeu ${game.name}`, game.id, null, null, null, null, null, null, null, null, null, xpGained);
    };

    client.memberLogGameIdle = (memberID, game, timestamp = null, xpGained = 10) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "GAMEIDLE", `${client.memberGetDisplayNameByID(memberID)} à été retiré du groupe de ${game.name} pour inactivité`, game.id, null, null, null, null, null, null, null, null, null, xpGained);
    };

    client.memberLogMember = (memberID, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "MEMBER", `${client.memberGetDisplayNameByID(memberID)} à été accepté en tant que membre`, null, null, null, null, null, null, null, null, null, null, 0);
    };


    client.memberLog = (timestamp, memberID, type, comment, gameID, voiceChannelName, messageID, messageContent, commandID, partyMemberID, emoji, nickOld, nickNew, note, xpGained) => {
        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const userdata = client.userdataGet(memberID);

        if (timestamp === null) {
            timestamp = +new Date;
        };
        let date = moment(timestamp).format('DD.MM.YYYY');
        let time = moment(timestamp).format('HH:mm');
        let currentTypeXP = client.userdataGetCurrentXP(memberID, type);

        let maxTypeXPperDay = 1000;


        let memberLogAdd = Object.assign({}, datamodel.tables.memberLog);
        switch (type) {
            case "VOICE":
                maxTypeXPperDay = settings.maxVoiceXPPerDay;

                let memberLogVoice = client.db_memberLog.find(memberLog =>
                    memberLog.memberID === memberID &&
                    memberLog.createdDate === date &&
                    memberLog.type === "VOICE" &&
                    memberLog.voiceChannelName === voiceChannelName);

                if (memberLogVoice) {
                    memberLogAdd = memberLogVoice;
                }

                break;
            case "PLAY":
                maxTypeXPperDay = settings.maxPlayXPPerDay;
                let memberLogPlay = client.db_memberLog.find(memberLog =>
                    memberLog.memberID === memberID &&
                    memberLog.createdDate === date &&
                    memberLog.type === "PLAY" &&
                    memberLog.gameID === gameID);
                if (memberLogPlay) {
                    memberLogAdd = memberLogPlay
                }
                break;
            case "TEXT":
                maxTypeXPperDay = settings.maxTextXPPerDay;
                break;
            case "CMD":
                maxTypeXPperDay = settings.maxCmdXPPerDay;
                break;
            case "REACTIN":
                maxTypeXPperDay = settings.maxReactInXPPerDay;
                break;
            case "REACTOUT":
                maxTypeXPperDay = settings.maxReactOutXPPerDay;
                break;
            default:
                memberLogAdd = Object.assign({}, datamodel.tables.memberLog);
                break;
        }

        if (memberLogAdd.key === "") {
            memberLogAdd.key = client.db_memberLog.autonum;
        }
        memberLogAdd.createdAt = timestamp;
        memberLogAdd.createdDate = date;
        memberLogAdd.createdTime = time;
        memberLogAdd.memberID = memberID;
        memberLogAdd.type = type;
        memberLogAdd.comment = comment;
        memberLogAdd.gameID = gameID;
        memberLogAdd.voiceChannelName = voiceChannelName;
        memberLogAdd.messageID = messageID;
        memberLogAdd.messageContent = messageContent;
        memberLogAdd.commandID = commandID;
        memberLogAdd.partyMemberID = partyMemberID;
        memberLogAdd.emoji = emoji;
        memberLogAdd.nickOld = nickOld;
        memberLogAdd.nickNew = nickNew;
        memberLogAdd.note = note;

        if (currentTypeXP >= maxTypeXPperDay) {
            memberLogAdd.xpMaxReached = true;
            memberLogAdd.xpGained += 0;
        } else {
            memberLogAdd.xpMaxReached = false;
            memberLogAdd.xpGained += xpGained;
            client.userdataAddXP(memberID, xpGained);
        }

        client.db_memberLog.set(memberLogAdd.key, memberLogAdd);
    };

    client.memberGetDisplayNameByID = (memberID) => {
        const guild = client.getGuild();

        let guildMember = guild.members.cache.get(memberID);
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

    client.userdataAddXP = (memberID, amount = 1) => {
        client.log(`Méthode: exp/userdataAddXP`, "debug");
        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const userdata = client.userdataGet(memberID);
        const roleMembers = client.roleMemberGet(guild, settings);
        const member = guild.members.cache.get(memberID);

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