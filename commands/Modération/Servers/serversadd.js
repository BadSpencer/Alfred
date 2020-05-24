const { Command } = require('discord-akairo');

class ServerAddCommand extends Command {
    constructor() {
        super('server-add', {
            aliases: ['server-add', 'sadd'],
            category: 'Modération',
            split : 'quoted',
            description: {
                content: `Ajouter un serveur de jeu`,
                usage: `Lancez la commande sans paramètre et laissez-vous guider`,
                examples: ['!server-add', '!sadd']
              },
        });
    }

    *args(message) {
        const game = yield {
            type: "game",
            match: 'rest',
            prompt: {
                start: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_ADD_GAME_PROMPT')),
                retry: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_ADD_GAME_RETRY')),
            }
        };
        const name = yield {
            prompt: {
                start: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_VIEW_NAME_PROMPT'))
            }
        };
        const ip = yield {
            prompt: {
                start: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_VIEW_IP_PROMPT'))
            }
        };
        const portrcon = yield {
            type: "number",
            prompt: {
                start: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_VIEW_PORTRCON_PROMPT')),
                retry: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_VIEW_PORTRCON_RETRY'))
            }
        };
        const pwdrcon = yield {
            prompt: {
                start: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_VIEW_PWDRCON_PROMPT'))
            }
        };
        const portftp = yield {
            type: "number",
            prompt: {
                start: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_VIEW_PORTFTP_PROMPT')),
                retry: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_VIEW_PORTFTP_RETRY'))
            }
        };
        const userftp = yield {
            prompt: {
                start: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_VIEW_USERFTP_PROMPT'))
            }
        };
        const pwdftp = yield {
            prompt: {
                start: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_VIEW_PWDFTP_PROMPT'))
            }
        }
        return { game, name, ip, portrcon, pwdrcon, portftp, userftp, pwdftp };
    }

    async exec(message, args) {
        let client = this.client;
        await client.gameServersAddServer(message, args.game.name, args.name, args.ip, args.portrcon, args.pwdrcon, args.portftp, args.userftp, args.pwdftp);
        if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();;
    }

}
module.exports = ServerAddCommand;