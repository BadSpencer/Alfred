const fs = require('fs');
const Discord = require("discord.js");
const {
    Permissions, MessageAttachment
} = require("discord.js");
const {
    Command
} = require("discord-akairo");
const {
    inspect
} = require("util");
const {
    successMessage,
    errorMessage,
    warnMessage
} = require('../../utils/messages');
class GamesCommand extends Command {
    constructor() {
        super('games', {
            aliases: ['games', 'g'],
            category: 'Admin',
            description: {
                content: 'Gestion des jeux',
                usage: '<action> <...arguments>',
            },
        });
    }

    *args(message) {
        const action = yield {
            type: [
                "liste",
                "listall",
                "score",
                "add",
                "view",
                "create",
                "active",
                "inactive",
                "delete",
                "voice",
                "statut",
                "infos",
                "players"
            ],
             
        };

        const game = yield {
            type: "game",
            match: "rest",
            default: null,
        };
        return { action, game };
    }


    async exec(message, args) {

        let client = this.client;
        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = await client.db.getSettings(client);

        const roleEveryone = guild.roles.cache.find(r => r.name == "@everyone");
        const roleMembers = guild.roles.cache.find(r => r.name == settings.memberRole);
        const roleMod = guild.roles.cache.find(r => r.name == settings.modRole);

        switch (args.action) {
            case 'liste': {
                client.db.enmapDisplay(client, client.db_games.filter(rec => rec.actif == true), message.channel);
                break;
            }
            case 'listall': {
                client.db.enmapDisplay(client, client.db_games, message.channel);
                break;
            }
            case "players": {
                if (!args.game) return errorMessage(`Veuillez spécifier un jeu pour cette action\nLancez la commande \`!games\` pour connaitre la liste des jeux`)
                client.gamesPlayersDetail(args.game.name, message);
                break;
            }
            case 'add': {
                await client.gamesCreate(args.game.name)
                break;
            }
            case 'view': {
                message.channel.send(`Données de **${args.game.name}**\n\`\`\`json\n${inspect(args.game)}\n\`\`\``)
                break;
            }
            case 'create': {
                let statusMessage = await message.channel.send(`Création des rôles et salons pour ${args.game.name}...`);

                // Création du rôle principal
                await message.guild.roles.create({
                        data: {
                            name: args.game.name,
                            color: settings.gameMainRoleColor,
                            hoist: false,
                            mentionable: true
                        },
                        reason: `Création du jeu ${args.game.name}`
                    }).then(mainRole => {
                        args.game.roleID = mainRole.id;
                        statusMessage.edit(`Rôle principal ${mainRole.name} créé`);
                    })

                // Création du rôle "Joue à"
                await message.guild.roles.create({
                    data: {
                        name: `Joue à ${args.game.name}`,
                        color: settings.gamePlayRoleColor,
                        hoist: true,
                        mentionable: false
                    },
                    reason: `Création du jeu ${args.game.name}`
                }).then(playRole => {
                    args.game.playRoleID = playRole.id;
                    statusMessage.edit(`Rôle "Joue à" ${playRole.name} créé`);
                })

                // Création categorie
                await message.guild.channels.create(`🔒${settings.gameCategoryPrefix}${args.game.name}`, {
                    type: "category"
                }).then(async category => {
                    args.game.categoryID = category.id;
                    category.setPosition(99);
                    statusMessage.edit(`Catégorie ${category.name} créée`);

                    // Création du salon discussions du jeu 
                    await message.guild.channels.create(`🔒${settings.gameTextPrefix}discussions`, {
                        type: 'text'
                    }).then(textchannel => {
                        args.game.textChannelID = textchannel.id;
                        textchannel.setParent(category);
                        textchannel.createOverwrite(roleEveryone, {
                            'VIEW_CHANNEL': false,
                            'READ_MESSAGES': false,
                            'READ_MESSAGE_HISTORY': false,
                        });
                        textchannel.createOverwrite(roleMembers, {
                            'VIEW_CHANNEL': true,
                            'READ_MESSAGES': true,
                            'READ_MESSAGE_HISTORY': true,
                        });
                        statusMessage.edit(`Salon ${textchannel.name} créé`);
                    })
                })
                await client.db_games.set(args.game.name, args.game);
                statusMessage.edit(`Salons et rôles pour ${args.game.name} correctement créés`);

                break;
            }
            case 'active': {
                if (args.game.actif) return errorMessage(`Le jeu ${args.game.name} est déjà actif`, message.channel);

                const gameRole = message.guild.roles.cache.get(args.game.roleID);
                const gameCategory = message.guild.channels.cache.get(args.game.categoryID);
                const gameTextChannel = message.guild.channels.cache.get(args.game.textChannelID);

                const gameInfosChannel = message.guild.channels.cache.get(args.game.infosChannelID);
                const gameStatutChannel = message.guild.channels.cache.get(args.game.statusChannelID);

                if (!roleMembers) return errorMessage(`Le rôle "Membres n'a pas été trouvé (memberRole:${settings.memberRole})`, message.channel);
                if (!roleMod) return errorMessage(`Le rôle "Modérateurs" n'a pas été trouvé (modRole:${settings.modRole})`, message.channel);
                if (!gameRole) return errorMessage(`Le rôle principal du jeu n'a pas été trouvé (roleID:${args.game.roleID})`, message.channel);
                if (!gameCategory) return errorMessage(`La catégorie du jeu n'a pas été trouvée (categoryID:${args.game.categoryID})`, message.channel);
                if (!gameTextChannel) return errorMessage(`Le salon discussions du jeu n'a pas été trouvée (textChannelID:${args.game.textChannelID})`, message.channel);

                let statusMessage;
                await message.util.send(`Quel est l'emoji qui doit être associé à ce jeu ?`);

                const responses = await message.channel.awaitMessages(msg => msg.author.id === message.author.id, {
                    max: 1,
                    time: 10000,
                });

                if (responses.size !== 1) {
                    message.reply('Activation du jeu annulée');
                    return null;
                }
                const response = responses.first();

                if (response.content) {
                    args.game.emoji = response.content;
                    statusMessage = await response.reply(`Activation du jeu ${args.game.name}...`);
                } else {
                    message.reply('Activation du jeu annulée');
                    return null;
                }


                await gameCategory.setName(`${settings.gameCategoryPrefix}${args.game.name}`);
                await gameTextChannel.setName(`${settings.gameTextPrefix}discussions`);
                await gameTextChannel.createOverwrite(gameRole, {
                    'VIEW_CHANNEL': true,
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
                await gameTextChannel.createOverwrite(roleMembers, {
                    'VIEW_CHANNEL': true,
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
                await gameTextChannel.createOverwrite(roleMod, {
                    'VIEW_CHANNEL': true,
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
                if (gameInfosChannel) {
                    await gameInfosChannel.setName(`${settings.gameInfosPrefix}informations`)
                    gameInfosChannel.createOverwrite(roleEveryone, {
                        'VIEW_CHANNEL': false,
                    });
                    await gameInfosChannel.createOverwrite(gameRole, {
                        'VIEW_CHANNEL': true,
                        'READ_MESSAGES': true,
                        'SEND_MESSAGES': false,
                        'SEND_TTS_MESSAGES': false,
                        'EMBED_LINKS': false,
                        'ATTACH_FILES': false,
                        'READ_MESSAGE_HISTORY': true,
                        'MENTION_EVERYONE': false,
                        'USE_EXTERNAL_EMOJIS': false,
                        'ADD_REACTIONS': false,
                    });

                    await gameInfosChannel.createOverwrite(roleMembers, {
                        'VIEW_CHANNEL': false,
                        'READ_MESSAGES': false,
                        'SEND_MESSAGES': false,
                        'SEND_TTS_MESSAGES': false,
                        'EMBED_LINKS': false,
                        'ATTACH_FILES': false,
                        'READ_MESSAGE_HISTORY': false,
                        'MENTION_EVERYONE': false,
                        'USE_EXTERNAL_EMOJIS': false,
                        'ADD_REACTIONS': false,
                    });
                    await gameInfosChannel.createOverwrite(roleMod, {
                        'VIEW_CHANNEL': true,
                        'READ_MESSAGES': true,
                        'SEND_MESSAGES': true,
                        'MANAGE_MESSAGES': true,
                        'SEND_TTS_MESSAGES': true,
                        'EMBED_LINKS': true,
                        'ATTACH_FILES': true,
                        'READ_MESSAGE_HISTORY': true,
                        'MENTION_EVERYONE': false,
                        'USE_EXTERNAL_EMOJIS': true,
                        'ADD_REACTIONS': true,
                    });
                }
                if (gameStatutChannel) {
                    await gameStatutChannel.setName(`${settings.gameStatusPrefix}statut`)
                    await gameStatutChannel.createOverwrite(roleEveryone, {
                        'VIEW_CHANNEL': false,
                    });
                    await gameStatutChannel.createOverwrite(gameRole, {
                        'VIEW_CHANNEL': true,
                        'READ_MESSAGES': true,
                        'SEND_MESSAGES': false,
                        'SEND_TTS_MESSAGES': false,
                        'EMBED_LINKS': false,
                        'ATTACH_FILES': false,
                        'READ_MESSAGE_HISTORY': true,
                        'MENTION_EVERYONE': false,
                        'USE_EXTERNAL_EMOJIS': false,
                        'ADD_REACTIONS': false,
                    });

                    await gameStatutChannel.createOverwrite(roleMembers, {
                        'VIEW_CHANNEL': false,
                        'READ_MESSAGES': false,
                        'SEND_MESSAGES': false,
                        'SEND_TTS_MESSAGES': false,
                        'EMBED_LINKS': false,
                        'ATTACH_FILES': false,
                        'READ_MESSAGE_HISTORY': false,
                        'MENTION_EVERYONE': false,
                        'USE_EXTERNAL_EMOJIS': false,
                        'ADD_REACTIONS': false,
                    });
                    await gameStatutChannel.createOverwrite(roleMod, {
                        'VIEW_CHANNEL': true,
                        'READ_MESSAGES': true,
                        'SEND_MESSAGES': true,
                        'MANAGE_MESSAGES': true,
                        'SEND_TTS_MESSAGES': true,
                        'EMBED_LINKS': true,
                        'ATTACH_FILES': true,
                        'READ_MESSAGE_HISTORY': true,
                        'MENTION_EVERYONE': false,
                        'USE_EXTERNAL_EMOJIS': true,
                        'ADD_REACTIONS': true,
                    });
                }
                args.game.actif = true;
                client.db_games.set(args.game.name, args.game);
                statusMessage.edit(`${args.game.name} a été correctement activé`);
                break;
            }
            case 'inactive': {
                if (!args.game.actif) return errorMessage(`Le jeu ${args.game.name} est déjà inactif`, message.channel);

                const gameRole = message.guild.roles.cache.get(args.game.roleID);
                const gameCategory = message.guild.channels.cache.get(args.game.categoryID);
                const gameTextChannel = message.guild.channels.cache.get(args.game.textChannelID);

                const gameInfosChannel = message.guild.channels.cache.get(args.game.infosChannelID);
                const gameStatutChannel = message.guild.channels.cache.get(args.game.statusChannelID);

                if (!roleMembers) return errorMessage(`Le rôle "Membres n'a pas été trouvé (memberRole:${settings.memberRole})`, message.channel);
                if (!roleMod) return errorMessage(`Le rôle "Modérateurs" n'a pas été trouvé (modRole:${settings.modRole})`, message.channel);
                if (!gameRole) return errorMessage(`Le rôle principal du jeu n'a pas été trouvé (roleID:${args.game.roleID})`, message.channel);
                if (!gameCategory) return errorMessage(`La catégorie du jeu n'a pas été trouvée (categoryID:${args.game.categoryID})`, message.channel);
                if (!gameTextChannel) return errorMessage(`Le salon discussions du jeu n'a pas été trouvée (textChannelID:${args.game.textChannelID})`, message.channel);

                await gameCategory.setName(`🔒${settings.gameCategoryPrefix}${args.game.name}`);
                await gameTextChannel.setName(`🔒${settings.gameTextPrefix}discussions`);
                await gameTextChannel.createOverwrite(gameRole, {
                    'VIEW_CHANNEL': false,
                    'READ_MESSAGES': false,
                });
                await gameTextChannel.createOverwrite(roleMembers, {
                    'VIEW_CHANNEL': false,
                    'READ_MESSAGES': false,
                });
                await gameTextChannel.createOverwrite(roleMod, {
                    'VIEW_CHANNEL': false,
                    'READ_MESSAGES': false,
                });
                if (gameInfosChannel) {
                    await gameInfosChannel.setName(`🔒${settings.gameInfosPrefix}informations`)
                    await gameInfosChannel.createOverwrite(gameRole, {
                        'VIEW_CHANNEL': false,
                        'READ_MESSAGES': false,
                    });
                    await gameInfosChannel.createOverwrite(roleMembers, {
                        'VIEW_CHANNEL': false,
                        'READ_MESSAGES': false,
                    });
                    await gameInfosChannel.createOverwrite(roleMod, {
                        'VIEW_CHANNEL': false,
                        'READ_MESSAGES': false,
                    });
                }

                if (gameStatutChannel) {
                    await gameStatutChannel.setName(`🔒${settings.gameStatusPrefix}statut`)
                    await gameStatutChannel.createOverwrite(gameRole, {
                        'VIEW_CHANNEL': false,
                        'READ_MESSAGES': false,
                    });
                    await gameStatutChannel.createOverwrite(roleMembers, {
                        'VIEW_CHANNEL': false,
                        'READ_MESSAGES': false,
                    });
                    await gameStatutChannel.createOverwrite(roleMod, {
                        'VIEW_CHANNEL': false,
                        'READ_MESSAGES': false,
                    });
                }

                args.game.actif = false;
                args.game.emoji = "";
                client.db_games.set(args.game.name, args.game);
                break;
            }
            case 'delete': {
                if (args.game.actif) return errorMessage(`Le jeu ${args.game.name} est actif`, message.channel);

                const gameRole = message.guild.roles.cache.get(args.game.roleID);
                if (gameRole) {
                    args.game.roleID = "";
                    gameRole.delete("Suppression du jeu");
                }
                const gamePlayRole = message.guild.roles.cache.get(args.game.playRoleID);
                if (gamePlayRole) {
                    args.game.playRoleID = "";
                    gamePlayRole.delete("Suppression du jeu");
                }

                const gameTextChannel = message.guild.channels.cache.get(args.game.textChannelID);
                if (gameTextChannel) {
                    args.game.textChannelID = "";
                    gameTextChannel.delete("Suppression du jeu");
                }

                const gameInfosChannel = message.guild.channels.cache.get(args.game.infosChannelID);
                if (gameInfosChannel) {
                    args.game.infosChannelID = "";
                    gameInfosChannel.delete("Suppression du jeu");
                }

                const gameStatusChannel = message.guild.channels.cache.get(args.game.statusChannelID);
                if (gameStatusChannel) {
                    args.game.statusChannelID = "";
                    gameStatusChannel.delete("Suppression du jeu");
                }

                const gameVoiceChannel = message.guild.channels.cache.get(args.game.voiceChannelID);
                if (gameVoiceChannel) {
                    args.game.voiceChannelID = "";
                    gameVoiceChannel.delete("Suppression du jeu");
                }

                const gameJoinChannel = message.guild.channels.cache.get(args.game.joinChannelID);
                if (gameJoinChannel) {
                    args.game.joinChannelID = "";
                    gameJoinChannel.delete("Suppression du jeu");
                }

                const gameCategory = message.guild.channels.cache.get(args.game.categoryID);
                if (gameCategory) {
                    args.game.categoryID = "";
                    gameCategory.delete("Suppression du jeu");
                }
                args.game.actif = false;
                args.game.emoji = "";
                client.db_games.set(args.game.name, args.game);
                break;
            }
            case 'voice': {
                if (!args.game.actif) return errorMessage(`Le jeu ${args.game.name} n'est pas actif`, message.channel);

                const gameCategory = message.guild.channels.cache.get(args.game.categoryID);
                const gameRole = message.guild.roles.cache.get(args.game.roleID);

                await message.guild.channels.create(`${args.game.name}`, {
                    type: 'voice'
                }).then(async gameVoiceChannel => {
                    args.game.voiceChannelID = gameVoiceChannel.id;
                    await gameVoiceChannel.setParent(gameCategory)
                        .then(successMessage(client.textes.get("GAMES_CHANNEL_LINKED_TO_CATEGORY", gameVoiceChannel, gameCategory), message.channel));
                    await gameVoiceChannel.createOverwrite(roleEveryone, {
                        'VIEW_CHANNEL': false,
                        'CONNECT': false,
                    }).then(successMessage(client.textes.get("GAMES_CHANNEL_PERM_FOR_GROUP", gameVoiceChannel, roleEveryone), message.channel));
                    await gameVoiceChannel.createOverwrite(roleMembers, {
                        'VIEW_CHANNEL': false,
                        'CONNECT': false,
                    }).then(successMessage(client.textes.get("GAMES_CHANNEL_PERM_FOR_GROUP", gameVoiceChannel, roleMembers), message.channel));
                    await gameVoiceChannel.createOverwrite(gameRole, {
                        'VIEW_CHANNEL': true,
                        'CONNECT': true,
                    }).then(successMessage(client.textes.get("GAMES_CHANNEL_PERM_FOR_GROUP", gameVoiceChannel, gameRole), message.channel));
                    successMessage(`Salon ${gameVoiceChannel.name} créé`, message.channel);
                    args.game.voiceChannelID = gameVoiceChannel.id;
                    client.db_games.set(args.game.name, args.game);
                })

                break;
            }
            case 'statut': {
                if (!args.game.actif) return errorMessage(`Le jeu ${args.game.name} n'est pas actif`, message.channel);

                const gameCategory = message.guild.channels.cache.get(args.game.categoryID);
                const gameRole = message.guild.roles.cache.get(args.game.roleID);


                await message.guild.channels.create(`${settings.gameStatusPrefix}statut`, {
                    type: 'text'
                }).then(gameStatusChannel => {
                    args.game.statusChannelID = gameStatusChannel.id;
                    gameStatusChannel.setParent(gameCategory);

                    gameStatusChannel.createOverwrite(roleEveryone, {
                        'VIEW_CHANNEL': false,
                    });
                    gameStatusChannel.createOverwrite(gameRole, {
                        'READ_MESSAGES': true,
                        'SEND_MESSAGES': false,
                        'SEND_TTS_MESSAGES': false,
                        'EMBED_LINKS': false,
                        'ATTACH_FILES': false,
                        'READ_MESSAGE_HISTORY': true,
                        'MENTION_EVERYONE': false,
                        'USE_EXTERNAL_EMOJIS': false,
                        'ADD_REACTIONS': false,
                    });

                    gameStatusChannel.createOverwrite(roleMembers, {
                        'READ_MESSAGES': false,
                        'SEND_MESSAGES': false,
                        'SEND_TTS_MESSAGES': false,
                        'EMBED_LINKS': false,
                        'ATTACH_FILES': false,
                        'READ_MESSAGE_HISTORY': false,
                        'MENTION_EVERYONE': false,
                        'USE_EXTERNAL_EMOJIS': false,
                        'ADD_REACTIONS': false,
                    });
                    gameStatusChannel.createOverwrite(roleMod, {
                        'READ_MESSAGES': true,
                        'SEND_MESSAGES': true,
                        'MANAGE_MESSAGES': true,
                        'SEND_TTS_MESSAGES': true,
                        'EMBED_LINKS': true,
                        'ATTACH_FILES': true,
                        'READ_MESSAGE_HISTORY': true,
                        'MENTION_EVERYONE': false,
                        'USE_EXTERNAL_EMOJIS': true,
                        'ADD_REACTIONS': true,
                    });
                    successMessage(`Salon ${gameStatusChannel.name} créé`, message.channel);
                })
                client.db_games.set(args.game.name, args.game);
                break;
            }
            case 'infos': {
                if (!args.game.actif) return errorMessage(`Le jeu ${args.game.name} n'est pas actif`, message.channel);

                const gameCategory = message.guild.channels.cache.get(args.game.categoryID);
                const gameRole = message.guild.roles.cache.get(args.game.roleID);


                await message.guild.channels.create(`${settings.gameInfosPrefix}informations`, {
                    type: 'text'
                }).then(gameInfosChannel => {
                    args.game.infosChannelID = gameInfosChannel.id;
                    gameInfosChannel.setParent(gameCategory);

                    gameInfosChannel.createOverwrite(roleEveryone, {
                        'VIEW_CHANNEL': false,
                    });
                    gameInfosChannel.createOverwrite(gameRole, {
                        'READ_MESSAGES': true,
                        'SEND_MESSAGES': false,
                        'SEND_TTS_MESSAGES': false,
                        'EMBED_LINKS': false,
                        'ATTACH_FILES': false,
                        'READ_MESSAGE_HISTORY': true,
                        'MENTION_EVERYONE': false,
                        'USE_EXTERNAL_EMOJIS': false,
                        'ADD_REACTIONS': false,
                    });

                    gameInfosChannel.createOverwrite(roleMembers, {
                        'READ_MESSAGES': false,
                        'SEND_MESSAGES': false,
                        'SEND_TTS_MESSAGES': false,
                        'EMBED_LINKS': false,
                        'ATTACH_FILES': false,
                        'READ_MESSAGE_HISTORY': false,
                        'MENTION_EVERYONE': false,
                        'USE_EXTERNAL_EMOJIS': false,
                        'ADD_REACTIONS': false,
                    });
                    gameInfosChannel.createOverwrite(roleMod, {
                        'READ_MESSAGES': true,
                        'SEND_MESSAGES': true,
                        'MANAGE_MESSAGES': true,
                        'SEND_TTS_MESSAGES': true,
                        'EMBED_LINKS': true,
                        'ATTACH_FILES': true,
                        'READ_MESSAGE_HISTORY': true,
                        'MENTION_EVERYONE': false,
                        'USE_EXTERNAL_EMOJIS': true,
                        'ADD_REACTIONS': true,
                    });
                    successMessage(`Salon ${gameInfosChannel.name} créé`, message.channel);
                })
                client.db_games.set(args.game.name, args.game);
                break;
            }
        }

        if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();;;
    }

}
module.exports = GamesCommand;