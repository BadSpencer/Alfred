const { Command } = require('discord-akairo');
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage, stateMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class GameActiveCommand extends Command {
    constructor() {
        super('game-active', {
            aliases: ['game-active', 'gact'],
            category: 'Jeux',
            description: {
                content: textes.get('GAMES_GAME_ACTIVE_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMES_GAME_ACTIVE_DESCRIPTION_USAGE'),
                examples: ['!game-active', '!gact']
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
                    await this.client.gamesListPost(message.channel, 'inactif');
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

        const roleEveryone = guild.roles.cache.find(r => r.name === "@everyone");
        const roleMembers = guild.roles.cache.find(r => r.name === settings.memberRole);
        const roleMod = guild.roles.cache.find(r => r.name === settings.modRole);

        if (args.game.actif) {
            return errorMessage(textes.get("GAMES_GAME_ACTIVE_ERROR_GAME_ACTIVE", args.game.name), message.channel);
        };


        let state = textes.get("GAMES_GAME_ACTIVE_STATE_START", args.game);
        let embedState = stateMessage(state);
        let stateMsg = await message.channel.send(embedState);


        // Catégorie
        let gameCategory;
        if (args.game.categoryID === "") {
            state += `Catégorie: Création\n`;
            gameCategory = await message.guild.channels.create(`${settings.gameCategoryPrefix}${args.game.name}`, {
                type: "category"
            });
        } else {
            state += `Catégorie: Réactivation\n`;
            gameCategory = await message.guild.channels.cache.get(args.game.categoryID);
            await gameCategory.setName(`${settings.gameCategoryPrefix}${args.game.name}`)
        };
        if (gameCategory) {
            args.game.categoryID = gameCategory.id;
            state += `Catégorie: ✅\n`;

        } else {
            state += `Catégorie: 🟥 Non disponible\n`;
        };
        stateMsg.edit(stateMessage(state));
        await client.sleep(500);




        let gameRole = await message.guild.roles.create({
            data: {
                name: args.game.name,
                color: settings.gameMainRoleColor,
                hoist: false,
                mentionable: true
            },
            reason: `Création du jeu ${args.game.name}`
        });
        if (gameRole) {
            args.game.roleID = gameRole.id;
            state += `Rôle: ✅\n`;
        } else {
            state += `Rôle: 🟥 Non disponible\n`;
        };
        stateMsg.edit(stateMessage(state));
        await client.sleep(500);

        let gamePlayRole = await message.guild.roles.create({
            data: {
                name: `Joue à ${args.game.name}`,
                color: settings.gamePlayRoleColor,
                hoist: true,
                mentionable: false
            },
            reason: `Création du jeu ${args.game.name}`
        })
        if (gamePlayRole) {
            args.game.playRoleID = gamePlayRole.id;
            state += `Rôle "Joue à": ✅\n`;
        } else {
            state += `Rôle "Joue à": 🟥 Non disponible\n`;
        };
        stateMsg.edit(stateMessage(state));
        await client.sleep(500);

        let textChannel;
        if (args.game.textChannelID === "") {
            textChannel = await message.guild.channels.create(`${settings.gameTextPrefix}discussions`, {
                type: 'text'
            });
        } else {
            textChannel = await message.guild.channels.cache.get(args.game.textChannelID);
            await textChannel.setName(`${settings.gameTextPrefix}discussions`)
        }
        if (textChannel) {
            args.game.textChannelID = textChannel.id;
            state += `Discussions: ✅\n`;
        } else {
            state += `Discussions: 🟥 Non disponible\n`;
        };
        stateMsg.edit(stateMessage(state));
        await client.sleep(500);
        if (textChannel) {
            await textChannel.setParent(gameCategory);
            await client.sleep(500);
            await textChannel.createOverwrite(roleEveryone, {
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
            });
            await client.sleep(500);
            await textChannel.createOverwrite(gameRole, {
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                ADD_REACTIONS: true,
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                SEND_TTS_MESSAGES: true,
                MANAGE_MESSAGES: false,
                EMBED_LINKS: true,
                ATTACH_FILES: true,
                READ_MESSAGE_HISTORY: true,
                MENTION_EVERYONE: false,
                USE_EXTERNAL_EMOJIS: true,
                MANAGE_ROLES: false,
                MANAGE_WEBHOOKS: false
            });
            await client.sleep(500);
            await textChannel.createOverwrite(roleMembers, {
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                ADD_REACTIONS: true,
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                SEND_TTS_MESSAGES: true,
                MANAGE_MESSAGES: false,
                EMBED_LINKS: true,
                ATTACH_FILES: true,
                READ_MESSAGE_HISTORY: true,
                MENTION_EVERYONE: false,
                USE_EXTERNAL_EMOJIS: true,
                MANAGE_ROLES: false,
                MANAGE_WEBHOOKS: false
            });
            state += `Discussions (perm): ✅\n`;
        };
        stateMsg.edit(stateMessage(state));
        await client.sleep(500);


        let gameVoiceChannel = await message.guild.channels.create(`🔈${args.game.name}`, {
            type: 'voice'
        });
        if (gameVoiceChannel) {
            args.game.voiceChannelID = gameVoiceChannel.id;
            state += `Salon Vocal: ✅\n`;
        } else {
            state += `Salon Vocal: 🟥 Non disponible\n`;
        };
        stateMsg.edit(stateMessage(state));
        await client.sleep(500);
        if (gameVoiceChannel) {
            gameVoiceChannel.setParent(gameCategory);
            await client.sleep(500);
            gameVoiceChannel.createOverwrite(roleEveryone, {
                VIEW_CHANNEL: false,
                CONNECT: false,
            });
            await client.sleep(500);
            gameVoiceChannel.createOverwrite(gameRole, {
                VIEW_CHANNEL: true,
                CONNECT: true,
            });
            await client.sleep(500);
            gameVoiceChannel.createOverwrite(roleMembers, {
                VIEW_CHANNEL: false,
                CONNECT: false,
            });
            state += `Salon Vocal (perm): ✅\n`;
        };
        stateMsg.edit(stateMessage(state));
        await client.sleep(500);

        let infosChannel = await message.guild.channels.create(`${settings.gameInfosPrefix}informations`, {
            type: 'text'
        });
        if (infosChannel) {
            args.game.infosChannelID = infosChannel.id;
            state += `Salon Informations: ✅\n`;
        } else {
            state += `Salon Informations: 🟥 Non disponible\n`;
        };
        stateMsg.edit(stateMessage(state));
        if (infosChannel) {
            await infosChannel.setParent(gameCategory);
            await client.sleep(500);
            await infosChannel.setPosition(1);
            await client.sleep(500);
            await infosChannel.createOverwrite(roleEveryone, {
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
            });
            await client.sleep(500);
            await infosChannel.createOverwrite(gameRole, {
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                ADD_REACTIONS: false,
                VIEW_CHANNEL: true,
                SEND_MESSAGES: false,
                SEND_TTS_MESSAGES: false,
                MANAGE_MESSAGES: false,
                EMBED_LINKS: false,
                ATTACH_FILES: false,
                READ_MESSAGE_HISTORY: true,
                MENTION_EVERYONE: false,
                USE_EXTERNAL_EMOJIS: false,
                MANAGE_ROLES: false,
                MANAGE_WEBHOOKS: false
            });
            await client.sleep(500);
            await infosChannel.createOverwrite(roleMembers, {
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                ADD_REACTIONS: false,
                VIEW_CHANNEL: true,
                SEND_MESSAGES: false,
                SEND_TTS_MESSAGES: false,
                MANAGE_MESSAGES: false,
                EMBED_LINKS: false,
                ATTACH_FILES: false,
                READ_MESSAGE_HISTORY: true,
                MENTION_EVERYONE: false,
                USE_EXTERNAL_EMOJIS: false,
                MANAGE_ROLES: false,
                MANAGE_WEBHOOKS: false
            });
            state += `Salon Informations (perm): ✅\n`;
        };
        stateMsg.edit(stateMessage(state));
        await client.sleep(500);


        args.game.actif = true;
        args.game.emoji = await client.gameGetFreeEmoji();
        client.db_games.set(args.game.id, args.game);

        state += `Salons et rôles pour ${args.game.name} correctement créés\n`;
        stateMsg.edit(stateMessage(state));

        return;



        if (args.game.categoryID == "" && args.game.textChannelID == "") {
            let gameCategory = await message.guild.channels.create(`${settings.gameCategoryPrefix}${args.game.name}`, {
                type: "category"
            }).then(async category => {

                args.game.categoryID = category.id;
                category.setPosition(99);
                state += `Catégorie: ✅\n`;
                stateMsg.edit(stateMessage(state));

                gameRole = await message.guild.roles.create({
                    data: {
                        name: args.game.name,
                        color: settings.gameMainRoleColor,
                        hoist: false,
                        mentionable: true
                    },
                    reason: `Création du jeu ${args.game.name}`
                }).then(async gameRole => {
                    args.game.roleID = gameRole.id;
                    state += `Rôle principal: ✅\n`;
                    stateMsg.edit(stateMessage(state));

                    message.guild.channels.create(`${settings.gameTextPrefix}discussions`, {
                        type: 'text'
                    }).then(textChannel => {
                        args.game.textChannelID = textChannel.id;
                        textChannel.setParent(category);
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
                        });
                        textChannel.createOverwrite(gameRole, {
                            CREATE_INSTANT_INVITE: false,
                            MANAGE_CHANNELS: false,
                            ADD_REACTIONS: true,
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: true,
                            SEND_TTS_MESSAGES: true,
                            MANAGE_MESSAGES: false,
                            EMBED_LINKS: true,
                            ATTACH_FILES: true,
                            READ_MESSAGE_HISTORY: true,
                            MENTION_EVERYONE: false,
                            USE_EXTERNAL_EMOJIS: true,
                            MANAGE_ROLES: false,
                            MANAGE_WEBHOOKS: false
                        });
                        textChannel.createOverwrite(roleMembers, {
                            CREATE_INSTANT_INVITE: false,
                            MANAGE_CHANNELS: false,
                            ADD_REACTIONS: true,
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: true,
                            SEND_TTS_MESSAGES: true,
                            MANAGE_MESSAGES: false,
                            EMBED_LINKS: true,
                            ATTACH_FILES: true,
                            READ_MESSAGE_HISTORY: true,
                            MENTION_EVERYONE: false,
                            USE_EXTERNAL_EMOJIS: true,
                            MANAGE_ROLES: false,
                            MANAGE_WEBHOOKS: false
                        });
                    }).then(

                        message.guild.channels.create(`🔈${args.game.name}`, {
                            type: 'voice'
                        }).then(gameVoiceChannel => {
                            args.game.voiceChannelID = gameVoiceChannel.id;
                            gameVoiceChannel.setParent(category)

                        })
                    )
                })
            })
        } else {
            gameRole = await message.guild.roles.create({
                data: {
                    name: args.game.name,
                    color: settings.gameMainRoleColor,
                    hoist: false,
                    mentionable: true
                },
                reason: `Création du jeu ${args.game.name}`
            }).then(async mainRole => {
                args.game.roleID = mainRole.id;
                state += `Rôle principal: ✅\n`;
                stateMsg.edit(stateMessage(state));

                let gameCategory = message.guild.channels.cache.get(args.game.categoryID);
                await gameCategory.setName(`${settings.gameCategoryPrefix}${args.game.name}`)
                state += `Catégorie: ✅ (réactivation)\n`;
                stateMsg.edit(stateMessage(state));

                let textChannel = message.guild.channels.cache.get(args.game.textChannelID);
                await textChannel.setName(`${settings.gameTextPrefix}discussions`)
                state += `Salon discussions: ✅ (réactivation)\n`;
                stateMsg.edit(stateMessage(state));

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
                });
                textChannel.createOverwrite(mainRole, {
                    CREATE_INSTANT_INVITE: false,
                    MANAGE_CHANNELS: false,
                    ADD_REACTIONS: true,
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    SEND_TTS_MESSAGES: true,
                    MANAGE_MESSAGES: false,
                    EMBED_LINKS: true,
                    ATTACH_FILES: true,
                    READ_MESSAGE_HISTORY: true,
                    MENTION_EVERYONE: false,
                    USE_EXTERNAL_EMOJIS: true,
                    MANAGE_ROLES: false,
                    MANAGE_WEBHOOKS: false
                });
                textChannel.createOverwrite(roleMembers, {
                    CREATE_INSTANT_INVITE: false,
                    MANAGE_CHANNELS: false,
                    ADD_REACTIONS: true,
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    SEND_TTS_MESSAGES: true,
                    MANAGE_MESSAGES: false,
                    EMBED_LINKS: true,
                    ATTACH_FILES: true,
                    READ_MESSAGE_HISTORY: true,
                    MENTION_EVERYONE: false,
                    USE_EXTERNAL_EMOJIS: true,
                    MANAGE_ROLES: false,
                    MANAGE_WEBHOOKS: false
                });
                state += `Permissions: ✅\n`;
                stateMsg.edit(stateMessage(state));

                message.guild.channels.create(`🔈${args.game.name}`, {
                    type: 'voice'
                }).then(gameVoiceChannel => {
                    args.game.voiceChannelID = gameVoiceChannel.id;
                    gameVoiceChannel.setParent(gameCategory)

                })
            })
        };





        // Création du rôle "Joue à"
        let playRole = await message.guild.roles.create({
            data: {
                name: `Joue à ${args.game.name}`,
                color: settings.gamePlayRoleColor,
                hoist: true,
                mentionable: false
            },
            reason: `Création du jeu ${args.game.name}`
        }).then(playRole => {
            args.game.playRoleID = playRole.id;
            state += `Rôle "Joue à": ✅\n`;
        })
        stateMsg.edit(stateMessage(state));




        args.game.actif = true;
        args.game.emoji = await client.gameGetFreeEmoji();
        client.db_games.set(args.game.id, args.game);

        state += `Salons et rôles pour ${args.game.name} correctement créés\n`;
        stateMsg.edit(stateMessage(state));

        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = GameActiveCommand;