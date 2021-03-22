const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('../../utils/datamodel');
const colors = require('../../utils/colors');
const {
    Command
} = require("discord-akairo");
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage,
    promptMessage
} = require('../../utils/messages');
const textes = new (require(`../../utils/textes.js`));

class ProfilCommand extends Command {
    constructor() {
        super('profil', {
            aliases: ['profil'],
            category: 'Informations',
            channel: 'dm',
            description: {
                content: textes.get('INFOS_PROFIL_DESCRIPTION_CONTENT'),
                usage: textes.get('INFOS_PROFIL_DESCRIPTION_USAGE'),
                examples: ['!profil', '!profil Bad Spencer', '!profil 291545597205544971']
            }
        });
    }

    async *args(message) {
        const userdata = yield {
            type: "userdata",
            match: 'rest',
            default: message => this.client.db_userdata.get(message.author.id),
            prompt: {
                start: message => promptMessage(textes.get('INFOS_PROFIL_MEMBER_PROMPT')),
                retry: message => promptMessage(textes.get('INFOS_PROFIL_MEMBER_RETRY'))
            }
        };
        return {
            userdata
        };
    }

    async exec(message, args) {
        this.client.userdataShowInfos(args.userdata, message.channel, false);
    }

}
module.exports = ProfilCommand;