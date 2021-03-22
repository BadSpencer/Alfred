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

class expSetCommand extends Command {
    constructor() {
        super("exp-set", {
            aliases: ["expset"],
            category: '🟪 Levels/Expérience',
            description: {
                content: textes.get('EXP_CMD_SET_DESCRIPTION_CONTENT'),
                usage: textes.get('EXP_CMD_SET_DESCRIPTION_USAGE'),
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
        const xptotal = yield {
            type: 'number',
            prompt: {
                start: message => promptMessage(textes.get('EXP_CMD_SET_XPTOTAL_PROMPT')),
                retry: message => promptMessage(textes.get('EXP_CMD_SET_XPTOTAL_RETRY'))
            }
        };

        return { userdata, xptotal };
    }

    async exec(message, args) {
        let client = this.client;

        args.userdata.xp = args.xptotal;
        args.userdata.level = client.xpGetLevel(args.userdata.xp);
        client.userdataSet(args.userdata);

        successMessage(textes.get("EXP_CMD_SET_SUCCESS", args.userdata), message.channel);
    }

}

module.exports = expSetCommand;