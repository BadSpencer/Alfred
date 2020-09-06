const Discord = require("discord.js");
const moment = require("moment");
const colors = require("./colors");
const constants = require("./constants");
const datamodel = require("./datamodel");
const textes = new(require("./textes.js"));
const ftpClient = require("ftp");

module.exports = (client) => {

    client.getGuild = () => {
        let guild = client.guilds.cache.get(client.config.guildID);
        if (!guild) {
            return client.log(`Serveur discord "${client.config.guildID}" non trouvé. Vérifiez la configuration d\'Alfred`, "error");
        } else {
            return guild;
        }
    };

    client.getSettings = (guild = null) => {
        if (!guild) {
            guild = client.guilds.cache.get(client.config.guildID);
        }
        let settings = client.db_settings.get(guild.id);
        if (!settings) {
            return client.log(`Configuration du Serveur discord "${client.config.guildID}" non trouvée.`, "error");
        } else {
            return settings;
        }

    };

    client.settingsCheck = () => {
        client.log(`Méthode: core/settingsCheck`, "debug");
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        if (!settings) {
            guild.owner.send(`La configuration du serveur ${guild.name} (${guild.id}) n\'a pas été faite. Veuillez lancer la commande !settings`);
            client.log(`Configuration non trouvée pour serveur ${guild.name} (${guild.id}). La configuration par défaut à été appliquée.`);

            settings = Object.assign({}, datamodel.tables.settings);
            settings.id = guild.id;
            settings.guildName = guild.name;
            client.db_settings.set(guild.id, settings);
        } else {
            client.log(`Configuration serveur ${guild.name} (${guild.id}) chargée`);
        }

        client.log(`settingsCheck: Rôles`, "debug");

        const roleMembers = client.roleMemberGet(guild, settings);
        if (!roleMembers) {
            client.log(`settingsCheck: Rôle "Membres" non trouvé`, "error");
        } else {
            client.log(`settingsCheck: Rôle "Membres" OK`, "debug");
        };

        const roleMod = client.roleModGet(guild, settings);
        if (!roleMod) {
            client.log(`settingsCheck: Rôle "Modérateurs" non trouvé`, "error");
        } else {
            client.log(`settingsCheck: Rôle "Modérateurs" OK`, "debug");
        };

        const roleAdmin = client.roleAdminGet(guild, settings);
        if (!roleAdmin) {
            client.log(`settingsCheck: Rôle "Admins" non trouvé`, "error");
        } else {
            client.log(`settingsCheck: Rôle "Admins" OK`, "debug");
        };


    };

    client.roleMemberGet = (guild = null, settings = null) => {
        if (!guild) {
            guild = client.guilds.cache.get(client.config.guildID);
        }
        if (!settings) {
            client.getSettings(guild)
        }
        return guild.roles.cache.find(r => r.name == settings.memberRole);
    };

    client.roleModGet = (guild = null, settings = null) => {
        if (!guild) {
            guild = client.guilds.cache.get(client.config.guildID);
        }
        if (!settings) {
            client.getSettings(guild)
        }
        return guild.roles.cache.find(r => r.name == settings.modRole);
    };

    client.roleAdminGet = (guild = null, settings = null) => {
        if (!guild) {
            guild = client.guilds.cache.get(client.config.guildID);
        }
        if (!settings) {
            client.getSettings(guild)
        }
        return guild.roles.cache.find(r => r.name == settings.adminRole);
    };

    client.textesCheck = () => {
        let astuces = client.textes.getAstuces(client);
        astuces.forEach(astuce => {
            let currAst = client.db_astuces.find(ast => ast.texte == astuce);
            if (!currAst) {
                let newAstuce = Object.assign({}, datamodel.tables.astuce);
                newAstuce.id = client.db_astuces.autonum;
                newAstuce.texte = astuce;
                newAstuce.count = 0;
                client.db_astuces.set(newAstuce.id, newAstuce);
            }
        });

        let citations = client.textes.getCitations(client);
        citations.forEach(citation => {
            let currCit = client.db_citations.find(ast => ast.texte == citation);
            if (!currCit) {
                let newCitation = Object.assign({}, datamodel.tables.citation);
                newCitation.id = client.db_citations.autonum;
                newCitation.texte = citation;
                newCitation.count = 0;
                client.db_citations.set(newCitation.id, newCitation);
            }
        });
    };

    client.createVoiceChannel = async (name = "") => {
        client.log(`Méthode: createVoiceChannel`, "debug");
        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const roleEveryone = guild.roles.cache.find(r => r.name == "@everyone");
        const roleMembers = guild.roles.cache.find(r => r.name == settings.memberRole);
        const voiceChannelsCategory = guild.channels.cache.find(c => c.name === settings.voiceChansCategory);

        let channelName = "";
        if (!name) {
            channelName = settings.freeVoiceChan;
        } else {
            channelName = name;
        }

        await guild.channels.create(channelName, {
            type: 'voice'
        }).then(freeVoiceChannel => {
            freeVoiceChannel.createOverwrite(roleEveryone, {
                'CONNECT': false,
            });
            freeVoiceChannel.createOverwrite(roleMembers, {
                'CONNECT': true,
            });
            freeVoiceChannel.setParent(voiceChannelsCategory);
        });

    };

    client.renameFreeVoiceChannel = async (member) => {
        client.log(`Méthode: renameFreeVoiceChannel`, "debug");
        let channelName = client.textes.get("VOICE_NEW_VOICE_CHANNEL");

        let presenceGame = await client.presenceGetGameName(member.presence);
        if (presenceGame) {
            let game = client.gamesGet(presenceGame);
            if (game) {
                channelName = `🔊 ${game.name}`
            }
        }
        await member.voice.channel.setName(channelName);
        await member.voice.channel.createOverwrite(member, {
            'MANAGE_CHANNELS': true,
        });
    };

    client.presenceGetGameName = (presence) => {
        if (!presence.activities) return null;
        if (presence.activities.length == 0) return null;

        let presencePlaying = presence.activities.find(rec => rec.type == "PLAYING");
        if (presencePlaying) {
            return presencePlaying.name;
        } else {
            return null;
        }
    };

    client.contactVoiceChannelJoin = async (member) => {
        client.log(`Méthode: contactVoiceChannelJoin`, "debug");
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        const roleEve = guild.roles.cache.find(r => r.name == "@everyone");
        const roleMem = guild.roles.cache.find(r => r.name == settings.memberRole);
        const roleMod = guild.roles.cache.find(r => r.name == settings.modRole);
        const roleAdm = guild.roles.cache.find(r => r.name == settings.adminRole);

        const voiceChannelsCategory = guild.channels.cache.find(c => c.name === settings.voiceChansCategory);
        const accueilCategory = guild.channels.cache.find(c => c.name === settings.accueilCategory);

        switch (channel.name) {
            case settings.contactChannelFree:
                if (member.roles.cache.has(roleMod.id) || member.roles.cache.has(roleAdm.id)) {

                } else {
                    channel.setParent(voiceChannelsCategory);
                    channel.setName(settings.contactChannelInprogress);
                    channel.createOverwrite(roleEve, {
                        'VIEW_CHANNEL': true,
                        'CONNECT': false,
                    });
                    channel.createOverwrite(roleMem, {
                        'VIEW_CHANNEL': true,
                        'CONNECT': false,
                    });
                    channel.createOverwrite(roleMod, {
                        'VIEW_CHANNEL': true,
                        'CONNECT': true,
                    });
                    client.modLog(client.textes.get("MOD_NOTIF_USER_JOIN_CONTACT", member));
                }
                break;
            case settings.contactChannelWaiting:
                if (member.roles.cache.has(roleMod.id) || member.roles.cache.has(roleAdm.id)) {
                    channel.setName(settings.contactChannelInprogress);
                } else {

                }
                break;
            case settings.contactChannelInprogress:

                break;
        }





    };
    client.contactVoiceChannelQuit = async (channel) => {
        client.log(`Méthode: contactVoiceChannelQuit`, "debug");
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        const roleEve = guild.roles.cache.find(r => r.name == "@everyone");
        const roleMem = guild.roles.cache.find(r => r.name == settings.memberRole);
        const roleMod = guild.roles.cache.find(r => r.name == settings.modRole);
        const roleAdm = guild.roles.cache.find(r => r.name == settings.adminRole);

        const voiceChannelsCategory = guild.channels.cache.find(c => c.name === settings.voiceChansCategory);
        const accueilCategory = guild.channels.cache.find(c => c.name === settings.accueilCategory);

        switch (channel.name) {
            case settings.contactChannelFree:
                channel.setParent(accueilCategory);
                channel.setName(settings.contactChannelFree);
                channel.createOverwrite(roleEve, {
                    'VIEW_CHANNEL': true,
                    'CONNECT': true,
                });
                break;
            case settings.contactChannelWaiting:
                channel.setParent(accueilCategory);
                channel.setName(settings.contactChannelFree);
                channel.createOverwrite(roleEve, {
                    'VIEW_CHANNEL': true,
                    'CONNECT': true,
                });
                break;
            case settings.contactChannelInprogress:
                channel.setParent(accueilCategory);
                channel.setName(settings.contactChannelFree);
                channel.createOverwrite(roleEve, {
                    'VIEW_CHANNEL': true,
                    'CONNECT': true,
                });
                break;
        }
    };
    client.gameVoiceChannelJoin = async (game, channel) => {
        client.log(`Méthode: gameVoiceChannelJoin`, "debug");
        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const roleMembers = guild.roles.cache.find(r => r.name == settings.memberRole);
        const voiceChannelsCategory = guild.channels.cache.find(c => c.name === settings.voiceChansCategory);

        try {
            await channel.setParent(voiceChannelsCategory);
            await channel.setName(`🔊${game.name}`);
            await channel.createOverwrite(roleMembers, {
                'VIEW_CHANNEL': true,
                'CONNECT': true,
            });
        } catch (error) {
            client.log(error, "error");
        };

    };
    client.gameVoiceChannelQuit = async (game, channel) => {
        client.log(`Méthode: gameVoiceChannelQuit`, "debug");
        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const roleMembers = guild.roles.cache.find(r => r.name == settings.memberRole);
        const gameCategory = guild.channels.cache.get(game.categoryID);

        try {
            await channel.setParent(gameCategory);
            await channel.setName(`🔈${game.name}`);
            await channel.createOverwrite(roleMembers, {
                'VIEW_CHANNEL': false,
                'CONNECT': false,
            });
        } catch (error) {
            client.log(error, "error");
        };


    };
    client.messageOfTheDay = async () => {
        client.log(`Méthode: messageOfTheDay`, "debug");
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        let embed = new Discord.MessageEmbed();
        let description = "";

        let generalChannel = guild.channels.cache.find(c => c.name === settings.welcomeMemberChannel);

        let messages = await generalChannel.messages.fetch({
            limit: 100
        }).then(messages => {
            messages = messages.array();
            messages = messages.filter((m) => m.author.bot === true);
            messages = messages.filter((m) => m.content === "");
            messages = messages.filter((m) => m.embeds[0].title === "Bonne journée à tous sur Casual Effect");


            generalChannel.bulkDelete(messages, true);
            client.log(`Suppression de ${messages.length} messages `, "debug");
        });




        let astuces = client.db_astuces.array();
        astuces.sort(function (a, b) {
            return a.count - b.count;
        });
        let astuce = client.db_astuces.get(astuces[0].id);
        astuce.count += 1;
        client.db_astuces.set(astuces[0].id, astuce);


        let citations = client.db_citations.array();

        let shuffleCitations = citations.sort(function (a, b) {
            return 0.5 - Math.random()
        });

        let sortedCitations = shuffleCitations.sort(function (a, b) {
            return a.count - b.count;
        });

        let citation = client.db_citations.get(sortedCitations[0].id);

        citation.count += 1;
        client.db_citations.set(sortedCitations[0].id, citation)

        description += client.textes.get("MOTD_BONJOUR");
        description += "\n";
        description += "\n";
        description += client.textes.get("MOTD_ASTUCE");
        description += "\n";
        description += astuce.texte;
        description += "\n";
        description += "\n";
        description += client.textes.get("MOTD_CITATION");
        description += "\n";
        description += citation.texte;
        description += "\n";
        description += "\n";


        embed.setTitle(client.textes.get("MOTD_TITRE"));
        embed.setColor(`0xCC7900`);
        embed.setDescription(description);

        generalChannel.send(embed);




    };
    client.modLog = async (content) => {
        client.log(`Méthode: modLog`, "debug");
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        let modNotifChannel = guild.channels.cache.find(c => c.name === settings.modNotifChannel);

        if (modNotifChannel) {
            modNotifChannel.send(content);
        }
    };
    client.messageLog = (message) => {
        if (message.author.bot) return false;
        if (message.content.startsWith("!")) return false;
        let messagesLogs = Object.assign({}, datamodel.tables.messagesLogs);
        messagesLogs.messageID = message.id;
        messagesLogs.channelID = message.channel.id;
        messagesLogs.createdBy = message.author.id;
        messagesLogs.createdByName = client.memberGetDisplayNameByID(message.author.id);
        messagesLogs.createdAt = message.createdTimestamp;
        messagesLogs.createdDate = moment(message.createdAt).format('DD.MM.YYYY');
        messagesLogs.createdTime = moment(message.createdAt).format('HH:mm');
        messagesLogs.content = message.cleanContent;
        client.db_messageslogs.set(message.id, messagesLogs);
        client.log(`Message dans  ${message.channel.parent.name}/${message.channel.name} par ${messagesLogs.createdByName}`, "debug");
        return true;
    };

    client.commandLog = async (message, command) => {
        client.log(`Méthode: commandLog`, "debug");
        let commandsLogs = Object.assign({}, datamodel.tables.commandsLogs);
        commandsLogs.messageID = message.id;
        commandsLogs.command = command.id;
        commandsLogs.channelID = message.channel.id;
        commandsLogs.channelType = message.channel.type;
        commandsLogs.createdBy = message.author.id;
        commandsLogs.createdByName = client.memberGetDisplayNameByID(message.author.id);;
        commandsLogs.createdAt = message.createdTimestamp;
        commandsLogs.createdDate = moment(message.createdAt).format('DD.MM.YYYY');
        commandsLogs.createdTime = moment(message.createdAt).format('HH:mm');
        commandsLogs.content = message.content;
        client.db_commandsLogs.set(message.id, commandsLogs);
        client.log(`Commande ${command.id} par ${commandsLogs.createdByName}`, "debug");
    };

    client.channelGetAllMessages = async (channelID) => {
        client.log(`Méthode: channelGetAllMessages`, "debug");

        const guild = client.guilds.cache.get(client.config.guildID);
        let channel = guild.channels.cache.get(channelID);


        const messagesAll = [];
        let last_id;

        while (true) {
            const options = {
                limit: 100
            };
            if (last_id) {
                options.before = last_id;
            }

            const messages = await channel.messages.fetch(options);
            if (messages.size > 0) {
                messagesAll.push(...messages);
                last_id = messages.last().id;
                if (messages.size != 100) {
                    break;
                }
            } else {
                break;
            }
        }
        return messagesAll;
    };
    client.logEventToEmoji = (event) => {
        client.log(`Méthode: logEventToEmoji`, "debug");
        let emoji = "";
        switch (event) {
            case "JOIN":
                emoji = "🤝";
                break;
            case "QUIT":
                emoji = "🚪";
                break;
            case "KICK":
                emoji = "🤜";
                break;
            case "BAN":
                emoji = "🖕";
                break;
            case "MEMBER":
                emoji = "👍";
                break;
            case "NOTE":
                emoji = "📝";
                break;
            case "NICK":
                emoji = "📧";
                break;
            case "GAMEJOIN":
                emoji = "🔸";
                break;
            case "GAMEQUIT":
                emoji = "🔹";
                break;
        }
        return emoji;
    };
    client.logEventToText = (event) => {
        client.log(`Méthode: logEventToText`, "debug");
        let eventText = "";
        switch (event) {
            case "JOIN":
                eventText = "rejoint le discord";
                break;
            case "QUIT":
                eventText = "quitté le discord";
                break;
            case "KICK":
                eventText = "été expulsé";
                break;
            case "BAN":
                eventText = "été banni";
                break;
            case "MEMBER":
                eventText = "été accepté";
                break;
            case "NOTE":
                eventText = "reçu une note";
                break;
            case "NICK":
                eventText = "changé de pseudo";
                break;
            case "GAMEJOIN":
                eventText = "rejoint un jeu";
                break;
            case "GAMEQUIT":
                eventText = "quitté un jeu";
                break;
        }
        return eventText;
    };
    client.msToDays = (milliseconds) => {
        client.log(`Méthode: msToDays`, "debug");
        let roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
        let days = roundTowardsZero(milliseconds / 86400000),
            hours = roundTowardsZero(milliseconds / 3600000) % 24,
            minutes = roundTowardsZero(milliseconds / 60000) % 60,
            seconds = roundTowardsZero(milliseconds / 1000) % 60;
        if (seconds === 0) {
            seconds++;
        }
        return days;
    };
    client.msToDaysText = (milliseconds) => {
        client.log(`Méthode: msToDaysText`, "debug");
        let roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
        let days = roundTowardsZero(milliseconds / 86400000),
            hours = roundTowardsZero(milliseconds / 3600000) % 24,
            minutes = roundTowardsZero(milliseconds / 60000) % 60,
            seconds = roundTowardsZero(milliseconds / 1000) % 60;
        if (seconds === 0) {
            seconds++;
        }
        let pattern = "";
        if (days > 0) {
            pattern = "{days}j";
        } else {
            if (hours > 0) {
                pattern = "{hours}h";
            } else {
                if (minutes > 0) {
                    pattern = "{minutes}m";
                } else {
                    if (seconds > 0) {
                        pattern = "{seconds}s";
                    } else {
                        pattern = "à l'instant";
                    }
                }
            }
        };
        let sentence = pattern
            .replace("{duration}", pattern)
            .replace("{days}", days)
            .replace("{hours}", hours)
            .replace("{minutes}", minutes)
            .replace("{seconds}", seconds);
        return sentence;
    };
    client.msToHours = (milliseconds) => {
        client.log(`Méthode: msToHours`, "debug");
        let roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
        let days = roundTowardsZero(milliseconds / 86400000),
            hours = roundTowardsZero(milliseconds / 3600000) % 24,
            minutes = roundTowardsZero(milliseconds / 60000) % 60,
            seconds = roundTowardsZero(milliseconds / 1000) % 60;
        if (seconds === 0) {
            seconds++;
        }
        let pattern = "";
        if (days > 0) {
            pattern += "{days}j ";
        }
        if (hours > 0) {
            pattern += "{hours}h ";
        };
        if (minutes > 0) {
            pattern += "{minutes}m";
        };

        let sentence = pattern
            .replace("{duration}", pattern)
            .replace("{days}", days)
            .replace("{hours}", hours)
            .replace("{minutes}", minutes)
            .replace("{seconds}", seconds);
        return sentence;
    };
    client.arrayToEmbed = async (array, recordsByPage = 10, titre, channel) => {
        client.log(`Méthode: arrayToEmbed`, "debug");
        let postedEmbeds = client.db_postedEmbeds.get("default");

        let nbPages = Math.ceil(array.length / recordsByPage);
        let pagesArray = [];

        let embeds = [];


        for (i = 0; i < nbPages; i++) {
            let page = i + 1;
            let pageRecords = await array.slice(i * recordsByPage, (i + 1) * recordsByPage);
            let description = "";
            let embed = new Discord.MessageEmbed();

            let firstRow = page * recordsByPage - (recordsByPage - 1);
            let lastRow = page * recordsByPage;
            if (lastRow > array.length) {
                lastRow = array.length;
            };




            // embed.setTitle(`${firstRow} - ${lastRow}`);
            embed.setAuthor(`${titre}`);

            for (var j in pageRecords) {
                description += `${pageRecords[j]}\n`;
            }
            embed.setDescription(description);
            if (nbPages > 1) embed.setFooter(`Page: ${page}/${nbPages}`);
            embeds.push(embed);
        };




        let pageCount = 0;
        embeds.forEach(embed => {
            pageCount += 1;
            let firstRow = pageCount * recordsByPage - (recordsByPage - 1);
            let lastRow = pageCount * recordsByPage;
            if (lastRow > array.length) {
                lastRow = array.length;
            };

            let pagesRecord = {
                "page": pageCount,
                "firstRow": firstRow,
                "lastRow": lastRow,
                "embed": embed
            };
            pagesArray.push(pagesRecord);
        });

        channel.send(embeds[0]).then(async msgSent => {
            postedEmbeds.id = msgSent.id;
            postedEmbeds.channelID = msgSent.channel.id;
            postedEmbeds.name = `Affichage Array "${titre}"`;
            postedEmbeds.currentPage = 1;
            postedEmbeds.totalPages = pagesArray.length;
            postedEmbeds.pages = pagesArray;
            client.db_postedEmbeds.set(postedEmbeds.id, postedEmbeds);
            if (postedEmbeds.totalPages > 1) {
                await msgSent.react(`◀️`);
                await msgSent.react(`▶️`);
            }

        });


    };

    client.datamodelCheck = () => {
        const guild = client.guilds.cache.get(client.config.guildID);


        client.log(`Vérification structure "settings"`, "debug");

        let settingsModel = Object.assign({}, datamodel.tables.settings);
        let setingsKeys = Object.keys(settingsModel);
        let settings = client.db_settings.get(guild.id);

        let settingsNew = settingsModel;
        for (const key of setingsKeys) {
            if (settings[key] !== undefined) {
                settingsNew[key] = settings[key];
            };
        };
        client.db_settings.set(guild.id, settingsNew);


        client.log(`Vérification structure "games"`, "debug");

        let gamesModel = Object.assign({}, datamodel.tables.games);
        let gamesKeys = Object.keys(gamesModel);
        let games = client.gamesGetAll(true);

        for (const game of games) {
            let gameNew = Object.assign({}, datamodel.tables.games);
            for (const key of gamesKeys) {
                if (game[key] !== undefined) {
                    gameNew[key] = game[key];
                };
            };
            client.db_games.set(game.id, gameNew);
        };


        // Vérification usergame
        // for (const game of games) {
        //     if (game.roleID !== "") {
        //         let gameMainRole = guild.roles.cache.get(game.roleID);
        //         if (gameMainRole) {
        //             for (const member of gameMainRole.members) {
        //                 let usergameKey = `${member[1].id}-${game.id}`;

        //                 let usergame = client.db_usergame.get(usergameKey);
        //                 let date = +new Date;
        //                 date = +new Date(moment(date).subtract(30, 'days'));

        //                 if (!usergame) {
        //                     client.log(`Les données du jeu ${game.name} pour ${member[1].displayName} n'ont pas été trouvées. Elle vont être créées`, "warn");
        //                     usergame = Object.assign({}, datamodel.tables.usergame);
        //                     usergame.id = usergameKey;
        //                     usergame.userid = member[1].id;
        //                     usergame.gameid = game.id;
        //                     usergame.joinedAt = date;
        //                     usergame.joinedDate = moment(date).format('DD.MM.YYYY');
        //                     usergame.joinedTime = moment(date).format('HH:mm');
        //                     usergame.lastPlayed = date;
        //                     usergame.lastAction = date;
        //                     client.log(client.textes.get("LOG_EVENT_USERGAME_CREATED", member[1], game));
        //                     client.db_usergame.set(usergame.id, usergame);
        //                 }
        //             }
        //         } else {
        //             client.log(`Le rôle principal de ${game.name} n'a pas été trouvé sur le serveur`, "error");
        //         }
        //     }
        // };



        /*
        for (const game of games) {
            if (game.id !== client.gamesGetGameID(game.name)) {
                if (!game.id.includes("'")) {
                    if (game.actif === true) {
                        client.db_games.delete(game.id);
                        game.id = client.gamesGetGameID(game.name);
                        client.db_games.set(game.id, game);
                        client.log(`Adaptation ${game.name}`);

                    } else {
                        client.db_games.delete(game.id);
                        game.id = client.gamesGetGameID(game.name);
                        client.db_games.set(game.id, game);
                        client.log(`Adaptation ${game.name}`, "debug");
                    }
                } else {
                    game.id = client.gamesGetGameID(game.name);
                    client.db_games.set(game.id, game);
                    client.log(`Adaptation ${game.name} Attention doublon`);
                };
            }
        };
        */

        /*
        let usergames = client.db_usergame.fetchEverything();

        for (const usergame of usergames) {
            if (usergame[0] == "default") {
                client.db_usergame.delete(usergame[0]);
            } else {
                if (usergame[1] !== null) {
                    if (usergame[1].id !== `${usergame[1].userid}-${usergame[1].gameid}`) {
                        if (!usergame[0].includes("'")) {
                            client.db_usergame.delete(usergame[0]);
                        }
                        let gameID = client.gamesGetGameID(usergame[1].gameid);
                        usergame[1].id = `${usergame[1].userid}-${gameID}`;
                        usergame[1].gameid = gameID;
                        client.db_usergame.set(usergame[1].id, usergame[1]);
                    }
                } else {
                    if (!usergame[0].includes("'")) {
                        client.db_usergame.delete(usergame[0]);
                    }
                }
            }
        }
        */


        client.log(`Vérification structure "gameservers"`, "debug");

        let gameserverModel = Object.assign({}, datamodel.tables.gameservers);
        let gameserverKeys = Object.keys(gameserverModel);
        let gameservers = client.gameServersGetAll(true);

        for (const gameserver of gameservers) {
            let gameserverNew = gameserverModel;
            for (const key of gameserverKeys) {
                if (gameserver[key] !== undefined) {
                    gameserverNew[key] = gameserver[key];
                };
            };
            client.db_gameservers.set(gameserver.id, gameserverNew);
        };




    };




};