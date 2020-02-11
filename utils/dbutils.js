const moment = require('moment');

class DbUtils {
    constructor(client) {

        this.userdataCreate = async (member) => {
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
    }
}

module.exports = DbUtils;