const colors = require('../../../utils/colors');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('../../../utils/messages');



// Required things for using Embeds and extending Akairo Command
const { Permissions } = require('discord.js');
const {
    Command
} = require("discord-akairo");

class EmbedCommand extends Command {
    constructor() {
        super('embed', {
            aliases: ['embed', 'em'],
            category: 'Modération',
            args: [{
                id: "action",
                type: [
                    "userboard", "board", "ub",
                    "aide",
                    "liste", "list", "ls",
                    "listall", "listeall",
                    "ajouter", "ajout", "aj", "add",
                    "edit", "editer",
                    "titre",
                    "title",
                    "image", "img",
                    "thumb", "thumbnail",
                    "showdesc", "desc", "description",
                    "addfield", "af",
                    "clearfields", "cf",
                    "footer", "foot",
                    "url",
                    "copier", "copy",
                    "afficher", "aff", "view",
                    "supprimer", "suppr", "del",
                    "delforce",
                    "notitle", "titleoff",
                    "titleon",
                    "nofooter", "footeroff",
                    "footeron",
                    "arch", "archiver"
                ],
                default: "userboard",
            },
            {
                id: "arguments",
                type: "content",
                match: "rest",
                default: null,
            },
            ],
            description: {
                content: 'Gestion des messages de type "Embed"',
                usage: '',
                examples: ['']
            }
        });
    }




    async exec(message, args) {
        let client = this.client;
        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = await client.db.getSettings(client);
        let embedEdit = await client.embedGetCureentEdit(message.author.id);

        switch (args.action) {
            case "ub":
            case "board":
            case "userboard": {
                client.embedUserboard(message);
                break;
            }
            case "aide": {
                client.embedAide(message);
                break;
            }
            case "liste":
            case "list":
            case "ls": {

                client.db.enmapDisplay(client, client.db_embeds.filter(embed => embed.ownedBy == message.author.id), message.channel, ["titre"]);
                break;
            }
            case 'listeall':
            case "listall": {
                client.db.enmapDisplay(client, client.db_embeds.filter(embed => embed.ownedBy !== ""), message.channel, ["titre", "ownedByName"]);
                break;
            }
            case "ajouter":
            case "ajout":
            case "aj":
            case "add": {
                const titre = args.arguments;
                let embedID = await client.embedCreate(message, titre);
                await client.embedShow(embedID, message);
                break;
            }
            case "edit":
            case "editer": {
                await client.embedEdit(message, args.arguments);

                break;
            }
            case "copy":
            case "copier": {
                await client.embedCopy(message, args.arguments);

                break;
            }
            case 'supprimer':
            case 'suppr':
            case 'del':

                break;
            case 'delforce':
                client.db_embeds.delete(args.arguments);

                break;
            case "titre":
                if (embedEdit) {
                    embedEdit.titre = args.arguments;
                    embedEdit = await client.embedUpdateChanged(message, embedEdit, message.author.id);
                    client.db_embeds.set(embedEdit.id, embedEdit);
                }
                await client.embedShow(embedEdit.id, message);
                break;
            case "title": {
                if (embedEdit) {
                    await client.embedUpdate(embedEdit.id, "title", args.arguments, message);
                    await client.embedShow(embedEdit.id, message);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            }
            case "img":
            case "image": {
                if (embedEdit) {
                    await client.embedUpdate(embedEdit.id, "image", args.arguments, message);
                    await client.embedShow(embedEdit.id, message);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            }
            case "thumb":
            case "thumbnail": {
                if (embedEdit) {
                    await client.embedUpdate(embedEdit.id, "thumbnail", args.arguments, message);
                    await client.embedShow(embedEdit.id, message);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            }
            case "desc":
            case "description": {
                if (embedEdit) {
                    await client.embedUpdate(embedEdit.id, "description", args.arguments, message);
                    await client.embedShow(embedEdit.id, message);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            }
            case "showdesc": {
                if (embedEdit) {
                    await client.embedShowDesc(embedEdit.id, message);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            }
            case "af":
            case "addfield":
                if (embedEdit) {
                    await client.embedUpdate(embedEdit.id, "addfield", args.arguments, message);
                    await client.embedShow(embedEdit.id, message);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            case "cf":
            case "clearfields":
                if (embedEdit) {
                    await client.embedUpdate(embedEdit.id, "clearfields", args.arguments, message);
                    await client.embedShow(embedEdit.id, message);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            case "foot":
            case "footer": {
                if (embedEdit) {
                    await client.embedUpdate(embedEdit.id, "footer", args.arguments, message);
                    await client.embedShow(embedEdit.id, message);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            }
            case "url": {
                if (embedEdit) {
                    await client.embedUpdate(embedEdit.id, "url", args.arguments, message);
                    await client.embedShow(embedEdit.id, message);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            }
            case "aff":
            case "afficher":
            case "view": {
                if (args.arguments) {
                    await client.embedShow(args.arguments, message);
                } else {
                    if (embedEdit) {
                        await client.embedShow(embedEdit.id, message);
                    }
                }
                break;
            }
            case "notitle":
            case "titleoff":
                if (embedEdit) {
                    embedEdit.showTitle = false;
                    embedEdit.changedAt = +new Date;
                    client.db_embeds.set(embedEdit.id, embedEdit);
                }
                await client.embedShow(embedEdit.id, message);
                break;
            case "titleon":
                if (embedEdit) {
                    embedEdit.showTitle = true;
                    embedEdit.changedAt = +new Date;
                    client.db_embeds.set(embedEdit.id, embedEdit);
                }
                await client.embedShow(embedEdit.id, message);
                break;
            case "nofooter":
            case "footeroff":
                if (embedEdit) {
                    embedEdit.showFooter = false;
                    embedEdit.changedAt = +new Date;
                    client.db_embeds.set(embedEdit.id, embedEdit);
                }
                await client.embedShow(embedEdit.id, message);
                break;
            case "footeron":
                if (embedEdit) {
                    embedEdit.showFooter = true;
                    embedEdit.changedAt = +new Date;
                    client.db_embeds.set(embedEdit.id, embedEdit);
                }
                await client.embedShow(embedEdit.id, message);
                break;
            case "arch":
            case "archiver": {
                if (embedEdit) {
                    await client.embedArchive(message, embedEdit.id);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            }
        }
        if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();;
    }
}


module.exports = EmbedCommand;