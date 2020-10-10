const { Command } = require("discord-akairo");
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class GameEditCommand extends Command {
    constructor() {
        super('game-edit', {
            aliases: ['game-edit', 'gedit'],
            category: 'Jeux',
            description: {
                content: textes.get('GAMES_GAME_EDIT_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMES_GAME_EDIT_DESCRIPTION_USAGE'),
                examples: ['!game-edit', '!gedit']
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
                    return promptMessage(textes.get('GAMES_GAME_EDIT_GAME_PROMPT'))
                },
                retry: message => promptMessage(textes.get('GAMES_GAME_EDIT_GAME_RETRY')),
            }
        };

        const field = yield {
            prompt: {
                start: async message => {
                    await message.channel.send(`**${game.id}**\n\`\`\`json\n${inspect(game)}\n\`\`\``);
                    return promptMessage(textes.get('CMD_EDIT_FIELD_PROMPT'))
                },
            }
        };

        const value = yield {
            prompt: {
                start: message => promptMessage(textes.get('CMD_EDIT_VALUE_PROMPT'))
            }
        };

        return { game, field, value };
    }

    async exec(message, args) {
        let client = this.client;

        if (args.game[args.field] === undefined) return errorMessage(textes.get('ERROR_FIELD_NOT_FOUND', args.field), message.channel);

        if (args.field == "nbDaysInactive") {
            args.game[args.field] = parseInt(args.value);
        } else {
            args.game[args.field] = args.value;
            if (args.value === "true") {
                args.game[args.field] = true;
            }
            if (args.value === "false") {
                args.game[args.field] = false;
            }
        }
        client.db_games.set(args.game.id, args.game);

        successMessage(client.textes.get('GAMES_GAME_EDIT_SUCCESS', args.game), message.channel);
        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = GameEditCommand;