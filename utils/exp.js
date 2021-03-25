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
            client.log(`Analyse de l'activité pour ${member.displayName}`, "debug");
            if (member.roles.cache.has(roleMembers.id)) {
                client.log(`${member.displayName} est dans le groupe des membres`, "debug");
                let presenceGame = client.presenceGetGameName(member.presence);
                if (presenceGame) {
                    client.log(`${member.displayName}joue à ${presenceGame}`, "debug");
                    const game = client.gamesGet(presenceGame);
                    if (game) {
                        client.log(`${presenceGame} à bien été trouvé`, "debug");
                        client.usergameUpdateLastPlayed(game, member);
                        client.usergameAddXP(member, game);
                        if (member.voice.channel && member.voice.channel.name !== settings.AFKChannel && member.voice.channel.name !== settings.quietChannel) {
                            client.log(`${member.displayName} est dans un salon vocal -> gain d'XP`, "debug");
                            client.memberLogPlay(member, game, null, 1);
                        } else {
                            client.log(`${member.displayName} n'est pas en vocal -> aucun gain d'XP`, "debug");
                            client.memberLogPlay(member, game, null, 0);
                        }
                    } else {
                        client.log(`${presenceGame} non trouvé`, "debug");
                    }
                } else {
                    client.log(`${member.displayName} ne joue à aucun jeu`, "debug");
                }
                if (member.voice.channel && member.voice.channel.name !== settings.AFKChannel && member.voice.channel.name !== settings.quietChannel) {
                    client.log(`${member.displayName} est dans un salon vocal -> gain d'XP`, "debug");
                    client.memberLogVoice(member.id);
                };
            } else {
                client.log(`${member.displayName} n'est pas membre -> analyse annulée`, "debug");
            }
        });

    };

    client.memberLogVoice = (memberID, timestamp = null, xpGained = 1) => {
        const guild = client.getGuild();
        if (timestamp === null) {
            timestamp = +new Date;
        };
        let member = guild.members.cache.get(memberID);
        if (member) {
            client.memberLog(timestamp, memberID, "VOICE", `${client.memberGetDisplayNameByID(memberID)} est dans le salon ${member.voice.channel.name}`, null, member.voice.channel.name, null, null, null, null, null, xpGained);
        }
    };

    client.memberLogPlay = (member, game, timestamp = null, xpGained = 1) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };

        if (member.roles.cache.has(game.roleID)) {
            client.memberLog(timestamp, member.id, "PLAY", `${client.memberGetDisplayNameByID(member.id)} joue à ${game.name}`, game.id, null, null, null, null, null, null, xpGained);
        } else {
            client.memberLog(timestamp, member.id, "PLAY", `${client.memberGetDisplayNameByID(member.id)} joue à ${game.name} (pas dans le groupe)`, game.id, null, null, null, null, null, null, 0);
        }

    };

    client.memberLogText = (memberID, message, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };

        if (!message.content.startsWith("https://tenor.com") && !message.content.startsWith("https://media.tenor.com")) {
            if (message.content.length > 150) {
                client.memberLog(timestamp, memberID, "TEXT", `Messages de ${client.memberGetDisplayNameByID(memberID)}`, null, null, null, null, null, null, null, 100);
            } else {
                client.memberLog(timestamp, memberID, "TEXT", `Messages de ${client.memberGetDisplayNameByID(memberID)}`, null, null, null, null, null, null, null, 25);
            }
        }
    };

    client.memberLogCmd = (memberID, timestamp = null, xpGained = 5) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "CMD", `Commandes par ${client.memberGetDisplayNameByID(memberID)}`, null, null, null, null, null, null, null, 0);
    };

    client.memberLogReactIn = (memberID, partyMemberID, message, emoji, timestamp = null, xpGained = 10) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "REACTIN", `${client.memberGetDisplayNameByID(memberID)} réaction reçue avec ${emoji} par ${client.memberGetDisplayNameByID(partyMemberID)} (${xpGained})`, null, null, partyMemberID, emoji, null, null, null, xpGained);
    };

    client.memberLogReactOut = (memberID, partyMemberID, message, emoji, timestamp = null, xpGained = 5) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "REACTOUT", `${client.memberGetDisplayNameByID(memberID)} réaction avec ${emoji} pour ${client.memberGetDisplayNameByID(partyMemberID)} (${xpGained})`, null, null, partyMemberID, emoji, null, null, null, xpGained);
    };

    client.memberLogServerJoin = (memberID, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "SERVERJOIN", `${client.memberGetDisplayNameByID(memberID)} à rejoint le serveur`, null, null, null, null, null, null, null, 0);
    };

    client.memberLogServerQuit = (memberID, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "SERVERQUIT", `${client.memberGetDisplayNameByID(memberID)} à quitté le serveur`, null, null, null, null, null, null, null, 0);
    };

    client.memberLogNote = (memberID, partyMemberID, note, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "NOTE", `Note pour ${client.memberGetDisplayNameByID(memberID)} par ${client.memberGetDisplayNameByID(partyMemberID)}`, null, null, partyMemberID, null, null, null, note, 0);
    };

    client.memberLogWarn = (memberID, partyMemberID, note, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "WARN", `Avertissement pour ${client.memberGetDisplayNameByID(memberID)} par ${client.memberGetDisplayNameByID(partyMemberID)}`, null, null, partyMemberID, null, null, null, note, 0);
    };

    client.memberLogKick = (memberID, partyMemberID, note, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "SERVERKICK", `${client.memberGetDisplayNameByID(memberID)} à été kické du serveur par ${client.memberGetDisplayNameByID(partyMemberID)}`, null, null, partyMemberID, null, null, null, note, 0);
    };

    client.memberLogBan = (memberID, partyMemberID, note, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "SERVERBAN", `${client.memberGetDisplayNameByID(memberID)} à été banni du serveur par ${client.memberGetDisplayNameByID(partyMemberID)}`, null, null, partyMemberID, null, null, null, note, 0);
    };

    client.memberLogNick = (memberID, nickOld, nickNew, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "NICK", `${nickOld} s'appelle désormais ${nickNew}`, null, null, null, null, nickOld, nickNew, null, 0);
    };

    client.memberLogGameJoin = (memberID, game, timestamp = null, xpGained = 0) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "GAMEJOIN", `${client.memberGetDisplayNameByID(memberID)} à rejoint le jeu ${game.name}`, game.id, null, null, null, null, null, null, xpGained);
    };

    client.memberLogGameQuit = (memberID, game, timestamp = null, xpGained = 0) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "GAMEQUIT", `${client.memberGetDisplayNameByID(memberID)} à quitté le jeu ${game.name}`, game.id, null, null, null, null, null, null, xpGained);
    };

    client.memberLogGameIdle = (memberID, game, timestamp = null, xpGained = 0) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "GAMEIDLE", `${client.memberGetDisplayNameByID(memberID)} à été retiré du groupe de ${game.name} pour inactivité`, game.id, null, null, null, null, null, null, xpGained);
    };

    client.memberLogMember = (memberID, timestamp = null) => {
        if (timestamp === null) {
            timestamp = +new Date;
        };
        client.memberLog(timestamp, memberID, "MEMBER", `${client.memberGetDisplayNameByID(memberID)} à été accepté en tant que membre`, null, null, null, null, null, null, null, 0);
    };

    client.memberLog = (timestamp, memberID, type, comment, gameID, voiceChannelName, partyMemberID, emoji, nickOld, nickNew, note, xpGained) => {
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
                    memberLogAdd = memberLogPlay;
                }
                break;
            case "TEXT":
                maxTypeXPperDay = settings.maxTextXPPerDay;
                let memberLogText = client.db_memberLog.find(memberLog =>
                    memberLog.memberID === memberID &&
                    memberLog.createdDate === date &&
                    memberLog.type === "TEXT");
                if (memberLogText) {
                    memberLogAdd = memberLogText;
                }
                break;
            case "CMD":
                maxTypeXPperDay = settings.maxCmdXPPerDay;
                let memberLogCmd = client.db_memberLog.find(memberLog =>
                    memberLog.memberID === memberID &&
                    memberLog.createdDate === date &&
                    memberLog.type === "CMD");
                if (memberLogCmd) {
                    memberLogAdd = memberLogCmd;
                }
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
        memberLogAdd.partyMemberID = partyMemberID;
        memberLogAdd.emoji = emoji;
        memberLogAdd.nickOld = nickOld;
        memberLogAdd.nickNew = nickNew;
        memberLogAdd.note = note;

        memberLogAdd.xpNoLimit += xpGained;
        memberLogAdd.hits += 1;

        if (currentTypeXP >= maxTypeXPperDay) {
            memberLogAdd.xpMaxReached = true;
            memberLogAdd.xpGained += 0;
        } else {
            memberLogAdd.xpMaxReached = false;
            memberLogAdd.xpGained += xpGained;
            if (xpGained > 0) {
                client.userdataAddXP(memberID, xpGained);
            }
        }

        client.db_memberLog.set(memberLogAdd.key, memberLogAdd);
    };

    client.userdataAddXP = (memberID, amount = 1) => {
        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const userdata = client.userdataGet(memberID);
        const roleMembers = client.roleMemberGet(guild, settings);
        const member = guild.members.cache.get(memberID);

        if (member) {
            if (member.roles.cache.has(roleMembers.id)) {
                userdata.xp += amount;
                let newLevel = client.xpGetLevel(userdata.xp);
                if (newLevel > userdata.level) {
                    userdata.level = newLevel;
                    client.userLevelUp(member, newLevel);
                };
                client.userdataSet(userdata);
                client.log(`XP pour ${member.displayName}: ${amount}`, "debug");
            }
        }
    };

    client.usergameAddXP = (member, game, amount = 1) => {
        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const usergame = client.usergameGet(member, game);

        usergame.xp += amount;
        let newLevel = client.xpGetLevel(usergame.xp);
        if (newLevel > usergame.level) {
            usergame.level = newLevel;
            client.log(`Jeu ${game.name}: Niveau supérieur pour ${member.displayName} qui est désormais level ${newLevel}`)
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
                memberLog.createdDate === createdDate &&
                memberLog.type === type);

        let XP = 0;
        for (const memberLog of memberLogs) {
            XP += memberLog.xpGained;
        }

        return XP;
    };

    client.xpGetLevel = (xp, coef = 0) => {
        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        let c = 0;
        if (coef === 0) {
            c = settings.xpToLevelCoef;
        } else {
            c = coef;
        }
        // L = (25 + sqrt(25 * 25 - 4 * 25 * (-X) ))/ (2 * 25)
        let level = Math.floor(Math.floor(c + Math.sqrt(c * c - 4 * c * (-xp))) / (c * 2));
        return level;
    };
    client.levelGetXP = (level, coef = 0) => {
        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        let c = 0;
        if (coef === 0) {
            c = settings.xpToLevelCoef;
        } else {
            c = coef;
        }
        // L = (25 + sqrt(25 * 25 - 4 * 25 * (-X) ))/ (2 * 25)
        let xp = Math.floor((c * (level * level)) - (c * level));
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

    client.memberGetKarma = (memberID) => {
        let karma = 0;
        let score = 0;
        let now = +new Date;
        let fromTimestamp = +new Date(moment(now).subtract(1, 'days').startOf('day'));
        let toTimestamp = +new Date(moment(now).subtract(1, 'days').endOf('day'));

        let memberLogs = client.db_memberLog.filterArray(memberLog =>
            memberLog.memberID === memberID &&
            memberLog.createdAt > fromTimestamp &&
            memberLog.createdAt < toTimestamp);

        if (memberLogs) {
            for (const memberLog of memberLogs) {
                score += memberLog.xpGained;
            }
        }

        if (score > 0) {
            karma = 1;
        } else {
            karma = -1;
        }
        return karma;
    };

    client.setKarma = () => {
        const guild = client.getGuild();
        guild.members.cache.forEach(member => {
            client.log(`Karma pour ${member.displayName}`, "debug");
            let userdata = client.userdataGet(member.id);
            if (userdata) {
                let karma = client.memberGetKarma(member.id);
                userdata.karma += karma;
                if (userdata.karma < 0) {
                    userdata.karma = 0;
                }
                if (userdata.karma > 100) {
                    userdata.karma = 100;
                }
                client.userdataSet(userdata);
                client.log(`Karma: ${karma} -> ${userdata.karma}`, "debug");
            }
        });
        return true;
    };

}