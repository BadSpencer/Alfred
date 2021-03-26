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
} = require('../../../utils/messages');
const moment = require("moment");
const colors = require('../../../utils/colors');
const textes = new (require(`../../../utils/textes.js`));

class NoteEditCommand extends Command {
    constructor() {
        super('note-edit', {
            aliases: ['note-edit', 'notes-edit', 'nedit'],
            category: '🟪 Membres',
            description: {
                content: textes.get("NOTE_EDIT_DESCRIPTION_CONTENT"),
                usage: textes.get("NOTE_EDIT_DESCRIPTION_USAGE"),
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

        const changeDate = yield {
            type: 'ouinon',
            prompt: {
                start: message => promptMessage(textes.get('NOTE_CHANGEDATE_PROMPT', note.createdDate, note.createdTime)),
                retry: message => promptMessage(textes.get('CMD_OUINON_RETRY'))
            }
        }

        const date = yield (changeDate == 'oui' ? {
            type: 'date',
            prompt: {
                start: message => promptMessage(textes.get('NOTE_DATE_PROMPT', note.createdDate)),
                retry: message => promptMessage(textes.get('NOTE_DATE_RETRY'))
            }
        } : {
            type: 'date',
            default: new Date(note.createdAt)
        });

        const changeNote = yield {
            type: 'ouinon',
            prompt: {
                start: message => promptMessage(textes.get('NOTE_CHANGENOTE_PROMPT', note.note)),
                retry: message => promptMessage(textes.get('CMD_OUINON_RETRY'))
            }
        }

        const newText = yield (changeNote == 'oui' ? {
            type: 'string',
            prompt: {
                start: message => promptMessage(textes.get('NOTE_NEWNOTE_PROMPT', note.note))
            }
        } : {
            type: 'string',
            default: note.note
        });

        return {
            note, date, newText
        };
    }

    async exec(message, args) {

        let newNote = Object.assign({}, args.note);

        newNote.createdAt = args.date;
        newNote.createdDate = moment(args.date).format('DD.MM.YYYY');
        newNote.createdTime = moment(args.date).format('HH:mm');
        newNote.note = args.newText;
        
        this.client.db_memberLog.set(newNote.key, newNote);
        this.client.modLogEmbed(this.client.textes.get("MOD_NOTIF_MEMBER_NOTE_EDIT", message.author.id, args.note, newNote), 'NOTEEDIT');

    }
}


module.exports = NoteEditCommand;