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

class AstuceEditCommand extends Command {
    constructor() {
        super('astuce-edit', {
            aliases: ['astuce-edit', 'astedit'],
            category: '🟪 Gestion des Astuces',
            description: {
                content: textes.get("CMD_ASTUCEEDIT_CONTENT"),
                usage: textes.get("CMD_ASTUCEEDIT_USAGE"),
                examples: ['']
            }
        });
    }

    async *args(message) {
        const astuce = yield {
            type: "astuce",
            prompt: {
                start: message => promptMessage(textes.get('CMD_ASTUCE_PROMPT')),
                retry: message => promptMessage(textes.get('CMD_ASTUCE_RETRY'))
            }
        };

        const astuceText = yield {
            type: "string",
            prompt: {
                start: message => promptMessage(textes.get("CMD_ASTUCEADD_ASTUCETEXT_PROMPT"))
            }
        };

        return {
            astuce, astuceText
        };

    }

    async exec(message, args) {
        successMessage(`L'astuce **${args.astuce.id}** à correctement été mise à jour`, message.channel, true);
        args.astuce.texte = args.astuceText;
        this.client.db_astuces.set(args.astuce.id, args.astuce);
    }
}


module.exports = AstuceEditCommand;