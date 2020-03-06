const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('./datamodel');


// CONGIG
exports.getSettings = async (client) => {
    const guild = client.guilds.get(client.config.guildID);
    if (!guild) return client.logger.error(`Serveur discord "${client.config.guildID}" non trouvé. Vérifiez la configuration d\'Alfred`);
    let settings = client.db_settings.get(guild.id);
    return settings;
}
exports.settingsCheck = async (client) => {
    client.logger.log(`Vérification de la configuration serveur`);
    const guild = client.guilds.get(client.config.guildID);

    if (!guild) return client.logger.error(`Serveur discord "${client.config.guildID}" non trouvé. Vérifiez la configuration d\'Alfred`);

    let settings = client.db_settings.get(guild.id);

    if (!settings) {
        let noguildsettings = `Configuration non trouvée pour serveur ${guild.name} (${guild.id}). La configuration par défaut à été appliquée.`;
        guild.owner.send(`La configuration du serveur ${guild.name} (${guild.id}) n\'a pas été faite. Veuillez lancer la commande !settings`)
        client.logger.log(`${noguildsettings}`)
        settings = datamodel.tables.settings;

        settings.id = guild.id;
        settings.guildName = guild.name;
        client.db_settings.set(guild.id, settings);
    } else {
        client.logger.log(`Configuration serveur ${guild.name} (${guild.id}) chargée`)
    }
};

exports.textesCheck = async (client) => {
    let astuces = client.textes.getAstuces(client);
    let newAstuce = {
        "id": "",
        "texte": "",
        "count": 0
    };

    let newCitation = {
        "id": "",
        "texte": "",
        "count": 0
    };
    astuces.forEach(astuce => {
        let currAst = client.db_astuces.find(ast => ast.texte == astuce);
        if (!currAst) {
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
            newCitation.id = client.db_citations.autonum;
            newCitation.texte = citation;
            newCitation.count = 0;
            client.db_citations.set(newCitation.id, newCitation);
        }
    });

};



