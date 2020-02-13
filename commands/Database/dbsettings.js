const {
    Command
} = require('discord-akairo');

class dbSettingsCommand extends Command {
    constructor() {
        super('dbsettings', {
            aliases: ['dbsettings', 'settings', 's'],
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
        }

    }
}

module.exports = dbSettingsCommand;