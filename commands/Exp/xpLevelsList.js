const {
    Command
} = require("discord-akairo");
const {
    inspect
} = require("util");
const {
    successMessage,
    errorMessage,
    warnMessage,
    promptMessage
} = require('../../utils/messages');
const Discord = require("discord.js");

class xplevelslistCommand extends Command {
    constructor() {
        super("xp-levels-list", {
            aliases: ["xplevels", "xplvl"],
            category: '🟪 Levels/Expérience',
            description: {
                content: "Liste des levels en fonction de l'XP",
                usage: "!xpl [coef]",
            },
        });
    }

    * args(message) {
        const coef = yield {
            type: "number",
            default: 0
        };
        return {
            coef
        };
    }


    async exec(message, args) {
        let client = this.client;
        const guild = client.getGuild();
        const settings = client.getSettings(guild);



        let coef = 0;
        if (args.coef === 0) {
            coef = settings.xpToLevelCoef;
        } else {
            coef = args.coef;
        }

    
        let levelsToXP = "";
        let i = 0;
        for (i = 0; i < 20; i++) {
            let level = i + 1;
            let XP = client.levelGetXP(level, coef);

            levelsToXP += `${level} -> ${XP}\n`
        }

        let embed = new Discord.MessageEmbed();
        embed.setTitle(`Liste des levels`);
        embed.setDescription(levelsToXP);
        embed.setFooter(`Coefficient: ${coef}`)
        message.channel.send(embed);

        // if (message.channel.type === "text") {
        //     message.delete();
        // };
    }

}

module.exports = xplevelslistCommand;