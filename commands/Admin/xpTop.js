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

class xpTopCommand extends Command {
    constructor() {
        super("xp-top", {
            aliases: ["xptop"],
            category: "Admin",
            description: {
                content: "Top XP",
                usage: "!xptop",
            },
        });
    }

    * args(message) {
        const mode = yield {
            type: ["all", "cureent"],
            default: 0
        };
        return {
            mode
        };
    }


    async exec(message, args) {
        let client = this.client;
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        moment.locale('fr');


        let userdatas = client.userdataGetAll(true);


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

        let usersScores = [];
        let usersScoreDesc = [];
        let now = +new Date;
        let fromTimestamp = +new Date(moment(now).subtract(5, 'days').startOf('day'));
        let toTimestamp = +new Date(moment(now).subtract(1, 'days').endOf('day'));

        // var start = moment().startOf('day'); // set to 12:00 am today
        // var end = moment().endOf('day'); // set to 23:59 pm today



        // for (const userdata of userdatas) {
        //     let memberLogs = client.db_memberLog.filterArray(memberLog =>
        //         memberLog.memberID === userdata.id &&
        //         memberLog.createdAt > fromTimestamp &&
        //         memberLog.createdAt < toTimestamp);
        //     if (memberLogs) {
        //         let memberXP = {
        //             "memberID": userdata.id,
        //             "memberDisplayName": client.memberGetDisplayNameByID(userdata.id),
        //             "xpText": 0,
        //             "xpVoice": 0,
        //             "xpPlay": 0,
        //             "xpReactOut": 0,
        //             "xpReactIn": 0,
        //             "xpCmd": 0,
        //             "xpTotal": 0
        //         };
        //         for (const memberLog of memberLogs) {
        //             switch (memberLog.type) {
        //                 case "VOICE":
        //                     memberXP.xpVoice += memberLog.xpGained;
        //                     break;
        //                 case "PLAY":
        //                     memberXP.xpPlay += memberLog.xpGained;
        //                     break;
        //                 case "TEXT":
        //                     memberXP.xpText += memberLog.xpGained;
        //                     break;
        //                 case "CMD":
        //                     memberXP.xpCmd += memberLog.xpGained;
        //                     break;
        //                 case "REACTIN":
        //                     memberXP.xpReactIn += memberLog.xpGained;
        //                     break;
        //                 case "REACTOUT":
        //                     memberXP.xpReactOut += memberLog.xpGained;
        //                     break;
        //                 default:
        //                     break;
        //             }
        //             memberXP.xpTotal += memberLog.xpGained;
        //         }
        //         usersScores.push(memberXP);
        //     }
        // }

        // usersScores.sort(function (a, b) {
        //     return b.xpTotal - a.xpTotal;
        // });

        // for (const usersScore of usersScores) {
        //     if (usersScore.xpTotal > 0) {
        //         usersScoreDesc.push(`**${usersScore.memberDisplayName}** ${usersScore.xpTotal}`);
        //         usersScoreDesc.push(`Messages: ${usersScore.xpText}`);
        //         usersScoreDesc.push(`Vocal: ${usersScore.xpVoice}`);
        //         usersScoreDesc.push(`Jeu: ${usersScore.xpPlay}`);
        //         usersScoreDesc.push(`Réactions données: ${usersScore.xpReactOut}`);
        //         usersScoreDesc.push(`Réactions reçues: ${usersScore.xpReactIn}`);
        //         usersScoreDesc.push(`Commandes: ${usersScore.xpCmd}`);
        //     }
        // }
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


    }

}

module.exports = xpTopCommand;