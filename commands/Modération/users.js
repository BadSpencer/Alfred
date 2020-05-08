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
            args: [
                {
                    id: 'action',
                    type: 'text',
                    default: 'userboard'
                },
                {
                    id: 'userdata',
                    type: 'userdata',
                    prompt: {
                        start: 'Quel membre souhaitez vous expulser ?',
                        retry: 'Mentionnez un membre avec son ID'
                    },
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
        const guild = client.guilds.get(client.config.guildID);
        let userdatas = await client.userdataGetAll();
        switch (args.action) {
            case 'userboard':
                client.userdataUserboard(message);
                break;
            case 'liste':
                if (message.channel.type === 'text') {
                    client.db.enmapDisplay(client, userdatas, message.member, ["displayName", "username"]);
                } else {
                    client.db.enmapDisplay(client, userdatas, message.channel, ["displayName", "username"]);
                }
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
            case 'initlogs':
                for (const userdata of userdatas) {
                    let member = guild.members.get(userdata.id);
                    if (member) {
                        await client.userdataClearLogs(member.id);
                        await client.userdataAddLog(userdata, member, "JOIN", "A rejoint le discord");
                        message.channel.send(client.textes.get("MEMBER_INIT_LOGS_MEMBER_SUCCESS", member.displayName));
                    } else {
                        message.channel.send(client.textes.get("MEMBER_INIT_LOGS_MEMBER_NOTFOUND", userdata.id));
                    }
                }
                break;
            case 'initmesslogs':
                client.log(`Réinitialisation des logs des messages`);
                await client.db_messageslogs.deleteAll()
                client.log(`Table des logs des messages vidée`, "debug");
                let textChannels = guild.channels.filter(record => record.type == "text");
                let messageCountTotal = 0;

                for (const channel of textChannels) {

                    let channelMessages = await client.channelGetAllMessages(channel[1].id);
                    let messageCount = 0;
                    for (const mess of channelMessages) {
                        let messageLoggued = await client.messageLog(mess[1]);
                        if (messageLoggued) messageCount += 1;
                    };
                    messageCountTotal += messageCount;
                    client.log(`${messageCount} sur ${channelMessages.length} messages récupérés dans ${channel[1].name}`, "debug");
                }
                client.log(client.textes.get("COM_USERS_INITMESSLOGS_RESULT", messageCountTotal));
                successMessage(client.textes.get("COM_USERS_INITMESSLOGS_RESULT", messageCountTotal), message.channel);
        }
        if (message.channel.type === 'text') message.delete();
    }
}

module.exports = usersCommand;