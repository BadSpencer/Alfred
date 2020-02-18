const { Command, Flag } = require('discord-akairo');
class JeuxCommand extends Command {
    constructor() {
        super('jeux', {
            aliases: ['jeux'],
            description: {
                content: 'Gestion des jeux',
                usage: '<action> <...arguments>',
            },
            category: 'jeux',
        });
    }
    *args() {
        const method = yield {
            type: [
                ['jeux-view', 'view'],
                ['jeux-set', 'set'],
            ],
            otherwise: () => {
            },
        };
        return Flag.continue(method);
    }
}
module.exports = JeuxCommand;