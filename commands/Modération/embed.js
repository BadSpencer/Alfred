const colors = require('../../utils/colors');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('../../utils/messages');



// Required things for using Embeds and extending Akairo Command
const { Permissions } = require('discord.js');
const {
    Command
} = require('discord-akairo');

class EmbedCommand extends Command {
    constructor() {
        super('embed', {
            aliases: ['embed', 'em'],
            userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
            channelRestriction: 'dm',
            // define arg properties
            category: 'Modérations',
            args: [{
                id: "action",
                type: [
                    "userboard", "board", "ub",
                    "aide",
                    "liste", "list", "ls", "listall",
                    "ajouter", "ajout", "aj", "add",
                    "edit", "editer",
                    "titre",
                    "image", "img",
                    "thumb", "thumbnail",
                    "showdesc", "desc", "description",
                    "addfield", "af",
                    "clearfields", "cf",
                    "footer", "foot",
                    "url",
                    "copier", "copy",
                    "afficher", "aff", "view",
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
            ]
        });
    }




    async exec(message, args) {
        let client = this.client;
        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);
        let embedEdit = client.db_embeds.find(n => n.statut == "EDIT" && n.auteur == message.author.id);

        switch (args.action) {
            case "ub":
            case "board":
            case "userboard": {
                client.embeds.userboard(client, message);
                break;
            }
            case "aide": {
                client.embeds.aide(client, message);
                break;
            }
            case "liste":
            case "list":
            case "ls": {

                client.db.enmapDisplay(client, client.db_embeds.filter(embed => embed.auteur == message.author.id), message.channel);
                break;
            }
            case "listall": {
                client.db.enmapDisplay(client, client.db_embeds, message.channel);
                break;
            }
            case "ajouter":
            case "ajout":
            case "aj":
            case "add": {
                const titre = args.arguments;
                let embedID = await client.embeds.createEmbed(client, message, titre);
                successMessage(client.textes.get("EMBED_CREATION_SUCCESS", titre, embedID), message.channel);
                await client.embeds.showEmbed(client, embedID, message.channel);
                break;
            }
            case "edit":
            case "editer": {
                await client.embeds.editEmbed(client, message, args.arguments);
                break;
            }
            case "copy":
            case "copier": {
                await client.embeds.copyEmbed(client, message, args.arguments);
                break;
            }
            case "titre": {
                if (embedEdit) {
                    await client.embeds.updateEmbed(client, embedEdit.id, "titre", args.arguments);
                    await client.embeds.showEmbed(client, embedEdit.id, message.channel);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            }
            case "img":
            case "image": {
                if (embedEdit) {
                    await client.embeds.updateEmbed(client, embedEdit.id, "image", args.arguments);
                    await client.embeds.showEmbed(client, embedEdit.id, message.channel);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            }
            case "thumb":
            case "thumbnail": {
                if (embedEdit) {
                    await client.embeds.updateEmbed(client, embedEdit.id, "thumbnail", args.arguments);
                    await client.embeds.showEmbed(client, embedEdit.id, message.channel);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            }
            case "desc":
            case "description": {
                if (embedEdit) {
                    await client.embeds.updateEmbed(client, embedEdit.id, "description", args.arguments);
                    await client.embeds.showEmbed(client, embedEdit.id, message.channel);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            }
            case "showdesc": {
                if (embedEdit) {
                    await client.embeds.showEmbedDesc(client, embedEdit.id, message);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            }
            case "af":
            case "addfield":
                if (embedEdit) {
                    await client.embeds.updateEmbed(client, embedEdit.id, "addfield", args.arguments);
                    await client.embeds.showEmbed(client, embedEdit.id, message.channel);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            case "cf":
            case "clearfields":
                if (embedEdit) {
                    await client.embeds.updateEmbed(client, embedEdit.id, "clearfields", args.arguments);
                    await client.embeds.showEmbed(client, embedEdit.id, message.channel);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            case "foot":
            case "footer": {
                if (embedEdit) {
                    await client.embeds.updateEmbed(client, embedEdit.id, "footer", args.arguments);
                    await client.embeds.showEmbed(client, embedEdit.id, message.channel);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            }
            case "url": {
                if (embedEdit) {
                    await client.embeds.updateEmbed(client, embedEdit.id, "url", args.arguments);
                    await client.embeds.showEmbed(client, embedEdit.id, message.channel);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            }
            case "aff":
            case "afficher":
            case "view": {
                if (args.arguments) {
                    await client.embeds.showEmbed(client, args.arguments, message.channel);
                } else {
                    if (embedEdit) {
                        await client.embeds.showEmbed(client, embedEdit.id, message.channel);
                    }
                }
                break;
            }
            case "notitle":
            case "titleoff":
                if (embedEdit) {
                    embedEdit.showTitle = false;
                    client.db_embeds.set(embedEdit.id, embedEdit);
                }
                await client.embeds.showEmbed(client, embedEdit.id, message.channel);
                break;
            case "titleon":
                if (embedEdit) {
                    embedEdit.showTitle = true;
                    client.db_embeds.set(embedEdit.id, embedEdit);
                }
                await client.embeds.showEmbed(client, embedEdit.id, message.channel);
                break;
            case "nofooter":
            case "footeroff":
                if (embedEdit) {
                    embedEdit.showFooter = false;
                    client.db_embeds.set(embedEdit.id, embedEdit);
                }
                await client.embeds.showEmbed(client, embedEdit.id, message.channel);
                break;
            case "footeron":
                if (embedEdit) {
                    embedEdit.showFooter = true;
                    client.db_embeds.set(embedEdit.id, embedEdit);
                }
                await client.embeds.showEmbed(client, embedEdit.id, message.channel);
                break;
            case "arch":
            case "archiver": {
                if (embedEdit) {
                    await client.embeds.archiveEmbed(client, embedEdit.id);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            }
        }
        message.delete();
    }
}


module.exports = EmbedCommand;