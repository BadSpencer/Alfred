const { Command } = require('discord-akairo');
class GamesViewCommand extends Command {
    constructor() {
        super('games-view', {
            aliases: ['games-view'],
            category: 'games',
            description: {
                content: 'Display game data',
                usage: '!game view <gameid>',
            },
            args: [{
                id: 'gameid',
            }],
        });
    }
    exec(message, args) {
        console.log(`Commande !game view with id:${args.gameid}`);
    }
}
module.exports = GamesViewCommand;