const fs = require('fs');
const {
    MessageAttachment
} = require('discord.js');
const {
    Command
} = require('discord-akairo');
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
            aliases: ['games'],
            description: {
                content: 'Gestion des jeux',
                usage: '<action> <...arguments>',
            },
            category: 'config',
            args: [{
                    id: "action",
                    type: ["list", "add", "view", "create", "active", "inactive", "delete", "voice", "statut", "infos", "postrr", "export", "import"],
                    default: "list",
                },
                {
                    id: "arguments",
                    type: "content",
                    match: "rest",
                    default: null,
                },
            ]
        });
    }
    async exec(message, args) {
        const guild = this.client.guilds.get(this.client.config.guildID);
        const settings = await this.client.db.getSettings(this.client);

        const roleEveryone = guild.roles.find(r => r.name == "@everyone");
        const roleMembers = guild.roles.find(r => r.name == settings.memberRole);
        const roleMod = guild.roles.find(r => r.name == settings.modRole);

        switch (args.action) {
            case 'list': {
                this.client.db.enmapDisplay(this.client, this.client.db_games, message.channel);
                break;
            }
            case 'add': {
                await this.client.db.gamesCreate(this.client, args.arguments)
                break;
            }
            case 'view': {
                let game = this.client.db_games.get(args.arguments);
                if (!game) return errorMessage(`Le jeu ${args.arguments} n'a pas été trouvé`, message);
                message.channel.send(`Données de **${args.arguments}**\n\`\`\`json\n${inspect(game)}\n\`\`\``)
                break;
            }
            case 'create': {
                let game = this.client.db_games.get(args.arguments);
                if (!game) return errorMessage(`Le jeu ${args.arguments} n'a pas été trouvé`, message);

                let statusMessage = await message.channel.send(`Création des rôles et salons pour ${args.arguments}...`);

                // Création du rôle principal
                await message.guild.createRole({
                    name: args.arguments,
                    color: settings.gameMainRoleColor,
                    hoist: false,
                    mentionable: true
                }).then(mainRole => {
                    game.roleID = mainRole.id;
                    statusMessage.edit(`Rôle principal ${mainRole.name} créé`);
                })

                // Création du rôle "Joue à"
                await message.guild.createRole({
                    name: `Joue à ${args.arguments}`,
                    color: settings.gamePlayRoleColor,
                    hoist: true,
                    mentionable: false
                }).then(playRole => {
                    game.playRoleID = playRole.id;
                    statusMessage.edit(`Rôle "Joue à" ${playRole.name} créé`);
                })

                // Création categorie
                await message.guild.createChannel(`🔒${settings.gameCategoryPrefix}${args.arguments}`, {
                    type: "category"
                }).then(async category => {
                    game.categoryID = category.id;
                    category.setPosition(99);
                    statusMessage.edit(`Catégorie ${category.name} créée`);

                    // Création du salon discussions du jeu 
                    await message.guild.createChannel(`🔒${settings.gameTextPrefix}discussions`, {
                        type: 'text'
                    }).then(textchannel => {
                        game.textChannelID = textchannel.id;
                        textchannel.setParent(category);
                        textchannel.overwritePermissions(roleEveryone, {
                            'VIEW_CHANNEL': false,
                            'READ_MESSAGES': false,
                        });
                        textchannel.overwritePermissions(roleMembers, {
                            'READ_MESSAGES': false,
                        });
                        statusMessage.edit(`Salon ${textchannel.name} créé`);
                    })
                })
                await this.client.db_games.set(args.arguments, game);
                statusMessage.edit(`Salons et rôles pour ${args.arguments} correctement créés`);

                break;
            }
            case 'active': {
                let game = this.client.db_games.get(args.arguments);
                if (!game) return errorMessage(`Le jeu ${args.arguments} n'a pas été trouvé`, message);
                if (game.actif) return errorMessage(`Le jeu ${args.arguments} est déjà actif`, message);

                const gameRole = message.guild.roles.get(game.roleID);
                const gameCategory = message.guild.channels.get(game.categoryID);
                const gameTextChannel = message.guild.channels.get(game.textChannelID);

                const gameInfosChannel = message.guild.channels.get(game.infosChannelID);
                const gameStatutChannel = message.guild.channels.get(game.statusChannelID);

                if (!roleMembers) return errorMessage(`Le rôle "Membres n'a pas été trouvé (memberRole:${settings.memberRole})`, message);
                if (!roleMod) return errorMessage(`Le rôle "Modérateurs" n'a pas été trouvé (modRole:${settings.modRole})`, message);
                if (!gameRole) return errorMessage(`Le rôle principal du jeu n'a pas été trouvé (roleID:${game.roleID})`, message);
                if (!gameCategory) return errorMessage(`La catégorie du jeu n'a pas été trouvée (categoryID:${game.categoryID})`, message);
                if (!gameTextChannel) return errorMessage(`Le salon discussions du jeu n'a pas été trouvée (textChannelID:${game.textChannelID})`, message);

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
                    game.emoji = response.content;
                    statusMessage = await response.reply(`Activation du jeu ${args.arguments}...`);
                } else {
                    message.reply('Activation du jeu annulée');
                    return null;
                }


                await gameCategory.setName(`${settings.gameCategoryPrefix}${args.arguments}`);
                await gameTextChannel.setName(`${settings.gameTextPrefix}discussions`);
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
                if (gameInfosChannel) {
                    await gameInfosChannel.setName(`${settings.gameInfosPrefix}informations`)
                    gameInfosChannel.overwritePermissions(roleEveryone, {
                        'VIEW_CHANNEL': false,
                    });
                    await gameInfosChannel.overwritePermissions(gameRole, {
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

                    await gameInfosChannel.overwritePermissions(roleMembers, {
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
                    await gameInfosChannel.overwritePermissions(roleMod, {
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
                    await gameStatutChannel.overwritePermissions(roleEveryone, {
                        'VIEW_CHANNEL': false,
                    });
                    await gameStatutChannel.overwritePermissions(gameRole, {
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

                    await gameStatutChannel.overwritePermissions(roleMembers, {
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
                    await gameStatutChannel.overwritePermissions(roleMod, {
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
                game.actif = true;
                this.client.db_games.set(args.arguments, game);
                statusMessage.edit(`${args.arguments} a été correctement activé`);
                break;
            }
            case 'inactive': {
                let game = this.client.db_games.get(args.arguments);
                if (!game) return errorMessage(`Le jeu ${args.arguments} n'a pas été trouvé`, message);
                if (!game.actif) return errorMessage(`Le jeu ${args.arguments} est déjà inactif`, message);

                const gameRole = message.guild.roles.get(game.roleID);
                const gameCategory = message.guild.channels.get(game.categoryID);
                const gameTextChannel = message.guild.channels.get(game.textChannelID);

                const gameInfosChannel = message.guild.channels.get(game.infosChannelID);
                const gameStatutChannel = message.guild.channels.get(game.statusChannelID);

                if (!roleMembers) return errorMessage(`Le rôle "Membres n'a pas été trouvé (memberRole:${settings.memberRole})`, message);
                if (!roleMod) return errorMessage(`Le rôle "Modérateurs" n'a pas été trouvé (modRole:${settings.modRole})`, message);
                if (!gameRole) return errorMessage(`Le rôle principal du jeu n'a pas été trouvé (roleID:${game.roleID})`, message);
                if (!gameCategory) return errorMessage(`La catégorie du jeu n'a pas été trouvée (categoryID:${game.categoryID})`, message);
                if (!gameTextChannel) return errorMessage(`Le salon discussions du jeu n'a pas été trouvée (textChannelID:${game.textChannelID})`, message);

                await gameCategory.setName(`🔒${settings.gameCategoryPrefix}${args.arguments}`);
                await gameTextChannel.setName(`🔒${settings.gameTextPrefix}discussions`);
                await gameTextChannel.overwritePermissions(gameRole, {
                    'VIEW_CHANNEL': false,
                    'READ_MESSAGES': false,
                });
                await gameTextChannel.overwritePermissions(roleMembers, {
                    'VIEW_CHANNEL': false,
                    'READ_MESSAGES': false,
                });
                await gameTextChannel.overwritePermissions(roleMod, {
                    'VIEW_CHANNEL': false,
                    'READ_MESSAGES': false,
                });
                if (gameInfosChannel) {
                    await gameInfosChannel.setName(`🔒${settings.gameInfosPrefix}informations`)
                    await gameInfosChannel.overwritePermissions(gameRole, {
                        'VIEW_CHANNEL': false,
                        'READ_MESSAGES': false,
                    });
                    await gameInfosChannel.overwritePermissions(roleMembers, {
                        'VIEW_CHANNEL': false,
                        'READ_MESSAGES': false,
                    });
                    await gameInfosChannel.overwritePermissions(roleMod, {
                        'VIEW_CHANNEL': false,
                        'READ_MESSAGES': false,
                    });
                }

                if (gameStatutChannel) {
                    await gameStatutChannel.setName(`🔒${settings.gameStatusPrefix}statut`)
                    await gameStatutChannel.overwritePermissions(gameRole, {
                        'VIEW_CHANNEL': false,
                        'READ_MESSAGES': false,
                    });
                    await gameStatutChannel.overwritePermissions(roleMembers, {
                        'VIEW_CHANNEL': false,
                        'READ_MESSAGES': false,
                    });
                    await gameStatutChannel.overwritePermissions(roleMod, {
                        'VIEW_CHANNEL': false,
                        'READ_MESSAGES': false,
                    });
                }

                game.actif = false;
                game.emoji = "";
                this.client.db_games.set(args.arguments, game);
                break;
            }
            case 'delete': {
                let game = this.client.db_games.get(args.arguments);
                if (!game) return errorMessage(`Le jeu ${args.arguments} n'a pas été trouvé`, message);
                if (game.actif) return errorMessage(`Le jeu ${args.arguments} est actif`, message);

                const gameRole = message.guild.roles.get(game.roleID);
                if (gameRole) {
                    game.roleID = "";
                    gameRole.delete("Suppression du jeu");
                }
                const gamePlayRole = message.guild.roles.get(game.playRoleID);
                if (gamePlayRole) {
                    game.playRoleID = "";
                    gamePlayRole.delete("Suppression du jeu");
                }

                const gameTextChannel = message.guild.channels.get(game.textChannelID);
                if (gameTextChannel) {
                    game.textChannelID = "";
                    gameTextChannel.delete("Suppression du jeu");
                }

                const gameInfosChannel = message.guild.channels.get(game.infosChannelID);
                if (gameInfosChannel) {
                    game.infosChannelID = "";
                    gameInfosChannel.delete("Suppression du jeu");
                }

                const gameStatusChannel = message.guild.channels.get(game.statusChannelID);
                if (gameStatusChannel) {
                    game.statusChannelID = "";
                    gameStatusChannel.delete("Suppression du jeu");
                }

                const gameVoiceChannel = message.guild.channels.get(game.voiceChannelID);
                if (gameVoiceChannel) {
                    game.voiceChannelID = "";
                    gameVoiceChannel.delete("Suppression du jeu");
                }

                const gameJoinChannel = message.guild.channels.get(game.joinChannelID);
                if (gameJoinChannel) {
                    game.joinChannelID = "";
                    gameJoinChannel.delete("Suppression du jeu");
                }

                const gameCategory = message.guild.channels.get(game.categoryID);
                if (gameCategory) {
                    game.categoryID = "";
                    gameCategory.delete("Suppression du jeu");
                }
                game.actif = false;
                game.emoji = "";
                this.client.db_games.set(args.arguments, game);
                break;
            }
            case 'voice': {
                break;
            }
            case 'statut': {
                let game = this.client.db_games.get(args.arguments);
                if (!game) return errorMessage(`Le jeu ${args.arguments} n'a pas été trouvé`, message);
                if (!game.actif) return errorMessage(`Le jeu ${args.arguments} n'est pas actif`, message);

                const gameCategory = message.guild.channels.get(game.categoryID);
                const gameRole = message.guild.roles.get(game.roleID);


                await message.guild.createChannel(`${settings.gameStatusPrefix}statut`, {
                    type: 'text'
                }).then(gameStatusChannel => {
                    game.statusChannelID = gameStatusChannel.id;
                    gameStatusChannel.setParent(gameCategory);

                    gameStatusChannel.overwritePermissions(roleEveryone, {
                        'VIEW_CHANNEL': false,
                    });
                    gameStatusChannel.overwritePermissions(gameRole, {
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

                    gameStatusChannel.overwritePermissions(roleMembers, {
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
                    gameStatusChannel.overwritePermissions(roleMod, {
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
                    successMessage(`Salon ${gameStatusChannel.name} créé`, message);
                })
                this.client.db_games.set(args.arguments, game);
                break;
            }
            case 'infos': {
                let game = this.client.db_games.get(args.arguments);
                if (!game) return errorMessage(`Le jeu ${args.arguments} n'a pas été trouvé`, message);
                if (!game.actif) return errorMessage(`Le jeu ${args.arguments} n'est pas actif`, message);

                const gameCategory = message.guild.channels.get(game.categoryID);
                const gameRole = message.guild.roles.get(game.roleID);


                await message.guild.createChannel(`${settings.gameInfosPrefix}informations`, {
                    type: 'text'
                }).then(gameInfosChannel => {
                    game.infosChannelID = gameInfosChannel.id;
                    gameInfosChannel.setParent(gameCategory);

                    gameInfosChannel.overwritePermissions(roleEveryone, {
                        'VIEW_CHANNEL': false,
                    });
                    gameInfosChannel.overwritePermissions(gameRole, {
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

                    gameInfosChannel.overwritePermissions(roleMembers, {
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
                    gameInfosChannel.overwritePermissions(roleMod, {
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
                    successMessage(`Salon ${gameInfosChannel.name} créé`, message);
                })
                this.client.db_games.set(args.arguments, game);
                break;
            }
            case 'postrr': {
                this.client.games.PostRoleReaction(this.client);
                break;
            }
            case 'export': {
                let games = this.client.db_games.fetchEverything();
                if (!games) return errorMessage(`Aucun jeu trouvé`, message);


                let data = "";
                games.forEach(game => {
                    data += JSON.stringify(game) + `\n`;
                })

                //const buffer = new Buffer.allocUnsafe(exporteddata);

                //const attachment = new MessageAttachment(exporteddata, 'games.txt');
                //const attachment = new MessageAttachment(buffer, 'games.txt');

                

                //let data = JSON.stringify(data);
                fs.writeFileSync('export.json', data);

                //message.channel.send(`${message.author}, Voici la table des jeux`, attachment);
                
                message.channel.send({
                    files: [{
                      attachment: 'export.json',
                      name: 'games.json'
                    }]
                  });
 

                break;
            }
        }


    }

}
module.exports = GamesCommand;