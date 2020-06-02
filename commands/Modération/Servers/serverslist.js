const { Command } = require('discord-akairo');
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class ServerListCommand extends Command {
    constructor() {
        super('server-list', {
            aliases: ['server-list', 'slist'],
            category: 'Modération-server',
            description: {
                content: textes.get('GAMESERVER_SERVER_LIST_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMESERVER_SERVER_LIST_DESCRIPTION_USAGE'),
                examples: ['!server-list','!slist']
            },
            split: 'quoted',
        });
    }


    *args(message) {

    }

    async exec(message, args) {
        let client = this.client;
        await client.db.enmapDisplay(client, client.gameServersGetAll(), message.channel, ["servername", "isActive", "gamename"]);
        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerListCommand;