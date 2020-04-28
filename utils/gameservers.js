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

module.exports = (client) => {

  client.gameServersAddServer = async (message, gamename, name, ip, portrcon, pwdrcon, portftp, userftp, pwdftp) => {
    let serverID = client.db_gameservers.autonum;
    let gameserver = client.db_gameservers.get("default");
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

  client.gameServersDeleteServer = async (message, serverID) => {
    let server = client.db_gameservers.get(serverID);

    if (!server) return errorMessage(client.textes.get("GAMESERVER_ERROR_SERVER_NOT_FOUND", serverID), message.channel);

    let questionMess = await questionMessage(client.textes.get("GAMESERVER_SERVER_DELETE_CHECK_BEFORE", server), message.channel);
    const responses = await message.channel.awaitMessages(msg => msg.author.id === message.author.id, {
      max: 1,
      time: 30000,
    });

    if (responses.size !== 1) {
      warnMessage(client.textes.get("COM_ACTION_TIMEOUT"), message.channel);
      return null;
    }
    const response = responses.first();
    if (message.channel.type === 'text') response.delete();

    if (response.content == "oui") {
      await client.db_gameservers.delete(serverID);
      successMessage(client.textes.get("GAMESERVER_SERVER_DELETE_SUCCESS", server), message.channel);
    } else {
      warnMessage(client.textes.get("COM_ACTION_ANNULLE"), message.channel);
      return null;
    }

  };

  client.gameServersPlayerLog = async (playerID, playerName, server) => {
    const guild = client.guilds.get(client.config.guildID);

    let gameserversPlayer = await client.db_gameserversPlayers.get(playerID);
    let dateNow = +new Date;
    if (gameserversPlayer) {
      gameserversPlayer.lastSeenAt = dateNow;
      gameserversPlayer.lastSeenDate = moment(dateNow).format('DD.MM.YYYY');
      gameserversPlayer.lastSeenTime = moment(dateNow).format('HH:mm');
      await client.db_gameserversPlayers.set(playerID, gameserversPlayer);


      if (gameserversPlayer.memberID !== "") {
        let member = guild.members.get(gameserversPlayer.memberID);
        if (!member) {
          let userdata = client.db_userdata.get(gameserversPlayer.memberID);
          if (userdata) {
            await client.modLog(client.textes.get("GAMESERVER_PLAYER_OLD_MEMBER_DETECTED", server, playerID, playerName));
          }
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
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    let heure = moment().format('HH');



    let servers = await client.db_gameservers.filterArray(server => server.id !== "default" && server.isActive == true);
    client.log(`Vérification RCON (${servers.length} serveurs)`);

    for (const server of servers) {
      let response = await client.gameRconQuery(server, "listplayers");
      let playerlist = [];

      let game = client.db_games.get(server.gamename);
      const gameTextChannel = await guild.channels.get(game.textChannelID);

      if (response == undefined) {
        if (server.status == "online") {
          // Annonce serveur est tombé
          if (heure !== "05") gameTextChannel.send(`Le serveur ${server.servername} est tombé. Les admins ont déjà été prévenus`);
        };
        server.status = "offline";
        server.connected = 0;
        server.playerlist = [];

      } else {
        if (server.status == "offline") {
          // Annonce serveur est revenu
          if (heure !== "05") gameTextChannel.send(`Le serveur ${server.servername} est à nouveau en ligne !`);
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

  client.gameServersArkDWD = async (serverID = "all", message = null) => {
    const guild = client.guilds.get(client.config.guildID);
    let settings = client.db_settings.get(guild.id);




    if (serverID == "all") {
      let servers = await client.db_gameservers.filterArray(server => server.gamename == "ARK: Survival Evolved");
      for (const server of servers) {
        //let response = await client.gameRconQuery(server, "destroywilddinos");
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
        if (server.status == "online") {
          if (server.connected == 0) {
            fieldDescription = `🟢 [**${server.servername}**](${server.steamlink})\n`;
          } else {
            fieldDescription = `🟢 [**${server.servername}**](${server.steamlink}) **${server.connected}**\n`;
          }
        } else {
          fieldDescription = `🔴 [**${server.servername}**](${server.steamlink})\n`;
        }
        for (const player of server.playerlist) {
          // fieldDescription += `◽️ ${player[0]} (${player[1]})\n`;
          if (player[2] !== "") {
            let member = await guild.members.get(player[2]);
            fieldDescription += `🔹 ${member.displayName}\n`;
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

  client.gameServersPlayerLink = async (message, playerID, memberID) => {
    const guild = client.guilds.get(client.config.guildID);

    let gameserversPlayer = await client.db_gameserversPlayers.get(playerID);
    let member = guild.members.get(memberID);

    if (!gameserversPlayer) return errorMessage(client.textes.get("GAMESERVER_ERROR_PLAYERID_NOT_FOUND", playerID), message.channel);
    if (!member) return errorMessage(client.textes.get("USER_ERROR_MEMBERID_NOT_FOUND", memberID), message.channel);

    gameserversPlayer.memberID = memberID;
    await client.db_gameserversPlayers.set(playerID, gameserversPlayer);
    return successMessage(client.textes.get("GAMESERVER_PLAYER_LINK_SUCCESS", gameserversPlayer, member), message.channel);
  };

  client.gameServersPlayerBan = async (playerID, message = null) => {

    let gameserversPlayer = await client.db_gameserversPlayers.get(playerID);

    if (!gameserversPlayer) return errorMessage(client.textes.get("GAMESERVER_ERROR_PLAYERID_NOT_FOUND", playerID), message.channel);

    let servers = await client.db_gameservers.filterArray(server => server.gamename == "ARK: Survival Evolved" && server.isActive == true);
    for (const server of servers) {
      let response = await client.gameRconQuery(server, `BanPlayer ${playerID}`);
      if (response.includes("Banned")) {
        client.modLog(client.textes.get("GAMESERVER_ARK_BAN_SUCCESS", gameserversPlayer, server));
        if (message !== null) {
          successMessage(client.textes.get("GAMESERVER_ARK_BAN_SUCCESS", gameserversPlayer, server), message.channel);
        }
      } else {
        client.modLog(client.textes.get("GAMESERVER_ARK_BAN_ERROR", gameserversPlayer, server));
        if (message !== null) {
          errorMessage(client.textes.get("GAMESERVER_ARK_BAN_ERROR", gameserversPlayer, server), message.channel);
        }
      }
    }
    gameserversPlayer.isBanned = true;
    await client.db_gameserversPlayers.set(playerID, gameserversPlayer);

  };

  client.gameServersPlayerUnban = async (playerID, message = null) => {

    let gameserversPlayer = await client.db_gameserversPlayers.get(playerID);

    if (!gameserversPlayer) return errorMessage(client.textes.get("GAMESERVER_ERROR_PLAYERID_NOT_FOUND", playerID), message.channel);

    let servers = await client.db_gameservers.filterArray(server => server.gamename == "ARK: Survival Evolved" && server.isActive == true);
    for (const server of servers) {
      let response = await client.gameRconQuery(server, `UnBanPlayer ${playerID}`);
      if (response.includes("Unbanned")) {
        client.modLog(client.textes.get("GAMESERVER_ARK_UNBAN_SUCCESS", gameserversPlayer, server));
        if (message !== null) {
          successMessage(client.textes.get("GAMESERVER_ARK_UNBAN_SUCCESS", gameserversPlayer, server), message.channel);
        }
      } else {
        client.modLog(client.textes.get("GAMESERVER_ARK_UNBAN_ERROR", gameserversPlayer, server));
        if (message !== null) {
          errorMessage(client.textes.get("GAMESERVER_ARK_UNBAN_ERROR", gameserversPlayer, server), message.channel);
        }
      }
    }
    gameserversPlayer.isBanned = false;
    await client.db_gameserversPlayers.set(playerID, gameserversPlayer);
  };

  client.gameServersListPlayers = async (message) => {
    const guild = client.guilds.get(client.config.guildID);

    let dateNow = +new Date();
    let listPlayersArray = [];
    let players = client.db_gameserversPlayers.fetchEverything().array();

    players.sort(function (a, b) {
      return a.lastSeenAt - b.lastSeenAt;
    }).reverse();


    players.forEach(player => {
      let statusIcon = "";
      let playerName = "";

      if (player.memberID !== "") {
        let userdata = client.db_userdata.get(player.memberID);
        if (!userdata) {
          if (player.isBanned == false) {
            statusIcon = "⚠️";
            playerName = `**${player.steamName}** (membre ${player.memberID} non trouvé)`;
          } else {
            statusIcon = "⛔️";
            playerName = `**${player.steamName}** (membre ${player.memberID} non trouvé)`;
          }

        } else {
          if (player.isBanned == false) {
            statusIcon = "🔹";
            playerName = `**${userdata.displayName}**`;
          } else {
            statusIcon = "⛔️";
            playerName = `**${userdata.displayName}**`;
          }
        }
      } else {
        if (player.isBanned == false) {
          statusIcon = "🔸";
          playerName = `**${player.steamName}** (joueur non lié à un membre)`;
        } else {
          statusIcon = "⛔️";
          playerName = `**${player.steamName}** (joueur non lié à un membre)`;
        }
      }



      let connected = "";
      let ms = dateNow - player.lastSeenAt;
      if (ms < 0) ms = 1000;
      let timeDwD = client.msToHours(ms);


      if (timeDwD !== "" && timeDwD !== "1m") {
        connected = `Connecté il y a **${timeDwD}**`;
      } else {
        connected = `**Connecté**`
      }

      listPlayersArray.push(`${statusIcon}${playerName}\n⬛️ID:${player.id} (${player.steamName})\n⬛️${connected}\n`);
    })

    await client.arrayToEmbed(listPlayersArray, 5, "Liste des joueurs", message.channel);

  };
}