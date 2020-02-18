const { Command } = require('discord-akairo');
const { successMessage, errorMessage, warnMessage } = require('../../../utils/messages');
class GamesCreateCommand extends Command {
    constructor() {
        super('games-create', {
            aliases: ['games-create'],
            category: 'games',
            description: {
                content: 'Création des salons et rôles pour un jeu',
                usage: '!game create <nom du jeu>',
            },
            args: [{
                id: 'gamename',
                match: 'content',
            }],
        });
    }
    async exec(message, args) {
        let game = this.client.db_games.get(args.gamename);

        if (!game) return errorMessage(`Le jeu ${args.gamename} n'a pas été trouvé`, message);


        // Création du rôle principal
        await message.guild.createRole({
            name: args.gamename,
            color: this.client.config.gameMainRoleColor,
            hoist: false,
            mentionable: true
          }).then(mainRole =>{
              successMessage(`Rôle principal ${mainRole.name} créé`, message);
          })

        // Création du rôle "Joue à"

        // Création categorie

        // Création du salon vocal du jeu



    }
}
module.exports = GamesCreateCommand;