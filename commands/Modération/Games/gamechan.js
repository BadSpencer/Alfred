const { Command } = require("discord-akairo");
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage, stateMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class GameChanCommand extends Command {
    constructor() {
        super('game-channel', {
            aliases: ['game-channel', 'gchan'],
            category: 'Jeux',
            description: {
                content: textes.get('GAMES_GAME_CHAN_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMES_GAME_CHAN_DESCRIPTION_USAGE'),
                examples: ['!game-infos', '!ginfos']
            },
            split: 'quoted',
        });
    }


    async *args(message) {
        const game = yield {
            type: "game",
            prompt: {
                start: async message => {
                    await this.client.gamesListPost(message.channel, 'tout');
                    return promptMessage(textes.get('GAMES_GAME_CHAN_GAME_PROMPT'))
                },
                retry: message => promptMessage(textes.get('GAMES_CHAN_INFOS_GAME_RETRY')),
            }
        };

        const chan = yield {
            type: ['infos', 'event'],
            prompt: {
                start: async message => {
                    return promptMessage(textes.get('GAMES_GAME_CHAN_CHAN_PROMPT'))
                },
                retry: message => promptMessage(textes.get('GAMES_GAME_CHAN_CHAN_RETRY')),
            }
        }



        return { game, chan };
    }

    async exec(message, args) {
        let client = this.client;
        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = client.getSettings();

        const gameCategory = message.guild.channels.cache.get(args.game.categoryID);
        const gameRole = message.guild.roles.cache.get(args.game.roleID);
        const roleEveryone = guild.roles.cache.find(r => r.name == "@everyone");
        const roleMembers = guild.roles.cache.find(r => r.name == settings.memberRole);



        switch (args.chan) {
            case 'infos':
                await message.guild.channels.create(`${settings.gameInfosPrefix}informations`, {
                    type: 'text'
                }).then(gameInfosChannel => {
                    args.game.infosChannelID = gameInfosChannel.id;
                    gameInfosChannel.setParent(gameCategory);

                    gameInfosChannel.createOverwrite(roleEveryone, {
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
                    gameInfosChannel.createOverwrite(gameRole, {
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

                    gameInfosChannel.createOverwrite(roleMembers, {
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
                    successMessage(`Salon ${gameInfosChannel.name} créé`, message.channel);
                })
                client.db_games.set(args.game.id, args.game);
                break;

                case 'event':
                    await message.guild.channels.create(`${settings.gameEventPrefix}évènements`, {
                        type: 'text'
                    }).then(gameEventsChannel => {
                        args.game.eventsChannelID = gameEventsChannel.id;
                        gameEventsChannel.setParent(gameCategory);
    
                        gameEventsChannel.createOverwrite(roleEveryone, {
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
                        gameEventsChannel.createOverwrite(gameRole, {
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
    
                        gameEventsChannel.createOverwrite(roleMembers, {
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
                        successMessage(`Salon ${gameEventsChannel.name} créé`, message.channel);
                    })
                    client.db_games.set(args.game.id, args.game);
                break;
        }


        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = GameChanCommand;