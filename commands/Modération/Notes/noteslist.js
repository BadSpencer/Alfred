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

class NotesListCommand extends Command {
    constructor() {
        super('note-list', {
            aliases: ['note-list', 'notes-list', 'nlist'],
            category: '🟪 Notes de modération',
            description: {
                content: textes.get("NOTE_LIST_DESCRIPTION_CONTENT"),
                usage: textes.get("NOTE_LIST_DESCRIPTION_USAGE"),
                examples: ['']
            }
        });
    }

    async *args(message) {

    }

    async exec(message, args) {
        this.client.memberNotesList(message.channel);
    }
}


module.exports = NotesListCommand;