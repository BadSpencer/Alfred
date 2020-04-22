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
class ServersCommand extends Command {
    constructor() {
        super('servers', {
            aliases: ['servers', 'server', 'serv', 's'],
            category: 'Admin',
            userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
            description: {
                content: 'Gestion serveurs de jeu',
                usage: '!sadd et laissez vous guider',
            },
            split: 'quoted',
            args: [
                {
                    id: "action",
                    type: [
                        "list",
                        "score",
                        "add",
                        "view",
                        "create",
                        "active",
                        "inactive",
                        "delete",
                        "voice",
                        "statut",
                        "infos"
                    ],
                    default: "list",
                },
                {
                    id: "arguments",
                    type: "content",
                    match: "rest",
                    default: null,
                }
            ]
        });
    }
    async exec(message, args) {
        let client = this.client;


        switch (args.action) {
            case 'list':
                client.db.enmapDisplay(client, client.db_gameservers.filter(record => record.id !== "default"), message.channel, ["gamename", "name"]);
                break;
            case 'view':
                let server = client.db_gameservers.get(args.arguments);
                if (!server) return errorMessage(`Le serveur ${args.arguments} n'a pas été trouvé`, message.channel);
                message.channel.send(`Données de **${args.arguments}**\n\`\`\`json\n${inspect(server)}\n\`\`\``)
                break;
            case 'infos':
                client.gameServersPostInfoMessages();
                break;
        }

        message.delete();
    }

}
module.exports = ServersCommand;