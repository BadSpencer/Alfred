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
} = require('../../utils/messages');
const colors = require('../../utils/colors');
const textes = new (require(`../../utils/textes.js`));

class NoteCommand extends Command {
    constructor() {
        super('note-add', {
            aliases: ['note-add', 'notes-add', 'nadd'],
            category: '🟪 Membres',
            description: {
                content: textes.get("USER_NOTEADD_DESCRIPTION_CONTENT"),
                usage: textes.get("USER_NOTEADD_DESCRIPTION_USAGE"),
                examples: ['']
            }
        });
    }

    async *args(message) {
        const userdata = yield {
            type: "userdata",
            prompt: {
                start: message => promptMessage(textes.get('USER_NOTEADD_MEMBER_PROMPT')),
                retry: message => promptMessage(textes.get('USER_NOTEADD_MEMBER_RETRY'))
            }
        };

        const note = yield {
            type: "string",
            prompt: {
                start: message => promptMessage(textes.get("USER_NOTEADD_NOTE_PROMPT", this.client.memberGetDisplayNameByID(userdata.id)))
            }
        };
        
        return {
            userdata,
            note
        };
    }

    async exec(message, args) {
        this.client.memberLogNote(args.userdata.id, message.author.id, args.note);
        this.client.modLog(this.client.textes.get("MOD_NOTIF_MEMBER_NEW_NOTE", this.client.memberGetDisplayNameByID(args.userdata.id), this.client.memberGetDisplayNameByID(message.author.id), args.note));
    }
}


module.exports = NoteCommand;