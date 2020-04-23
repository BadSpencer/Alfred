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
                    id: 'userdata',
                    type: 'userdata',
                    prompt: {
                        start: 'Quel membre souhaitez vous expulser ?',
                        retry: 'Mentionnez un membre avec son ID',
                    },
                },
                {
                    id: 'raison',
                    type: "content",
                    match: "rest",
                    prompt: {
                        start: 'Pour quelle raison souhaitez vous expluser ce membre ?',
                    },
                }
            ]
        });
    }

    async exec(message, args) {
        let client = this.client;
        const guild = client.guilds.get(client.config.guildID);
        let member = guild.members.get(args.userdata.id);

        if (!member) return;
        if (member.hasPermission(Permissions.FLAGS.MANAGE_GUILD)) return;
        if (member.hasPermission(Permissions.FLAGS.MANAGE_MESSAGES)) return;

        client.userdataAddLog(args.userdata, message.member, "KICK", args.raison);

        member.kick(args.raison);
        client.serverKickNotification(member, message.member, args.raison);
    }
}


module.exports = KickCommand;