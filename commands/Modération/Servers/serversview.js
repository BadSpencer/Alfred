const { Command } = require('discord-akairo');
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');

class ServerViewCommand extends Command {
    constructor() {
        super('server-view', {
            aliases: ['server-view', 'sview'],
            category: 'Modération',
            description: {
                content: `Afficher l'enregistrement d'un serveur de jeu`,
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
        await message.channel.send(`**${args.server.servername}**\n\`\`\`json\n${inspect(args.server)}\n\`\`\``);
        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerViewCommand;