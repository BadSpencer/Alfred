const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('./datamodel');




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