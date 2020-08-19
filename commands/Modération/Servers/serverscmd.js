const { Command } = require("discord-akairo");
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class ServerChatCommand extends Command {
    constructor() {
        super('server-cmd', {
            aliases: ['server-cmd', 'scmd'],
            category: 'Serveurs',
            description: {
                content: textes.get('GAMESERVER_SERVER_CMD_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMESERVER_SERVER_CMD_DESCRIPTION_USAGE'),
                examples: ['!server-cmd * SaveWorld', '!scmd 1 DestroyWildDinos']
            },
            split: 'quoted',
        });
    }

    async *args(message) {
        const serverID = yield {
            type: 'serverID',
            prompt: {
                start: async message => {
                    await this.client.db.enmapDisplay(this.client, this.client.gameServersGetActive(), message.channel, ["servername", "gamename"]);
                    return promptMessage(textes.get('GAMESERVER_SERVER_CMD_SERVER_PROMPT'))
                },
                retry: message => promptMessage(textes.get('GAMESERVER_SERVER_CMD_SERVER_RETRY')),
            }
        };
        const cmd = yield {
            match: 'rest',
            prompt: {
                start: message => {
                    return promptMessage(textes.get('GAMESERVER_SERVER_CMD_CMD_PROMPT'))
                },
            }
        };
        return { serverID, cmd };
    }

    async exec(message, args) {
        let client = this.client;

        // Constitution de la liste des serveurs
        let servers = [];
        if (args.serverID == "*") {
            servers = client.gameServersGetActive(true);
        } else {
            servers.push(client.gameServersGet(args.serverID));
        }

        for (const server of servers) {
            let response = await client.gameRconQuery(server, args.cmd);
            successMessage(`Reponse du serveur "${server.servername}": ${response}`, message.channel)
        };

        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerChatCommand;