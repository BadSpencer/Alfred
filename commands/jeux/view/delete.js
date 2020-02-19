const { Command } = require('discord-akairo');
const { successMessage, errorMessage, warnMessage } = require('../../../utils/messages');
class GamesDeleteCommand extends Command {
    constructor() {
        super('games-delete', {
            aliases: ['games-delete'],
            category: 'games',
            description: {
                content: 'Suppression des données d\'un jeu',
                usage: '!game delete <nom du jeu>',
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

        const gameRole = message.guild.roles.get(game.roleID);
        if (gameRole) {
            gameRole.delete("Suppression du jeu");
        }
        const gamePlayRole = message.guild.roles.get(game.playRoleID);
        if (gamePlayRole) {
            gamePlayRole.delete("Suppression du jeu");
        }

        const gameTextChannel = message.guild.channels.get(game.textChannelID);
        if (gameTextChannel) {
            gameTextChannel.delete("Suppression du jeu");
        }

        const gameInfosChannel = message.guild.channels.get(game.infosChannelID);
        if (gameInfosChannel) {
            gameInfosChannel.delete("Suppression du jeu");
        }

        const gameVoiceChannel = message.guild.channels.get(game.voiceChannelID);
        if (gameVoiceChannel) {
            gameVoiceChannel.delete("Suppression du jeu");
        }

        const gameJoinChannel = message.guild.channels.get(game.joinChannelID);
        if (gameJoinChannel) {
            gameJoinChannel.delete("Suppression du jeu");
        }

        const gameCategory = message.guild.channels.get(game.categoryID);
        if (gameCategory) {
            gameCategory.delete("Suppression du jeu");
        }

        await this.client.db_games.delete(args.gamename);
    }
}
module.exports = GamesDeleteCommand;