const {
    Command
} = require('discord-akairo');
const { Permissions } = require('discord.js');

class NoteCommand extends Command {
    constructor() {
        super('note', {
            aliases: ['note'],
            userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
            channelRestriction: 'guild',
            category: 'Modération',
            //cooldown: 30000,
            ratelimit: 1,
            description: 'Ajouter une note sur un membre',
            args: [
                {
                    id: 'userdata',
                    type: 'userdata',
                    prompt: {
                        start: 'Pour quel membre voulez vous ajouter une note ?',
                        retry: 'Mentionnez un membre avec son ID',
                    },
                },
                {
                    id: 'note',
                    type: "content",
                    match: "rest",
                    prompt: {
                        start: 'Quelle est votre note ?',
                    },
                }
            ]
        });
    }

    async exec(message, args) {
        let client = this.client;


        await client.userdataAddLog(args.userdata, message.member, "NOTE", args.note);


    }
}


module.exports = NoteCommand;