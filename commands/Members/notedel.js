const Discord = require("discord.js");
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
const moment = require("moment");
const colors = require('../../utils/colors');
const textes = new (require(`../../utils/textes.js`));

class NoteDelCommand extends Command {
    constructor() {
        super('note-del', {
            aliases: ['note-del','notes-del', 'ndel'],
            category: '🟪 Membres',
            description: {
                content: textes.get("NOTE_DEL_DESCRIPTION_CONTENT"),
                usage: textes.get("NOTE_DEL_DESCRIPTION_USAGE"),
                examples: ['']
            }
        });
    }

    async *args(message) {
        const note = yield {
            type: "note",
            prompt: {
                start: message => promptMessage(textes.get('CMD_NOTE_PROMPT')),
                retry: message => promptMessage(textes.get('CMD_NOTE_RETRY'))
            }
        };

        const noteDeletion = yield (note.type == 'WARN' ? {
            type: 'ouinon',
            prompt: {
                start: message => promptMessage(textes.get('WARN_DEL_CONFIRM_PROMPT', note, this.client.memberGetDisplayNameByID(note.partyMemberID), this.client.memberGetDisplayNameByID(note.memberID))),
                retry: message => promptMessage(textes.get('CMD_OUINON_RETRY'))
            }
        } : {
            type: 'ouinon',
            prompt: {
                start: message => promptMessage(textes.get('NOTE_DEL_CONFIRM_PROMPT', note, this.client.memberGetDisplayNameByID(note.partyMemberID), this.client.memberGetDisplayNameByID(note.memberID))),
                retry: message => promptMessage(textes.get('CMD_OUINON_RETRY'))
            }
        });

        return {
            note, noteDeletion
        };
    }

    async exec(message, args) {
        const userdata = this.client.userdataGet(args.note.memberID);
        if (args.noteDeletion == 'oui') {
            if (args.note.type == 'WARN') {
                this.client.db_memberLog.delete(args.note.key);
                userdata.warn -= 1;
                this.client.userdataSet(userdata);
                successMessage(`L'avertissement ${args.note.key} à correctement été retiré`, message.channel, true);
                this.client.modLogEmbed(this.client.textes.get("MOD_NOTIF_MEMBER_WARN_DEL", message.author.id, args.note), 'WARNDEL');
            } else {
                successMessage(`La note ${args.note.key} à correctement été supprimée`, message.channel, true);
                this.client.db_memberLog.delete(args.note.key);
                this.client.modLogEmbed(this.client.textes.get("MOD_NOTIF_MEMBER_NOTE_DEL", message.author.id, args.note), 'NOTEDEL');
            }
        }
    }
}


module.exports = NoteDelCommand;