// USERDATA
exports.userdataCheck = async (client) => {
    client.logger.log(`Vérification de la base des membres`);
    const guild = client.guilds.get(client.config.guildID);

    await client.db_userdata.delete("default");
    await client.db_userdata.set("default", datamodel.tables.userdata);



    guild.members.forEach(async member => {
        if (member.user.bot) return; // Ne pas enregistrer les bots
        let userdata = client.db_userdata.get(member.id);

        if (!userdata) {
            await client.db.userdataCreate(client, member);
        }
    })
};
exports.userlogsCheck = async (client) => {
    client.logger.debug(`Vérification des logs`);
    const guild = client.guilds.get(client.config.guildID);


    await client.db_userxplogs.delete("default");
    await client.db_userxplogs.set("default", datamodel.tables.userxplogs);
};
exports.embedsCheck = async (client) => {
    client.logger.debug(`Vérification des embeds`);
    const guild = client.guilds.get(client.config.guildID);
    await client.db_embeds.delete("default");
    await client.db_embeds.set("default", datamodel.tables.embeds);
};
exports.usergameCheck = async (client) => {
    client.logger.log(`Vérification des données de jeux des membres`);
    const guild = client.guilds.get(client.config.guildID);
    let games = await client.db.gamesGetActive(client);

    if (!games) return client.logger.warn(`Aucun jeu actif sur ce serveur. Vérification interrompue.`);

    await client.db_usergame.delete("default");
    await client.db_usergame.set("default", datamodel.tables.usergame);



    guild.members.forEach(async member => {
        if (member.user.bot) return; // Ne pas enregistrer les bots
        let userdata = client.db_userdata.get(member.id);

        if (!userdata) {
            await client.db.usergameCreate(client, member, game);
        }
    })
};
exports.userdataCreate = async (client, member) => {
    let userdata = client.db_userdata.get("default");
    let userdataLogs = datamodel.tables.userdataLogs;
    let userdataNicknames = datamodel.tables.userdataNicknames;

    let userJoinedDate = moment(member.joinedAt).format('DD.MM.YYYY');
    let userJoinedTime = moment(member.joinedAt).format('HH:mm');

    userdata.id = member.id;
    userdata.name = member.displayName;
    userdata.createdAt = +new Date;
    userdata.joinedDate = userJoinedDate;
    userdata.joinedTime = userJoinedTime;
    userdata.level = 0;
    userdata.xp = 0;


    userdataNicknames.date = userJoinedDate;
    userdataNicknames.oldNickname = member.user.username;
    userdataNicknames.newNickname = member.displayName;
    userdata.nicknames.push(userdataNicknames);

    userdataLogs.date = userJoinedDate;
    userdataLogs.type = "Membre"
    userdataLogs.commentaire = "Enregistrement initial";
    userdataLogs.xp = 0;
    userdata.logs.push(userdataLogs);

    client.db_userdata.set(member.id, userdata);
    client.logger.log(`Membre ${member.displayName} à été ajouté à la base de données`)
};
exports.usergameAddXP = async (client, member, xpAmount, game) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = client.db_settings.get(guild.id);
    const userdata = client.db_userdata.get(member.id);
    const roleMembers = guild.roles.find(r => r.name == settings.memberRole);

    let usergame = client.db_usergame.get(`${member.presence.game.name}-${member.id}`);
    if (usergame) {
        usergame.xp += xpAmount;
        client.db.userxplogAdd(client, member, "GAMEXP", xpAmount, "Joue", member.presence.game.name);
        usergame.lastPlayed = +new Date;
        let newLevel = await client.exp.xpGetLevel(usergame.xp);
        if (newLevel > usergame.level) {
            usergame.level = newLevel;
            client.logger.log(`Jeu ${game.name}: Niveau supérieur pour ${member.displayName} qui est désormais level ${newLevel})`)
            //client.exp.userLevelUp(client, member, newLevel);
        };
        client.db_usergame.set(`${member.presence.game.name}-${member.id}`, usergame);
    }
};
exports.userdataAddXP = async (client, member, xpAmount, reason) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = client.db_settings.get(guild.id);
    const userdata = client.db_userdata.get(member.id);
    const roleMembers = guild.roles.find(r => r.name == settings.memberRole);
    if (roleMembers) {
        if (member.roles.has(roleMembers.id)) {
            if (xpAmount > 0) {
                userdata.xp += xpAmount;
                client.db.userxplogAdd(client, member, "XP", xpAmount, reason);
                client.logger.log(client.textes.get("EXP_LOG_ADDXP", member, xpAmount, reason));
                let newLevel = await client.exp.xpGetLevel(userdata.xp);
                if (newLevel > userdata.level) {
                    userdata.level = newLevel;
                    client.exp.userLevelUp(client, member, newLevel);
                };
                client.db_userdata.set(member.id, userdata);
            }
        }
    } else {
        client.logger.error(`Configuration serveur: impossible de trouver le rôle ${settings.memberRole}. Vérifiez la configuration en base de donnée`)
    }
};
exports.userxplogAdd = async (client, member, type, xpgained, xpreason, gamename = "n/a") => {
    let date = moment().format('DD.MM.YYYY');
    let id = `${member.id}-${date}`;

    let userxplogs;
    if (client.db_userxplogs.has(id)) {
        userxplogs = client.db_userxplogs.get(id);

    } else {
        userxplogs = client.db_userxplogs.get("default");
        userxplogs.id = id;
        userxplogs.date = date;
        userxplogs.userid = member.id;
    }

    switch (type) {
        case "XP": {
            let xp = userxplogs.xp.find(r => r.reason == xpreason);
            if (xp) {
                xp.xp += xpgained;
            } else {
                xp = {
                    "reason": xpreason,
                    "xp": xpgained
                };
                userxplogs.xp.push(xp);
            }
            break;
        }
        case "GAMEXP": {
            let gamexp = userxplogs.gamexp.find(r => r.gamename == gamename);
            if (gamexp) {
                gamexp.xp += xpgained;
            } else {
                gamexp = {
                    "gamename": gamename,
                    "xp": xpgained
                };
                userxplogs.gamexp.push(gamexp);
            }
            break;
        }
    }
    client.db_userxplogs.set(id, userxplogs);
};
// GAMES
exports.gamesCheck = async (client) => {
    client.logger.log(`Vérification de la base de données des jeux`);
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);
    await client.db_games.delete("default");
    await client.db_games.set("default", datamodel.tables.games);

    let games = await client.db.gamesGetActive(client);

    if (!games) return client.logger.warn(`Aucun jeu actif sur ce serveur. Vérification interrompue.`);

    await client.games.PostRoleReaction(client, true);
};
exports.gamesCreate = async (client, gamename) => {
    let game = client.db_games.get("default");

    game.id = gamename;
    game.name = gamename;
    game.createdAt = +new Date;

    client.db_games.set(game.id, game);
    client.logger.log(`Le jeu ${gamename} à été ajouté à la base de données`)


};
exports.gamesGetActive = async (client) => {
    const games = client.db_games.filter(game => game.actif === true);
    return games;
};
exports.gamesGetAll = async (client) => {
    const games = client.db_games.find(game => game.name !== "default");
    return games;
};

