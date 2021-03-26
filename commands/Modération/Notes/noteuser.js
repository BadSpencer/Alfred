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
const textes = new (require(`../../../utils/textes.js`));

class NoteUserCommand extends Command {
    constructor() {
        super('note-user', {
            aliases: ['note-user', 'notes-user', 'notes', 'nuser'],
            category: '🟪 Membres',
            description: {
                content: textes.get("USER_NOTE_DESCRIPTION_CONTENT"),
                usage: textes.get("USER_NOTE_DESCRIPTION_USAGE"),
                examples: ['']
            }
        });
    }

    async *args(message) {
        const userdata = yield {
            type: "userdata",
            prompt: {
                start: message => promptMessage(textes.get('USER_MEMBER_PROMPT')),
                retry: message => promptMessage(textes.get('USER_MEMBER_RETRY'))
            }
        };
        return {
            userdata
        };
    }

    async exec(message, args) {
        this.client.memberNotesPost(args.userdata.id, message.channel);
    }
}


module.exports = NoteUserCommand;