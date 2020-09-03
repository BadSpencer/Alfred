 const {
     Command
 } = require("discord-akairo");
 const {
     inspect
 } = require("util");
 const {
     successMessage,
     errorMessage,
     warnMessage,
     questionMessage,
     promptMessage,
     stateMessage
 } = require('../../../utils/messages');
 const textes = new(require(`../../../utils/textes.js`));

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



         return {
             game
         };
     }

     async exec(message, args) {
         let client = this.client;
         const guild = client.getGuild();
        const settings = client.getSettings(guild);

         const roleEveryone = guild.roles.cache.find(r => r.name == "@everyone");
         const roleMembers = guild.roles.cache.find(r => r.name == settings.memberRole);
         const roleMod = guild.roles.cache.find(r => r.name == settings.modRole);

         if (args.game.actif) {
             return errorMessage(textes.get("GAMES_GAME_ACTIVE_ERROR_GAME_ACTIVE", args.game.name), message.channel);
         };


         let state = textes.get("GAMES_GAME_ACTIVE_STATE_START", args.game);
         let embedState = stateMessage(state);
         let stateMsg = await message.channel.send(embedState);


         // Gestion du rôle principal
         let gameMainRole;
         if (args.game.roleID !== "") {

             gameMainRole = guild.roles.cache.get(args.game.roleID);

             if (!gameMainRole) {
                 // Le rôle principal n'existe pas (cas normal)
                 gameMainRole = await client.gamesCreateMainRole(args.game);
                 state += `Rôle principal créé: ✅\n`;
                 args.game.roleID = gameMainRole.id;
             } else {
                 client.log(textes.get("GAMES_GAME_ACTIVE_MAINROLE_ALREADY_EXIST"));
             }
             gameMainRole = await client.gamesCreateMainRole(args.game);
             state += `Rôle principal créé: ✅\n`;
             args.game.roleID = gameMainRole.id;
         }
         stateMsg.edit(stateMessage(state));


         // Gestion de la catégorie
         let gameCategory;
         if (args.game.categoryID !== "") {
             // Une catégorie est déjà renseignée pour le jeu (jeu actif par le passé)
             gameCategory = guild.channels.cache.get(args.game.categoryID);
             if (!gameCategory) {
                 // La catégorie n'existe pas
                 client.log(textes.get("GAMES_GAME_ACTIVE_CATEGORY_NOT_FOUND"));
                 state += `Catégorie créée: ✅\n`;
                 gameCategory = await client.gamesCreateMainCategory(args.game);
                 args.game.categoryID = gameCategory.id;
             } else {
                 // La catégorie existe. On change son nom avec les règles de nommage par défaut
                 gameCategory.setName(`${settings.gameCategoryPrefix}${args.game.name}`);
                 state += `Catégorie réactivée: ✅\n`;
             }
         } else {
             gameCategory = client.gamesCreateMainCategory(args.game);
             state += `Catégorie créée: ✅\n`;
             args.game.categoryID = gameCategory.id;
         }
         stateMsg.edit(stateMessage(state));


         // Gestion du salon de discussions
         let gameTextChannel;
         if (args.game.textChannelID !== "") {
             // Un salon de discussions est déjà renseigné pour le jeu (jeu actif par le passé)
             gameTextChannel = guild.channels.cache.get(args.game.textChannelID);
             if (!gameTextChannel) {
                 // Le salon spécifié n'existe pas. On le recréé
                 client.log(textes.get("GAMES_GAME_ACTIVE_TEXTCHANNEL_NOT_FOUND"));
                 gameTextChannel = await client.gamesCreateTextChannel(args.game);
                 await client.gamesTextChannelSetPerm(args.game, "active");
                 state += `Salon discussions créé: ✅\n`;
                 args.game.textChannelID = gameTextChannel.id;
             } else {
                 // Le salon existe. On change son nom avec les règles de nommage par défaut
                 gameTextChannel.setName(`${settings.gameCategoryPrefix}${args.game.name}`);
                 await client.gamesTextChannelSetPerm(args.game, "active");
                 state += `Salon discussions réactivé: ✅\n`;
             }
         } else {
             gameTextChannel = client.gamesCreateTextChannel(args.game);
             client.gamesTextChannelSetPerm(args.game, "active");
             state += `Salon discussions créé: ✅\n`;
             args.game.textChannelID = gameTextChannel.id;
         }
         stateMsg.edit(stateMessage(state));


         // Gestion salon vocal
         let gameVoiceChannel;
         if (args.game.voiceChannelID !== "") {
             // Un salon vocal existe déjà pour ce jeu (pas normal)
             gameVoiceChannel = guild.channels.cache.get(args.game.voiceChannelID);

             if (!gameVoiceChannel) {
                // Le salon spécifié n'existe pas. On le recréé
                gameVoiceChannel = await client.gamesCreateVoiceChannel(args.game);
             } else {

             }



         }




         if (args.game.categoryID == "" && args.game.textChannelID == "") {
             let gameCategory = await message.guild.channels.create(`${settings.gameCategoryPrefix}${args.game.name}`, {
                 type: "category"
             }).then(async category => {

                 args.game.categoryID = category.id;
                 category.setPosition(99);
                 state += `Catégorie: ✅\n`;
                 stateMsg.edit(stateMessage(state));

                 gameMainRole = await message.guild.roles.create({
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

                         message.guild.channels.create(`${args.game.name}`, {
                             type: 'voice'
                         }).then(async gameVoiceChannel => {
                             args.game.voiceChannelID = gameVoiceChannel.id;
                             gameVoiceChannel.setParent(category)
                                 .then(() => {
                                     state += `Salon vocal: ✅\n`;
                                     stateMsg.edit(stateMessage(state));
                                 });

                             gameVoiceChannel.createOverwrite(roleEveryone, {
                                 VIEW_CHANNEL: false,
                                 CONNECT: false,
                             });
                             gameVoiceChannel.createOverwrite(roleMembers, {
                                 VIEW_CHANNEL: false,
                                 CONNECT: false,
                             });
                             gameVoiceChannel.createOverwrite(mainRole, {
                                 VIEW_CHANNEL: true,
                                 CONNECT: true,
                             });

                             args.game.voiceChannelID = gameVoiceChannel.id;
                             client.db_games.set(args.game.id, args.game);
                         })


                     })
                 })
             })
         } else {
             gameMainRole = await message.guild.roles.create({
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
                 if (gameCategory) {
                     await gameCategory.setName(`${settings.gameCategoryPrefix}${args.game.name}`)
                     state += `Catégorie: ✅ (réactivation)\n`;
                     stateMsg.edit(stateMessage(state));
                 }

                 let textChannel = message.guild.channels.cache.get(args.game.textChannelID);
                 if (textChannel) {
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
                 }
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