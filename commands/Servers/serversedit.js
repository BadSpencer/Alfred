const { Command } = require("discord-akairo");
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../utils/messages');
const fetch = require("node-fetch");
const textes = new (require(`../../utils/textes.js`));

class ServerEditCommand extends Command {
    constructor() {
        super('server-edit', {
            aliases: ['server-edit', 'sedit'],
            category: '🟪 Serveurs',
            description: {
                content: textes.get('GAMESERVER_SERVER_EDIT_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMESERVER_SERVER_EDIT_DESCRIPTION_USAGE'),
                examples: ['!server-edit', '!sedit']
            },
            split: 'quoted',
        });
    }


    async *args(message) {
        const server = yield {
            type: 'server',
            prompt: {
                start: async message => { 
                    await this.client.db.enmapDisplay(this.client, this.client.gameServersGetActive(), message.channel, ["servername", "gamename"]);
                    return promptMessage(textes.get('GAMESERVER_SERVER_EDIT_SERVER_PROMPT'))
                },
                retry: message => promptMessage(textes.get('GAMESERVER_SERVER_EDIT_SERVER_RETRY')),
            }
        };

        const field = yield {
            prompt: {
                start: async message => { 
                    await message.channel.send(`**${server.servername}**\n\`\`\`json\n${inspect(server)}\n\`\`\``);
                    return promptMessage(textes.get('CMD_EDIT_FIELD_PROMPT')) 
            },
            }
        };

        const value = yield {
            prompt: {
                start: message => promptMessage(textes.get('CMD_EDIT_VALUE_PROMPT'))
            }
        };

        return { server, field, value };
    }

    async exec(message, args) {
        let client = this.client;

        if (!args.server[args.field]) return errorMessage(textes.get('ERROR_FIELD_NOT_FOUND', args.field), message.channel);

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
        if (args.field == 'ip' || args.field == 'portrcon' || args.filed == 'pwdrcon') {
            let urlshortener = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURI(`steam://connect/${args.server.ip}:${args.server.portrcon}/`)}`);
            args.server.steamlink = await urlshortener.text();
        };
        client.db_gameservers.set(args.server.id, args.server);

        successMessage(client.textes.get('GAMESERVER_SERVER_EDIT_SUCCESS', args.server), message.channel);
        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerEditCommand;