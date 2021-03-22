const { Command } = require('discord-akairo');
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage, stateMessage } = require('../../utils/messages');
const textes = new (require(`../../utils/textes.js`));

class GameActiveCommand extends Command {
    constructor() {
        super('game-active', {
            aliases: ['game-active', 'gact'],
            category: '🟪 Jeux',
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
        const roleMembers = guild.roles.cache.find(r => r.name === message.settings.memberRole);
        const roleModerator = guild.roles.cache.find(r => r.name === message.settings.modRole);

        if (args.game.actif) {
            return errorMessage(textes.get("GAMES_GAME_ACTIVE_ERROR_GAME_ACTIVE", args.game.name), message.channel);
        };


        let states = [];
        states.push(textes.get("GAMES_GAME_ACTIVE_STATE_TITLE", args.game));
        states.push(" ");
        states.push(textes.get("GAMES_GAME_ACTIVE_STATE_ROLE_CREATE_START")); // states[2]
        states.push(textes.get("GAMES_GAME_ACTIVE_STATE_TEXTCHANNEL_CREATE_START")); // states[3]
        states.push(textes.get("GAMES_GAME_ACTIVE_STATE_TEXTCHANNELPERM_CREATE_START")); // states[4]

        let embedState = stateMessage(states.join("\n"));
        let stateMsg = await message.channel.send(embedState);


        let gameRole = await message.guild.roles.create({
            data: {
                name: args.game.name,
                color: message.settings.gameMainRoleColor,
                hoist: false,
                mentionable: true
            },
            reason: `Création du jeu ${args.game.name}`
        });
        if (gameRole) {
            args.game.roleID = gameRole.id;
            states[2] = textes.get("GAMES_GAME_ACTIVE_STATE_ROLE_CREATE_SUCCESS");
        } else {
            states[2] = textes.get("GAMES_GAME_ACTIVE_STATE_ROLE_CREATE_FAILED");
        };
        stateMsg.edit(stateMessage(states.join("\n")));
        await client.sleep(500);


        let textChannel;
        if (args.game.textChannelID === "") {
            textChannel = await message.guild.channels.create(`${args.game.name}`, {
                type: 'text'
            });
        } else {
            textChannel = await message.guild.channels.cache.get(args.game.textChannelID);
            await textChannel.setName(`${args.game.name}`)
        }
        if (textChannel) {
            args.game.textChannelID = textChannel.id;
            states[3] = textes.get("GAMES_GAME_ACTIVE_STATE_TEXTCHANNEL_CREATE_SUCCESS");
        } else {
            states[3] = textes.get("GAMES_GAME_ACTIVE_STATE_TEXTCHANNEL_CREATE_FAILED");
        };
        stateMsg.edit(stateMessage(states.join("\n")));
        await client.sleep(500);
        if (textChannel) {
            // await textChannel.setParent(gameCategory);
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
            await textChannel.createOverwrite(gameRole,{
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                ADD_REACTIONS: true,
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                SEND_TTS_MESSAGES: true,
                MANAGE_MESSAGES: true,
                EMBED_LINKS: true,
                ATTACH_FILES: true,
                READ_MESSAGE_HISTORY: true,
                MENTION_EVERYONE: false,
                USE_EXTERNAL_EMOJIS: true,
                MANAGE_ROLES: false,
                MANAGE_WEBHOOKS: false
            });
            await textChannel.createOverwrite(roleModerator, {
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                ADD_REACTIONS: true,
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                SEND_TTS_MESSAGES: true,
                MANAGE_MESSAGES: true,
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
            states[4] = textes.get("GAMES_GAME_ACTIVE_STATE_TEXTCHANNELPERM_CREATE_SUCCESS");
        };
        stateMsg.edit(stateMessage(states.join("\n")));
        await client.sleep(500);

        args.game.actif = true;
        args.game.emoji = await client.gameGetFreeEmoji();
        client.db_games.set(args.game.id, args.game);

        states.push(" ");
        states.push(textes.get("GAMES_GAME_ACTIVE_STATE_COPPLETE", args.game));
        stateMsg.edit(stateMessage(states.join("\n")));

        client.gamesJoinListPost(true);

        if (message.channel.type === 'text') message.delete();

  
    }

}
module.exports = GameActiveCommand;