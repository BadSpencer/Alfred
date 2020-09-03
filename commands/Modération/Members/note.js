const {
    Command
} = require("discord-akairo");
const { Permissions } = require("discord.js");
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage,
    promptMessage
} = require('../../../utils/messages');
const colors = require('../../../utils/colors');

class NoteCommand extends Command {
    constructor() {
        super('note', {
            aliases: ['note'],
            category: 'Modération',
            description: 'Ajouter une note sur un membre',
            args: [
                {
                    id: 'userdata',
                    type: 'userdata',
                    prompt: {
                        start: message => promptMessage('Pour quel membre voulez vous ajouter une note ?'),
                        retry: message => promptMessage('Mentionnez un membre avec son ID'),
                    },
                },
                {
                    id: 'note',
                    type: "content",
                    match: "rest",
                    prompt: {
                        start: message => promptMessage('Quelle est votre note ?'),
                    },
                }
            ],
            description: {
                content: 'Ajouter une note sur un membre',
                usage: '',
                examples: ['']
              }
        });
    }

    async exec(message, args) {
        let client = this.client;
        const guild = client.getGuild();
        let member = guild.members.cache.get(args.userdata.id);

        if (!member) return errorMessage(client.textes.get("USER_ERROR_NOT_A_MEMBER", args.userdata.displayName), message.channel);

        client.memberLogNote(member, message.member, args.note);
        client.modLog(client.textes.get("MOD_NOTIF_MEMBER_NEW_NOTE", member, message.member, args.note));
    }
}


module.exports = NoteCommand;