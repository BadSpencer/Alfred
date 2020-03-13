const moment = require("moment");

module.exports = (client) => {

  client.gameGetScore = async (nbDays = 5) => {



    let games = [];
    let days = [];

    for (var i = 1; i < 5; i++) {
      days.push(moment().subtract(i, 'days').format('DD.MM.YYYY'));
    }

    for (const day of days) {
      let xplogs = client.db_userxplogs.filterArray(rec => rec.date == day)
      for (const xplog of xplogs) {
        if (xplog.gamexp) {
          for (const gamexp of xplog.gamexp) {

            let game = games.find(r => r.name == gamexp.gamename)
            if (game) {
              game.xp += gamexp.xp;
            } else {
              game = {
                "name": gamexp.gamename,
                "xp": gamexp.xp
              };
              games.push(game);
            }
          }
        }
      }
    }

    console.log(games);

  };


}