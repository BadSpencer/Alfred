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
                    id: 'userdata',
                    type: 'userdata',
                    prompt: {
                        start: 'Quel membre souhaitez vous bannir ?',
                        retry: 'Mentionnez un membre avec son ID',
                    },
                },
                {
                    id: 'raison',
                    type: "content",
                    match: "rest",
                    prompt: {
                        start: 'Pour quelle raison souhaitez vous bannir ce membre ?',
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

        client.userdataAddLog(args.userdata, message.member, "BAN", args.raison);

        member.ban(args.raison);
        client.serverBanNotification(amember, message.member, args.raison);
    }
}


module.exports = BanCommand;