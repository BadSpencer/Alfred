const fs = require('fs');
const Discord = require("discord.js");
const {
    Permissions, MessageAttachment
} = require('discord.js');
const {
    Command
} = require('discord-akairo');
const {
    inspect
} = require("util");
const {
    successMessage,
    errorMessage,
    warnMessage
} = require('../../../utils/messages');
class ServerEditCommand extends Command {
    constructor() {
        super('serveredit', {
            aliases: ['serveredit', 'sedit'],
            category: 'Admin',
            userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
            description: {
                content: 'Editer un serveur de jeu',
                usage: '!sadd <id>',
            },
            split: 'quoted',
            args: [
                {
                    id: "id",
                    type: "number",
                    prompt: {
                        start: 'Veuillez saisir l\'id du serveur à editer',
                        retry: 'Ce n\'est pas un id valide!'
                    }
                },
                {
                    id: "field"
                },
                {
                    id: "value",
                    matching: "sticky",
                }
            ]
        });
    }
    async exec(message, args) {
        let client = this.client;

        let server = client.db_gameservers.get(args.id);

        if (!server) return errorMessage(`Server avec ID ${server.id} non trouvé`, message.channel);
        if (!server[args.field]) return errorMessage(`Le champs ${server.field} n'existe pas`, message.channel);


        server[args.field] = args.value;
        client.db_gameservers.set(args.id, server);


        //let serverID = await client.gameAddServer(args.game.name, args.name, args.ip, args.port, args.password);
        successMessage(client.textes.get("GAMES_SERVER_EDIT_SUCCESS", args.id), message.channel);
        message.delete();
    }

}
module.exports = ServerEditCommand;