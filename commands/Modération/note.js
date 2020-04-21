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
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: 'Quel membre voulez vous expulser ?',
                        retry: 'Mentionnez un membre avec @ ou bien son ID',
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

        await client.userdataAddLog(args.member, message.member, "NOTE", args.note);


    }
}


module.exports = NoteCommand;