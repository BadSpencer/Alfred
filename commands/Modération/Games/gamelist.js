const { Command } = require("discord-akairo");
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class GameListCommand extends Command {
    constructor() {
        super('game-list', {
            aliases: ['game-list', 'glist'],
            category: 'Jeux',
            description: {
                content: textes.get('GAMES_GAME_LIST_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMES_GAME_LIST_DESCRIPTION_USAGE'),
                examples: ['!game-list', '!glist']
            },
        });
    }


    async *args(message) {
        const option = yield {
            default: 'tout',
            prompt: {
                retry: message => promptMessage(textes.get('GAMES_GAME_LIST_OPTION_RETRY')),
                optional: true
            }
        }
        return { option };
    }

    async exec(message, args) {
        let client = this.client;
        await client.gamesListPost(message.channel, args.option);
        //if (message.channel.type === 'text') message.delete();
    }

}
module.exports = GameListCommand;