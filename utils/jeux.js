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

    const game = await client.db_games.get(gamename);
    const gameRole = await message.guild.roles.get(game.roleID);

    let description = "";


    const embed = new Discord.RichEmbed();
    embed.setTitle(gamename);
    embed.setColor(colors['darkorange']);

    for (const member of gameRole.members) {
      let key = `${gamename}-${member[1].id}`
      let usergame = client.db_usergame.get(key);
      if (usergame) {
        let now = +new Date;
        description += `**${member[1].displayName}** Jeu: ${client.msToDays(now - usergame.lastPlayed)} Action: ${client.msToDays(now - usergame.lastAction)} \n`;
      } else {
        description += `**${member[1].displayName}** Aucune donnée de jeu\n`;
      }
    }

    embed.setDescription(description);

    message.channel.send(embed);

  };
}