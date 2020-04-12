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
        let embeds = client.db_embeds.filter(embed => embed.auteur == message.author.id);
        let embedEdit = client.db_embeds.find(n => n.statut == "EDIT" && n.auteur == message.author.id);
        let archivedEmbeds = client.db_embeds.filterArray(embed => embed.statut == "ARCH");
        let description = client.textes.get("EMBED_USERBOARD_DESCRIPTION", embeds.size, embedEdit);
        description += "\n";
        archivedEmbeds.sort(function (a, b) {
            return a.changedAt + b.changedAt;
        });
        let lastArchivedEmebeds = archivedEmbeds.slice(0, 5);
        for (const embed of lastArchivedEmebeds) {
            description += `**${embed.id}** : ${embed.titre}\n`;
        }

        let embed = new Discord.RichEmbed()
            .setTitle(client.textes.get("EMBED_USERBOARD_TITLE", message.author.username))
            .setDescription(description);
        message.channel.send(embed);
    };
    client.embedAide = async (message) => {
        let embed = new Discord.RichEmbed()
            .setTitle(client.textes.get("EMBED_AIDE_TITLE", message.author.username))
            .setDescription(client.textes.get("EMBED_AIDE_DESCRIPTION"));
        message.channel.send(embed);
    };
    client.embedEdit = async (message, id) => {
        const embedEdit = client.db_embeds.find(n => n.statut == "EDIT" && n.auteur == message.author.id);
        if (embedEdit) {
            warnMessage(client.textes.get("EMBED_CURRENT_EDIT_ARCHIVED", embedEdit), message.channel);
            await client.embedArchive(embedEdit.id);
        }

        let embed = client.db_embeds.get(id);
        embed.statut = "EDIT";
        client.db_embeds.set(embed.id, embed);
    }
    client.embedCreate = async (message, titre) => {
        const embedEdit = client.db_embeds.find(n => n.statut == "EDIT" && n.auteur == message.author.id);
        if (embedEdit) {
            warnMessage(client.textes.get("EMBED_CURRENT_EDIT_ARCHIVED", embedEdit), message.channel);
            await client.embedArchive(embedEdit.id);
        }
        let embed = client.db_embeds.get("default");
        let key = client.db_embeds.autonum;
        const Embed = new Discord.RichEmbed().setTitle(titre);
        embed.id = key;
        embed.statut = "EDIT";
        embed.auteur = message.author.id;
        embed.titre = titre;
        embed.createdAt = +new Date;
        embed.changedAt = +new Date;
        embed.dateCreation = moment().format('DD.MM.YYYY');
        embed.content = Embed;
        client.db_embeds.set(key, embed);
        return key;
    };
    client.embedCopy = async (message, id) => {
        const embedEdit = client.db_embeds.find(n => n.statut == "EDIT" && n.auteur == message.author.id);
        if (embedEdit) {
            warnMessage(client.textes.get("EMBED_CURRENT_EDIT_ARCHIVED", embedEdit), message.channel);
            await client.embedArchive(embedEdit.id);
        }

        let embed = client.db_embeds.get(id);
        let key = client.db_embeds.autonum;
        embed.id = key;
        embed.statut = "EDIT";
        embed.createdAt = +new Date;
        embed.changedAt = +new Date;
        client.db_embeds.set(key, embed);
    };
    client.embedShow = async (embedID, message, news = false) => {
        client.embedShowChannel(embedID, message.channel, news);
    }
    client.embedShowChannel = async (embedID, channel, news = false) => {
        const guild = client.guilds.get(client.config.guildID);
        const settings = client.db_settings.get(guild.id);


        let postedMessage;
        let embed = client.db_embeds.get(embedID);
        
        if (embed) {
            let member = guild.members.get(embed.auteur);
            let Embed = new Discord.RichEmbed(embed.content);
            if (news) {
                if (member) {
                    Embed.setFooter(`Envoyé par ${member.displayName} le ${moment().format('DD.MM.YYYY')} à ${moment().format('HH:mm')}`, member.user.avatarURL);
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
    client.embedUpdate = async (embedID, property, args) => {

        let embedOrig = client.db_embeds.get(embedID);
        let embedNew = new Discord.RichEmbed(embedOrig.content);
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
                let newEmbed = new Discord.RichEmbed();
                newEmbed.setTitle(embedNew.title);
                newEmbed.setDescription(embedNew.description);
                newEmbed.setImage(embedNew.image);
                newEmbed.setThumbnail(embedNew.thumbnail);
                newEmbed.setURL(embedNew.url);
                embedNew = newEmbed;
                break;
            }
            case 'titre': {
                embedNew.setTitle(arguments);
                embedOrig.titre = arguments;
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
        embedOrig.content = embedNew;
        embedOrig.changedAt = +new Date;
        client.db_embeds.set(embedID, embedOrig);
    };
    client.embedShowDesc = async (embedID, message) => {
        let embed = client.db_embeds.get(embedID);
        message.channel.send(`\`\`\`!embed desc ${embed.content.description}\`\`\``)
    };
    client.embedArchive = async (embedID) => {
        let embed = client.db_embeds.get(embedID);
        embed.statut = 'ARCH';
        embed.changedAt = +new Date;
        client.db_embeds.set(embedID, embed);
    };

};