// POSTED EMBEDS
exports.postedEmbedsCheck = async (client) => {
    client.logger.log(`Vérification des Embeds postés`);
    await client.db_postedEmbeds.deleteAll();
    await client.db_postedEmbeds.set("default", datamodel.tables.postedEmbeds);
};
exports.postedEmbedsCreate = async (client, postedEmbeds) => {
    await client.db_postedEmbeds.set(postedEmbeds.id, postedEmbeds);
    client.logger.log(`L'embed ${postedEmbeds.name} à été ajouté à la base de données`)
};
exports.postedEmbedsGetAll = async (client) => {
    const postedEmbeds = client.db_postedEmbeds.filter(postedEmbed => postedEmbed.name !== "default");
    return postedEmbeds;
};
exports.enmapDisplay = async (client, enmap, channel) => {

    if (enmap.size == 0) return client.logger.warn(`Aucun enregistrement trouvé`);

    let postedEmbeds = client.db_postedEmbeds.get("default");
    let pagesArray = [];
    let nbPages = Math.ceil(enmap.size / 10);

    let embeds = [];
    for (i = 0; i < nbPages; i++) {
        embeds.push(await client.db.enampCreateEmbed(client, enmap, enmap.name, i + 1))
    }

    let pageCount = 0;
    embeds.forEach(embed => {
        pageCount += 1;
        let firstRow = pageCount * 10 - 9;
        let lastRow = pageCount * 10;
        if (lastRow > enmap.size) {
            lastRow = enmap.size;
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
        postedEmbeds.name = `Affichage Enmap ${enmap.name}`;
        postedEmbeds.currentPage = 1;
        postedEmbeds.totalPages = pagesArray.length;
        postedEmbeds.pages = pagesArray;
        client.db_postedEmbeds.set(postedEmbeds.id, postedEmbeds);
        await msgSent.react(`◀`);
        await msgSent.react(`▶`);
    });



};
exports.enampCreateEmbed = async (client, enmap, name, page) => {
    let embed = new Discord.RichEmbed();
    let nbPages = Math.ceil(enmap.size / 10);
    let description = "";
    let array = enmap.array();
    let keysArray = enmap.keyArray();
    let index = page - 1;
    let pageRecords = await array.slice(index * 10, (index + 1) * 10);
    let pageIndexes = await keysArray.slice(index * 10, (index + 1) * 10);
    let row = index * 10 + 1;


    async function showProps(obj) {

        let fieldlist = [];
        for (var i in obj) {
            if (i !== "id") {
                fieldlist.push(i);
            }
        }

        var result = ``;
        for (var i in obj) {
            // obj.hasOwnProperty() is used to filter out properties from the object's prototype chain
            if (obj.hasOwnProperty(i)) {
                if (fieldlist.includes(i)) result += `${obj[i]},`;
            }
        }
        return result;
    }

    for (var i in pageRecords) {
        //let record = util.inspect(pageRecords[i], {compact: 10, breakLength: 180});
        let record = await showProps(pageRecords[i]);
        description += `**${pageIndexes[i]}**:\`${record.substring(0, 100)}\`\n`;
        row += 1;
    }

    embed.setTitle(`${page * 10 - 9} - ${page * 10 - 10 + pageRecords.length} / ${enmap.size}`);
    embed.setAuthor(`${name}`, "https://cdn.discordapp.com/attachments/599235210550181900/633576189822500874/SQLite_Database_Browser_icon.png");
    embed.setDescription(description);
    embed.setFooter(`Page: ${page}/${nbPages}`);
    return embed;
};

Object.defineProperty(String.prototype, "toProperCase", {
    value: function () {
        return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
});

// <Array>.random() returns a single random element from an array
// [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
Object.defineProperty(Array.prototype, "random", {
    value: function () {
        return this[Math.floor(Math.random() * this.length)];
    }
});