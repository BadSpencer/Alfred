const { Command } = require("discord-akairo");
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class ServerChatCommand extends Command {
    constructor() {
        super('server-chat', {
            aliases: ['server-chat', 'schat'],
            category: 'Serveurs',
            description: {
                content: textes.get('GAMESERVER_SERVER_CHAT_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMESERVER_SERVER_CHAT_DESCRIPTION_USAGE'),
                examples: ['!server-chat * Bonjour à tous', '!schat 1 Le serveur doit être rebooté']
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
                    return promptMessage(textes.get('GAMESERVER_SERVER_CHAT_SERVER_PROMPT'))
                },
                retry: message => promptMessage(textes.get('GAMESERVER_SERVER_CHAT_SERVER_RETRY')),
            }
        };

        const msg = yield {
            match: 'rest',
            prompt: {
                start: message => {
                    return promptMessage(textes.get('GAMESERVER_SERVER_CHAT_MSG_PROMPT'))
                },
            }
        };


        return { serverID, msg };
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

        // Normalisation du message (accents et carzctères spéciaux)
        let sendmess = `ServerChat ${args.msg.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;
        for (const server of servers) {
            client.gameRconQuery(server, sendmess);
        };


        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerChatCommand;