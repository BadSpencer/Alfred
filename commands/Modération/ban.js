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
            //cooldown: 30000,
            ratelimit: 1,
            description: 'Bannir un membre (ne peut plus revenir)',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: 'Quel membre voulez vous bannir ?',
                        retry: 'Mentionnez un membre avec @ ou bien son ID',
                    },
                },
                {
                    id: 'raison',
                    type: 'rest',
                    prompt: {
                        start: 'Pour quelle raison souhaitez vous bannir ce membre ?',
                    },
                }
            ]
        });
    }

    async exec(message, args) {
        let client = this.client;

        if (args.member.hasPermission(Permissions.FLAGS.MANAGE_GUILD)) return;
        if (args.member.hasPermission(Permissions.FLAGS.MANAGE_MESSAGES)) return;

        client.userdataAddLog(args.member, message.member, "BAN", args.raison);

        args.member.kick(args.raison);
        client.serverBanNotification(args.member, message.member, args.raison);
    }
}


module.exports = BanCommand;