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
const datamodel = require('../../utils/datamodel');

class AstuceAddCommand extends Command {
    constructor() {
        super('astuce-add', {
            aliases: ['astuce-add', 'astadd'],
            category: '🟪 Gestion des Astuces',
            description: {
                content: textes.get("CMD_ASTUCEADD_CONTENT"),
                usage: textes.get("CMD_ASTUCEADD_USAGE"),
                examples: ['']
            }
        });
    }

    async *args(message) {
        const astuceText = yield {
            type: "string",
            prompt: {
                start: message => promptMessage(textes.get("CMD_ASTUCEADD_ASTUCETEXT_PROMPT"))
            }
        };

        return {
            astuceText
        };

    }

    async exec(message, args) {

        let astuce = Object.assign({}, datamodel.tables.astuce);
        let astuceNewID = this.client.db_astuces.autonum;

        astuce.id = astuceNewID;
        astuce.texte = args.astuceText;
        this.client.db_astuces.set(astuce.id, astuce);
        successMessage(`L'astuce **${astuce.id}** à correctement été ajoutée`, message.channel, true);

    }
}


module.exports = AstuceAddCommand;