const { Command } = require("discord-akairo");
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../utils/messages');
const textes = new (require(`../../utils/textes.js`));

class GameListCommand extends Command {
    constructor() {
        super('member-list', {
            aliases: ['member-list', 'mlist'],
            category: '🟪 Membres',
            description: {
                content: textes.get('GAMES_GAME_LIST_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMES_GAME_LIST_DESCRIPTION_USAGE'),
                examples: ['!member-list', '!mlist']
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
        await client.memberListPost(message.channel, args.option);
    }

}
module.exports = GameListCommand;