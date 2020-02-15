const moment = require("moment");
const datamodel = require('./datamodel');

// CONGIG
exports.settingsCheck = async (client) => {
    const guild = client.guilds.get(client.config.guildID);

    if(!guild) return client.logger.error(`Serveur discord "${client.config.guildID}" non trouvé. Vérifiez la configuration d\'Alfred`);

    let settings = client.db_settings.get(guild.id);
    
    if (!settings) {
        let noguildsettings = `Configuration non trouvée pour serveur ${guild.name} (${guild.id}). La configuration par défaut à été appliquée.`;
        guild.owner.send(`La configuration du serveur ${guild.name} (${guild.id}) n\'a pas été faite. Veuillez lancer la commande !settings`)
        client.logger.log(`${noguildsettings}`)
        settings = datamodel.tables.settings;

        settings.id = guild.id;
        settings.guildName = guild.name;
        client.db_settings.set(guild.id, settings);
    } else {
        client.logger.log(`Configuration serveur ${guild.name} (${guild.id}) chargée`)
    }
};

// USERDATA
exports.userdataCreate = async (client, member) => {
    let userJoinedDate = moment(member.joinedAt).format('DD.MM.YYYY') + " à " + moment(member.joinedAt).format('HH:mm');
    let userdata = datamodel.userdata;
    let userdataLogs = datamodel.userdataLogs;
    let userdataNicknames = datamodel.userdataNicknames;

    userdata.id = member.id;
    userdata.name = member.displayName;
    userdata.level = 0;
    userdata.xp = 0;
    userdata.xpStartDate = +new Date;

    userdataNicknames.date = member.joinedTimestamp;
    userdataNicknames.oldNickname = member.user.username;
    userdataNicknames.newNickname = member.displayName;
    userdata.nicknames.push(userdataNicknames);

    userdataLogs.date = member.joinedTimestamp;
    userdataLogs.type = 
    userdata.logs.push({
        "date": member.joinedTimestamp,
        "type": "JOIN",
        "description": "A rejoint le serveur le " + userJoinedDate
    });

    client.db_userdata.set(member.id, userdata);
};

exports.userdataAddXP = async (client, member, xp, reason) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = client.db_settings.get(guild.id);
    const userdata = client.db_userdata.get(member.id);
    const roleMembers = guild.roles.find(r => r.name == settings.memberRole);
    if (roleMembers) {
        if (member.roles.has(roleMembers.id)) {
            let xpAmount = parseInt(xp);
            if (xpAmount > 0) {
                userdata.xp += xpAmount;
                client.logger.log(`${member.displayName} à gagné ${xpAmount}xp (${reason})`)
                let newLevel = await client.exp.xpGetLevel(userdata.xp);
                if (newLevel > userdata.level) {
                    userdata.level = newLevel;
                    client.logger.log(`${member.displayName} à gagné un level. Il est désormais level ${newLevel})`)
                    client.exp.userLevelUp(client, member, newLevel);
                };
                client.db_userdata.set(member.id, userdata);
            }
        }
    } else {
        client.logger.error(`Configuration serveur: impossible de trouver le rôle ${settings.memberRole}. Vérifiez la configuration en base de donnée`)
    }
};

exports.userlogAdd = async (client, member, type, xpgained, xpreason) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = client.db_settings.get(guild.id);
    const date = moment(member.joinedAt).format('DD-MM-YYYY')
    const logkey = (`${member.id}${date}`);

    let userlog = client.db_userlogs.get(logkey);
    if (userlog) {

    } else {

    }

}

// GAMES

exports.gamesGetAll = async (client) => {
    const games = client.db_games.fetchEverything() || {};
    return games;
};