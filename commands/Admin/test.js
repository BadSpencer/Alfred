const {
    Command
} = require('discord-akairo');
const { Permissions } = require('discord.js');
const steamServerStatus = require('steam-server-status');

class TestCommand extends Command {
    constructor() {
        super('test', {
            aliases: ['test'],
            category: 'Admin',
            cooldown: 30000,
            ratelimit: 1,
            description: 'Commande de test',
        });
    }

    async exec(message) {
        let client = this.client;

        client.messageOfTheDay();

        // steamServerStatus.getServerStatus(
        //     "176.57.171.214", "29215", function (serverInfo) {
        //       if (serverInfo.error) {
        //         client.log(serverInfo.error, 'error');
        //       } else {
        //         let regExp = /\(([^)]+)\)/;
        //         let matches = regExp.exec(serverInfo.serverName);
        //       }
        //     });


        if (message.channel.type === 'text') message.delete();;
    }
}


module.exports = TestCommand;