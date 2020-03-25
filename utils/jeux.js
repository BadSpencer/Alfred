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

      let gameServerInfoMessage = await gameInfosChannel.send(embed);
      server.infoMessage = gameServerInfoMessage.id;
      client.db_gameservers.set(server.id, server);
    };
  };

  client.gameServersPostStatusMessage = async () => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    let games = await client.db.gamesGetActiveArray(client);




    for (const game of games) {
      if (!game.infosChannelID) continue;
      let embed = new Discord.RichEmbed();
      const gameInfosChannel = await guild.channels.get(game.infosChannelID);
      let servers = await client.db_gameservers.filterArray(server => server.gamename == game.name);

      if (servers.length == 0) continue;


      let description = "";

      let status = "";

      servers.sort(function (a, b) {
        return a.id - b.id;
      });


      for (const server of servers) {
        if (server.status == "online") {
          status = "🟢";
        } else {
          status = "🔴";
        }
        if (server.connected == 0) {
          description += `${status} ${server.name}\n\n`
        } else[
          description += `${status} ${server.name} 👤**${server.connected}**\n\n`
        ]
        //description += `${server.status} ${server.name} 👤**${server.connected}**\n\n`
        //embed.addField(`${server.status} ${server.name} (${server.connected})`, '\u200B', false);
      }
      embed.setTimestamp();
      embed.setTitle(game.name);
      embed.setDescription(description)
      embed.setFooter(`Dernière mise à jour`);

      let gameServerStatusMessage = undefined;
      if (game.serversStatusMessageID) {
        await gameInfosChannel.fetchMessage(game.serversStatusMessageID).then(message => {
          gameServerStatusMessage = message;
        });
      }

      if (gameServerStatusMessage) {
        gameServerStatusMessage.edit(embed);
      } else {
        let message = await gameInfosChannel.send(embed);
        game["serversStatusMessageID"] = message.id;
        client.db_games.set(game.name, game);
      }
    }
  };

  client.gameServersStatus = async () => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);



    let servers = await client.db_gameservers.filterArray(server => server.id !== "default");

    for (const server of servers) {
      let response = await client.gameRconQuery(server, "listplayers");
      let playerlist = [];

      let game = client.db_games.get(server.gamename);
      const gameTextChannel = await guild.channels.get(game.textChannelID);

      if (response == undefined) {
        if (server.status == "online") {
          // Annonce serveur est tombé

          gameTextChannel.send(`Le serveur ${server.name} est tombé. Les admins ont déjà été prévenus`);

        };
        server.status = "offline";
        server.connected = 0;

      } else {
        if (server.status == "offline") {
          // Annonce serveur est revenu
          gameTextChannel.send(`Le serveur ${server.name} est à nouveau en ligne !`);
        };
        server.status = "online";

        if (response.startsWith(`No Players Connected`)) {
          server.connected = 0;
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
          server.connected = playerlist.length;

        }
      }
      await client.db_gameservers.set(server.id, server);
    }
  };


  client.gameServerGetInfosEmbed = async (server, details = false) => {

    let embed = new Discord.RichEmbed();
    let playerlist = [];
    let description = "";

    embed.addField('Paramètres', `Exp: **${server.xpRate}**x\nRécolte: **${server.recRate}**x\nAppriv.: **${server.apprRate}**x`, true);
    embed.addField('\u200B', `Int. repro: **${server.reproRate}**x\nEclosion: **${server.ecloRate}**x\nMaturation: **${server.matRate}**x`, true);
    embed.addField('Mods', server.description, true);

    if (server.thumbnail) embed.setThumbnail(server.thumbnail);

    description += `**Steam Connect**: steam://connect/${server.ip}:${server.port}/\n`;
    description += `**Adresse**: ${server.ip}:${server.port}\n`;
    description += `**Mot de passe**: ${server.clientpwd}\n`;
    description += `\n`;

    embed.setTitle(server.name);
    embed.setDescription(description);

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