const { Command } = require('discord-akairo');
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');

class ServerEditCommand extends Command {
    constructor() {
        super('server-edit', {
            aliases: ['server-edit', 'sedit'],
            category: 'Modération',
            description: {
                content: 'Editer un serveur de jeu',
                usage: '',
                examples: ['']
            },
            split: 'quoted',
        });
    }


    async *args(message) {
        let msgServerList = await this.client.db.enmapDisplay(this.client, this.client.db_gameservers.filter(record => record.id !== "default" && record.isActive == true), message.channel, ["servername", "gamename", "ip", "port"]);
        const server = yield {
            type: 'server',
            prompt: {
                start: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_EDIT_SERVER_PROMPT')),
                retry: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_EDIT_SERVER_RETRY')),
            }
        };

        let msgViewRecord = await message.channel.send(`**${server.servername}**\n\`\`\`json\n${inspect(server)}\n\`\`\``);
        const field = yield {
            prompt: {
                start: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_EDIT_FIELD_PROMPT'))
            }
        };

        const value = yield {
            prompt: {
                start: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_EDIT_VALUE_PROMPT'))
            }
        };
        // msgServerList.delete();
        // msgViewRecord.delete();
        return { server, field, value };
    }

    async exec(message, args) {
        let client = this.client;

        if (!args.server[args.field]) return errorMessage(client.textes.get('ERROR_FIELD_NOT_FOUND', args.field), message.channel);

        if (args.field == "portrcon" || args.field == "portftp") {
            args.server[args.field] = parseInt(args.value);
        } else {
            if (args.field == "isActive") {
                if (args.field == "true") {
                    args.server[args.field] = true;
                } else {
                    args.server[args.field] = false;
                }
            } else {
                args.server[args.field] = args.value;
            }
        }
        client.db_gameservers.set(args.server.id, args.server);

        successMessage(client.textes.get('GAMESERVER_SERVER_EDIT_SUCCESS', args.server), message.channel);
        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerEditCommand;