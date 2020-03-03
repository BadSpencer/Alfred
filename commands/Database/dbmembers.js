const {
    Command
} = require('discord-akairo');

class dbMembersCommand extends Command {
    constructor() {
        super('dbmembers', {
            aliases: ['dbmembers', 'members', 'm'],
            category: 'config',
            args: [{
                id: 'action',
                type: 'text',
                default: 'liste' 
            }],
        });
    }

    exec(message, args) {
        let client = this.client;
        switch (args.action) {
            case 'liste': {
                break;
            }
            case 'initxp': {
                message.guild.members.forEach(async member => {
                    client.db_userdata.set(member.id, "xp", 0);
                    client.db_userdata.set(member.id, "level", 0)
                  });
                break;
            }
        }

    }
}

module.exports = dbMembersCommand;