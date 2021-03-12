const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('../../../utils/datamodel');
const colors = require('../../../utils/colors');
const {
    Command
} = require("discord-akairo");
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage,
    promptMessage
} = require('../../../utils/messages');
const textes = new(require(`../../../utils/textes.js`));

class PlayerSessCommand extends Command {
    constructor() {
        super('user-infos', {
            aliases: ['user-infos', 'ui'],
            category: 'Modération',
            description: {
                content: textes.get('USER_INFOS_DESCRIPTION_CONTENT'),
                usage: textes.get('USER_INFOS_DESCRIPTION_USAGE'),
                examples: ['!ui', '!ui Bad Spencer', '!ui 291545597205544971']
            }
        });
    }

    async *args(message) {
        const member = yield {
            type: "member",
            prompt: {
                start: message => promptMessage(textes.get('USER_USERINFO_MEMBER_PROMPT')),
                retry: message => promptMessage(textes.get('USER_USERINFO_MEMBER_RETRY'))
            }
        };
        return {
            member
        };
    }

    async exec(message, args) {
        let client = this.client;

        const userdata = client.db_userdata.find(record => record.id == args.member.id);
        if (userdata) {
            client.userdataShowInfos(userdata, message.channel);
        }        

        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = PlayerSessCommand;