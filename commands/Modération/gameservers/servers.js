const fs = require('fs');
const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('../../../utils/datamodel');
const colors = require('../../../utils/colors');
const {
    Command
} = require('discord-akairo');
const {
    inspect
} = require("util");
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage,
    promptMessage
} = require('../../../utils/messages');

class ServersCommand extends Command {
    constructor() {
        super('servers', {
            aliases: ['servers', 'server', 'serv', 'srv', 's'],
            category: 'Modération',
            description: {
                content: 'Gestion serveurs de jeu',
                usage: '\`!servers aide\` pour avoir de l\'aide',
            },
            split: 'quoted',
            args: [
                {
                    id: "action",
                    type: [
                        'liste', 'list',
                        'supprimer', 'suppr', 'delete', 'del',
                        'score',
                        'add',
                        'view',
                        'create',
                        'active',
                        'inactive',
                        'delete',
                        'voice',
                        'statut',
                        'infos'
                    ],
                    default: "list",
                },
                {
                    id: "arguments",
                    type: "content",
                    match: "rest",
                    default: null,
                }
            ],
            description: {
                content: 'Gestion des serveurs de jeu',
                usage: '',
                examples: ['']
            }
        });
    }
    async exec(message, args) {
        let client = this.client;
        let serverID = "";


        switch (args.action) {
            case 'liste':
            case 'list':
                client.db.enmapDisplay(client, client.db_gameservers.filter(record => record.id !== "default" && record.isActive == true), message.channel, ["servername", "gamename", "ip", "port"]);
                break;
            case 'add':
                //const command = this.client.commandHandler.modules.get('serveradd');
                //this.handler.runCommand(message, command, null);
                //client.commandHandler.runCommand(message, command, null);
                break;
            case 'view':
                let server = client.db_gameservers.get(args.arguments);
                if (!server) return errorMessage(`Le serveur ${args.arguments} n'a pas été trouvé`, message.channel);
                message.channel.send(`Données de **${args.arguments}**\n\`\`\`json\n${inspect(server)}\n\`\`\``)
                break;
            case 'infos':
                client.gameServersPostInfoMessages();
                break;
            case 'supprimer':
            case 'suppr':
            case 'del':
            case 'delete':
                await client.gameServersDeleteServer(message, args.arguments);
                break;
            case 'active':
                client.db_gameservers.set(args.arguments, true, 'isActive');
                break;
            case 'inactive':
                client.db_gameservers.set(args.arguments, false, 'isActive');
                break;
        }

        if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();;
    }

}
module.exports = ServersCommand;