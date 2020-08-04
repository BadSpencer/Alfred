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
const textes = new(require(`../../../utils/textes.js`));
const datamodel = require('../../../utils/datamodel');
const ftpClient = require('ftp');
const steamServerStatus = require('steam-server-status');

class ServerConfigCommand extends Command {
    constructor() {
        super('server-config', {
            aliases: ['server-config', 'sconfig'],
            category: 'Serveurs',
            description: {
                content: textes.get('GAMESERVER_SERVER_VIEW_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMESERVER_SERVER_VIEW_DESCRIPTION_USAGE'),
                examples: ['!server-view', '!sview 1']
            },
            split: 'quoted',
        });
    }


    async *args(message) {
        // const server = yield {
        //     type: 'server',
        //     prompt: {
        //         start: async message => {
        //             await this.client.db.enmapDisplay(this.client, this.client.gameServersGetActive(), message.channel, ["servername", "gamename"]);
        //             return promptMessage(textes.get('GAMESERVER_SERVER_VIEW_SERVER_PROMPT'))
        //         },
        //         retry: message => promptMessage(textes.get('GAMESERVER_SERVER_VIEW_SERVER_RETRY')),
        //     }
        // };
        // return {
        //     server
        // };
    }

    async exec(message, args) {
        let client = this.client;

        let servers = client.gameServersGetActive().array();

        for (const server of servers) {
            client.gameserverGetConfig(server, false);
        }

        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerConfigCommand;