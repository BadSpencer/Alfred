const {
    Command
} = require("discord-akairo");
const { Permissions } = require('discord.js');

class LogsCommand extends Command {
    constructor() {
        super('logs', {
            aliases: ['logs', 'log'],  
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
        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = await client.db.getSettings(client);

        if (message.channel.type === 'text') message.delete();;
        message.channel.send("Logs", { files: ["/root/.pm2/logs/index-out.log"] });

        if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();

    }

}


module.exports = LogsCommand;