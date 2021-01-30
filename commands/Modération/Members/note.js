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

class NoteCommand extends Command {
    constructor() {
        super("note", {
            aliases: ["note"],
            category: "Modération",
            description: {
                content: textes.get("USER_NOTE_DESCRIPTION_CONTENT"),
                usage: textes.get("USER_NOTE_DESCRIPTION_USAGE"),
                examples: ['']
            }
        });
    }

    async *args(message) {
        const member = yield {
            type: "member",
            prompt: {
                start: message => promptMessage(textes.get('USER_NOTE_MEMBER_PROMPT')),
                retry: message => promptMessage(textes.get('USER_NOTE_MEMBER_RETRY'))
            }
        };

        const note = yield {
            type: "string",
            prompt: {
                start: message => promptMessage(textes.get("USER_NOTE_NOTE_PROMPT", member))
            }
        };
        
        return {
            member,
            note
        };
    }

    async exec(message, args) {
        this.client.memberLogNote(args.member.id, message.author.id, args.note);
        this.client.modLog(this.client.textes.get("MOD_NOTIF_MEMBER_NEW_NOTE", args.member, message.member, args.note));
    }
}


module.exports = NoteCommand;