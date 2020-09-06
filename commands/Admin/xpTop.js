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

        let usersScoreDesc = [];
        let now = +new Date;
        let fromTimestamp = moment(now).subtract(5, 'days');

        for (const userdata of userdatas) {
            let memberLogs = client.db_memberLog.filterArray(memberLog =>
                memberLog.memberID === userdata.id &&
                memberLog.createdAt > fromTimestamp);
            if (memberLogs) {
                let userXP = 0;
                for (const memberLog of memberLogs) {
                    userXP += memberLog.xpGained;
                }
                if (userXP > 0) {
                    usersScoreDesc.push(`${client.memberGetDisplayNameByID(userdata.id)}: ${userXP}`);
                }
            }

        }


        await client.arrayToEmbed(usersScoreDesc, 10, `Scores`, message.channel);

    }

}

module.exports = xpTopCommand;