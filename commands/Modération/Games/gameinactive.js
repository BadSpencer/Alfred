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

        if (!args.game.actif) {
            return errorMessage(textes.get("GAMES_GAME_INACTIVE_ERROR_GAME_INACTIVE", args.game), message.channel);
        };

        const roleEveryone = guild.roles.cache.find(r => r.name == "@everyone");
        const roleMembers = guild.roles.cache.find(r => r.name == message.settings.memberRole);

        let states = [];
        states.push(textes.get("GAMES_GAME_INACTIVE_STATE_TITLE", args.game));
        states.push(" ");
        states.push(textes.get("GAMES_GAME_INACTIVE_STATE_ROLE_DELETE_START")); // states[2]
        states.push(textes.get("GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_RENAME_START")); // states[3]
        states.push(textes.get("GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_EVERYONEPERM_START")); // states[4]
        states.push(textes.get("GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_MEMBERPERM_START")); // states[5]


        let state = textes.get("GAMES_GAME_INACTIVE_STATE_START", args.game);

        let stateMsg = await message.channel.send(stateMessage(states.join("\n")));

        if (args.game.roleID !== "") {
            const gameRole = message.guild.roles.cache.get(args.game.roleID);
            if (gameRole) {
                gameRole.delete()
                    .then(deleted => {
                        states[2] = textes.get("GAMES_GAME_INACTIVE_STATE_ROLE_DELETE_SUCCESS");
                        args.game.roleID = "";
                    })
                    .catch(error => {
                        states[2] = textes.get("GAMES_GAME_INACTIVE_STATE_ROLE_DELETE_FAILED");
                        args.game.roleID = "";
                    });
            } else {
                states[2] = textes.get("GAMES_GAME_INACTIVE_STATE_ROLE_DELETE_NOT_FOUND", args.game.roleID);
                args.game.roleID = "";
            };
        } else {
            states[2] = textes.get("GAMES_GAME_INACTIVE_STATE_ROLE_DELETE_NO_ROLE");
        };
        stateMsg.edit(stateMessage(states.join("\n")));
        await client.sleep(500);


        if (args.game.textChannelID !== "") {
            const gameTextChannel = message.guild.channels.cache.get(args.game.textChannelID);
            if (gameTextChannel) {
                await client.sleep(1500);
                gameTextChannel.setName(`🔒${gameTextChannel.name}`)
                    .then(textChannel => {
                        states[3] = textes.get("GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_RENAME_SUCCESS");
                        stateMsg.edit(stateMessage(states.join("\n")));

                        textChannel.createOverwrite(roleEveryone, {
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
                                states[4] = textes.get("GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_EVERYONEPERM_SUCCESS");
                                stateMsg.edit(stateMessage(states.join("\n")));

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
                                        states[5] = textes.get("GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_MEMBERPERM_SUCCESS");
                                        stateMsg.edit(stateMessage(states.join("\n")));
                                    })
                                    .catch(error => {
                                        states[5] = textes.get("GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_MEMBERPERM_FAILED");
                                        stateMsg.edit(stateMessage(states.join("\n")));
                                    });
                            })
                            .catch(error => {
                                states[4] = textes.get("GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_EVERYONEPERM_FAILED");
                                stateMsg.edit(stateMessage(states.join("\n")));
                            });
                    })
                    .catch(error => {
                        states[3] = textes.get("GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_RENAME_FAILED");
                        stateMsg.edit(stateMessage(states.join("\n")));
                    });

            } else {
                states[3] = textes.get("GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_RENAME_NOT_FOUND", args.game.textChannelID);
                states[4] = textes.get("GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_EVERYONEPERM_NOT_FOUND", args.game.textChannelID);
                states[5] = textes.get("GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_MEMBERPERM_NOT_FOUND", args.game.textChannelID);
                args.game.textChannelID = "";
                stateMsg.edit(stateMessage(states.join("\n")));
            };
        } else {
            states[3] = textes.get("GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_RENAME_NO_ID");
            states[4] = textes.get("GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_EVERYONEPERM_NO_ID");
            states[5] = textes.get("GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_MEMBERPERM_NO_ID");
            stateMsg.edit(stateMessage(states.join("\n")));
        }
        stateMsg.edit(stateMessage(states.join("\n")));
        await client.sleep(500);


        args.game.roleID = "";
        args.game.actif = false;
        args.game.emoji = "";
        client.db_games.set(args.game.id, args.game);

        client.gamesJoinListPost(true);

        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = GameInactiveCommand;