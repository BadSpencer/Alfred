const { Command } = require("discord-akairo");
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage, stateMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class GameInactiveCommand extends Command {
    constructor() {
        super('game-inactive', {
            aliases: ['game-inactive', 'ginact'],
            category: 'Jeux',
            description: {
                content: textes.get('GAMES_GAME_INACTIVE_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMES_GAME_INACTIVE_DESCRIPTION_USAGE'),
                examples: ['!game-inactive', '!ginact']
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
                    await this.client.gamesListPost(message.channel, 'actif');
                    return promptMessage(textes.get('GAMES_GAME_EDIT_GAME_PROMPT'))
                },
                retry: message => promptMessage(textes.get('GAMES_GAME_EDIT_GAME_RETRY')),
            }
        };



        return { game };
    }

    async exec(message, args) {
        let client = this.client;
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        if (!args.game.actif) {
            return errorMessage(textes.get("GAMES_GAME_INACTIVE_ERROR_GAME_INACTIVE", args.game.name), message.channel);
        };

        const roleEveryone = guild.roles.cache.find(r => r.name == "@everyone");
        const roleMembers = guild.roles.cache.find(r => r.name == settings.memberRole);

        let state = textes.get("GAMES_GAME_INACTIVE_STATE_START", args.game);
        let embedState = stateMessage(state);
        let stateMsg = await message.channel.send(embedState);

        if (args.game.roleID !== "") {
            const gameRole = message.guild.roles.cache.get(args.game.roleID);
            if (gameRole) {
                gameRole.delete()
                    .then(deleted => {
                        state += `Rôle principal: ✅ supprimé\n`;
                        stateMsg.edit(stateMessage(state));
                        args.game.roleID = "";
                    })
                    .catch(error => {
                        state += `Rôle principal: 🟥 ${error}\n`;
                        stateMsg.edit(stateMessage(state));
                        args.game.roleID = "";
                    });
            } else {
                state += `Rôle principal: 🟥 non trouvé (${args.game.roleID})\n`;
                stateMsg.edit(stateMessage(state));
                args.game.roleID = "";
            };
        } else {
            state += `Rôle principal: aucun rôle associé\n`;
            stateMsg.edit(stateMessage(state));
        };
        await client.sleep(500);



        const gamePlayRole = message.guild.roles.cache.get(args.game.playRoleID);
        if (gamePlayRole) {
            gamePlayRole.delete()
                .then(deleted => {
                    state += `Rôle "Joue à": ✅ supprimé\n`;
                    stateMsg.edit(stateMessage(state));
                })
                .catch(error => {
                    state += `Rôle "Joue à": 🟥 ${error}\n`;
                    stateMsg.edit(stateMessage(state));
                });
        } else {
            state += `Rôle "Joue à": 🟥 non trouvé\n`;
            stateMsg.edit(stateMessage(state));
        }
        args.game.playRoleID = "";
        await client.sleep(500);

        const gameCategory = message.guild.channels.cache.get(args.game.categoryID);
        if (gameCategory) {
            gameCategory.setName(`🔒${settings.gameCategoryPrefix}${args.game.name}`)
                .then(deleted => {
                    state += `Catégorie: ✅ renommée\n`;
                    stateMsg.edit(stateMessage(state));
                })
                .catch(error => {
                    state += `Catégorie: 🟥 ${error}\n`;
                    stateMsg.edit(stateMessage(state));
                });
        } else {
            state += `Catégorie: 🟥 non trouvée\n`;
            args.game.categoryID = "";
            stateMsg.edit(stateMessage(state));
        }
        await client.sleep(500);

        const gameTextChannel = message.guild.channels.cache.get(args.game.textChannelID);
        if (gameTextChannel) {
            gameTextChannel.setName(`🔒${settings.gameTextPrefix}discussions`)
                .then(textChannel => {
                    state += `Salon discussion: ✅ renommé\n`;
                    stateMsg.edit(stateMessage(state));
                })
                .catch(error => {
                    state += `Salon discussion: 🟥 ${error}\n`;
                    stateMsg.edit(stateMessage(state));
                });
                await client.sleep(500);
            gameTextChannel.createOverwrite(roleEveryone, {
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                ADD_REACTIONS: false,
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false,
                SEND_TTS_MESSAGES: false,
                MANAGE_MESSAGES: false,
                EMBED_LINKS: false,
                ATTACH_FILES: false,
                READ_MESSAGE_HISTORY: false,
                MENTION_EVERYONE: false,
                USE_EXTERNAL_EMOJIS: false,
                MANAGE_ROLES: false,
                MANAGE_WEBHOOKS: false
            })
                .then(textChannel => {
                    state += `Salon discussion: ✅ verrouillé pour Everyone\n`;
                    stateMsg.edit(stateMessage(state));
                })
                .catch(error => {
                    state += `Salon discussion: 🟥 ${error}\n`;
                    stateMsg.edit(stateMessage(state));
                });
                await client.sleep(500);
            gameTextChannel.createOverwrite(roleMembers, {
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                ADD_REACTIONS: false,
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false,
                SEND_TTS_MESSAGES: false,
                MANAGE_MESSAGES: false,
                EMBED_LINKS: false,
                ATTACH_FILES: false,
                READ_MESSAGE_HISTORY: false,
                MENTION_EVERYONE: false,
                USE_EXTERNAL_EMOJIS: false,
                MANAGE_ROLES: false,
                MANAGE_WEBHOOKS: false
            })
                .then(textChannel => {
                    state += `Salon discussion: ✅ verrouillé pour Membres\n`;
                    stateMsg.edit(stateMessage(state));
                })
                .catch(error => {
                    state += `Salon discussion: 🟥 ${error}\n`;
                    stateMsg.edit(stateMessage(state));
                });
        } else {
            state += `Salon discussion: 🟥 non trouvé\n`;
            args.game.textChannelID = "";
            stateMsg.edit(stateMessage(state));
        };
        await client.sleep(500);

        const gameInfosChannel = message.guild.channels.cache.get(args.game.infosChannelID);
        if (gameInfosChannel) {
            gameInfosChannel.delete()
                .then(deleted => {
                    state += `Salon Informations: ✅ supprimé\n`;
                    stateMsg.edit(stateMessage(state));
                })
                .catch(error => {
                    state += `Salon Informations: 🟥 ${error}\n`;
                    stateMsg.edit(stateMessage(state));
                });
        } else {
            state += `Salon Informations: 🟥 non trouvé\n`;
            stateMsg.edit(stateMessage(state));
        };
        args.game.infosChannelID = "";
        args.game.infosMessageID = "";
        await client.sleep(500);

        const gameStatutChannel = message.guild.channels.cache.get(args.game.statusChannelID);
        if (gameStatutChannel) {
            gameStatutChannel.delete()
                .then(deleted => {
                    state += `Salon Statut: ✅ supprimé\n`;
                    stateMsg.edit(stateMessage(state));
                })
                .catch(error => {
                    state += `Salon Statut: 🟥 ${error}\n`;
                    stateMsg.edit(stateMessage(state));
                });
        } else {
            state += `Salon Statut: 🟥 non trouvé\n`;
            stateMsg.edit(stateMessage(state));
        };
        args.game.statusChannelID = "";
        await client.sleep(500);

        const gameVoiceChannel = message.guild.channels.cache.get(args.game.voiceChannelID);
        if (gameVoiceChannel) {
            gameVoiceChannel.delete()
            .then(deleted => {
                state += `Salon Vocal: ✅ supprimé\n`;
                stateMsg.edit(stateMessage(state));
            })
            .catch(error => {
                state += `Salon Vocal: 🟥 ${error}\n`;
                stateMsg.edit(stateMessage(state));
            });
        } else {
            state += `Salon Vocal: 🟥 non trouvé\n`;
            stateMsg.edit(stateMessage(state));
        };
        args.game.voiceChannelID = "";
        await client.sleep(500);

        args.game.roleID = "";
        args.game.actif = false;
        args.game.emoji = "";
        client.db_games.set(args.game.id, args.game);

        successMessage(textes.get('GAMES_GAME_INACTIVE_SUCCESS', args.game), message.channel);
        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = GameInactiveCommand;