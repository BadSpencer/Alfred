const colors = require('../../utils/colors');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('../../utils/messages');

// Translations
const {
    MESSAGES
} = require('../../localization/fr');
const channels = require('../../localization/channels');
const permissions = require('../../localization/permissions');

// Required things for using Embeds and extending Akairo Command
const {
    RichEmbed
} = require('discord.js');
const {
    Command
} = require('discord-akairo');

class EmbedCommand extends Command {
    constructor() {
        super('embed', {
            aliases: ['embed', 'em'],
            // define arg properties
            category: 'Modération',
            args: [{
                    id: "action",
                    type: [
                        "userboard", "board", "ub",
                        "aide",
                        "liste", "list", "ls",
                        "ajouter", "ajout", "aj", "add",
                        "titre",
                        "image", "img",
                        "thumb", "thumbnail",
                        "showdesc", "desc", "description",
                        "footer", "foot",
                        "url",
                        "copier", "copy", "edit",
                        "afficher", "aff", "view",
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
                    await client.embeds.showEmbedDesc(client, embedID, message.channel);
                } else {
                    errorMessage(client.textes.get("EMBED_EDIT_NOEDITEMBED"), message.channel);
                }
                break;
            }
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
    }
}


module.exports = EmbedCommand;