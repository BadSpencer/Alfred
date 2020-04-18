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

class dbMembersCommand extends Command {
    constructor() {
        super('members', {
            aliases: ['members', 'm'],
            category: 'Admin',
            userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
            args: [{
                id: 'action',
                type: 'text',
                default: 'liste'
            }],
        });
    }

    async exec(message, args) {
        let client = this.client;
        switch (args.action) {
            case 'liste':
                break;
            case 'top':



                break;
            case 'initxp':
                const guild = client.guilds.get(client.config.guildID);
                let userdatas = client.db_userdata.filterArray(rec => rec.id !== "");

                for (const userdata of userdatas) {
                    client.db_userdata.set(userdata.id, "xp", 0);
                    client.db_userdata.set(userdata.id, "level", 0);
                }
                break;

            case 'initlogs':
                const guild = client.guilds.get(client.config.guildID);
                let userdatas = client.db_userdata.filterArray(rec => rec.id !== "");

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
        }
        message.delete();
    }
}

module.exports = dbMembersCommand;