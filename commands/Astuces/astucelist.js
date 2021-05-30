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

class AstuceListCommand extends Command {
    constructor() {
        super('astuce-list', {
            aliases: ['astuce-list', 'astlist'],
            category: '🟪 Gestion des Astuces',
            description: {
                content: textes.get("CMD_ASTUCELIST_CONTENT"),
                usage: textes.get("CMD_ASTUCELIST_USAGE"),
                examples: ['']
            }
        });
    }

    async *args(message) {

    }

    async exec(message, args) {
        let now = +new Date;

        // Récupération des astuce dans la base et tri par ID ascendant
        const astuces = this.client.db_astuces.array();
        astuces.sort(function (a, b) {
            return a.id - b.id;
        });

        // Préparation de la liste
        let astucesList = [];
        for (const astuce of astuces) {
            let lastDisplayed = moment.duration(astuce.lastDisplayedAt - now).locale("fr").humanize(true);
            astucesList.push(`**${astuce.id}**: ${astuce.texte}`);
            astucesList.push(`Affichée il y a ${lastDisplayed} (${astuce.displayCount} fois en tout)`);
        }

        // Affichage de la liste
        if (astucesList.length > 0) {
            await this.client.arrayToEmbed(astucesList, 12, `Liste des astuces (total: ${astucesList.length/2})`, message.channel);
        } else {
            warnMessage(`Aucune astuce trouvée`, message.channel);
        }

    }
}


module.exports = AstuceListCommand;