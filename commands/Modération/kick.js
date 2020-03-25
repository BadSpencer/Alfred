const {
    Command
} = require('discord-akairo');
const { Permissions } = require('discord.js');

class KickCommand extends Command {
    constructor() {
        super('kick', {
            aliases: ['kick'],
            userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
            category: 'Modération',
            cooldown: 30000,
            ratelimit: 1,
            description: 'Récupérer les logs',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: null
                }
            ]
        });
    }

    async exec(message, args) {
        let client = this.client;

    }
}


module.exports = KickCommand;