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

class expLvlSetCommand extends Command {
    constructor() {
        super("exp-lvlset", {
            aliases: ["explvlset"],
            category: '🟪 Levels/Expérience',
            description: {
                content: textes.get('EXP_CMD_LVLSET_DESCRIPTION_CONTENT'),
                usage: textes.get('EXP_CMD_LVLSET_DESCRIPTION_USAGE'),
            },
        });
    }

    * args(message) {
        const userdata = yield {
            type: 'userdata',
            prompt: {
                start: message => promptMessage(textes.get('CMD_USERDATA_PROMPT')),
                retry: message => promptMessage(textes.get('CMD_USERDATA_RETRY'))
            }
        };
        const level = yield {
            type: 'number',
            prompt: {
                start: message => promptMessage(textes.get('EXP_CMD_LVLSET_LEVEL_PROMPT')),
                retry: message => promptMessage(textes.get('EXP_CMD_LVLSET_LEVEL_RETRY'))
            }
        };

        return { userdata, level };
    }

    async exec(message, args) {
        let client = this.client;

        args.userdata.level = args.level;
        args.userdata.xp = client.levelGetXP(args.level);
        client.userdataSet(args.userdata);

        successMessage(textes.get("EXP_CMD_LVLSET_SUCCESS", args.userdata), message.channel);
    }

}

module.exports = expLvlSetCommand;