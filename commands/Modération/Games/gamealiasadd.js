const { Command } = require('discord-akairo');
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class GamealiasAddCommand extends Command {
    constructor() {
        super('gamealias-add', {
            aliases: ['gamealias-add', 'ga-add'],
            category: 'Jeux',
            description: {
                content: textes.get('GAMES_GAMEALIAS_ADD_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMES_GAMEALIAS_ADD_DESCRIPTION_USAGE'),
                examples: ['!game-view', '!gview']
            },
            split: 'quoted',
        });
    }

    async *args(message) {
        const game = yield {
            type: "game",
            match: 'rest',
            prompt: {
                start: async message => { 
                    await this.client.gamesListPost(message.channel, 'actif');
                    return promptMessage(textes.get('GAMES_GAMEALIAS_ADD_GAME_PROMPT'))
                },

                retry: message => promptMessage(textes.get('GAMES_GAMEALIAS_ADD_GAME_RETRY'))
            }
        };

        const alias = yield {
            type: 'gamealiasNew',
            prompt: {
                start: message => promptMessage(textes.get('GAMES_GAMEALIAS_ADD_ALIAS_PROMPT', game)),
                retry: message => promptMessage(textes.get('GAMES_GAMEALIAS_ADD_ALIAS_RETRY'))
            }
        };

        return { game, alias };
    }

    async exec(message, args) {
        let client = this.client;
        client.gamealiasAdd(args.alias, args.game.id);
        successMessage(textes.get('GAMES_GAMEALIAS_ADD_SUCCESS', args.game, args.alias), message.channel);
        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = GamealiasAddCommand;