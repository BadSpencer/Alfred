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
        const userdata = yield {
            type: "userdata",
            prompt: {
                start: message => promptMessage(textes.get('USER_MEMBER_PROMPT')),
                retry: message => promptMessage(textes.get('USER_MEMBER_RETRY'))
            }
        };

        const note = yield {
            type: "string",
            prompt: {
                start: message => promptMessage(textes.get("USER_WARN_NOTE_PROMPT", this.client.memberGetDisplayNameByID(userdata.id)))
            }
        };

        return {
            userdata,
            note
        };
    }

    async exec(message, args) {

        const guild = this.client.getGuild();
        let member = guild.members.cache.get(args.userdata.id);

        args.userdata.warn += 1;
        this.client.userdataSet(args.userdata);

        this.client.memberLogWarn(args.userdata.id, message.author.id, args.note);
        member.send(`Vous avez reçu un avertissement de la part de ${this.client.memberGetDisplayNameByID(message.author.id)}.
        Raison: ${args.note}`)

        if (args.userdata.warn > 2) {
            this.client.modLog(this.client.textes.get("MOD_NOTIF_MEMBER_NEW_WARN_LIMIT", args.userdata.id, message.author.id, args.note, args.userdata.warn));
        } else {
            this.client.modLog(this.client.textes.get("MOD_NOTIF_MEMBER_NEW_WARN", args.userdata.id, message.author.id, args.note));
        }

    }
}


module.exports = NoteCommand;