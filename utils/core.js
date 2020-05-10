const Discord = require("discord.js");
const moment = require("moment");
const colors = require('./colors');
const constants = require('./constants');
const datamodel = require('./datamodel');

module.exports = (client) => {
    client.createVoiceChannel = async (name = "") => {
        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);
        const roleEveryone = guild.roles.find(r => r.name == "@everyone");
        const roleMembers = guild.roles.find(r => r.name == settings.memberRole);
        const voiceChannelsCategory = guild.channels.find(c => c.name === settings.voiceChansCategory);

        let channelName = "";
        if (!name) {
            channelName = settings.freeVoiceChan;
        } else {
            channelName = name;
        }

        await guild.createChannel(channelName, {
            type: 'voice'
        }).then(freeVoiceChannel => {
            freeVoiceChannel.overwritePermissions(roleEveryone, {
                'CONNECT': false,
            });
            freeVoiceChannel.overwritePermissions(roleMembers, {
                'CONNECT': true,
            });
            freeVoiceChannel.setParent(voiceChannelsCategory);
        });

    };
    client.renameFreeVoiceChannel = async (member) => {
        let channelName = client.textes.get("VOICE_NEW_VOICE_CHANNEL");
        if (member.presence.game) {
            let game = client.db_games.get(member.presence.game.name);
            if (game) {
                channelName = `🔊 ${game.name}`
            }
        }
        //if (member.id == "193822534196658176") channelName = `🔊 Confinement COVID-19`;
        await member.voiceChannel.setName(channelName);
        await member.voiceChannel.overwritePermissions(member, {
            'MANAGE_CHANNELS': true,
        });

    };

    client.contactVoiceChannelJoin = async (member) => {
        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);

        const roleEve = guild.roles.find(r => r.name == "@everyone");
        const roleMem = guild.roles.find(r => r.name == settings.memberRole);
        const roleMod = guild.roles.find(r => r.name == settings.modRole);
        const roleAdm = guild.roles.find(r => r.name == settings.adminRole);

        const voiceChannelsCategory = guild.channels.find(c => c.name === settings.voiceChansCategory);
        const accueilCategory = guild.channels.find(c => c.name === settings.accueilCategory);

        switch (member.voiceChannel.name) {
            case settings.contactChannelFree:
                if (member.roles.has(roleMod.id) || member.roles.has(roleAdm.id)) {

                } else {
                    member.voiceChannel.setParent(voiceChannelsCategory);
                    member.voiceChannel.setName(settings.contactChannelInprogress);
                    member.voiceChannel.overwritePermissions(roleEve, {
                        'VIEW_CHANNEL': true,
                        'CONNECT': false,
                    });
                    member.voiceChannel.overwritePermissions(roleMem, {
                        'VIEW_CHANNEL': true,
                        'CONNECT': false,
                    });
                    member.voiceChannel.overwritePermissions(roleMod, {
                        'VIEW_CHANNEL': true,
                        'CONNECT': true,
                    });
                    client.modLog(client.textes.get("MOD_NOTIF_USER_JOIN_CONTACT", member));
                }
                break;
            case settings.contactChannelWaiting:
                if (member.roles.has(roleMod.id) || member.roles.has(roleAdm.id)) {
                    member.voiceChannel.setName(settings.contactChannelInprogress);
                } else {

                }
                break;
            case settings.contactChannelInprogress:

                break;
        }





    };
    client.contactVoiceChannelQuit = async (member) => {
        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);

        const roleEve = guild.roles.find(r => r.name == "@everyone");
        const roleMem = guild.roles.find(r => r.name == settings.memberRole);
        const roleMod = guild.roles.find(r => r.name == settings.modRole);
        const roleAdm = guild.roles.find(r => r.name == settings.adminRole);

        const voiceChannelsCategory = guild.channels.find(c => c.name === settings.voiceChansCategory);
        const accueilCategory = guild.channels.find(c => c.name === settings.accueilCategory);

        switch (member.voiceChannel.name) {
            case settings.contactChannelFree:
                member.voiceChannel.setParent(accueilCategory);
                member.voiceChannel.setName(settings.contactChannelFree);
                member.voiceChannel.overwritePermissions(roleEve, {
                    'VIEW_CHANNEL': true,
                    'CONNECT': true,
                });
                break;
            case settings.contactChannelWaiting:
                member.voiceChannel.setParent(accueilCategory);
                member.voiceChannel.setName(settings.contactChannelFree);
                member.voiceChannel.overwritePermissions(roleEve, {
                    'VIEW_CHANNEL': true,
                    'CONNECT': true,
                });
                break;
            case settings.contactChannelInprogress:
                member.voiceChannel.setParent(accueilCategory);
                member.voiceChannel.setName(settings.contactChannelFree);
                member.voiceChannel.overwritePermissions(roleEve, {
                    'VIEW_CHANNEL': true,
                    'CONNECT': true,
                });
                break;
        }
    };

    client.gameVoiceChannelJoin = async (game, member) => {
        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);
        const roleMembers = guild.roles.find(r => r.name == settings.memberRole);
        const voiceChannelsCategory = guild.channels.find(c => c.name === settings.voiceChansCategory);

        member.voiceChannel.setParent(voiceChannelsCategory);
        member.voiceChannel.setName(`🔊${game.name}`);
        member.voiceChannel.overwritePermissions(roleMembers, {
            'VIEW_CHANNEL': true,
            'CONNECT': true,
        });
    };
    client.gameVoiceChannelQuit = async (game, member) => {
        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);
        const roleMembers = guild.roles.find(r => r.name == settings.memberRole);
        const gameCategory = guild.channels.get(game.categoryID);

        member.voiceChannel.setParent(gameCategory);
        member.voiceChannel.setName(`🔈${game.name}`);
        member.voiceChannel.overwritePermissions(roleMembers, {
            'VIEW_CHANNEL': false,
            'CONNECT': false,
        });
    };
    client.messageOfTheDay = async () => {

        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);

        let embed = new Discord.RichEmbed();
        let description = "";

        let generalChannel = guild.channels.find(c => c.name === settings.welcomeMemberChannel);

        let astuces = client.db_astuces.array();
        astuces.sort(function (a, b) {
            return a.count - b.count;
        });
        let astuce = client.db_astuces.get(astuces[0].id);
        astuce.count += 1;
        client.db_astuces.set(astuces[0].id, astuce);


        let citations = client.db_citations.array();

        let sortedCitations = citations.sort(function (a, b) {
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
        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);

        //let timestamp = moment().format('DD.MM') + " " + moment().format('HH:mm');
        //let notification = timestamp + " " + content;

        let modNotifChannel = guild.channels.find(c => c.name === settings.modNotifChannel);

        if (modNotifChannel) {
            modNotifChannel.send(content);
        }
    };

    client.messageLog = async (message) => {


        if (message.author.bot) return false;
        if (message.content.startsWith("!")) return false;

        let messagesLogs = datamodel.tables.messagesLogs;
        messagesLogs.messageID = message.id;
        messagesLogs.channelID = message.channel.id;
        messagesLogs.createdBy = message.author.id;
        messagesLogs.createdByName = message.author.username;
        messagesLogs.createdAt = message.createdTimestamp;
        messagesLogs.createdDate = moment(message.createdAt).format('DD.MM.YYYY');
        messagesLogs.createdTime = moment(message.createdAt).format('HH:mm');
        client.db_messageslogs.set(message.id, messagesLogs);
        return true;
    };

    client.commandLog = async (message, command) => {

        let commandsLogs = datamodel.tables.commandsLogs;
        commandsLogs.messageID = message.id;
        commandsLogs.command = command.id;
        commandsLogs.channelID = message.channel.id;
        commandsLogs.channelType = message.channel.type;
        commandsLogs.createdBy = message.author.id;
        commandsLogs.createdByName = message.author.username;
        commandsLogs.createdAt = message.createdTimestamp;
        commandsLogs.createdDate = moment(message.createdAt).format('DD.MM.YYYY');
        commandsLogs.createdTime = moment(message.createdAt).format('HH:mm');
        commandsLogs.content = message.content;
        client.db_commandsLogs.set(message.id, commandsLogs);

    };

    client.channelGetAllMessages = async (channelID) => {

        const guild = client.guilds.get(client.config.guildID);
        let channel = guild.channels.get(channelID);


        const messagesAll = [];
        let last_id;

        while (true) {
            const options = { limit: 100 };
            if (last_id) {
                options.before = last_id;
            }

            const messages = await channel.fetchMessages(options);
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
        let emoji = "";
        switch (event) {
            case 'JOIN':
                emoji = "🤝";
                break;
            case 'QUIT':
                emoji = "🚪";
                break;
            case 'KICK':
                emoji = "🤜";
                break;
            case 'BAN':
                emoji = "🖕";
                break;
            case 'MEMBER':
                emoji = "👍";
                break;
            case 'NOTE':
                emoji = "📝";
                break;
            case 'NICK':
                emoji = "📧";
                break;
            case 'GAMEJOIN':
                emoji = "🔸";
                break;
            case 'GAMEQUIT':
                emoji = "🔹";
                break;
        }
        return emoji;
    };
    client.logEventToText = (event) => {
        let eventText = "";
        switch (event) {
            case 'JOIN':
                eventText = " nous a rejoint";
                break;
            case 'QUIT':
                eventText = "nous a quitté";
                break;
            case 'KICK':
                eventText = "a été expulsé";
                break;
            case 'BAN':
                eventText = "a été banni";
                break;
            case 'MEMBER':
                eventText = "a été accepté";
                break;
            case 'NOTE':
                eventText = "a reçu une note";
                break;
            case 'NICK':
                eventText = "a changé de pseudo";
                break;
            case 'GAMEJOIN':
                eventText = "a rejoint un jeu";
                break;
            case 'GAMEQUIT':
                eventText = "a quitté un jeu";
                break;
        }
        return eventText;
    };

    client.msToDays = (milliseconds) => {
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

        let postedEmbeds = client.db_postedEmbeds.get("default");

        let nbPages = Math.ceil(array.length / recordsByPage);
        let pagesArray = [];

        let embeds = [];


        for (i = 0; i < nbPages; i++) {
            let page = i + 1;
            let pageRecords = await array.slice(i * recordsByPage, (i + 1) * recordsByPage);
            let description = "";
            let embed = new Discord.RichEmbed();

            let firstRow = page * recordsByPage - (recordsByPage - 1);
            let lastRow = page * recordsByPage;
            if (lastRow > array.length) {
                lastRow = array.length;
            };




            embed.setTitle(`${firstRow} - ${lastRow}`);
            embed.setAuthor(`${titre}`);

            for (var j in pageRecords) {
                description += `${pageRecords[j]}\n`;
            }
            embed.setDescription(description);
            embed.setFooter(`Page: ${page}/${nbPages}`);
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
            await msgSent.react(`◀️`);
            await msgSent.react(`▶️`);
   
        });


    };
}