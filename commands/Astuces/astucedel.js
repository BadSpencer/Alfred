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

class AstuceDelCommand extends Command {
    constructor() {
        super('astuce-del', {
            aliases: ['astuce-del', 'astdel'],
            category: '🟪 Gestion des Astuces',
            description: {
                content: textes.get("CMD_ASTUCEDEL_CONTENT"),
                usage: textes.get("CMD_ASTUCEDEL_USAGE"),
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

        const astuceDeletion = yield {
            type: 'ouinon',
            prompt: {
                start: message => promptMessage(textes.get('CMD_ASTUCE_CONFIRM_PROMPT', astuce)),
                retry: message => promptMessage(textes.get('CMD_OUINON_RETRY'))
            }
        };

        return {
            astuce, astuceDeletion
        };

    }

    async exec(message, args) {

        if (args.astuceDeletion === 'oui') {
                successMessage(`L'astuce **${args.astuce.id}** à correctement été supprimée`, message.channel, true);
                this.client.db_astuces.delete(args.astuce.id);
        }

    }
}


module.exports = AstuceDelCommand;