const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('./datamodel');

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

  client.gameAddServer = async (gamename, name, ip, port, password) => {
    let serverID = client.db_gameservers.autonum;
    let gameserver = client.db_gameservers.get("default");

    gameserver.id = serverID;
    gameserver.gamename = gamename;
    gameserver.name = name;
    gameserver.ip = ip;
    gameserver.port = port;
    gameserver.password = password;

    client.db_gameservers.set(serverID, gameserver);
    client.log(`Le jeu ${gamename} à été ajouté à la base de données`);
    return serverID;
  };


  client.checkGameServers = async () => {
    client.log(`Vérification de la base de données des serveurs de jeu`, "debug");
    await client.db_gameservers.delete("default");
    await client.db_gameservers.set("default", datamodel.tables.gameservers);
  };

  client.gameServersPostInfoMessages = async () => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    let servers = await client.db_gameservers.filterArray(server => server.id !== "default");




    for (const server of servers) {
      const game = await client.db_games.find(game => game.name == server.gamename);

      if (!game.infosChannelID) return;
      const gameInfosChannel = await guild.channels.get(game.infosChannelID);
      let embed = new Discord.RichEmbed(await client.gameServerGetInfosEmbed(server));

      let gameServerInfoMessage = undefined;
      if (server.infoMessage) {
        await gameInfosChannel.fetchMessage(server.infoMessage).then(message => {
          gameServerInfoMessage = message;
        });
      }

      if (gameServerInfoMessage) {
        gameServerInfoMessage.edit(embed);

      } else {
        gameServerInfoMessage = await gameInfosChannel.send(embed);
        server.infoMessage = gameServerInfoMessage.id;
        client.db_gameservers.set(server.id, server);

      }

    };


  };

  client.gameServerGetInfosEmbed = async (server, details = false) => {

    let embed = new Discord.RichEmbed();
    let playerlist = [];
    let description = "";

    let response = await client.gameRconQuery(server, "listplayers");

    embed.addField('Paramètres',`Exp: **${server.xpRate}**x\nRécolte: **${server.recRate}**x\nAppriv.: **${server.apprRate}**x`, true);
    embed.addField('\u200B',`Int. repro: **${server.reproRate}**x\nEclosion: **${server.ecloRate}**x\nMaturation: **${server.matRate}**x`, true);
    embed.addField('Mods',server.description, true);


    if (response == undefined) {
      embed.addField("Statut", "🟥 Offline", true);
      embed.addField('\u200B','\u200B', true);
      embed.addField("En ligne", "0", true);
    } else {
      embed.addField("Statut", "🟩 Online", true);
      embed.addField('\u200B','\u200B', true);

      if (response.startsWith(`No Players Connected`)) {
        embed.addField("En ligne", "0", true);
      } else {
        let entries = response.split("\n");
        const regex = /(?<=\.)(.*?)(?=\,)/;
        let m;
        entries.forEach(entry => {
          if ((m = regex.exec(entry)) !== null) {
            let user = m[1];
            let id = entry.split(",")[1].trim();
            playerlist.push([user, id]);
          }
        });
        embed.addField("En ligne", playerlist.length, true);
      }

    }

    if (server.thumbnail) embed.setThumbnail(server.thumbnail);

    description += `**Steam Connect**: steam://connect/${server.ip}:${server.port}/\n`;
    description += `**Adresse**: ${server.ip}:${server.port}\n`;
    description += `**Mot de passe**: ${server.clientpwd}\n`;
    description += `\n`;
    //description += server.description;


    embed.setTitle(server.name);
    embed.setDescription(description);
    embed.setTimestamp();

    return embed;

  };

  client.gameServersArkDWD = async () => {
    let servers = await client.db_gameservers.filterArray(server => server.gamename == "ARK: Survival Evolved");

    for (const server of servers) {
      client.gameRconQuery(server, "destroywilddinos");
    }
  };

  client.gameRconQuery = async (server, command) => {
    const RCON = require('source-rcon-client').default;
    let rcon = new RCON(server.ip, server.port, server.password);
    let returnResponse;
    await rcon.connect().then(() => {

      return rcon.send(command); // Assuming an ARK/ATLAS server...
    }).then(response => {
      client.log(`RCON commande '${command}' sur '${server.name}'`, "debug");
      returnResponse = response;
      return rcon.disconnect();
    }).catch(error => {
      client.log(`Erreur RCON: ${error}`, "error");
    });
    return returnResponse;
  };

}