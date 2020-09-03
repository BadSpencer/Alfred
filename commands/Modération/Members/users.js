const {
    Command
} = require("discord-akairo");
const { Permissions } = require("discord.js");
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('../../../utils/messages');
const moment = require("moment");
const datamodel = require('../../../utils/datamodel');

class usersCommand extends Command {
    constructor() {
        super('users', {
            aliases: ['users', 'u'],
            category: 'Modération',
            args: [
                {
                    id: 'action',
                    type: 'text',
                    default: 'userboard'
                }
            ],
            description: {
                content: 'Gestion des utilisateurs',
                usage: '',
                examples: ['']
            }
        });
    }

    async exec(message, args) {
        let client = this.client;
        const guild = client.guilds.cache.get(client.config.guildID);
        let userdatas = await client.userdataGetAll();
        switch (args.action) {
            case 'userboard':
                client.userdataUserboard(message);
                break;
            case 'liste':
                // if (message.channel.type === 'text') {
                //     client.db.enmapDisplay(client, userdatas, message.member, ["displayName", "username"]);
                // } else {
                //     client.db.enmapDisplay(client, userdatas, message.channel, ["displayName", "username"]);
                // }
                client.db.enmapDisplay(client, userdatas, message.channel, ["displayName", "username"]);
                break;
            case 'top':
                break;

            case 'info':
            case 'infos':
            case 'view':
                client.userdataShowInfos(memberID, message.channel);
                break;
            case 'initxp':
                for (const userdata of userdatas) {
                    client.db_userdata.set(userdata.id, "xp", 0);
                    client.db_userdata.set(userdata.id, "level", 0);
                }
                break;
        }
        if (message.channel.type === 'text') message.delete();
    }
}

module.exports = usersCommand;