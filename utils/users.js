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
    client.serverQuitNotification = async (user) => {
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        let welcomeChannel = guild.channels.cache.find(c => c.name === settings.welcomeChannel);

        let avatar;
        if (!user.avatarURL()) {
            avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
        } else {
            avatar = user.avatarURL();
        }

        if (welcomeChannel) {

            const welcomeMessage = new Discord.MessageEmbed()
                .setTimestamp()
                .setColor(colors['yellow'])
                .setDescription(client.textes.get("MESSAGES_SERVER_QUIT", user))
                .setThumbnail('https://cdn.discordapp.com/attachments/713393174449619004/820327631647014982/1F64B-1F3FB_color.png')
                .setFooter(client.textes.get("LOG_EVENT_USER_QUIT_SERVER", user), avatar);
            welcomeChannel.send(welcomeMessage);
        };



    };
    client.serverKickNotification = async (user, userBy, raison) => {
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        let welcomeChannel = guild.channels.cache.find(c => c.name === settings.welcomeChannel);

        let avatar;
        if (!user.avatarURL()) {
            avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
        } else {
            avatar = user.avatarURL();
        }

        if (welcomeChannel) {

            const welcomeMessage = new Discord.MessageEmbed()
                .setTimestamp()
                .setColor(colors['darkred'])
                .setDescription(client.textes.get("MESSAGES_SERVER_KICK", user, userBy, raison))
                .setThumbnail('https://cdn.discordapp.com/attachments/713393174449619004/820326574707834880/274C_color.png')
                .setFooter(client.textes.get("LOG_EVENT_USER_KICK_SERVER", user), avatar);
            welcomeChannel.send(welcomeMessage);
        } else {
            client.log("Salon acceuil non trouvé", "error");
        }
    };
    client.serverBanNotification = async (user, userBy, raison) => {
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        let welcomeChannel = guild.channels.cache.find(c => c.name === settings.welcomeChannel);

        let avatar;
        if (!user.avatarURL()) {
            avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
        } else {
            avatar = user.avatarURL();
        }

        if (welcomeChannel) {

            const banMessage = new Discord.MessageEmbed()
                .setTimestamp()
                .setColor(colors['red'])
                .setDescription(client.textes.get("MESSAGES_SERVER_BAN", user, userBy, raison))
                .setThumbnail('https://cdn.discordapp.com/attachments/713393174449619004/820325906391498802/26D4_color.png')
                .setFooter(client.textes.get("LOG_EVENT_USER_BAN_SERVER", user), avatar);
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

    client.userdataSearch = (phrase, toArray = false) => {
        if (toArray === false) {
            return client.db_userdata.filter((rec) =>
                rec.displayName.includes(searchString));
        } else {
            return client.db_userdata.filterArray((rec) =>
                rec.displayName.includes(searchString));
        }
    };

    client.userdataUserboard = async (message) => {
        const guild = client.guilds.cache.get(client.config.guildID);

        let userdatas = client.userdataGetAll(true);

        let membersTopScores = client.membersGetTopScores();
        membersTopScores = membersTopScores.slice(0, 5);
        let listeScores = "";
        for ( memberTopScore of membersTopScores) {
            listeScores += `${client.memberGetDisplayNameByID(memberTopScore.memberID)}: ${memberTopScore.score}\n`;
        }
        if (listeScores == "") {
            listeScores = 'Aucun score';
        }

        let embed = new Discord.MessageEmbed();
        embed.setTitle(client.textes.get("USERDATA_USERBOARD_TITLE"));
        embed.addField("Top Scores", listeScores, false);

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
        userdata.karma = 100;

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

    client.userdataShowInfos = async (userdata, channel, showModInfos = false) => {
        const guild = client.guilds.cache.get(client.config.guildID);
        const member = guild.members.cache.get(userdata.id);



        if (!userdata) return;

        if (channel) {
            let memberGames = client.gamesGetForMember(userdata.id);
            let listeJeux = '';
            for (game of memberGames) {
                let usergameKey = `${userdata.id}-${game.id}`;
                let usergame = client.db_usergame.get(usergameKey);
                if (usergame) {
                    listeJeux += `${game.name} (${usergame.level})\n`;
                } else {
                    listeJeux += `${game.name}\n`;
                }
            }

            if (listeJeux == '') {
                listeJeux = 'Aucun jeu';
            }

            const userInfosMessage = new Discord.MessageEmbed();
            let dateNow = +new Date;

            userInfosMessage.setAuthor(userdata.displayName, member.user.avatarURL())
            userInfosMessage.setColor(colors['darkorange'])
            
            userInfosMessage.setThumbnail(`${constants.images.lvlth[userdata.level]}`)
            userInfosMessage.addField(`📅 Inscription`, `Le ${userdata.joinedDate}\n${moment.duration(userdata.joinedAt - dateNow).locale("fr").humanize(true)}`, true);
            userInfosMessage.addField(`🎮 Jeux`, `${listeJeux}`, true);
            userInfosMessage.addField(`📊 Points`, `XP: ${userdata.xp}\nKarma: ${userdata.karma}`, true);
            if (showModInfos) {
                let notesCount = await client.memberNotesCount(userdata.id);
                userInfosMessage.addField(`🟪 Modération`, `Notes: ${notesCount}\nAvert.: ${userdata.warn}`, true);
                userInfosMessage.setTitle(`ID: ${userdata.id}`)
            }
            // userInfosMessage.setDescription(`Description`)
            channel.send(userInfosMessage);
        };
    };
};