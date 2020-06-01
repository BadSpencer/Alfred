const { Command } = require('discord-akairo');

class ServersCommand extends Command {
    constructor() {
        super('servers', {
            aliases: ['servers', 'server', 'serv', 'srv', 's'],
            category: 'Modération',
            description: {
                content: 'Affiche la liste des serveurs',
                usage: '',
                examples: ['']
            }
        });
    }
    async exec(message, args) {
        let client = this.client;
        client.db.enmapDisplay(client, client.db_gameservers.filter(record => record.id !== "default" && record.isActive == true), message.channel, ["servername", "gamename", "ip", "port"]);
        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServersCommand;