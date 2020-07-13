const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('./datamodel');
const colors = require('./colors');
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('./messages');

module.exports = (client) => {

  client.gamesGetAll = () => {
    return client.db_games;
  };
  client.gamesGetActive = () => {
    return client.db_games.filter(rec => rec.actif == true);
  };
  client.gamesGetInactive = () => {
    return client.db_games.filter(rec => rec.actif == false);
  };

  client.gamesListPost = async (channel, option = 'tout') => {
    let gameList = [];
    switch (option) {
      case 'tout':
        gameList = client.gamesGetAll().array();
        gameList.sort(function (a, b) {
          return a.actif - b.actif;
        }).reverse();
        break;
      case 'actif':
        gameList = client.gamesGetActive().array();
        gameList.sort(function (a, b) {
          return a.id - b.id;
        }).reverse();
        break;
      case 'inactif':
        gameList = client.gamesGetInactive().array();
        gameList.sort(function (a, b) {
          return a.name - b.name;
        });
        break;
    }

    let gameListOutput = [];
    let iconStatut = '';
    for (const game of gameList) {
      if (game.actif) {
        iconStatut = '◽️';
      } else {
        iconStatut = '◾️';
      }
      gameListOutput.push(`${iconStatut} **${game.id}**`);
    };
    await client.arrayToEmbed(gameListOutput, 20, `Liste de jeux (option: ${option})`, channel);
  };

  client.gamesCreate = async (gamename) => {
    let game = datamodel.tables.games;

    game.id = gamename;
    game.name = gamename;
    game.createdAt = +new Date;

    client.db_games.set(game.id, game);
    client.log(`Le jeu ${gamename} à été ajouté à la base de données`)
  };

  client.gameGetScore = async (nbDays = 5) => {

    const guild = client.guilds.cache.get(client.config.guildID);
    let activeGames = client.db_games.filterArray(game => game.actif === true);

    let activeGamesScores = [];



    let days = [];
    for (var i = 0; i < 5; i++) {
      days.push(moment().subtract(i, 'days').format('DD.MM.YYYY'));
    }

    let gamesXP = [];
    for (const day of days) {
      let xplogs = client.db_userxplogs.filterArray(rec => rec.date == day)
      for (const xplog of xplogs) {
        if (xplog.gamexp) {
          for (const gamexp of xplog.gamexp) {

            let game = gamesXP.find(r => r.name == gamexp.gamename)
            if (game) {
              game.xp += gamexp.xp;
            } else {
              game = {
                "name": gamexp.gamename,
                "xp": gamexp.xp
              };
              gamesXP.push(game);
            }
          }
        }
      }
    }

    for (const game of activeGames) {
      let gameRole = guild.roles.cache.get(game.roleID);
      if (!gameRole) return;
      let gamexp = gamesXP.find(r => r.name == game.name)
      if (gamexp) {
        let activeGameXP = {
          "name": game.name,
          "emoji": game.emoji,
          "xp": gamexp.xp,
          "members": gameRole.members.size
        };
        activeGamesScores.push(activeGameXP);
      } else {
        let activeGameXP = {
          "name": game.name,
          "emoji": game.emoji,
          "xp": 0,
          "members": gameRole.members.size
        };
        activeGamesScores.push(activeGameXP);
      }
    }

    activeGamesScores.sort(function (a, b) {
      return b.xp - a.xp;
    });

    return activeGamesScores;
  };

  client.gamesJoinListPost = async (clearReact = false) => {
    const guild = client.guilds.cache.get(client.config.guildID);
    const settings = await client.db.getSettings(client);
    const games = await client.db.gamesGetActive(client);
    const gamesXP = await client.gameGetScore();

    if (!gamesXP) return;

    const gameJoinChannel = await guild.channels.cache.find(c => c.name === settings.gameJoinChannel);

    if (games.size == 0) return;

    let embed = new Discord.MessageEmbed();

    let gameJoinMessage = undefined;
    if (settings.gameJoinMessage !== "") {
      await gameJoinChannel.messages.fetch(settings.gameJoinMessage).then(message => {
        gameJoinMessage = message;
        client.log(client.textes.get("GAMES_LIST_SUCCESS_LOADED"), "debug");
      }).catch(err => {
        client.log(client.textes.get("GAMES_LIST_WARN_NOTFOUND"), "warn");
      });
    }

    let maxXP = gamesXP[0].xp;

    let description = "";
    for (const game of gamesXP) {

      let score = 0;
      if (game.xp > 0) {
        score = Math.round(((game.xp * 100) / maxXP) / 20);
      }

      if (game.xp > 0 && score == 0) score = 1;

      if (score == 5) description += `${game.emoji} **${game.name}** \`${game.members}👤\` ⭐️⭐️⭐️⭐️⭐️\n`;
      if (score == 4) description += `${game.emoji} **${game.name}** \`${game.members}👤\` ⭐️⭐️⭐️⭐️\n`;
      if (score == 3) description += `${game.emoji} **${game.name}** \`${game.members}👤\` ⭐️⭐️⭐️\n`;
      if (score == 2) description += `${game.emoji} **${game.name}** \`${game.members}👤\` ⭐️⭐️\n`;
      if (score == 1) description += `${game.emoji} **${game.name}** \`${game.members}👤\` ⭐️\n`;
      if (score == 0) description += `${game.emoji} **${game.name}** \`${game.members}👤\` 👻\n`;

    }
    let footer = (`Dernière mise à jour`);

    embed.setTitle(`Liste des jeux`);
    embed.setColor(0xF1C40F);
    embed.setDescription(description);
    embed.setFooter(footer);
    embed.setTimestamp();
    embed.setImage(`https://media.discordapp.net/attachments/599235210550181900/645313787376697344/ligne_horizontale_2F3136.png`);



    if (!gameJoinMessage) {
      await gameJoinChannel.send(embed).then(async msgSent => {
        settings.gameJoinMessage = msgSent.id;
        client.db_settings.set(guild.id, settings);
        for (const game of gamesXP) {
          await msgSent.react(game.emoji);
        }
      });
      client.log(client.textes.get("GAMES_LIST_SUCCESS_CREATED"), "warn")
    } else {
      gameJoinMessage.edit(embed).then(async msgSent => {
        if (clearReact) {
          await msgSent.reactions.removeAll();
          for (const game of gamesXP) {
            await msgSent.react(game.emoji);
          }
        }
      });
      client.log(client.textes.get("GAMES_LIST_SUCCESS_UPDATED"))
    }

  };

  client.gamesPlayersDetail = async (gamename, message) => {
    const guild = client.guilds.cache.get(client.config.guildID);
    const game = client.db_games.get(gamename);
    const gameRole = guild.roles.cache.get(game.roleID);

    let playerListOutput = [];

    for (const member of gameRole.members) {
      let usergameKey = `${gamename}-${member[1].id}`
      let usergame = client.db_usergame.get(usergameKey);
      let now = +new Date;
      let daysPlayed = 0;
      let daysPlayedTxt = '';
      let daysAction = 0;
      let daysActionTxt = '';

      if (usergame) {
        daysPlayed = client.msToDays(now - usergame.lastPlayed);
        daysAction = client.msToDays(now - usergame.lastAction);

        if (daysPlayed > game.nbDaysInactive) {
          daysPlayedTxt = `**${daysPlayed}**`;
        } else {
          daysPlayedTxt = `${daysPlayed}`;
        }

        if (daysAction > game.nbDaysInactive) {
          daysActionTxt = `**${daysAction}**`;
        } else {
          daysActionTxt = `${daysAction}`;
        }

        playerListOutput.push(`**${member[1].displayName}** - Act: ${daysPlayedTxt} - ${daysActionTxt}`);
      };
    }
    await client.arrayToEmbed(playerListOutput, 20, `Joueurs de ${gamename}`, message.channel);
  };

  client.usergameUpdateLastPlayed = async (game, member) => {
    let usergameKey = `${game.name}-${member.id}`;
    let usergame = client.db_usergame.get(usergameKey);
    if (!usergame) {
      usergame = datamodel.tables.usergame;
      usergame.id = usergameKey;
      usergame.userid = member.id;
      usergame.gameid = game.name;
      client.log(client.textes.get("LOG_EVENT_USERGAME_CREATED", member, game));
      if (game.actif && !member.roles.cache.has(game.roleID)) {
        client.usergameNotifyPlayerActiveGame(game, member);
      }
    }
    usergame.lastPlayed = +new Date;
    client.db_usergame.set(usergameKey, usergame);
  };

  client.usergameUpdateLastAction = async (game, member) => {
    let usergameKey = `${game.name}-${member.id}`;
    let usergame = client.db_usergame.get(usergameKey);
    if (!usergame) {
      usergame = datamodel.tables.usergame;
      usergame.id = usergameKey;
      usergame.userid = member.id;
      usergame.gameid = game.name;
    }
    usergame.lastAction = +new Date;
    client.db_usergame.set(usergameKey, usergame);
  };

  client.usergameUpdateJoinedAt = async (game, member) => {
    let usergameKey = `${game.name}-${member.id}`;
    let usergame = client.db_usergame.get(usergameKey);
    if (!usergame) {
      usergame = datamodel.tables.usergame;
      usergame.id = usergameKey;
      usergame.userid = member.id;
      usergame.gameid = game.name;
    }
    usergame.joinedAt = +new Date;
    usergame.joinedDate = moment().format('DD.MM.YYYY');
    usergame.joinedTime = moment().format('HH:mm');
    usergame.lastAction = +new Date;
    client.db_usergame.set(usergameKey, usergame);
  };

  client.usergameNotifyPlayerActiveGame = async (game, member) => {
    const guild = client.guilds.cache.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    const gameRole = guild.roles.cache.get(game.roleID);
    const gameJoinChannel = await guild.channels.cache.find(c => c.name === settings.gameJoinChannel);

    const notification = new Discord.MessageEmbed()
      .setColor(colors['darkviolet'])
      .setDescription(client.textes.get("GAMES_ACTIVE_NOTIFICATION", game, member, gameRole, gameJoinChannel));
    member.send(notification);
    client.modLog(client.textes.get("MOD_NOTIF_MEMBER_NOTIFIED_GAME_EXIST", member, game));

  };

  client.gameNewPlayerNotification = async (game, member) => {
    const guild = client.guilds.cache.get(client.config.guildID);
    const settings = await client.db.getSettings(client);


    const gameTextChannel = await guild.channels.cache.get(game.textChannelID);
    const gameInfosChannel = await guild.channels.cache.get(game.infosChannelID);

    let avatar;
    if (!member.user.avatarURL()) {
      avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
    } else {
      avatar = member.user.avatarURL();
    }

    if (gameTextChannel) {
      const welcomeMessage = new Discord.MessageEmbed()
        .setColor(colors['darkgreen'])
        .setTimestamp()
        .setThumbnail(avatar)
        .setDescription(client.textes.get("GAMES_JOIN_NOTIFICATION", game, member));
      await gameTextChannel.send(welcomeMessage);
      if (gameInfosChannel) {
        const informationsMessage = new Discord.MessageEmbed()
          .setColor(colors['darkorange'])
          .setThumbnail(client.user.avatarURL())
          .setDescription(client.textes.get("GAMES_JOIN_INFORMATION_CHANNEL_NOTIFICATION", game, gameInfosChannel, member));
        await member.send(informationsMessage);
      };
    }
    client.modLog(client.textes.get("MOD_NOTIF_MEMBER_JOIN_GAME", member, game));
  };

  client.gamePlayerQuitNotification = async (game, member, type = 'QUIT') => {
    const guild = client.guilds.cache.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    let channelNotification = `GAMES_${type}_NOTIFICATION`;
    let modNotification = `MOD_NOTIF_MEMBER_${type}_GAME`;


    const gameTextChannel = await guild.channels.cache.get(game.textChannelID);

    let avatar;
    if (!member.user.avatarURL()) {
      avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
    } else {
      avatar = member.user.avatarURL();
    }

    if (gameTextChannel) {
      const notifChannelMessage = new Discord.MessageEmbed()
        .setColor(colors['yellow'])
        .setTimestamp()
        .setDescription(client.textes.get(channelNotification, game, member));
      gameTextChannel.send(notifChannelMessage);
    };
    if (type == "PURGE") {
      const notifMemberMessage = new Discord.MessageEmbed()
        .setColor(colors['yellow'])
        .setTimestamp()
        .setDescription(client.textes.get('GAMES_PURGE_MEMBER_NOTIFICATION', game));
      member.send(notifMemberMessage);

    };


    client.modLog(client.textes.get(modNotification, member, game));

  };

  client.gameDisplayInfos = async (game, channel) => {
    const guild = client.guilds.cache.get(client.config.guildID);

    const gameRole = await guild.roles.cache.get(game.roleID);

    let description = "";

    const embed = new Discord.MessageEmbed();
    embed.setTitle(game.name);
    embed.setColor(colors['darkorange']);

    let players = await client.gameGetPlayerList(game);

    players.sort(function (a, b) {
      return a.lastPlayed - b.lastPlayed;
    });

    for (const player of players) {
      if (player.usergame) {
        if (player.isActive == true) {
          description += `◽️ **${player.name}** ${player.daysJoined}j - XP:${player.xp}\n`;

        } else {
          if (player.daysPlayed >= game.nbDaysInactive && player.daysAction >= game.nbDaysInactive) {
            description += `◽️ **${player.name}** ${player.daysJoined}j - XP:${player.xp}\njeu: **${player.daysPlayed}j** discord: **${player.daysAction}j**\n`;
          } else {
            if (player.daysPlayed >= game.nbDaysInactive) {
              description += `◽️ **${player.name}** ${player.daysJoined}j - XP:${player.xp}\njeu: **${player.daysPlayed}j** discord: ${player.daysAction}j\n`;
            }
            if (player.daysAction >= game.nbDaysInactive) {
              description += `◽️ **${player.name}** ${player.daysJoined}j - XP:${player.xp}\njeu: ${player.daysPlayed}j discord: **${player.daysAction}j**\n`;
            }
          }
        }
      } else {
        description += `⚠️ ${player.name} - Données de jeu absentes\n`;
      }

    }

    embed.setDescription(description);


    channel.send(embed);
  };

  client.gameQuitConfirmation = async (messageReaction, game, member) => {
    const guild = client.guilds.cache.get(client.config.guildID);
    const settings = await client.db.getSettings(client);
    const gameRole = guild.roles.cache.get(game.roleID);
    let userdata = client.db_userdata.get(member.id);
    let statusMessage = await questionMessage(client.textes.get("GAMES_JOIN_WANT_TO_QUIT", game.name), messageReaction.message.channel);
    const responses = await messageReaction.message.channel.awaitMessages(msg => msg.author.id === member.id, {
      max: 1,
      time: 30000,
    });

    if (responses.size !== 1) {
      warnMessage(client.textes.get("GAMES_QUIT_CANCEL"), messageReaction.message.channel);
      return null;
    }
    const response = responses.first();

    if (response.content == "oui") {
      // response.delete();
      member.roles.remove(gameRole);
      successMessage(client.textes.get("GAMES_QUIT_SUCCESS", game.name), messageReaction.message.channel);
      client.gamesJoinListPost();
      client.gamePlayerQuitNotification(game, member);
      client.userdataAddLog(userdata, member, "GAMEQUIT", `A quitté le groupe "${game.name}"`);
    } else {
      response.delete();
      warnMessage(client.textes.get("COM_ACTION_ANNULLE"), messageReaction.message.channel);
      return null;
    }
  }

  client.gameGetPlayerList = async (game) => {
    const guild = client.guilds.cache.get(client.config.guildID);
    const gameRole = guild.roles.cache.get(game.roleID);



    let now = +new Date;

    let players = [];

    for (const member of gameRole.members) {

      let player = {
        "id": "",
        "name": "",
        "usergame": true,
        "isActive": true,
        "daysJoined": 0,
        "daysPlayed": 0,
        "daysAction": 0,
        "lastPlayed": "",
        "lastAction": "",
        "level": "",
        "xp": ""
      };
      let usergameKey = `${game.name}-${member[1].id}`
      let usergame = client.db_usergame.get(usergameKey);

      if (usergame) {
        player.id = member[1].id;
        player.name = member[1].displayName;
        player.daysJoined = client.msToDays(now - usergame.joinedAt);
        player.daysPlayed = client.msToDays(now - usergame.lastPlayed);
        player.daysAction = client.msToDays(now - usergame.lastAction);
        player.lastPlayed = usergame.lastPlayed;
        player.lastAction = usergame.lastAction;
        if (player.daysPlayed >= game.nbDaysInactive || player.daysAction >= game.nbDaysInactive) {
          player.isActive = false;
        }
        if (usergame.level == "") {
          player.level = "0";
        } else {
          player.level = usergame.level;
        }
        player.xp = usergame.xp;
      } else {
        player.id = member[1].id;
        player.name = member[1].displayName;
        player.usergame = false;
      }

      players.push(player);

    }
    return players;
  };

  client.gamesJoinListDelete = async () => {
    const guild = client.guilds.cache.get(client.config.guildID);
    const settings = await client.db.getSettings(client);
    const gameJoinChannel = await guild.channels.cache.find(c => c.name === settings.gameJoinChannel);

    if (!gameJoinChannel) return;

    if (settings.gameJoinMessage !== "") {
      gameJoinMessage = await gameJoinChannel.messages.fetch(settings.gameJoinMessage).then(message => {
        if (message.channel.type === 'text') message.delete();;
        settings.gameJoinMessage == "";
        client.log(client.textes.get("GAMES_LIST_SUCCESS_DELETED"));
      }).catch(err => {
        settings.gameJoinMessage == "";
        client.log(client.textes.get("GAMES_LIST_WARN_NOTFOUND_DELETION"), "warn");
      });
    }

    client.db_settings.set(guild.id, settings);
  };

  client.gamePurgeMembers = async (game, test = true) => {
    const guild = client.guilds.cache.get(client.config.guildID);
    const gameRole = guild.roles.cache.get(game.roleID);

    let players = await client.gameGetPlayerList(game);



    let playersPurgedList = '';

    for (const player of players) {

      if (player.usergame && player.isActive == false) {
        if (player.daysPlayed >= game.nbDaysInactive && player.daysAction >= game.nbDaysInactive) {
          let member = guild.members.cache.get(player.id);
          let userdata = client.db_userdata.get(player.id);
          if (member) {
            if (test == false) {
              member.roles.remove(gameRole);
              client.gamePlayerQuitNotification(game, member, "PURGE");
              client.userdataAddLog(userdata, member, "GAMEQUIT", `Inactivité sur "${game.name}"`);
            } else {
              //client.modLog(`**${member.displayName}** devrait être retiré du groupe "${game.name}" pour inactivité`);
              playersPurgedList += `${member.displayName}\n`;
            }
          }
        }
      }
    };
    if (test == true && playersPurgedList !== '') {
      client.modLog(`Joueurs inactifs pour **${game.name}**\n${playersPurgedList}`);
    };

  };

  client.gamesPurge = async () => {
    const games = client.gamesGetActive();
    for (const game of games) {
      client.gamePurgeMembers(game[1], false);
    }
    client.gamesJoinListPost();
  };

  client.gamealiasAdd = (alias, gamename) => {
    let gamealias = datamodel.tables.gamealias;
    gamealias.id = alias.toLowerCase();
    gamealias.gamename = gamename;
    client.db_gamealias.set(gamealias.id, gamealias);
  };

  client.gameGetFreeEmoji = async () => {
    let emojis = [
      "1️⃣",
      "2️⃣",
      "3️⃣",
      "4️⃣",
      "5️⃣",
      "6️⃣",
      "7️⃣",
      "8️⃣",
      "9️⃣",
      "🔟",
      "🇦",
      "🇧",
      "🇨",
      "🇩",
      "🇪",
      "🇫",
      "🇬",
      "🇭",
      "🇮",
      "🇯",
      '🇰',
      "🇱",
      "🇲",
      "🇳",
      "🇴",
      "🇵",
      "🇶",
      "🇷",
      "🇸",
      "🇹",
      "🇺",
      "🇻",
      "🇼",
      "🇽",
      "🇾",
      "🇿"
    ];

    let selectedEmoji = "";

    for (const emoji of emojis) {
      if (selectedEmoji == "") {
        let game = client.db_games.find(record => record.emoji == emoji);
        if (!game) {
          selectedEmoji = emoji;
        };
      };
    };

    return selectedEmoji;

  };


}