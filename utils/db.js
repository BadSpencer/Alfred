const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('./datamodel');


// CONGIG
exports.getSettings = async (client) => {
    const guild = client.guilds.cache.get(client.config.guildID);
    if (!guild) return console.log(`Serveur discord "${client.config.guildID}" non trouvé. Vérifiez la configuration d\'Alfred`, "error");
    let settings = client.db_settings.get(guild.id);
    return settings;
}
exports.settingsCheck = async (client) => {
    client.logger.debug(`Vérification de la configuration serveur`);
    const guild = client.guilds.cache.get(client.config.guildID);

    if (!guild) return client.logger.debug(`Serveur discord "${client.config.guildID}" non trouvé. Vérifiez la configuration d\'Alfred`);

    let settings = client.db_settings.get(guild.id);

    if (!settings) {
        guild.owner.send(`La configuration du serveur ${guild.name} (${guild.id}) n\'a pas été faite. Veuillez lancer la commande !settings`)
        client.logger.debug(`Configuration non trouvée pour serveur ${guild.name} (${guild.id}). La configuration par défaut à été appliquée.`)
        settings = datamodel.tables.settings;
        settings.id = guild.id;
        settings.guildName = guild.name;
        client.db_settings.set(guild.id, settings);
    } else {
        client.logger.debug(`Configuration serveur ${guild.name} (${guild.id}) chargée`)
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


exports.userlogsCheck = async (client) => {
    client.log(`Vérification des logs`, "debug");
    const guild = client.guilds.cache.get(client.config.guildID);


    await client.db_userxplogs.delete("default");
    await client.db_userxplogs.set("default", datamodel.tables.userxplogs);
};
exports.embedsCheck = async (client) => {
    client.log(`Vérification des embeds`, "debug");
    const guild = client.guilds.cache.get(client.config.guildID);
    await client.db_embeds.delete("default");
    await client.db_embeds.set("default", datamodel.tables.embeds);
};
exports.usergameCheck = async (client) => {
    client.log(`Vérification des données de jeux des membres`, "debug");
    const guild = client.guilds.cache.get(client.config.guildID);
    let games = await client.db.gamesGetActive(client);

    if (!games) return client.log(`Aucun jeu actif sur ce serveur. Vérification interrompue.`, "warn");

    await client.db_usergame.delete("default");
    await client.db_usergame.set("default", datamodel.tables.usergame);



    guild.members.cache.forEach(async member => {
        if (member.user.bot) return; // Ne pas enregistrer les bots
        let userdata = client.db_userdata.get(member.id);
        if (!userdata) {
            await client.db.usergameCreate(client, member, game);
        }
    })

    // let usergames = client.db_usergame.array();
    // for (const usergame of usergames) {
    //     if (usergame !== null) {
    //         let game = client.db_games.get(usergame.gameid);
    //         if (game) {
    //             let gameRole = guild.roles.cache.get(game.roleID);

    //             if (usergame.userid == undefined) {
    //                 let text = usergame.id.split("-");
    //                 usergame["userid"] = text[1];
    //             }

    //             if (usergame.joinedAt == "") {
    //                 usergame.joinedAt = 0;
    //             }
    //             if (usergame.lastPlayed == "") {
    //                 usergame.lastPlayed = 0;
    //             }
    //             if (usergame.lastAction == "") {
    //                 usergame.lastAction = 0;
    //             }
    //             if (usergame.xp == "") {
    //                 usergame.xp = 0;
    //             }
    //             if (usergame.level == "") {
    //                 usergame.level = 0;
    //             }
    //             if (gameRole) {
    //                 if (gameRole.members.has(usergame.userid)) {
    //                     if (usergame.joinedAt == 0) {
    //                         usergame.joinedAt = game.createdAt + 90000;
    //                         usergame.joinedDate = moment(usergame.joinedAt).format('DD.MM.YYYY');
    //                         usergame.joinedTime = moment(usergame.joinedAt).format('HH:mm');
    //                     }
    //                 } else {
    //                     usergame.joinedAt = 0;
    //                     usergame.joinedDate = "";
    //                     usergame.joinedTime = "";
    //                 }
    //             } else {
    //                 usergame.joinedAt = 0;
    //                 usergame.joinedDate = "";
    //                 usergame.joinedTime = "";
    //             }
    //             client.db_usergame.set(usergame.id, usergame);
    //         }
    //     }
    // }


};
exports.usergameAddXP = async (client, member, xpAmount, game) => {
    const guild = client.guilds.cache.get(client.config.guildID);
    const settings = client.db_settings.get(guild.id);
    const userdata = client.db_userdata.get(member.id);
    const roleMembers = guild.roles.cache.find(r => r.name == settings.memberRole);


    let usergame = client.db_usergame.get(`${game.name}-${member.id}`);
    if (usergame) {
        usergame.xp += xpAmount;
        client.db.userxplogAdd(client, member, "GAMEXP", xpAmount, "Joue", game.name);
        usergame.lastPlayed = +new Date;
        let newLevel = await client.xpGetLevel(usergame.xp);
        if (newLevel > usergame.level) {
            usergame.level = newLevel;
            client.log(`Jeu ${game.name}: Niveau supérieur pour ${member.displayName} qui est désormais level ${newLevel})`)
        };
        client.db_usergame.set(`${game.name}-${member.id}`, usergame);
    }
};
exports.userdataAddXP = async (client, member, xpAmount, reason) => {
    const guild = client.guilds.cache.get(client.config.guildID);
    const settings = client.db_settings.get(guild.id);
    const userdata = client.db_userdata.get(member.id);
    const roleMembers = guild.roles.cache.find(r => r.name == settings.memberRole);
    if (roleMembers) {
        if (member.roles.cache.has(roleMembers.id)) {
            if (xpAmount > 0) {
                userdata.xp += xpAmount;
                client.db.userxplogAdd(client, member, "XP", xpAmount, reason);
                client.log(client.textes.get("EXP_LOG_ADDXP", member, xpAmount, reason), "debug");
                let newLevel = await client.xpGetLevel(userdata.xp);
                if (newLevel > userdata.level) {
                    userdata.level = newLevel;
                    client.userLevelUp(member, newLevel);
                };
                client.db_userdata.set(member.id, userdata);
            }
        }
    } else {
        client.log(`Configuration serveur: impossible de trouver le rôle ${settings.memberRole}. Vérifiez la configuration en base de donnée`, "error")
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
    client.log(`Vérification de la base de données des jeux`, "debug");
    const guild = client.guilds.cache.get(client.config.guildID);
    const settings = await client.db.getSettings(client);
    await client.db_games.delete("default");
    await client.db_games.set("default", datamodel.tables.games);

    let games = await client.db.gamesGetAll(client);
    for (const game of games) {
        if (game.nbDaysInactive == undefined) {
            game["nbDaysInactive"] = 30;
            client.db_games.set(game.id, game);
        }
    }


    let gamesActive = await client.db.gamesGetActive(client);
    if (!gamesActive) return client.log(`Aucun jeu actif sur ce serveur. Vérification interrompue.`, "warn");

    await client.gamesListPost(true);
};

exports.gamesGetActive = async (client) => {
    const games = client.db_games.filter(game => game.actif === true);
    return games;
};
exports.gamesGetActiveArray = async (client) => {
    const games = client.db_games.filterArray(game => game.actif === true);
    return games;
};
exports.gamesGetAll = async (client) => {
    const games = client.db_games.filterArray(game => game.name !== "default");
    return games;
};

// POSTED EMBEDS
exports.postedEmbedsCheck = async (client) => {
    client.log(`Vérification des Embeds postés`, "debug");
    await client.db_postedEmbeds.deleteAll();
    await client.db_postedEmbeds.set("default", datamodel.tables.postedEmbeds);
};
exports.postedEmbedsCreate = async (client, postedEmbeds) => {
    await client.db_postedEmbeds.set(postedEmbeds.id, postedEmbeds);
    client.log(`L'embed ${postedEmbeds.name} à été ajouté à la base de données`)
};
exports.postedEmbedsGetAll = async (client) => {
    const postedEmbeds = client.db_postedEmbeds.filter(postedEmbed => postedEmbed.name !== "default");
    return postedEmbeds;
};
exports.enmapDisplay = async (client, enmap, channel, fieldlist = []) => {

    if (enmap.size == 0) return client.log(`Aucun enregistrement trouvé`, "warn");

    let postedEmbeds = client.db_postedEmbeds.get("default");
    let pagesArray = [];
    let nbPages = Math.ceil(enmap.size / 10);

    let embeds = [];
    for (i = 0; i < nbPages; i++) {
        embeds.push(await client.db.enampCreateEmbed(client, enmap, enmap.name, i + 1, fieldlist))
    };

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
        if (pagesArray.length > 1) {
            await msgSent.react(`◀️`);
            await msgSent.react(`▶️`);
        }
    });



};
exports.enampCreateEmbed = async (client, enmap, name, page, fieldlist = []) => {
    let embed = new Discord.MessageEmbed();
    let nbPages = Math.ceil(enmap.size / 10);
    let description = "";
    let array = enmap.array();
    let keysArray = enmap.keyArray();
    let index = page - 1;
    let pageRecords = await array.slice(index * 10, (index + 1) * 10);
    let pageIndexes = await keysArray.slice(index * 10, (index + 1) * 10);
    let row = index * 10 + 1;


    async function showProps(obj) {

        if (fieldlist.length == 0) {
            for (var i in obj) {
                if (i !== "id") {
                    fieldlist.push(i);
                }
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
        description += `**${pageIndexes[i]}** \`${record.substring(0, 100)}\`\n`;
        row += 1;
    }

    embed.setTitle(`${page * 10 - 9} - ${page * 10 - 10 + pageRecords.length} / ${enmap.size}`);
    embed.setAuthor(`${name}`, "https://cdn.discordapp.com/attachments/599235210550181900/633576189822500874/SQLite_Database_Browser_icon.png");
    embed.setDescription(description);
    if (nbPages > 1) embed.setFooter(`Page: ${page}/${nbPages}`);
    return embed;
};


// <Array>.random() returns a single random element from an array
// [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
Object.defineProperty(Array.prototype, "random", {
    value: function () {
        return this[Math.floor(Math.random() * this.length)];
    }
});