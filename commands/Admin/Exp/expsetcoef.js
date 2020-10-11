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
} = require('../../../utils/messages');
const Discord = require("discord.js");
const moment = require("moment");
const textes = new (require(`../../../utils/textes.js`));

class expSetcoefCommand extends Command {
    constructor() {
        super("exp-setcoef", {
            aliases: ["expsetcoef", "expsc"],
            category: "Admin",
            description: {
                content: textes.get('EXP_CMD_SETCOEF_DESCRIPTION_CONTENT'),
                usage: textes.get('EXP_CMD_SETCOEF_DESCRIPTION_USAGE'),
            },
        });
    }

    * args(message) {
        const coef = yield {
            type: 'number',
            prompt: {
                start: message => promptMessage(textes.get('EXP_CMD_SETCOEF_COEF_PROMPT')),
                retry: message => promptMessage(textes.get('EXP_CMD_SETCOEF_COEF_RETRY'))
            }
        };

        return { coef };
    }

    async exec(message, args) {
        let client = this.client;
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        let userdatas = client.userdataGetAll(true);

        let results = [];

        settings.xpToLevelCoef = args.coef;
        client.db_settings.set(guild.id, settings);

        for (const userdata of userdatas) {
            userdata.level = client.xpGetLevel(userdata.xp);
            client.userdataSet(userdata);

            if (userdata.xp > 0) {
                results.push(`${userdata.displayName}: ${userdata.level}`);
            }

        }

        successMessage(textes.get("EXP_CMD_SETCOEF_SUCCESS", args.coef), message.channel);
        client.arrayToEmbed(results, 20, "Résultats du recalcul des levels", message.channel);
    }

}

module.exports = expSetcoefCommand;