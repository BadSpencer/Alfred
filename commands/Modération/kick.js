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
            //cooldown: 30000,
            ratelimit: 1,
            description: 'Expluser un membre (peut revenir)',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: 'Quel membre voulez vous expulser ?',
                        retry: 'Mentionnez un membre avec @ ou bien son ID',
                    },
                },
                {
                    id: 'raison',
                    type: 'rest',
                    prompt: {
                        start: 'Pour quelle raison souhaitez vous expluser ce membre ?',
                    },
                }
            ]
        });
    }

    async exec(message, args) {
        let client = this.client;

        if (args.member.hasPermission(Permissions.FLAGS.MANAGE_GUILD)) return;
        if (args.member.hasPermission(Permissions.FLAGS.MANAGE_MESSAGES)) return;

        client.userdataAddLog(args.member, message.member, "KICK", args.raison);

        args.member.kick(args.raison);
    }
}


module.exports = KickCommand;