const { Command } = require("discord-akairo");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../utils/messages');
const textes = new (require(`../../utils/textes.js`));
const steamServerStatus = require('steam-server-status');

class ServerAddCommand extends Command {
    constructor() {
        super('server-add', {
            aliases: ['server-add', 'sadd'],
            category: '🟪 Serveurs',
            split: 'quoted',
            description: {
                content: textes.get('GAMESERVER_SERVER_ADD_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMESERVER_SERVER_ADD_DESCRIPTION_USAGE'),
                examples: ['!server-add', '!sadd']
            },
        });
    }

    *args(message) {
        const game = yield {
            type: "game",
            match: 'rest',
            prompt: {
                start: message => promptMessage(textes.get('GAMESERVER_SERVER_ADD_GAME_PROMPT')),
                retry: message => promptMessage(textes.get('GAMESERVER_SERVER_ADD_GAME_RETRY')),
            }
        };
        const name = yield {
            prompt: {
                start: message => promptMessage(textes.get('GAMESERVER_SERVER_ADD_NAME_PROMPT'))
            }
        };
        const ip = yield {
            prompt: {
                start: message => promptMessage(textes.get('GAMESERVER_SERVER_ADD_IP_PROMPT'))
            }
        };
        const portrcon = yield {
            type: "number",
            prompt: {
                start: message => promptMessage(textes.get('GAMESERVER_SERVER_ADD_PORTRCON_PROMPT')),
                retry: message => promptMessage(textes.get('GAMESERVER_SERVER_VADD_PORTRCON_RETRY'))
            }
        };
        const pwdrcon = yield {
            prompt: {
                start: message => promptMessage(textes.get('GAMESERVER_SERVER_ADD_PWDRCON_PROMPT'))
            }
        };
        const portftp = yield {
            type: "number",
            prompt: {
                start: message => promptMessage(textes.get('GAMESERVER_SERVER_ADD_PORTFTP_PROMPT')),
                retry: message => promptMessage(textes.get('GAMESERVER_SERVER_ADD_PORTFTP_RETRY'))
            }
        };
        const userftp = yield {
            prompt: {
                start: message => promptMessage(textes.get('GAMESERVER_SERVER_ADD_USERFTP_PROMPT'))
            }
        };
        const pwdftp = yield {
            prompt: {
                start: message => promptMessage(textes.get('GAMESERVER_SERVER_ADD_PWDFTP_PROMPT'))
            }
        }
        return { game, name, ip, portrcon, pwdrcon, portftp, userftp, pwdftp };
    }

    async exec(message, args) {
        let client = this.client;
        await client.gameServersAddServer(message, args.game.name, args.name, args.ip, args.portrcon, args.pwdrcon, args.portftp, args.userftp, args.pwdftp);
        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerAddCommand;