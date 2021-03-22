const { Command } = require("discord-akairo");
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../utils/messages');
const textes = new (require(`../../utils/textes.js`));

class GamePlayersCommand extends Command {
    constructor() {
        super('game-players', {
            aliases: ['game-players', 'gplayers'],
            category: '🟪 Jeux',
            description: {
                content: textes.get('GAMES_GAME_PLAYER_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMES_GAME_PLAYER_DESCRIPTION_USAGE'),
                examples: ['!game-players', '!gplayers']
            },
            split: 'quoted',
        });
    };

    async *args(message) {
        const game = yield {
            type: "game",
            match: 'rest',
            prompt: {
                start: async message => { 
                    await this.client.gamesListPost(message.channel, 'tout');
                    return promptMessage(textes.get('GAMES_GAME_PLAYER_GAME_PROMPT'))
                },
                retry: message => promptMessage(textes.get('GAMES_GAME_PLAYER_GAME_RETRY')),
            }
        };
        return { game };
    };

    exec(message, args) {
        this.client.gamesPlayersDetail(args.game.name, message);
        if (message.channel.type === 'text') message.delete();
    };

}
module.exports = GamePlayersCommand;