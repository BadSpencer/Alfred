const moment = require('moment');

module.exports = (client) => {

    client.memberCreate = async (member) => {
        let userJoinedDate = moment(member.joinedAt).format('DD.MM.YYYY') + " à " + moment(member.joinedAt).format('HH:mm');
        let userdata = {
          "id": member.id,
          "name": member.displayName,
          "level": 0,
          "xp": 0,
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

    process.on("uncaughtException", (err) => {
        const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
        console.log(`Uncaught Exception: ${errorMsg}`);
        console.error(err);
        process.exit(1);
    });

    process.on("unhandledRejection", err => {
        console.log(`Unhandled rejection: ${err}`);
        console.error(err);
    });
};