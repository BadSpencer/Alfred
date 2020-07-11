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
        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = await client.db.getSettings(client);

        const roleEveryone = guild.roles.cache.find(r => r.name == "@everyone");
        const roleMembers = guild.roles.cache.find(r => r.name == settings.memberRole);
        const roleMod = guild.roles.cache.find(r => r.name == settings.modRole);

        if (args.game.actif) {
            return errorMessage(textes.get("GAMES_GAME_ACTIVE_ERROR_GAME_ACTIVE", args.game.name), message.channel);
        };


        let state = textes.get("GAMES_GAME_ACTIVE_STATE_START", args.game);
        let embedState = stateMessage(state);
        let stateMsg = await message.channel.send(embedState);


        // Vérification présence Catégorie


        let gameRole;
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
                }).then(async mainRole => {
                    args.game.roleID = mainRole.id;
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
                    })
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
        client.db_games.set(args.game.name, args.game);

        state += `Salons et rôles pour ${args.game.name} correctement créés\n`;
        stateMsg.edit(stateMessage(state));

        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = GameActiveCommand;