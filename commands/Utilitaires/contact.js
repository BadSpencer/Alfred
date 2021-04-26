const Discord = require("discord.js");
const { Command } = require("discord-akairo");
const { Permissions } = require("discord.js");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../utils/messages');
const textes = new (require("../../utils/textes.js"));
const colors = require('../../utils/colors');


class KickCommand extends Command {
    constructor() {
        super('contact', {
            aliases: ['contact', 'staff', 'bug'],
            category: 'Utilitaires',
            description: {
                content: '🔹 Permet de contacter le Staff en cas de problème',
                usage: `\`!contact\`
                Cette commande va créer un salon texte où vous seul et le staff aurez accès. Le staff recevra une notification et viendra traiter votre message dans les plus brefs délais`,
                examples: [`!contact`, `!staff`, `!bug`]
            }
        });
    }

    *args(message) {

    }

    async exec(message, args) {

        let client = this.client;
        let embed = new Discord.MessageEmbed();

        let contactCategory = message.guild.channels.cache.find(c => c.name === message.settings.contactCategory);




    }
}


module.exports = KickCommand;