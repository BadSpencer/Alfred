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



        this.makeChoice = async (channel, user) => {
            channel.send("Sorry, this channel isn't a nsfw channel. Do you want to change this channel to a nsfw channel? Reply this with `yes` to do it. And `no` for exiting this menu.");
            const filter = m => ((/yes/gi).test(m.content.split(" ")[0]) || (/no/gi).test(m.content.split(" ")[0])) && m.author.id === user.id;
            const choice = await channel.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
            if ((/yes/gi).test(choice.first())) {
                channel.setNSFW(true, `${client.user.tag} | NSFW`);
                return channel.send(`This channel now in nsfw mode. Now you'll be able to use my nfsw commands!`);
            } else if ((/no/gi).test(choice.first())) {
                return channel.send("Okay. Exiting...");
            }
        }


    }
}

module.exports = DbUtils;