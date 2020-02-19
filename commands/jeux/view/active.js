const { Command } = require('discord-akairo');
const { successMessage, errorMessage, warnMessage } = require('../../../utils/messages');
class GamesActiveCommand extends Command {
    constructor() {
        super('games-active', {
            aliases: ['games-active'],
            category: 'games',
            description: {
                content: 'Active un jeu',
                usage: '!game create <nom du jeu>',
            },
            args: [{
                id: 'gamename',
                match: 'content',
            }],
        });
    }
    async exec(message, args) {
        const guild = this.client.guilds.get(this.client.config.guildID);
        let game = this.client.db_games.get(args.gamename);
        let settings = await this.client.db.getSettings(this.client);

        if (!game) return errorMessage(`Le jeu ${args.gamename} n'a pas été trouvé`, message);
        if (game.actif) return errorMessage(`Le jeu ${args.gamename} est déjà actif`, message);

        //const roleEveryone = guild.roles.find(r => r.name == "@everyone");
        const roleMembers = guild.roles.find(r => r.name == settings.memberRole);
        if (!roleMembers) return errorMessage(`Le rôle "Membres n'a pas été trouvé (memberRole:${settings.memberRole})`, message);
        const roleMod = guild.roles.find(r => r.name == settings.modRole);
        if (!roleMod) return errorMessage(`Le rôle "Modérateurs" n'a pas été trouvé (modRole:${settings.modRole})`, message);
        const gameRole = message.guild.roles.get(game.roleID);
        if (!gameRole) return errorMessage(`Le rôle principal du jeu n'a pas été trouvé (roleID:${game.roleID})`, message);
        const gameCategory = message.guild.channels.get(game.categoryID);
        if (!gameCategory) return errorMessage(`La catégorie du jeu n'a pas été trouvée (categoryID:${game.categoryID})`, message);
        const gameTextChannel = message.guild.channels.get(game.textChannelID);
        if (!gameTextChannel) return errorMessage(`Le salon discussions du jeu n'a pas été trouvée (textChannelID:${game.textChannelID})`, message);


        await gameCategory.setName(`${settings.gameCategoryPrefix}${args.gamename}`);
        await gameTextChannel.overwritePermissions(gameRole, {
            'READ_MESSAGES': true,
            'SEND_MESSAGES': true,
            'SEND_TTS_MESSAGES': true,
            'EMBED_LINKS': true,
            'ATTACH_FILES': true,
            'READ_MESSAGE_HISTORY': true,
            'MENTION_EVERYONE': false,
            'USE_EXTERNAL_EMOJIS': true,
            'ADD_REACTIONS': true,
        });
        await gameTextChannel.overwritePermissions(roleMembers, {
            'READ_MESSAGES': true,
            'SEND_MESSAGES': true,
            'SEND_TTS_MESSAGES': true,
            'EMBED_LINKS': true,
            'ATTACH_FILES': true,
            'READ_MESSAGE_HISTORY': true,
            'MENTION_EVERYONE': false,
            'USE_EXTERNAL_EMOJIS': true,
            'ADD_REACTIONS': true,
        });
        await gameTextChannel.overwritePermissions(roleMod, {
            'READ_MESSAGES': true,
            'SEND_MESSAGES': true,
            'SEND_TTS_MESSAGES': true,
            'MANAGE_MESSAGES': true,
            'EMBED_LINKS': true,
            'ATTACH_FILES': true,
            'READ_MESSAGE_HISTORY': true,
            'MENTION_EVERYONE': false,
            'USE_EXTERNAL_EMOJIS': true,
            'ADD_REACTIONS': true,
        });

        /*
        const gameInfosChannel = message.guild.channels.get(game.infosChannelID);
        const gameVoiceChannel = message.guild.channels.get(game.voiceChannelID);
        const gameJoinChannel = message.guild.channels.get(game.joinChannelID);
        */
       game.actif = true;
       this.client.db_games.set(args.gamename, game);


    }
}
module.exports = GamesActiveCommand;