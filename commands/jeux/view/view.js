const { Command } = require('discord-akairo');
class ViewJeuxCommand extends Command {
    constructor() {
        super('jeux-view', {
            aliases: ['jeux-view'],
            category: 'jeux',
            description: {
                content: 'Affiche les données d\'un jeu',
                usage: '<method> <...arguments>',
            },
            args: [{
                id: 'gameid',
            }],
        });
    }
    exec(message, args) {
        console.log(`Commande !jeux view avec id:${args.gameid}`);
    }
}
module.exports = ViewJeuxCommand;