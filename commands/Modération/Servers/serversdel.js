const { Command } = require('discord-akairo');
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class ServerDelCommand extends Command {
    constructor() {
        super('server-del', {
            aliases: ['server-del', 'sdel'],
            category: 'Serveurs',
            split : 'quoted',
            description: {
                content: textes.get('GAMESERVER_SERVER_DEL_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMESERVER_SERVER_DEL_DESCRIPTION_USAGE'),
                examples: ['Ne pas utiliser']
              },
        });
    }

    async *args(message) {
        const server = yield {
            type: "server",
            prompt: {
                start: async message => { 
                    await this.client.db.enmapDisplay(this.client, this.client.gameServersGetAll(), message.channel, ["servername", "gamename"]);
                    return promptMessage(textes.get('GAMESERVER_SERVER_DEL_SERVER_PROMPT'))
                },
                retry: message => promptMessage(textes.get('GAMESERVER_SERVER_DEL_SERVER_RETRY'))
            }
        };
        const confirmation = yield {
            type: 'ouinon',
            prompt: {
                start: message => promptMessage(textes.get('GAMESERVER_SERVER_DEL_CONFIRMATION_PROMPT')),
                retry: message => promptMessage(textes.get('GAMESERVER_SERVER_DEL_CONFIRMATION_RETRY'))
            }
        };
        return { server, confirmation };
    }

    async exec(message, args) {
        let client = this.client;

        if (args.confirmation == 'oui') {
            client.gameServersDeleteServer(message, args.server);
        } else {
            warnMessage(textes.get("COM_ACTION_ANNULLE"), message.channel);
        }

        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerDelCommand;