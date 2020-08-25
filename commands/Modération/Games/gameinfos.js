const { Command } = require("discord-akairo");
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage, stateMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class GameInfosCommand extends Command {
    constructor() {
        super('game-infos', {
            aliases: ['game-infos', 'ginfos'],
            category: 'Jeux',
            description: {
                content: textes.get('GAMES_GAME_INFOS_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMES_GAME_INFOS_DESCRIPTION_USAGE'),
                examples: ['!game-infos', '!ginfos']
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
                    await this.client.gamesListPost(message.channel, 'tout');
                    return promptMessage(textes.get('GAMES_GAME_INFOS_GAME_PROMPT'))
                },
                retry: message => promptMessage(textes.get('GAMES_GAME_INFOS_GAME_RETRY')),
            }
        };



        return { game };
    }

    async exec(message, args) {
        let client = this.client;

        client.gamesPostGameInfos(args.game, message.channel);



        //if (message.channel.type === 'text') message.delete();
    }

}
module.exports = GameInfosCommand;