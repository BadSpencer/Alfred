const { Command } = require('discord-akairo');
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class GameViewCommand extends Command {
    constructor() {
        super('game-add', {
            aliases: ['game-add', 'gadd'],
            category: 'Jeux',
            description: {
                content: textes.get('GAMES_GAME_ADD_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMES_GAME_ADD_DESCRIPTION_USAGE'),
                examples: ['!game-add', '!gadd']
            },
            split: 'quoted',
        });
    }


    async *args(message) {
        const game = yield {
            match: 'rest',
            prompt: {
                start: async message => { 
                    return promptMessage(textes.get('GAMES_GAME_ADD_GAME_PROMPT'))
                }
            }
        };

        return { game };
    }

    async exec(message, args) {
        let client = this.client;
        await client.gamesCreate(args.game)
        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = GameViewCommand;