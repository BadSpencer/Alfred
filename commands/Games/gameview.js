const { Command } = require("discord-akairo");
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../utils/messages');
const textes = new (require(`../../utils/textes.js`));

class GameViewCommand extends Command {
    constructor() {
        super('game-view', {
            aliases: ['game-view', 'gview'],
            category: '🟪 Jeux',
            description: {
                content: textes.get('GAMES_GAME_VIEW_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMES_GAME_VIEW_DESCRIPTION_USAGE'),
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
                    await this.client.gamesListPost(message.channel, 'tout');
                    return promptMessage(textes.get('GAMES_GAME_VIEW_GAME_PROMPT'))
                },
                retry: message => promptMessage(textes.get('GAMES_GAME_VIEW_GAME_RETRY')),
            }
        };

        return { game };
    }

    async exec(message, args) {
        let client = this.client;
        await message.channel.send(`**${args.game.id}**\n\`\`\`json\n${inspect(args.game)}\n\`\`\``);
        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = GameViewCommand;