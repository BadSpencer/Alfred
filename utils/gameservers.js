const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('./datamodel');
const colors = require('./colors');
const {
  successMessage,
  errorMessage,
  warnMessage,
  questionMessage,
  promptMessage
} = require('./messages');
const fetch = require("node-fetch");
const textes = new (require(`./textes.js`));

module.exports = (client) => {

  client.gameServersGetAll = (toArray = false) => {
    if (toArray == false) {
      return client.db_gameservers.fetchEverything();
    } else {
      return client.db_gameservers.array();
    };
  };

  client.gameServersGetActive = (toArray = false) => {
    if (toArray == false) {
      return client.db_gameservers.filter(rec => rec.isActive == true);
    } else {
      return client.db_gameservers.filterArray(rec => rec.isActive == true);
    };
  };

  client.gameServersGet = (serverID) => {
    return client.db_gameservers.get(serverID);
  };

  client.gameServersAddServer = async (message, gamename, name, ip, portrcon, pwdrcon, portftp, userftp, pwdftp) => {
    let serverID = client.db_gameservers.autonum;
    let gameserver = datamodel.tables.gameservers;
    let dateNow = +new Date;

    let urlshortener = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURI(`steam://connect/${ip}:${portrcon}/`)}`);
    let steamlink = await urlshortener.text();

    gameserver.id = serverID;
    gameserver.createdAt = dateNow;
    gameserver.createdate = moment(dateNow).format('DD.MM.YYYY');
    gameserver.createdTime = moment(dateNow).format('HH:mm');

    gameserver.gamename = gamename;
    gameserver.servername = name;
    gameserver.ip = ip;
    gameserver.portrcon = portrcon;
    gameserver.pwdrcon = pwdrcon;
    gameserver.portftp = portftp;
    gameserver.userftp = userftp;
    gameserver.pwdftp = pwdftp;
    gameserver.steamlink = steamlink;

    client.db_gameservers.set(serverID, gameserver);
    client.log(`Le serveur **${name}** pour **${gamename}** à été ajouté à la base de données`);
    return successMessage(client.textes.get("GAMESERVER_SERVER_ADD_SUCCESS", serverID), message.channel);
  };

  client.gameServersDeleteServer = (message, server) => {
    client.db_gameservers.delete(server.id.toString());
    successMessage(client.textes.get("GAMESERVER_SERVER_DELETE_SUCCESS", server), message.channel);
  };

  client.gameServerCheckPlayerOffline = (server) => {

    let dateNow = +new Date;
    let activeEntries = client.db_playersLogs.filter(record => record.isActive == true);

    for (const entry of activeEntries) {
      if (entry[1].lastSeenAt < dateNow - 300000) {
        entry[1].isActive = false;
        client.db_playersLogs.set(entry[0], entry[1]);
      }
    };

  };

  client.gameServersPlayerLog = async (playerID, playerName, server) => {
    const guild = client.guilds.cache.get(client.config.guildID);

    let dateNow = +new Date;
    let gameserversPlayer = client.db_gameserversPlayers.get(playerID);
    let gamePlayed = client.db_games.get(server.gamename);


    let playersLog = client.db_playersLogs.find(record =>
      record.playerID == playerID &&
      record.serverID == server.id &&
      record.isActive == true
    );
    if (playersLog) {
      playersLog.lastSeenAt = dateNow;
      playersLog.lastSeenDate = moment(dateNow).format('DD.MM.YYYY');
      playersLog.lastSeenTime = moment(dateNow).format('HH:mm');
      client.db_playersLogs.set(playersLog.id, playersLog);
    } else {
      let playersLogID = client.db_playersLogs.autonum;
      let playersLogNew = datamodel.tables.playersLogs;
      playersLogNew.id = playersLogID;
      playersLogNew.serverID = server.id;
      playersLogNew.servername = server.servername;
      playersLogNew.playerID = playerID;
      if (gameserversPlayer && gameserversPlayer.memberID !== "") {
        playersLogNew.memberID = gameserversPlayer.memberID;
        let userdata = client.db_userdata.get(gameserversPlayer.memberID);
        if (userdata) {
          playersLogNew.displayName = userdata.displayName;
        }
      } else {
        playersLogNew.displayName = playerName;
      }
      playersLogNew.firstSeenAt = dateNow;
      playersLogNew.firstSeenDate = moment(dateNow).format('DD.MM.YYYY');
      playersLogNew.firstSeenTime = moment(dateNow).format('HH:mm');
      playersLogNew.lastSeenAt = dateNow;
      playersLogNew.lastSeenDate = moment(dateNow).format('DD.MM.YYYY');
      playersLogNew.lastSeenTime = moment(dateNow).format('HH:mm');
      client.db_playersLogs.set(playersLogNew.id, playersLogNew);
    }

    if (gameserversPlayer) {
      gameserversPlayer.lastSeenAt = dateNow;
      gameserversPlayer.lastSeenDate = moment(dateNow).format('DD.MM.YYYY');
      gameserversPlayer.lastSeenTime = moment(dateNow).format('HH:mm');
      await client.db_gameserversPlayers.set(playerID, gameserversPlayer);

      if (gameserversPlayer.memberID !== "") {
        let member = guild.members.cache.get(gameserversPlayer.memberID);
        if (!member) {
          let userdata = client.db_userdata.get(gameserversPlayer.memberID);
          if (userdata) {
            await client.modLog(client.textes.get("GAMESERVER_PLAYER_OLD_MEMBER_DETECTED", userdata, gameserversPlayer, server));
          }
        } else {
          await client.usergameUpdateLastPlayed(gamePlayed, member);
        }
      }

    } else {

      let gameserversPlayerNew = datamodel.tables.gameserversPlayers;
      gameserversPlayerNew.id = playerID;
      gameserversPlayerNew.steamName = playerName;
      gameserversPlayerNew.firstSeenAt = dateNow;
      gameserversPlayerNew.firstSeenDate = moment(dateNow).format('DD.MM.YYYY');
      gameserversPlayerNew.firstSeenTime = moment(dateNow).format('HH:mm');
      gameserversPlayerNew.lastSeenAt = dateNow;
      gameserversPlayerNew.lastSeenDate = moment(dateNow).format('DD.MM.YYYY');
      gameserversPlayerNew.lastSeenTime = moment(dateNow).format('HH:mm');
      await client.db_gameserversPlayers.set(playerID, gameserversPlayerNew);
      await client.modLog(client.textes.get("GAMESERVER_NEW_PLAYER_DETECTED", server, playerID, playerName));

    }

  };

  client.gameServersStatus = async () => {
    const guild = client.guilds.cache.get(client.config.guildID);

    let servers = await client.db_gameservers.filterArray(server => server.id !== "default" && server.isActive == true);
    client.log(`Vérification RCON (${servers.length} serveurs)`);

    for (const server of servers) {
      if (server.status !== "maintenance") {
        let response = await client.gameRconQuery(server, "listplayers");
        let playerlist = [];

        let game = client.db_games.get(server.gamename);
        const gameTextChannel = await guild.channels.cache.get(game.textChannelID);

        if (response == undefined) {
          if (server.status == "online") {
            // Annonce serveur est tombé
            warnMessage(`Le serveur ${server.servername} est tombé.`, gameTextChannel, true, 600000);
          };
          server.status = "offline";
          server.connected = 0;
          server.playerlist = [];

        } else {
          if (server.status == "offline") {
            // Annonce serveur est revenu
            successMessage(`Le serveur ${server.servername} est à nouveau en ligne !`, gameTextChannel, true, 600000)
          };
          server.status = "online";

          if (response.startsWith(`No Players Connected`)) {
            server.connected = 0;
            server.playerlist = [];
          } else {
            let entries = response.split("\n");
            const regex = /(?<=\.)(.*?)(?=\,)/;
            let m;
            entries.forEach(entry => {
              if ((m = regex.exec(entry)) !== null) {
                let user = m[1];
                let id = entry.split(",")[1].trim();

                let player = client.db_gameserversPlayers.get(id);
                if (player) {
                  playerlist.push([user, id, player.memberID]);
                } else {
                  playerlist.push([user, id, ""]);
                }
              }
            });
            server.connected = playerlist.length;
            server.playerlist = playerlist;
          }
        }
        for (const player of playerlist) {
          await client.gameServersPlayerLog(player[1], player[0], server)
        };

        client.gameServerCheckPlayerOffline(server);
        client.db_gameservers.set(server.id, server);
      }
    }
  };

  client.gameServerGetInfosEmbed = async (server, details = false) => {

    let embed = new Discord.MessageEmbed();
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

  client.gameServersArkDWD = async (serverID = "*", message = null) => {
    const guild = client.guilds.cache.get(client.config.guildID);
    let settings = client.db_settings.get(guild.id);

    if (serverID == "*") {
      let servers = await client.db_gameservers.filterArray(server => server.gamename == "ARK: Survival Evolved");
      for (const server of servers) {
        let response = await client.gameRconQuery(server, "destroywilddinos");
        if (response.includes("All Wild Dinos Destroyed")) {
          client.modLog(client.textes.get("GAMESERVER_ARK_DWD_SUCCESS", server));
          if (message !== null) {
            successMessage(client.textes.get("GAMESERVER_ARK_DWD_SUCCESS", server), message.channel);
          }
        } else {
          client.modLog(client.textes.get("GAMESERVER_ARK_DWD_ERROR", serverID));
          if (message !== null) {
            errorMessage(client.textes.get("GAMESERVER_ARK_DWD_ERROR", serverID), message.channel);
          }
        }
      }
    } else {
      let server = await client.db_gameservers.get(serverID);
      if (server) {
        let response = await client.gameRconQuery(server, "destroywilddinos");
        if (response.includes("All Wild Dinos Destroyed")) {
          client.modLog(client.textes.get("GAMESERVER_ARK_DWD_SUCCESS", server));
          if (message !== null) {
            successMessage(client.textes.get("GAMESERVER_ARK_DWD_SUCCESS", server), message.channel);
          }
        } else {
          client.modLog(client.textes.get("GAMESERVER_ARK_DWD_ERROR", serverID));
          if (message !== null) {
            errorMessage(client.textes.get("GAMESERVER_ARK_DWD_ERROR", serverID), message.channel);
          }
        }
      }
    }
  };

  client.gameServersSetMaintenanceOn = async (serverID = "*") => {
    if (serverID == "*") {
      let servers = await client.db_gameservers.filterArray(server => server.gamename == "ARK: Survival Evolved");
      for (const server of servers) {
        await client.gameServersSetStatus(server.id, "maintenance");
      }
    } else {
      let server = client.db_gameservers.get(serverID);
      await client.gameServersSetStatus(server.id, "maintenance");
    };
  };

  client.gameServersSetMaintenanceOff = async (serverID = "*") => {
    if (serverID == "*") {
      let servers = await client.db_gameservers.filterArray(server => server.gamename == "ARK: Survival Evolved");
      for (const server of servers) {
        await client.gameServersSetStatus(server.id, "maintenanceoff");
      }
    } else {
      await client.gameServersSetStatus(serverID, "maintenanceoff");
    };
  };

  client.gameServersSetStatus = async (serverID = "*", status) => {
    if (serverID == "*") {
      let servers = await client.db_gameservers.filterArray(server => server.gamename == "ARK: Survival Evolved");
      for (const server of servers) {
        client.db_gameservers.set(server.id, status, 'status');
        client.log(`Serveur "${server.servername}" nouveau statut: "${status}"`);
      }
    } else {
      client.db_gameservers.set(serverID, status, 'status');
      let server = client.db_gameservers.get(serverID);
      client.log(`Serveur "${server.servername}" nouveau statut: "${status}"`);
    };
  };

  client.gameRconQuery = async (server, command) => {
    const RCON = require('source-rcon-client').default;
    let rcon = new RCON(server.ip, server.portrcon, server.pwdrcon);

    client.log(`RCON commande '${command}' sur '${server.servername}' (${server.ip}:${server.portrcon})`, "debug");

    let returnResponse;
    await rcon.connect().then(() => {

      return rcon.send(command); // Assuming an ARK/ATLAS server...
    }).then(response => {
      returnResponse = response;
      return rcon.disconnect();
    }).catch(error => {
      client.log(`Erreur RCON: ${error}`, "error");
    });
    return returnResponse;
  };

  client.gameServersPostStatusMessage = async () => {
    const guild = client.guilds.cache.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    let games = await client.db.gamesGetActiveArray(client);

    for (const game of games) {
      if (!game.infosChannelID) continue;
      let embed = new Discord.MessageEmbed();
      const gameInfosChannel = await guild.channels.cache.get(game.infosChannelID);

      if (!gameInfosChannel) return;

      let servers = await client.db_gameservers.filterArray(server => server.gamename == game.name && server.isActive == true);

      if (servers.length == 0) continue;

      let dateNextDwD = +new Date(client.cron_ArkDWD.nextDate());
      let dateNow = +new Date();

      let timeDwD = client.msToHours(dateNextDwD - dateNow);



      let fieldTitle = '\u200B';
      let fieldDescription = "";

      let fieldServerAdressesTitle = "Adresses";
      let fieldServerAdressesDescription = "";

      servers.sort(function (a, b) {
        return a.id - b.id;
      });

      for (const server of servers) {

        switch (server.status) {
          case 'online':
            if (server.connected == 0) {
              fieldDescription = `🟢 [**${server.servername}**](${server.steamlink})\n`;
            } else {
              fieldDescription = `🟢 [**${server.servername}**](${server.steamlink}) **${server.connected}**\n`;
            }
            break;
          case 'offline':
            fieldDescription = `🔴 [**${server.servername}**](${server.steamlink})\n`;
            break;
          case 'maintenance':
            fieldDescription = `🟠 [**${server.servername}**](${server.steamlink})\n`;
            break;
        }
        if (server.status == 'maintenance') {
          fieldDescription += `en **maintenance**\n`;
        }
        for (const player of server.playerlist) {
          // fieldDescription += `◽️ ${player[0]} (${player[1]})\n`;
          if (player[2] !== "") {
            let member = await guild.members.cache.get(player[2]);
            if (member) {
              fieldDescription += `🔹 ${member.displayName}\n`;
            } else {
              fieldDescription += `⚠️ ${player[0]}\n`;
            }
          } else {
            fieldDescription += `🔸 ${player[0]}\n`;
          }
        }

        fieldDescription += '〰️〰️〰️〰️〰️〰️〰️〰️';
        fieldServerAdressesDescription += `[**${server.servername}**](${server.steamlink}): ${server.ip}:${server.portrcon}\n`;

        embed.addField(fieldTitle, fieldDescription, true);

      }

      if (game.name == "ARK: Survival Evolved") {

        let fieldServerInfosTitle = "Informations";
        let fieldServerInfosDescription = client.textes.get("GAMESERVER_ARK_INFORMATIONS", timeDwD);
        embed.addField(fieldServerInfosTitle, fieldServerInfosDescription, false);

        let fieldServerModsTitle = "Mods";
        let fieldServerModsDescription = client.textes.get("GAMESERVER_ARK_MODS");
        embed.addField(fieldServerModsTitle, fieldServerModsDescription, true);

        let fieldServerRatesTitle = "Paramètres";
        let fieldServerRatesDescription = client.textes.get("GAMESERVER_ARK_RATES");
        embed.addField(fieldServerRatesTitle, fieldServerRatesDescription, true);
      }

      embed.addField(fieldServerAdressesTitle, fieldServerAdressesDescription, false);


      embed.setTimestamp();
      embed.setTitle(game.name);
      // embed.setDescription(description)
      embed.setFooter(`Dernière mise à jour`);


      let gameServerStatusMessage = undefined;
      if (game.serversStatusMessageID) {
        await gameInfosChannel.messages.fetch(game.serversStatusMessageID).then(message => {
          gameServerStatusMessage = message;
        }).catch(error => {
          gameServerStatusMessage = undefined;
          client.log(`Message statut serveurs "${game.name}" non trouvé dans ${gameInfosChannel.name}`, "warn");
        });
      }

      if (gameServerStatusMessage !== undefined) {
        gameServerStatusMessage.edit(embed);
        client.log(`Message statut serveurs "${game.name}" mis à jour`);
      } else {
        let message = await gameInfosChannel.send(embed);
        game["serversStatusMessageID"] = message.id;
        client.db_games.set(game.name, game);
        client.log(`Message statut serveurs "${game.name}" créé`, 'warn');
      }

    }
  };

  client.gameServersPlayerLink = async (message, playerID, userdata) => {
    const guild = client.guilds.cache.get(client.config.guildID);

    let gameserversPlayer = client.db_gameserversPlayers.get(playerID);
    let member = guild.members.cache.get(userdata.id);

    if (!gameserversPlayer) return errorMessage(client.textes.get("GAMESERVER_ERROR_PLAYERID_NOT_FOUND", playerID), message.channel);
    if (!member) return errorMessage(client.textes.get("USER_ERROR_MEMBERID_NOT_FOUND", userdata.id), message.channel);

    gameserversPlayer.memberID = userdata.id;
    await client.db_gameserversPlayers.set(playerID, gameserversPlayer);
    return successMessage(client.textes.get("GAMESERVER_PLAYER_LINK_SUCCESS", gameserversPlayer, member), message.channel);
  };

  client.gameServerPlayerBan = async (player, server) => {
    let response = await client.gameRconQuery(server, `BanPlayer ${player.id}`);
    if (response.includes("Banned")) {
      player.isBanned = true;
      client.db_gameserversPlayers.set(player.id, player);
      client.modLog(textes.get('GAMESERVER_ARK_BAN_SUCCESS', player, server));
      return true;
    } else {
      client.modLog(textes.get('GAMESERVER_ARK_BAN_ERROR', player, server));
      return false;
    }
  };

  client.gameServerPlayerUnban = async (player, server) => {
    let response = await client.gameRconQuery(server, `UnBanPlayer ${player.id}`);
    if (response.includes("Unbanned")) {
      player.isBanned = true;
      client.db_gameserversPlayers.set(player.id, player);
      client.modLog(textes.get('GAMESERVER_ARK_UNBAN_SUCCESS', player, server));
      return true;
    } else {
      client.modLog(textes.get('GAMESERVER_ARK_UnBAN_ERROR', player, server));
      return false;
    }
  };

  client.gameServersPlayerBan = async (player, message = null) => {
    let servers = await client.db_gameservers.filterArray(server => server.gamename == "ARK: Survival Evolved" && server.isActive == true);
    for (const server of servers) {
      let playerBan = await client.gameServerPlayerBan(player, server);
      if (message !== null) {
        if (playerBan == true) {
          successMessage(textes.get('GAMESERVER_ARK_BAN_SUCCESS', player, server), message.channel);
        } else {
          errorMessage(textes.get('GAMESERVER_ARK_BAN_ERROR', player, server), message.channel);
        }
      }
    }
  };



  client.gameServersPlayerUnban = async (playerID, message = null) => {

    let gameserversPlayer = await client.db_gameserversPlayers.get(playerID);

    if (!gameserversPlayer) return errorMessage(client.textes.get("GAMESERVER_ERROR_PLAYERID_NOT_FOUND", playerID), message.channel);

    let servers = await client.db_gameservers.filterArray(server => server.gamename == "ARK: Survival Evolved" && server.isActive == true);
    for (const server of servers) {

      let playerUnban = await client.gameServerPlayerUnban(gameserversPlayer, server);
      if (message !== null) {
        if (playerUnban == true) {
          successMessage(textes.get('GAMESERVER_ARK_UNBAN_SUCCESS', gameserversPlayer, server), message.channel);
        } else {
          errorMessage(textes.get('GAMESERVER_ARK_UNBAN_ERROR', gameserversPlayer, server), message.channel);
        }
      }
    }
    gameserversPlayer.isBanned = false;
    await client.db_gameserversPlayers.set(playerID, gameserversPlayer);
  };

  client.gameServersListPlayers = async (message) => {
    const guild = client.guilds.cache.get(client.config.guildID);

    let dateNow = +new Date();
    let listPlayersArray = [];
    let players = client.db_gameserversPlayers.fetchEverything().array();

    players.sort(function (a, b) {
      return a.lastSeenAt - b.lastSeenAt;
    }).reverse();


    players.forEach(player => {
      let memberLinked = "";
      if (player.memberID !== "") {
        let userdata = client.db_userdata.get(player.memberID);
        if (!userdata) {
          memberLinked = `⚠️${player.memberID}`;
        } else {
          memberLinked = `🔹${userdata.displayName}`;
        }
      } else {
        memberLinked = '🔸non lié'
      }

      let connected = "";
      let ms = dateNow - player.lastSeenAt;
      if (ms < 0) ms = 1000;
      let timeDwD = client.msToHours(ms);


      if (timeDwD !== "" && timeDwD !== "1m") {
        connected = `${timeDwD}`;
      } else {
        connected = `Connecté`
      }

      listPlayersArray.push(`**${player.id}** ${player.steamName} - ${memberLinked} - ${connected}`);
    })

    await client.arrayToEmbed(listPlayersArray, 15, "Liste des joueurs", message.channel);

  };
}