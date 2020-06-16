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

    client.embedUserboard = async (message) => {
        let embedOwned = client.db_embeds.filterArray(embed => embed.ownedBy == message.author.id);
        let embedOthers = client.db_embeds.filterArray(embed => embed.ownedBy !== message.author.id && embed.ownedBy !== "");

        let embedEdit = await client.embedGetCureentEdit(message.author.id);
        let archivedEmbeds = client.db_embeds.filterArray(embed => embed.statut == "ARCH" && embed.ownedBy == message.author.id);
        let description = client.textes.get("EMBED_USERBOARD_DESCRIPTION", embedOwned.length, embedEdit);

        let embedOwnedLastDesc = "";
        let embedOthersLastDesc = "";

        embedOwned.sort(function (a, b) {
            return a.changedAt + b.changedAt;
        }).reverse();
        let embedOwnedLast = embedOwned.slice(0, 10);
        for (const embed of embedOwnedLast) {
            if (embed.statut == "EDIT") {
                embedOwnedLastDesc += `**${embed.id}**: **${embed.titre}**\n`;
            } else {
                embedOwnedLastDesc += `**${embed.id}**: ${embed.titre}\n`;
            }

        }
        embedOwnedLastDesc += `\n`;
        embedOwnedLastDesc += `\`!embed liste\` pour afficher tout vos embeds`;


        embedOthers.sort(function (a, b) {
            return a.changedAt + b.changedAt;
        });
        let embedOthersLast = embedOthers.slice(0, 5);
        for (const embed of embedOthersLast) {
            if (embed.statut == "EDIT") {
                embedOthersLastDesc += `**${embed.id}**: **${embed.titre}** (${embed.ownedByName})\n`;
            } else {
                embedOthersLastDesc += `**${embed.id}**: ${embed.titre} (${embed.ownedByName})\n`;
            }

        }
        embedOthersLastDesc += `\n`;
        embedOthersLastDesc += `\`!embed listeall\` pour afficher tout les embeds`;



        let embed = new Discord.MessageEmbed()
            .setTitle(client.textes.get("EMBED_USERBOARD_TITLE", message.author.username))
            .addField("Vos derniers embeds", embedOwnedLastDesc, true)
            .addField("Les derniers embeds des autres", embedOthersLastDesc, true)
            .setDescription(description);
        message.channel.send(embed);
    };
    client.embedAide = async (message) => {
        let embed = new Discord.MessageEmbed()
            .setTitle(client.textes.get("EMBED_AIDE_TITLE", message.author.username))
            .setDescription(client.textes.get("EMBED_AIDE_DESCRIPTION"));
        message.channel.send(embed);
    };

    client.embedCreate = async (message, titre) => {
        const guild = client.guilds.cache.get(client.config.guildID);
        let member = guild.members.cache.get(message.author.id);
        let dateNow = +new Date;

        await client.embedArchiveCurrentEdit(message);


        let embed = client.db_embeds.get("default");
        let key = client.db_embeds.autonum;
        const Embed = new Discord.MessageEmbed().setTitle(titre);
        embed.id = key;
        embed.statut = "EDIT";
        embed.titre = titre;
        embed.createdAt = dateNow;
        embed.createdDate = moment(dateNow).format('DD.MM.YYYY');
        embed.createdTime = moment(dateNow).format('HH:mm');
        embed.createdBy = member.id;
        embed.createdByName = member.displayName;
        embed.ownedBy = member.id;
        embed.ownedByName = member.displayName;
        embed.changedAt = dateNow;
        embed.changedDate = moment(dateNow).format('DD.MM.YYYY');
        embed.changedTime = moment(dateNow).format('HH:mm');
        embed.changedBy = member.id;
        embed.changedByName = member.displayName;
        embed.content = Embed;
        client.db_embeds.set(key, embed);
        successMessage(client.textes.get("EMBED_CREATION_SUCCESS", embed.titre, embed.id), message.channel);
        return key;
    };
    client.embedCopy = async (message, id) => {
        const guild = client.guilds.cache.get(client.config.guildID);
        let dateNow = +new Date;
        let member = guild.members.cache.get(message.author.id);
        await client.embedArchiveCurrentEdit(message);

        let embed = client.db_embeds.get(id);
        if (!embed) return errorMessage(client.textes.get("EMBED_NOT_FOUND", id), message.channel);

        let key = client.db_embeds.autonum;
        embed.id = key;
        embed.statut = "EDIT";
        embed.createdAt = dateNow;
        embed.createdDate = moment(dateNow).format('DD.MM.YYYY');
        embed.createdTime = moment(dateNow).format('HH:mm');
        embed.createdBy = member.id;
        embed.createdByName = member.displayName;
        embed.ownedBy = member.id;
        embed.ownedByName = member.displayName;
        embed.changedAt = dateNow;
        embed.changedDate = moment(dateNow).format('DD.MM.YYYY');
        embed.changedTime = moment(dateNow).format('HH:mm');
        embed.changedBy = member.id;
        embed.changedByName = member.displayName;
        embed.copyFrom = id;
        client.db_embeds.set(key, embed);
        successMessage(client.textes.get("EMBED_COPY_SUCCESS", id, key, embed.titre), message.channel);
    };
    client.embedShow = async (embedID, message, news = false) => {
        client.embedShowChannel(embedID, message.channel, news);
    }
    client.embedShowChannel = async (embedID, channel, news = false) => {
        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = client.db_settings.get(guild.id);


        let postedMessage;
        let embed = client.db_embeds.get(embedID);

        if (embed) {
            let member = guild.members.cache.get(embed.ownedBy);
            let Embed = new Discord.MessageEmbed(embed.content);
            if (news) {
                if (member) {
                    Embed.setFooter(`Envoyé par ${member.displayName} le ${moment().format('DD.MM.YYYY')} à ${moment().format('HH:mm')}`, member.user.avatarURL());
                } else {
                    Embed.setFooter(`Envoyé par ??????? le ${moment().format('DD.MM.YYYY')} à ${moment().format('HH:mm')}`);
                }
            }
            if (embed.showFooter == false) {
                Embed.setFooter("");
            }
            if (embed.showTitle == false) {
                Embed.setTitle("");
            }
            await channel.send(Embed).then(msgSent => {
                postedMessage = msgSent;
            });
        } else {
            errorMessage(client.textes.get("EMBED_NOT_FOUND", embedID), channel);
        }
        return postedMessage;

    };
    client.embedUpdate = async (embedID, property, args, message) => {
        let dateNow = +new Date;
        let embed = client.db_embeds.get(embedID);
        let embedNew = new Discord.MessageEmbed(embed.content);
        let arguments = args;
        switch (property) {
            case 'addfield': {
                const regex = /{(.+?)}/g;
                let localArgs = [];
                let match;
                while (match = regex.exec(arguments)) localArgs.push(match[1]);
                embedNew.addField(localArgs[0], localArgs[1], localArgs[2]);
                break;
            }
            case 'clearfields': {
                let newEmbed = new Discord.MessageEmbed();
                newEmbed.setTitle(embedNew.title);
                newEmbed.setDescription(embedNew.description);
                newEmbed.setImage(embedNew.image);
                newEmbed.setThumbnail(embedNew.thumbnail);
                newEmbed.setURL(embedNew.url);
                embedNew = newEmbed;
                break;
            }
            case 'title': {
                embedNew.setTitle(arguments);
                break;
            }
            case 'description': {
                embedNew.setDescription(arguments);
                break;
            }
            case 'image': {
                embedNew.setImage(arguments);
                break;
            }
            case 'thumbnail': {
                embedNew.setThumbnail(arguments);
                break;
            }
            case 'url': {
                embedNew.setURL(arguments);
                break;
            }
            case 'footer': {
                embedNew.setFooter(arguments);
                break;
            }
        }
        embed.content = embedNew;
        embed = await client.embedUpdateChanged(message, embed, message.author.id);
        client.db_embeds.set(embedID, embed);
        successMessage(client.textes.get("EMBED_UPDATE_SUCCESS", embed.id, embed.titre, property), message.channel);
    };
    client.embedShowDesc = async (embedID, message) => {
        let embed = client.db_embeds.get(embedID);
        message.channel.send(`\`\`\`!embed desc ${embed.content.description}\`\`\``)
    };
    client.embedEdit = async (message, id) => {
        const guild = client.guilds.cache.get(client.config.guildID);
        let member = guild.members.cache.get(message.author.id);
        
        let embed = client.db_embeds.get(id);
        if (!embed) return errorMessage(client.textes.get("EMBED_NOT_FOUND", id), message.channel);
        if (embed.ownedBy !== member.id) return errorMessage(client.textes.get("EMBED_ERROR_NOT_OWNER", id, embed.ownedByName), message.channel);

        await client.embedArchiveCurrentEdit(message);

        embed.statut = "EDIT";
        embed = await client.embedUpdateChanged(message, embed, message.author.id);
        client.db_embeds.set(embed.id, embed);
        successMessage(client.textes.get("EMBED_EDIT_SUCCESS", embed.titre, embed.id), message.channel);
    };
    client.embedArchive = async (message, id) => {
        const guild = client.guilds.cache.get(client.config.guildID);
        let member = guild.members.cache.get(message.author.id);

        let embed = client.db_embeds.get(id);
        if (!embed) return errorMessage(client.textes.get("EMBED_NOT_FOUND", id), message.channel);
        if (embed.ownedBy !== member.id) return errorMessage(client.textes.get("EMBED_ERROR_NOT_OWNER", id, embed.ownedByName), message.channel);
        if (embed.statut == 'ARCH') return warnMessage(client.textes.get("EMBED_WARN_ALREADY_ARCHIVED", id), message.channel);


        embed.statut = 'ARCH';
        embed = await client.embedUpdateChanged(message, embed, message.author.id);
        client.db_embeds.set(id, embed);
        successMessage(client.textes.get("EMBED_ARCHIVED_SUCCESS", embed.titre, embed.id), message.channel);
    };
    client.embedArchiveCurrentEdit = async (message) => {
        const guild = client.guilds.cache.get(client.config.guildID);
        let member = guild.members.cache.get(message.author.id);
        let embedEdit = await client.embedGetCureentEdit(message.author.id);
        if (embedEdit) {
            warnMessage(client.textes.get("EMBED_CURRENT_EDIT_ARCHIVED", embedEdit), message.channel);
            await client.embedArchive(message, embedEdit.id);
        }
    };
    client.embedUpdateChanged = async (message, embed, memberID) => {
        const guild = client.guilds.cache.get(client.config.guildID);
        let member = guild.members.cache.get(message.author.id);

        if (!member) {
            errorMessage(client.textes.get("MEMBER_NOT_FOUND", memberID), message.channel);
        } else {
            let dateNow = +new Date;
            embed.changedAt = dateNow;
            embed.changedDate = moment(dateNow).format('DD.MM.YYYY');
            embed.changedTime = moment(dateNow).format('HH:mm');
            embed.changedBy = member.id;
            embed.changedByName = member.displayName;
        }
        return embed;
    };
    client.embedGetCureentEdit = async (memberID) => {
        const embedEdit = client.db_embeds.find(embed =>
            embed.statut == "EDIT" &&
            embed.ownedBy == memberID);
        if (embedEdit) {
            return embedEdit;
        } else {
            return null;
        }
    };

};