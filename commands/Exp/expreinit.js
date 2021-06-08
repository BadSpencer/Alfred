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
const moment = require("moment");
const textes = new (require(`../../utils/textes.js`));

class expReinitCommand extends Command {
    constructor() {
        super("exp-reinit", {
            aliases: ["expinit","expri"],
            category: '🟪 Levels/Expérience',
            description: {
                content: textes.get('EXP_CMD_REINIT_DESCRIPTION_CONTENT'),
                usage: textes.get('EXP_CMD_REINIT_DESCRIPTION_USAGE'),
            },
        });
    }

    * args(message) {

    }

    async exec(message, args) {
        let client = this.client;
        let userdatas = client.userdataGetAll(true);

        for (const userdata of userdatas) {
            userdata.xp = 0;
            userdata.level = 1;
            userdata.credit = 0;
            userdata.karma = 100;
            client.userdataSet(userdata);
            client.log(`Expérience réinitialisée pour ${userdata.displayName}`);
        }

        successMessage(textes.get("EXP_CMD_REINIT_SUCCESS", userdatas.length), message.channel);
    }

}

module.exports = expReinitCommand;