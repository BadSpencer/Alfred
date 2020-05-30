const { Command } = require('discord-akairo');
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');

class ServerSessionsCommand extends Command {
    constructor() {
        super('server-sessions', {
            aliases: ['server-sessions', 'server-sess', 'ssessions', 'ssess'],
            category: 'Modération',
            description: {
                content: `Afficher les sessions de jeu d'un serveur`,
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
                start: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_VIEW_SERVER_PROMPT')),
                retry: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_VIEW_SERVER_RETRY')),
            }
        };

        // msgServerList.delete();
        return { server };
    }

    async exec(message, args) {
        let client = this.client;
        
        








        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerSessionsCommand;