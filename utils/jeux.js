const moment = require("moment");
const Discord = require("discord.js");

module.exports = (client) => {

  client.gameGetScore = async (nbDays = 5) => {

    const guild = client.guilds.get(client.config.guildID);
    let activeGames = client.db_games.filterArray(game => game.actif === true);

    let activeGamesScores = [];

    

    let days = [];
    for (var i = 1; i < 5; i++) {
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


}