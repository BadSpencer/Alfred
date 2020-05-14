const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('./datamodel');
const colors = require('./colors');

module.exports = (client) => {

  client.gameGetScore = async (nbDays = 5) => {

    const guild = client.guilds.get(client.config.guildID);
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
      let gameRole = guild.roles.get(game.roleID);
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

  client.checkGameServers = async () => {
    client.log(`Vérification de la base de données des serveurs de jeu`, "debug");
    await client.db_gameservers.delete("default");
    await client.db_gameservers.set("default", datamodel.tables.gameservers);
  };





  client.gamesPlayersDetail = async (gamename, message) => {
    const guild = client.guilds.get(client.config.guildID);
    const game = await client.db_games.get(gamename);
    const gameRole = guild.roles.get(game.roleID);

    let description = "";

    let descActive = "**Joueurs actifs**\n";
    let descInactivePlayed = "**Joueurs inactifs (jeu)**\n";
    let descInactiveAction = "**Joueurs inactifs (discussion)**\n";
    let descInactiveBoth = "**Joueurs inactifs (les deux)**\n";


    const embed = new Discord.RichEmbed();
    embed.setTitle(gamename);
    embed.setColor(colors['darkorange']);

    for (const member of gameRole.members) {
      let usergameKey = `${gamename}-${member[1].id}`
      let usergame = client.db_usergame.get(usergameKey);
      let now = +new Date;
      let daysPlayed = 0;
      let daysAction = 0;

      if (usergame) {
        if (usergame.lastAction == "") {
          usergame.lastAction = 1587500080000;
          client.db_usergame.set(usergameKey, usergame);
        }
      } else {
        usergame = client.db_usergame.get("default");
        usergame.id = usergameKey;
        usergame.userid = member.id;
        usergame.gameid = game.name;
        usergame.lastPlayed = 1586000080000;
        usergame.lastAction = 1587500080000;
        client.db_usergame.set(usergameKey, usergame);
      }

      daysPlayed = client.msToDays(now - usergame.lastPlayed);
      daysAction = client.msToDays(now - usergame.lastAction);

      if (daysPlayed < 30 && daysAction < 30) {
        descActive += `**${member[1].displayName}** Jeu: ${client.msToDays(now - usergame.lastPlayed)}j Action: ${client.msToDays(now - usergame.lastAction)}j\n`;
      } else {

        if (daysPlayed > 29 && daysAction > 29) {
          descInactiveBoth += `**${member[1].displayName}** Jeu: **${client.msToDays(now - usergame.lastPlayed)}j** Action: **${client.msToDays(now - usergame.lastAction)}j**\n`;
        } else {
          if (daysPlayed > 29) {
            descInactivePlayed += `**${member[1].displayName}** Jeu: **${client.msToDays(now - usergame.lastPlayed)}j** Action: ${client.msToDays(now - usergame.lastAction)}j\n`;
          }
          if (daysAction > 29) {
            descInactiveAction += `**${member[1].displayName}** Jeu: ${client.msToDays(now - usergame.lastPlayed)}j Action: **${client.msToDays(now - usergame.lastAction)}j**\n`;
          }
        }
      }



    }
    description = descActive + '\n' + descInactivePlayed + '\n' + descInactiveAction + '\n' + descInactiveBoth;

    embed.setDescription(description);

    message.channel.send(embed);

  };

  client.usergameUpdateLastPlayed = async (game, member) => {
    let usergameKey = `${game.name}-${member.id}`;
    let usergame = client.db_usergame.get(usergameKey);
    if (!usergame) {
      usergame = client.db_usergame.get("default");
      usergame.id = usergameKey;
      usergame.userid = member.id;
      usergame.gameid = game.name;
      client.log(client.textes.get("LOG_EVENT_USERGAME_CREATED", member, game));
      if (game.actif && !member.roles.has(game.roleID)) {
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
      usergame = client.db_usergame.get("default");
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
      usergame = client.db_usergame.get("default");
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
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    const gameRole = guild.roles.get(game.roleID);
    const gameJoinChannel = await guild.channels.find(c => c.name === settings.gameJoinChannel);

    const notification = new RichEmbed()
      .setColor(colors['darkviolet'])
      .setDescription(client.textes.get("GAMES_ACTIVE_NOTIFICATION", game, member, gameRole, gameJoinChannel));
    member.send(notification);
    client.modLog(client.textes.get("MOD_NOTIF_MEMBER_NOTIFIED_GAME_EXIST", member, game));

  };

  client.gameDisplayInfos = async (game, channel) => {
    const guild = client.guilds.get(client.config.guildID);

    const gameRole = await guild.roles.get(game.roleID);

    let description = "";

    const embed = new Discord.RichEmbed();
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

  client.gameGetPlayerList = async (game) => {
    const guild = client.guilds.get(client.config.guildID);
    const gameRole = guild.roles.get(game.roleID);

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
        player.id = member.id;
        player.name = member.displayName;
        player.usergame = false;
      }

      players.push(player);

    }
    return players;
  }


}