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

class expAddCommand extends Command {
    constructor() {
        super("exp-add", {
            aliases: ["expadd"],
            category: '🟪 Levels/Expérience',
            description: {
                content: textes.get('EXP_CMD_ADD_DESCRIPTION_CONTENT'),
                usage: textes.get('EXP_CMD_ADD_DESCRIPTION_USAGE'),
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
        const xpamount = yield {
            type: 'number',
            prompt: {
                start: message => promptMessage(textes.get('EXP_CMD_ADD_XPAMOUNT_PROMPT')),
                retry: message => promptMessage(textes.get('EXP_CMD_ADD_XPAMOUNT_RETRY'))
            }
        };

        return { userdata, xpamount };
    }

    async exec(message, args) {
        let client = this.client;

        args.userdata.xp += args.xpamount;
        args.userdata.level = client.xpGetLevel(args.userdata.xp);
        client.userdataSet(args.userdata);

        successMessage(textes.get("EXP_CMD_ADD_SUCCESS", args.userdata, args.xpamount), message.channel);
    }

}

module.exports = expAddCommand;