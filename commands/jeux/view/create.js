const { Command } = require('discord-akairo');
const { successMessage, errorMessage, warnMessage } = require('../../../utils/messages');
class GamesCreateCommand extends Command {
    constructor() {
        super('games-create', {
            aliases: ['games-create'],
            category: 'games',
            description: {
                content: 'Création des salons et rôles pour un jeu',
                usage: '!game create <nom du jeu>',
            },
            args: [{
                id: 'gamename',
                match: 'content',
            }],
        });
    }
    async exec(message, args) {
        const guild = client.guilds.get(client.config.guildID);
        let game = this.client.db_games.get(args.gamename);
        let settings = await this.client.db.getSettings(this.client);

        const roleEveryone = guild.roles.find(r => r.name == "@everyone");
        const roleMembers = guild.roles.find(r => r.name == settings.memberRole);

        if (!game) return errorMessage(`Le jeu ${args.gamename} n'a pas été trouvé`, message);


        // Création du rôle principal
        await message.guild.createRole({
            name: args.gamename,
            color: settings.gameMainRoleColor,
            hoist: false,
            mentionable: true
        }).then(mainRole => {
            successMessage(`Rôle principal ${mainRole.name} créé`, message);
        })

        // Création du rôle "Joue à"
        await message.guild.createRole({
            name: `Joue à ${args.gamename}`,
            color: settings.gamePlayRoleColor,
            hoist: true,
            mentionable: false
        }).then(mainRole => {
            game.roleID = mainRole.id;
            successMessage(`Rôle "Joue à" ${mainRole.name} créé`, message);
        })

        // Création categorie
        await message.guild.createChannel(`🔒${settings.gameCategoryPrefix}${args.gamename}`, {
            type: "category"
        }).then(async category => {
            game.categoryID = category.id;
            category.setPosition(99);
            successMessage(`Catégorie ${category.name} créée`, message);
            // Création du salon informations du jeu 
            await message.guild.createChannel(`${settings.gameInfosPrefix}informations`, {
                type: 'text'
            }).then(infochannel => {
                game.infosChannelID = infochannel.id;
                infochannel.setParent(category);
                infochannel.overwritePermissions(roleEveryone, {
                    'READ_MESSAGES': false,
                  });
                  infochannel.overwritePermissions(roleMembers, {
                    'READ_MESSAGES': false,
                  });
                successMessage(`Salon ${infochannel.name} créé`, message);
            })
            // Création du salon discussions du jeu 
            await message.guild.createChannel(`${settings.gameTextPrefix}discussions`, {
                type: 'text'
            }).then(textchannel => {
                game.textChannelID = textchannel.id;
                textchannel.setParent(category);
                textchannel.overwritePermissions(roleEveryone, {
                    'READ_MESSAGES': false,
                  });
                textchannel.overwritePermissions(roleMembers, {
                    'READ_MESSAGES': false,
                  });
                successMessage(`Salon ${textchannel.name} créé`, message);
            })
            // Création du salon vocal du jeu 
            /*
            await message.guild.createChannel(`🔈 ${args.gamename}`, {
                type: 'voice'
            }).then(voicechannel => {
                game.voiceChannelID = voicechannel.id;
                voicechannel.setParent(category);
                successMessage(`Salon vocal ${voicechannel.name} créé`, message);
            })
            */
        })

        await this.client.db_games.set(args.gamename, game);

        // Création du salon discussions du jeu 



        // Création du salon vocal du jeu



    }
}
module.exports = GamesCreateCommand;