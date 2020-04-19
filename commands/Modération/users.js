const {
    Command
} = require('discord-akairo');
const { Permissions } = require('discord.js');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('../../utils/messages');
const moment = require("moment");
const datamodel = require('../../utils/datamodel');

class usersCommand extends Command {
    constructor() {
        super('users', {
            aliases: ['users', 'u'],
            category: 'Modération',
            args: [{
                id: 'action',
                type: 'text',
                default: 'userboard'
            }],
        });
    }

    async exec(message, args) {
        let client = this.client;
        const guild = client.guilds.get(client.config.guildID);
        let userdatas = await client.userdataGetAll();
        switch (args.action) {
            case 'userboard':
                client.userdataUserboard(message);
            break;
            case 'liste':
                client.db.enmapDisplay(client, userdatas, message.channel, ["name", "xp", "level"]);
                break;
            case 'top':

                break;
            case 'initxp':
                for (const userdata of userdatas) {
                    client.db_userdata.set(userdata.id, "xp", 0);
                    client.db_userdata.set(userdata.id, "level", 0);
                }
                break;

            case 'initlogs':
                for (const userdata of userdatas) {
                    let member = guild.members.get(userdata.id);
                    if (member) {
                        await client.userdataClearLogs(member.id);
                        await client.userdataAddLog(member, member, "JOIN", "A rejoint le discord");
                        message.channel.send(client.textes.get("MEMBER_INIT_LOGS_MEMBER_SUCCESS", member.displayName));
                    } else {
                        message.channel.send(client.textes.get("MEMBER_INIT_LOGS_MEMBER_NOTFOUND", userdata.id));
                    }
                }
                break;
            case 'initmesslogs':
                let textChannels = guild.channels.filter(record => record.type == "text");

                for (const channel of textChannels) {
                    //client.log(`Récupération des messages de ${channel[1].name}`, "debug");
                    let messagesLogs = datamodel.tables.messagesLogs;
                    
                    let channelMessages = await client.channelGetAllMessages(channel[1].id);
                    for (const mess of channelMessages) {
                           client.messageLog (mess[1]);
                    };
                    
                    client.log(`${channelMessages.length} messages récupérés dans ${channel[1].name}`, "debug");
                }

        }
        message.delete();
    }
}

module.exports = usersCommand;