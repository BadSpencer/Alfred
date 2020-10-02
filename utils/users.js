const Discord = require("discord.js");
const colors = require('./colors');
const constants = require('./constants');
const moment = require("moment");
const datamodel = require('./datamodel');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('./messages');

module.exports = (client) => {
    // Message d'annonce lorsque quelqu'un rejoint le serveur
    client.serverJoinNotification = async (member) => {
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        if (settings.welcomeEnabled === false) return client.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"), "warn");

        let welcomeChannel = guild.channels.cache.find(c => c.name === settings.welcomeChannel);


        let avatar;
        if (!member.user.avatarURL()) {
            avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
        } else {
            avatar = member.user.avatarURL();
        }

        if (welcomeChannel) {
            const welcomeMessage = new Discord.MessageEmbed()
                .setTimestamp()
                .setColor(colors['darkgreen'])
                .setDescription(client.textes.get("MESSAGES_SERVER_JOIN", member))
                .setFooter(client.textes.get("LOG_EVENT_USER_JOIN_SERVER", member), avatar);
            welcomeChannel.send(welcomeMessage);
        };
    };
    // Message d'acceuil du nouvel utilisateur (lien vers site)
    client.serverJoinInformation = async (member) => {
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        if (settings.welcomeEnabled === false) return client.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"));

        let welcomeChannel = guild.channels.cache.find(c => c.name === settings.welcomeChannel);

        if (welcomeChannel) {
            const welcomeMessage = new Discord.MessageEmbed()
                .setTitle(client.textes.get("USER_MESSAGE_ACCUEIL_TITRE"))
                .setURL("https://www.casual-effect.org/")
                .setColor(colors['darkorange'])
                .setThumbnail(client.user.avatarURL())
                .setDescription(client.textes.get("USER_MESSAGE_ACCUEIL_DESCRIPTION", member));
            welcomeChannel.send(welcomeMessage);
        };
    };
    client.serverJoinInformationAgain = async (member) => {
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        if (settings.welcomeEnabled === false) return client.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"));

        let welcomeChannel = guild.channels.cache.find(c => c.name === settings.welcomeChannel);

        if (welcomeChannel) {
            const welcomeMessage = new Discord.MessageEmbed()
                .setTitle(client.textes.get("USER_MESSAGE_ACCUEIL_TITRE"))
                .setURL("https://www.casual-effect.org/")
                .setColor(colors['darkorange'])
                .setThumbnail(client.user.avatarURL())
                .setDescription(client.textes.get("USER_MESSAGE_ACCUEIL_DESCRIPTION_AGAIN", member));
            welcomeChannel.send(welcomeMessage);
        };
    };
    // Message d'annonce lorsque quelqu'un quitte le serveur
    client.serverQuitNotification = async (member) => {
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        let welcomeChannel = guild.channels.cache.find(c => c.name === settings.welcomeChannel);

        let avatar;
        if (!member.user.avatarURL()) {
            avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
        } else {
            avatar = member.user.avatarURL();
        }

        if (welcomeChannel) {

            const welcomeMessage = new Discord.MessageEmbed()
                .setTimestamp()
                .setColor(colors['yellow'])
                .setDescription(client.textes.get("MESSAGES_SERVER_QUIT", member))
                .setFooter(client.textes.get("LOG_EVENT_USER_QUIT_SERVER", member), avatar);
            welcomeChannel.send(welcomeMessage);
        };



    };
    client.serverKickNotification = async (member, memberBy, raison) => {
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        let welcomeChannel = guild.channels.cache.find(c => c.name === settings.welcomeChannel);

        let avatar;
        if (!member.user.avatarURL()) {
            avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
        } else {
            avatar = member.user.avatarURL();
        }

        if (welcomeChannel) {

            const welcomeMessage = new Discord.MessageEmbed()
                .setTimestamp()
                .setColor(colors['yellow'])
                .setDescription(client.textes.get("MESSAGES_SERVER_KICK", member, memberBy, raison))
                .setFooter(client.textes.get("LOG_EVENT_USER_KICK_SERVER", member), avatar);
            welcomeChannel.send(welcomeMessage);
        } else {
            client.log("Salon acceuil non trouvé", "error");
        }
    };
    client.serverBanNotification = async (member, memberBy, raison) => {
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        let welcomeChannel = guild.channels.cache.find(c => c.name === settings.welcomeChannel);

        let avatar;
        if (!member.user.avatarURL()) {
            avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
        } else {
            avatar = member.user.avatarURL();
        }

        if (welcomeChannel) {

            const banMessage = new Discord.MessageEmbed()
                .setTimestamp()
                .setColor(colors['yellow'])
                .setDescription(client.textes.get("MESSAGES_SERVER_BAN", member, memberBy, raison))
                .setFooter(client.textes.get("LOG_EVENT_USER_BAN_SERVER", member), avatar);
            welcomeChannel.send(banMessage);
        };
    };
    client.userdataGetAll = (toArray = false) => {
        if (toArray === false) {
            return client.db_userdata.fetchEverything();
        } else {
            return client.db_userdata.array();
        };
    };

    client.userdataGet = (memberID) => {
        return userdata = client.db_userdata.get(memberID);
    };

    client.userdataSet = (userdata) => {
        client.db_userdata.set(userdata.id, userdata);
    };

    client.userdataUserboard = async (message) => {
        const guild = client.guilds.cache.get(client.config.guildID);

        let userdatas = client.userdataGetAll(true);

        let usersTopXP = usersTopIn = usersTopOut = userdatas;

        let userstop5Desc = "";
        let userstopInDesc = "";
        let userstopOutDesc = "";
        let usersLastEvents = "";
        usersTopXP.sort(function (a, b) {
            return a.xp - b.xp;
        });
        usersTopXP.reverse();
        usersTopXP = usersTopXP.slice(0, 5);
        for (const user of usersTopXP) {
            let member = await guild.members.cache.get(user.id);
            if (member) {
                userstop5Desc += `**${user.displayName}**: ${user.level} (${user.xp})\n`;
            } else {
                userstop5Desc += `${user.displayName}: ${user.level} (${user.xp})\n`;
            }
        }


        usersTopIn.sort(function (a, b) {
            return a.joinedAt - b.joinedAt;
        });
        usersTopIn.reverse();
        usersTopIn = usersTopIn.slice(0, 5);
        for (const userIn of usersTopIn) {
            let member = await guild.members.cache.get(userIn.id);
            if (member) {
                userstopInDesc += `**${userIn.displayName}**\n`;
            } else {
                userstopInDesc += `${userIn.displayName}\n`;
            }
        };

        let usersTopOutLogs = [];
        for (const key in usersTopOut) {
            let member = await guild.members.cache.get(usersTopOut[key].id);

            if (!member) {
                let logEntriesQuit = usersTopOut[key].logs.filter(record =>
                    record.event == "BAN" ||
                    record.event == "KICK" ||
                    record.event == "QUIT");

                if (logEntriesQuit.length > 0) {
                    logEntriesQuit.sort(function (a, b) {
                        return a.createdAt + b.createdAt;
                    });
                    usersTopOutLogs.push({
                        "id": usersTopOut[key].id,
                        "createdAt": logEntriesQuit[0].createdAt,
                        "event": logEntriesQuit[0].event,
                        "displayName": usersTopOut[key].displayName
                    })
                }
            }
        }

        if (usersTopOutLogs.length > 0) {
            usersTopOutLogs.sort(function (a, b) {
                return a.createdAt - b.createdAt;
            });
            usersTopOutLogs.reverse();
            usersTopOutLogs = usersTopOutLogs.slice(0, 5);
            for (const keyUuserOut in usersTopOutLogs) {
                userstopOutDesc += `${client.logEventToEmoji(usersTopOutLogs[keyUuserOut].event)} ${usersTopOutLogs[keyUuserOut].displayName}\n`;
            };
        } else {
            userstopOutDesc = "Aucun";
        }


        let logEntriesLast = [];
        for (const user of userdatas) {
            for (const log of user.logs) {
                logEntriesLast.push({
                    "id": user.id,
                    "createdAt": log.createdAt,
                    "event": log.event,
                    "displayName": user.displayName,
                    "commentaire": log.commentaire
                })
            }
        }
        logEntriesLast.sort(function (a, b) {
            return a.createdAt - b.createdAt;
        });
        logEntriesLast.reverse();
        logEntriesLast = logEntriesLast.slice(0, 10);
        let dateNow = +new Date;
        for (const logEntry of logEntriesLast) {
            usersLastEvents += `${client.logEventToEmoji(logEntry.event)} ${logEntry.displayName} ${client.logEventToText(logEntry.event)} **${client.msToDaysText(dateNow - logEntry.createdAt)}**\n`;
        }



        let embed = new Discord.MessageEmbed();
        embed.setTitle(client.textes.get("USERDATA_USERBOARD_TITLE"));

        embed.addField("Derniers évènements", usersLastEvents, false);

        embed.addField("Arrivées", userstopInDesc, true);
        embed.addField("Départs", userstopOutDesc, true);

        embed.addField("Top 5: level/xp", userstop5Desc, false);


        message.channel.send(embed);
    };

    client.userdataCheck = () => {
        client.log(`Vérification de la base des membres`, "debug");
        const guild = client.guilds.cache.get(client.config.guildID);

        client.db_userdata.delete("default");

        client.log(`Membres Discord: ${guild.members.cache.size} BD: ${client.db_userdata.count}`, "debug");
        guild.members.cache.forEach(async member => {
            if (member.user.bot) return; // Ne pas enregistrer les bots
            let userdata = client.db_userdata.get(member.id);

            if (!userdata) {
                userdata = client.userdataCreate(member);
            } else {
                if (userdata.displayName !== member.displayName) {
                    client.memberLogNick(member.id, userdata.displayName, member.displayName);
                    client.modLog(client.textes.get("MOD_NOTIF_MEMBER_NICK_CHANGE", userdata.displayName, member.displayName));
                    userdata.displayName = member.displayName;
                    userdata.username = member.username;
                    client.db_userdata.set(member.id, userdata);
                };
            }
        });

        let memberLog = client.db_memberLog.array();

        if (memberLog.length === 0) {
            let userdatas = client.userdataGetAll(true);
            const regex = /"(.*?)"/m;

            for (const userdata of userdatas) {
                for (const log of userdata.logs) {
                    switch (log.event) {
                        case "JOIN":
                            client.memberLogServerJoin(userdata.id, log.createdAt);
                            break;
                        case "QUIT":
                            client.memberLogServerQuit(userdata.id, log.createdAt);
                            break;
                        case "MEMBER":
                            client.memberLogMember(userdata.id, log.createdAt);
                            break;
                        case "NOTE":
                            client.memberLogNote(userdata.id, log.createdBy, log.commentaire, log.createdAt);
                            break;
                        case "KICK":
                            client.memberLogKick(userdata.id, log.createdBy, log.commentaire, log.createdAt);
                            break;
                        case "NICK":
                            let nickSplit = log.commentaire.split(" -> ");
                            let nickOld = nickSplit[0];
                            let nickNew = nickSplit[1];
                            client.memberLogNick(userdata.id, nickOld, nickNew, log.createdAt)
                            break;
                        case "GAMEJOIN":
                            let gamejoinPhrase = regex.exec(log.commentaire);
                            let gamejoin = client.gamesGet(gamejoinPhrase[0]);
                            if (gamejoin) {
                                client.memberLogGameJoin(userdata.id, gamejoin, log.createdAt);
                            }
                            break;
                        case "GAMEQUIT":
                            if (log.commentaire.includes("Inactivité")) {
                                let gamequitPhrase = regex.exec(log.commentaire);
                                let gamequit = client.gamesGet(gamequitPhrase[0]);
                                if (gamequit) {
                                    client.memberLogGameIdle(userdata.id, gamequit, log.createdAt);
                                }
                            } else {
                                let gamequitPhrase = regex.exec(log.commentaire);
                                let gamequit = client.gamesGet(gamequitPhrase[0]);
                                if (gamequit) {
                                    client.memberLogGameQuit(userdata.id, gamequit, log.createdAt);
                                }
                            }
                            break;
                    }
                }

            }
        }













    };

    client.userdataCreate = async (member) => {
        let userdata = Object.assign({}, datamodel.tables.userdata);

        userdata.id = member.id;
        userdata.username = member.user.username;
        userdata.nickname = member.nickname;
        userdata.displayName = member.displayName;
        userdata.createdAt = member.user.createdTimestamp;
        userdata.createdDate = moment(member.user.createdTimestamp).format('DD.MM.YYYY');
        userdata.createdTime = moment(member.user.createdTimestamp).format('HH:mm');
        userdata.joinedAt = member.joinedTimestamp;
        userdata.joinedDate = moment(member.joinedTimestamp).format('DD.MM.YYYY');
        userdata.joinedTime = moment(member.joinedTimestamp).format('HH:mm');
        userdata.level = 0;
        userdata.xp = 0;

        client.db_userdata.set(member.id, userdata);
        client.log(`L'utilisateur ${member.user.username} à été ajouté à la base de données`);

    };

    client.userdataClearLogs = async (memberID) => {
        let userdata = client.db_userdata.get(memberID);
        if (userdata) {
            if (userdata.logs) {
                userdata.logs = [];
                client.db_userdata.set(memberID, userdata);
                client.log(`Logs membre effacés pour ${userdata.name}`, "debug");
            }
        }

    };

    client.userdataShowInfos = async (userdata, channel) => {
        const guild = client.guilds.cache.get(client.config.guildID);
        let member = guild.members.cache.get(userdata.id);

        let usersLastEvents = "";

        if (!userdata) return;

        if (channel) {


            let logEntriesLast = [];

            for (const log of userdata.logs) {
                logEntriesLast.push({
                    "id": userdata.id,
                    "createdAt": log.createdAt,
                    "event": log.event,
                    "displayName": userdata.displayName,
                    "commentaire": log.commentaire
                })
            }

            logEntriesLast.sort(function (a, b) {
                return a.createdAt - b.createdAt;
            });
            logEntriesLast.reverse();

            let dateNow = +new Date;
            for (const logEntry of logEntriesLast) {
                let eventText = client.logEventToText(logEntry.event);

                switch (logEntry.event) {
                    case "JOIN":
                        break;
                    case "QUIT":
                        break;
                    case "KICK":

                        break;
                    case "BAN":

                        break;
                    case "MEMBER":

                        break;
                    case "NOTE":

                        break;
                    case "NICK":
                        // let nicks = logEntry.commentaire.split(" -> ");
                        eventText = `${client.logEventToEmoji(logEntry.event)} ${logEntry.commentaire}`;
                        break;
                    case "GAMEJOIN":
                        eventText = `${client.logEventToEmoji(logEntry.event)} ${logEntry.commentaire}`;
                        break;
                    case "GAMEQUIT":
                        eventText = `${client.logEventToEmoji(logEntry.event)} ${logEntry.commentaire}`;
                        break;
                }
                usersLastEvents += `${moment(logEntry.createdAt).format('DD.MM.YY')}: ${eventText}\n`;
            }

            const userInfosMessage = new Discord.MessageEmbed();
            userInfosMessage.setTitle(`${userdata.displayName}`);
            userInfosMessage.setColor(colors['darkorange']);
            userInfosMessage.addField("Derniers évènements", usersLastEvents, false);
            // userInfosMessage.setThumbnail();
            // userInfosMessage.setDescription();
            channel.send(userInfosMessage);
        };
    };
};