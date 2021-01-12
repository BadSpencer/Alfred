const Discord = require("discord.js");
const { Command } = require("discord-akairo");
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class GameListCommand extends Command {
    constructor() {
        super('game-scores', {
            aliases: ['game-scores', 'gscores'],
            category: 'Jeux',
            description: {
                content: textes.get('GAMES_GAME_SCORES_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMES_GAME_SCORES_DESCRIPTION_USAGE'),
                examples: ['!game-scores', '!gscores']
            },
        });
    }


    async *args(message) {
    }

    async exec(message, args) {
        let client = this.client;

        let games = client.gamesGetAll(true);

        let gamesScores = [];
        let iconStatut = '';

        for (const game of games) {
            if (game.actif) {
                iconStatut = '◽️';
            } else {
                iconStatut = '◾️';
            }
            gamesScores.push(`${iconStatut} **${game.name}** ${client.gamesGetGameScore(game.id)}`);
        }

        await client.arrayToEmbed(gamesScores, 20, `Scores des jeux`, message.channel);

    }

}
module.exports = GameListCommand;