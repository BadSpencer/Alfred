const { Command } = require('discord-akairo');
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');

class ServerDelCommand extends Command {
    constructor() {
        super('server-del', {
            aliases: ['server-del', 'sdel'],
            category: 'Modération',
            split : 'quoted',
            description: {
                content: `Supprime un serveur de jeu.
                A n'utiliser qu'en cas d'erreur dans la base. Un serveur ne doit pas être supprimé mais désactivé.`,
                usage: '',
                examples: ['']
              },
        });
    }

    async *args(message) {
        let msgServerList = await this.client.db.enmapDisplay(this.client, this.client.db_gameservers.filter(record => record.id !== "default" && record.isActive == true), message.channel, ["servername", "gamename", "ip", "port"]);
        const server = yield {
            type: "server",
            prompt: {
                start: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_DEL_SERVER_PROMPT')),
                retry: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_DEL_SERVER_RETRY'))
            }
        };
        const confirmation = yield {
            type: 'ouinon',
            prompt: {
                start: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_DEL_CONFIRMATION_PROMPT')),
                retry: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_DEL_CONFIRMATION_RETRY'))
            }
        };
        return { server, confirmation };
    }

    async exec(message, args) {
        let client = this.client;

        if (args.confirmation == 'oui') {
            await client.gameServersDeleteServer(message, args.server);
        } else {
            warnMessage(client.textes.get("COM_ACTION_ANNULLE"), message.channel);
        }

    
        if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();;
    }

}
module.exports = ServerDelCommand;