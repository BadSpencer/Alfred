const { Command } = require('discord-akairo');
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage, stateMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class GameInactiveCommand extends Command {
    constructor() {
        super('game-delete', {
            aliases: ['game-delete', 'gdel'],
            category: 'Jeux',
            description: {
                content: textes.get('GAMES_GAME_DELETE_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMES_GAME_DELETE_DESCRIPTION_USAGE'),
                examples: ['!game-delete', '!gdel']
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



        return { game };
    }

    async exec(message, args) {
        let client = this.client;

        if (args.game.actif) {
            return errorMessage(textes.get("GAMES_GAME_DELETE_ERROR_GAME_ACTIVE", args.game), message.channel);
        };

        let state = textes.get("GAMES_GAME_DELETE_STATE_START", args.game);
        let embedState = stateMessage(state);
        let stateMsg = await message.channel.send(embedState);

        if (args.game.roleID !== "") {
            const gameRole = message.guild.roles.cache.get(args.game.roleID);
            if (gameRole) {
                args.game.roleID = "";
                gameRole.delete("Suppression du jeu");
                state += `Rôle principal: ✅\n`;
            } else {
                state += `Rôle principal: rôle ${args.game.roleID} non trouvé\n`;
                args.game.roleID = "";
            }
        } else {
            state += `Rôle principal: aucun rôle associé\n`;
        };
        stateMsg.edit(stateMessage(state));


        if (args.game.playRoleID !== "") {
            const gamePlayRole = message.guild.roles.cache.get(args.game.playRoleID);
            if (gamePlayRole) {
                args.game.playRoleID = "";
                await gamePlayRole.delete("Suppression du jeu");
                state += `Rôle "Joue à": ✅\n`;
            } else {
                state += `Rôle "Joue à": rôle ${args.game.playRoleID} non trouvé\n`;
                args.game.playRoleID = "";
            }
        } else {
            state += `Rôle "Joue à": aucun rôle associé\n`;
        };
        stateMsg.edit(stateMessage(state));


        if (args.game.textChannelID !== "") {
            const gameTextChannel = message.guild.channels.cache.get(args.game.textChannelID);
            if (gameTextChannel) {
                args.game.textChannelID = "";
                await gameTextChannel.delete("Suppression du jeu");
                state += `Salon disc.: ✅\n`;
            } else {
                state += `Salon disc.: salon ${args.game.textChannelID} non trouvé\n`;
                args.game.textChannelID = "";
            };
        } else {
            state += `Salon disc.: aucun salon associé\n`;
        };
        stateMsg.edit(stateMessage(state));

        if (args.game.infosChannelID != "") {
            const gameInfosChannel = message.guild.channels.cache.get(args.game.infosChannelID);
            if (gameInfosChannel) {
                args.game.infosChannelID = "";
                await gameInfosChannel.delete("Suppression du jeu");
                state += `Salon infos: ✅\n`;
            } else {
                state += `Salon infos: salon ${args.game.infosChannelID} non trouvé\n`;
            }
        } else {
            state += `Salon infos: aucun salon associé\n`;
        };
        stateMsg.edit(stateMessage(state));


        if (args.game.statusChannelID != "") {
            const gameStatusChannel = message.guild.channels.cache.get(args.game.statusChannelID);
            if (gameStatusChannel) {
                args.game.statusChannelID = "";
                gameStatusChannel.delete("Suppression du jeu");
                state += `Salon statut: ✅\n`;
            } else {
                state += `Salon statut: salon ${args.game.statusChannelID} non trouvé\n`;
                args.game.statusChannelID = "";
            };
        } else {
            state += `Salon statut: aucun salon associé\n`;
        };
        stateMsg.edit(stateMessage(state));


        if (args.game.voiceChannelID != "") {
            const gameVoiceChannel = message.guild.channels.cache.get(args.game.voiceChannelID);
            if (gameVoiceChannel) {
                args.game.voiceChannelID = "";
                gameVoiceChannel.delete("Suppression du jeu");
                state += `Salon vocal: ✅\n`;
            } else {
                state += `Salon vocal: salon ${args.game.voiceChannelID} non trouvé\n`;
            };
        } else {
            state += `Salon vocal: aucun salon associé\n`;
        };
        stateMsg.edit(stateMessage(state));


        
        if (args.game.categoryID != "") {
            const gameCategory = message.guild.channels.cache.get(args.game.categoryID);
            if (gameCategory) {
                args.game.categoryID = "";
                gameCategory.delete("Suppression du jeu");
                state += `Catégorie: ✅\n`;
            } else {
                state += `Catégorie: catégorie ${args.game.categoryID} non trouvée\n`;
            };
        } else {
            state += `Catégorie: aucun catégorie associée\n`;
        };
        stateMsg.edit(stateMessage(state));


        args.game.actif = false;
        args.game.emoji = "";
        client.db_games.set(args.game.name, args.game);

        successMessage(textes.get('GAMES_GAME_DELETE_SUCCESS', args.game), message.channel);
        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = GameInactiveCommand;