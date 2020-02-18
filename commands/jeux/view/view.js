const { Command } = require('discord-akairo');
const { inspect } = require("util");
class GamesViewCommand extends Command {
    constructor() {
        super('games-view', {
            aliases: ['games-view'],
            category: 'games',
            description: {
                content: 'Affiche les données d\'un jeu',
                usage: '!game view <gameid>',
            },
            args: [{
                id: 'gamename',
                match: 'content',
            }],
        });
    }
    exec(message, args) {
        let game = this.client.db_games.get(args.gamename);
        if(game) {
            message.channel.send(`***__Données du jeu__***\n\`\`\`json\n${inspect(game)}\n\`\`\``)
        }
        console.log(`Commande !game view with id:${args.gamename}`);
    }
}
module.exports = GamesViewCommand;