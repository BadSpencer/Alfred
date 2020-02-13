const moment = require("moment");

// USERDATA
exports.userdataCreate = async (client, member) => {
    let userJoinedDate = moment(member.joinedAt).format('DD.MM.YYYY') + " à " + moment(member.joinedAt).format('HH:mm');
    let userdata = {
        "id": member.id,
        "name": member.displayName,
        "level": 0,
        "xp": 0,
        "xpStartDate": +new Date,
        "nicknames": [],
        "notes": [],
        "avertissements": [],
        "logs": []
    };

    userdata.name = member.displayName;
    userdata.nicknames.push({
        "date": member.joinedTimestamp,
        "oldNickname": member.user.username,
        "newNickname": member.displayName
    });
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
    if (member.roles.has(roleMembers.id)) {
        let xpAmount = parseInt(xp);
        if (xpAmount > 0) {
            userdata.xp += xpAmount;
            client.logger.log(``)
            let newLevel = await client.exp.xpGetLevel(userdata.xp);
            if (newLevel > userdata.level) {
                userdata.level = newLevel;
                client.exp.userLevelUp(client, member, newLevel);
            };
            client.db_userdata.set(member.id, userdata);
        }
    };
};

// GAMES

exports.gamesGetAll = async (client) => {
    const games = client.db_games.fetchEverything() || {};
    return games;
};