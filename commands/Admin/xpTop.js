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
        // const coef = yield {
        //     type: "number",
        //     default: 0
        // };
        // return {
        //     coef
        // };
    }


    async exec(message, args) {
        let client = this.client;
        const guild = client.getGuild();
        const settings = client.getSettings(guild);


        let usersTopXP = client.userdataGetAll(true);


        let userstopDesc = [];

        usersTopXP.sort(function (a, b) {
            return a.xp - b.xp;
        });
        usersTopXP.reverse();
        for (const user of usersTopXP) {
            let member = guild.members.cache.get(user.id);
            if (member) {
                userstopDesc.push(`**${user.displayName}**: ${user.level} (${user.xp})`);
            } else {
                userstopDesc.push(`${user.displayName}: ${user.level} (${user.xp})`);
            }
        }

        await client.arrayToEmbed(userstopDesc, 20, `Classement XP/Levels`, message.channel);
    }

}

module.exports = xpTopCommand;