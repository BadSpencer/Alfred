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
        super("warn", {
            aliases: ["warn"],
            category: '🟪 Membres',
            description: {
                content: textes.get("USER_WARN_DESCRIPTION_CONTENT"),
                usage: textes.get("USER_WARN_DESCRIPTION_USAGE"),
                examples: ['']
            }
        });
    }

    async *args(message) {
        const member = yield {
            type: "member",
            prompt: {
                start: message => promptMessage(textes.get('USER_MEMBER_PROMPT')),
                retry: message => promptMessage(textes.get('USER_MEMBER_RETRY'))
            }
        };

        const note = yield {
            type: "string",
            prompt: {
                start: message => promptMessage(textes.get("USER_WARN_NOTE_PROMPT", member))
            }
        };

        return {
            member,
            note
        };
    }

    async exec(message, args) {
        let userdata = this.client.userdataGet(args.member.id);

        if (userdata) {
            userdata.warn += 1;
        };
        this.client.userdataSet(userdata);

        let note = `⚠️ ${args.note}`;
        this.client.memberLogNote(args.member.id, message.author.id, note);
        args.member.send(`Vous avez reçu un avertissement de la part de ${this.client.memberGetDisplayNameByID(message.member.id)}.
        Raison: ${args.note}`)
        this.client.modLog(this.client.textes.get("MOD_NOTIF_MEMBER_NEW_WARN", args.member, message.member, note));
    }
}


module.exports = NoteCommand;