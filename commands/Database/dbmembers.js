const {
    Command
} = require('discord-akairo');

class dbMembersCommand extends Command {
    constructor() {
        super('dbmembers', {
            aliases: ['dbmembers', 'm'],
            args: [{
                id: 'action',
                type: 'text',
                default: 'liste' 
            }],
        });
    }

    exec(message, args) {
        
        switch (args.action) {
            case 'liste': {


                break;
            }
            case 'init': {

                message.guild.members.forEach(async member => {
                    await this.userCreate(member);
                  });

                break;
            }
        }

    }
}

module.exports = dbMembersCommand;