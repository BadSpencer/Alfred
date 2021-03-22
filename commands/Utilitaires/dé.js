const Discord = require("discord.js");
const { Command } = require("discord-akairo");
const { Permissions } = require("discord.js");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../utils/messages');
const textes = new (require("../../utils/textes.js"));
const colors = require('../../utils/colors');


class KickCommand extends Command {
    constructor() {
        super('dé', {
            aliases: ['dé', 'dés', 'random', 'rand', 'rnd'],
            category: 'Utilitaires',
            description: {
                content: '🔹 Permet d\'effectuer un ou plusieurs lancés de dé',
                usage: `\`!dé [<nb tirages> <nb faces>]\`
                Choisissez le nombre de tirages successifs que vous souhaitez et le nombre de faces que comporte votre dé. Ces paramètres sont optionnels.
                Si vous lancez la commande sans paramètre, j'effectuerais un seul lancé d'un dé à six faces. Si vous souhaitez modifier le nombre de faces de votre dé vous devrez alors aussi spécifier un nombre de tirages`,
                examples: [`!dé`, `!dé 4 20`, `!rnd 1 100`]
            }
        });
    }

    *args(message) {
        const numTirages = yield {
            type: Argument.range('number', 1, 20),
            default: 1
        };
        const numFaces = yield {
            type: 'number',
            default: 6
        };
        return { numTirages, numFaces };
    }

    async exec(message, args) {

        let client = this.client;
        let embed = new Discord.MessageEmbed();
        let footer = `Tirages: ${args.numTirages}  Faces: ${args.numFaces}`;

        embed.setFooter(footer);
        if (args.numTirages > 1) {
            embed.setTitle(`Lancé de dés pour ${client.memberGetDisplayNameByID(message.author.id)}`)
        } else {
            embed.setTitle(`Lancé de dé pour ${client.memberGetDisplayNameByID(message.author.id)}`)
        }

        embed.setDescription(`⏳ Tirage en cours...`);
        let reponse = await message.channel.send(embed);
        await client.sleep(2000);
        let description = 'Résultat du tirage\n\n';
        if (args.numTirages > 1) {
            description += `Nombre de tirages: ${args.numTirages}\n`
        }
        if (args.numFaces != 6) {
            description += `Nombre de faces: ${args.numFaces}\n\n`
        }
        for (var i = 0; i < args.numTirages; i++) {
            description += `**${(Math.floor(Math.random() * args.numFaces) + 1).toString()}**\n`;
        }
        embed.setDescription(description);
        reponse.edit(embed);

    }
}


module.exports = KickCommand;