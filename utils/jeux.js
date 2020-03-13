const moment = require("moment");
const Discord = require("discord.js");

module.exports = (client) => {

  client.gameGetScore = async (nbDays = 5) => {


    let activeGames = client.db_games.filterArray(game => game.actif === true);


    let gamesXP = [];
    let activeGamesXP = [];
    let days = [];

    for (var i = 1; i < 5; i++) {
      days.push(moment().subtract(i, 'days').format('DD.MM.YYYY'));
    }

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
      let gamexp = gamesXP.find(r => r.name == game.name)
      if (gamexp) {
        let activeGameXP = {
          "name": gamexp.gamename,
          "xp": gamexp.xp
        };
        activeGamesXP.push(activeGameXP);
      }
    }

    activeGamesXP.sort(function (a, b) {
      return a.xp - b.xp;
    });


    let description = "";
    for (const activeGameXP of activeGamesXP) {
      description += `**${activeGameXP.gamename}**: ${activeGameXP.xp}\n`
    }

    let embed = new Discord.RichEmbed();

    embed.setTitle(client.textes.get("GAMES_SCORE_TITLE"));
    //embed.setThumbnail("https://i.imgur.com/VQHvSKr.png");
    embed.setDescription(description);
    //embed.setFooter(client.textes.get("SUGG_NOTIF_PROPOSED_BY", member), avatar);
    embed.setTimestamp();


    return embed;

  };


}