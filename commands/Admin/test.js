const {
    Command
} = require('discord-akairo');
const { Permissions } = require('discord.js');

class TestCommand extends Command {
    constructor() {
        super('test', {
            aliases: ['test', 'tst', 'tt'],
            category: 'Admin',
            userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
            cooldown: 30000,
            ratelimit: 1,
            description: 'Commande de test',
        });
    }

    async exec(message) {
        let client = this.client;

        client.messageOfTheDay();

        if (message.channel.type === 'text') message.delete();;
    }
}


module.exports = TestCommand;