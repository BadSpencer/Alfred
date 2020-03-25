const {
    Command
} = require('discord-akairo');
const { Permissions } = require('discord.js');

class BanCommand extends Command {
    constructor() {
        super('ban', {
            aliases: ['ban'],
            userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
            category: 'Modération',
            cooldown: 30000,
            ratelimit: 1,
            description: 'Bannir un membre (ne peut plus revenir)',
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


module.exports = BanCommand;