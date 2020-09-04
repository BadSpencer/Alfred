const {
    Command
} = require("discord-akairo");
const { Permissions } = require("discord.js");

class LogsCommand extends Command {
    constructor() {
        super('database', {
            aliases: ['database', 'db'],  
            category: 'Admin',
            channelRestriction: 'dm',
            cooldown: 30000,
            ratelimit: 1,
            description: {
                content: 'Consultation des logs',
                usage: '!logs [action]\nActions: \`full\`, \`commandes\` ( ou \`cmds\`)',
                examples: ['!logs', '!logs full', '!logs cmds']
            },
            args: [{
                id: "action",
                type: [
                    "full",
                    "commandes", "cmds"
                ],
                default: "full",
            }],
        });
    }

    async exec(message, args) {
        let client = this.client;
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        if (message.channel.type === 'text') message.delete();;
        // message.channel.send("Base de données", { files: ["/root/Alfred/data/enmap.sqlite"] });
        // message.channel.send("Base de données", { files: ["C:\\Users\\jmbrunod\\Documents\\Alfred\\data\\enmap.sqlite"] });
        message.channel.send("Base de données", { files: ["C:\\Users\\jmbrunod\\Documents\\Alfred DB\\enmap.sqlite"] });
        
    }

}


module.exports = LogsCommand;