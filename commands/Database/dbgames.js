const {
    Command
} = require('discord-akairo');
const {
    inspect
} = require("util");
const datamodel = require('../../utils/datamodel');
const defaultGames = datamodel.tables.games;

class dbGamesCommand extends Command {
    constructor() {
        super('dbgames', {
            aliases: ['dbgames'],
            split: 'quoted',

            description: {
                content: 'Gestion des jeux',
                usage: '<method> <...arguments>',
            },
            category: 'config',

            args: [{
                id: 'action',
                default: 'check'
            }, {
                id: 'key',
            }, {
                id: 'value',
            }],

        });
    }

    
    exec(message, args) {

        switch (args.action) {
            case 'check': {
                this.client.db.enmapDisplay(this.client, this.client.db_games, message.channel);
                break;
            }
            case 'view': {
                let game = this.client.db_games.get(args.key);
                if(game) {
                    message.channel.send(`***__Configuration__***\n\`\`\`json\n${inspect(game)}\n\`\`\``)
                } else {
                    game = this.client.db_games.get(args.join(" "));
                    if(game) {
                        message.channel.send(`***__Configuration__***\n\`\`\`json\n${inspect(game)}\n\`\`\``) 
                    }
                }
                break;
            }
            case 'add': {
                let newgame = defaultGames;
                newgame.name = args.gamename;
                newgame.discordTag = args.gamename;

                this.client.db_games.set(args.gamename, newgame);
                break;
            }

            case 'active': {

            }

        }

    }
    
}

module.exports = dbGamesCommand;