const { Command, Flag } = require('discord-akairo');
class GamesCommand extends Command {
    constructor() {
        super('games', {
            aliases: ['games'],
            description: {
                content: 'Manage games',
                usage: '<action> <...arguments>',
            },
            category: 'games',
        });
    }
    *args() {
        const method = yield {
            type: [
                ['games-view', 'view'],
            ],
            otherwise: () => {
            },
        };
        return Flag.continue(method);
    }
}
module.exports = GamesCommand;