const {
    Command
} = require("discord-akairo");
const {
    inspect
} = require("util");
const {
    successMessage,
    errorMessage,
    warnMessage,
    promptMessage
} = require('../../utils/messages');
const Discord = require("discord.js");
const moment = require("moment");

class ExpCommand extends Command {
    constructor() {
        super("exp", {
            aliases: ["exp"],
            category: '🟪 Admin',
            description: {
                content: "Expérience",
                usage: "!exp top",
            },
        });
    }

    * args(message) {
        const mode = yield {
            type: ["top", "score", "xpday", "initbyage", "initbymess"],
            default: 0
        };
        return {
            mode
        };
    }


    async exec(message, args) {
        let client = this.client;
        const guild = client.getGuild();
       
        let userdatas = client.userdataGetAll(true);

        moment.locale('fr');


        switch (args.mode) {
            case "top":
                let userstopDesc = [];
                userdatas.sort(function (a, b) {
                    return a.xp - b.xp;
                });
                userdatas.reverse();
                for (const user of userdatas) {
                    let member = guild.members.cache.get(user.id);
                    if (member) {
                        userstopDesc.push(`**${user.displayName}**: ${user.level} (${user.xp})`);
                    } else {
                        userstopDesc.push(`${user.displayName}: ${user.level} (${user.xp})`);
                    }
                }

                await client.arrayToEmbed(userstopDesc, 10, `Classement XP/Levels`, message.channel);

                break;

            case "score":
                let usersScores = [];
                let usersScoreDesc = [];
                let now = +new Date;
                let fromTimestamp = +new Date(moment(now).subtract(5, 'days').startOf('day'));
                let toTimestamp = +new Date(moment(now).subtract(1, 'days').endOf('day'));
                let dateFrom = moment(fromTimestamp).format('lll');
                let dateTo = moment(toTimestamp).format('lll');
                let userScores = client.membersGetTopScores();


                userScores.sort(function (a, b) {
                    return b.score - a.score;
                });

                for (const userScore of userScores) {
                    if (userScore.score > 0) {
                        usersScoreDesc.push(`${client.memberGetDisplayNameByID(userScore.memberID)}: ${userScore.score}`);
                    }
                }
                await client.arrayToEmbed(usersScoreDesc, 10, `Scores\nDonnées du ${dateFrom} au ${dateTo}`, message.channel);
                break;

            case "xpday":

                let expDetail = client.membersGetExpDetail();
                await client.arrayToEmbed(expDetail, 20, `Expérience gagné jour par jour\n(Vocal/Jeu/Messages/Réactions reçues/Réactions données})`, message.channel);

                break;
            case "initbymess":
                let memberExpLogMess = [];

                for (const userdata of userdatas) {
                    let xp = 0;
                    let level = 1;
                    let memberMessages = client.db_messageslogs.filterArray((record) =>
                        record.createdBy === userdata.id
                    );
                    if (memberMessages) {
                        for (const message of memberMessages) {
                            if (!message.content.startsWith("https://tenor.com") && !message.content.startsWith("https://media.tenor.com") && !message.content.startsWith("!")) {
                                    xp += 25;
                            }
                        }
                        level = client.xpGetLevel(xp);
                    } else {
                        xp = 0;
                        level = 1;
                    }
                    memberExpLogMess.push(`${userdata.displayName}: **${level}** ${xp}`);
                    // client.userdataSet(userdata);
                }
                await client.arrayToEmbed(memberExpLogMess, 20, `Initialisation Expérience\nExp = Nombre messages x 10`, message.channel);
                break;
            default:
                break;
        }







    }

}

module.exports = ExpCommand;