const { Command } = require("discord-akairo");
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage, stateMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class GameInfosCommand extends Command {
    constructor() {
        super('game-infos', {
            aliases: ['game-infos', 'ginfos'],
            category: 'Jeux',
            description: {
                content: textes.get('GAMES_GAME_INFOS_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMES_GAME_INFOS_DESCRIPTION_USAGE'),
                examples: ['!game-infos', '!ginfos']
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
                    return promptMessage(textes.get('GAMES_GAME_INFOS_GAME_PROMPT'))
                },
                retry: message => promptMessage(textes.get('GAMES_GAME_INFOS_GAME_RETRY')),
            }
        };



        return { game };
    }

    async exec(message, args) {
        let client = this.client;
        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = await client.db.getSettings(client);

        const gameCategory = message.guild.channels.cache.get(args.game.categoryID);
        const gameRole = message.guild.roles.cache.get(args.game.roleID);
        const roleEveryone = guild.roles.cache.find(r => r.name == "@everyone");
        const roleMembers = guild.roles.cache.find(r => r.name == settings.memberRole);

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
        client.db_games.set(args.game.name, args.game);


        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = GameInfosCommand;