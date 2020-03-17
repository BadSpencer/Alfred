const {
    Command
} = require('discord-akairo');
const { Permissions } = require('discord.js');

class LogsCommand extends Command {
    constructor() {
        super('logs', {
            aliases: ['logs'],
            userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
            category: 'Modération',
            cooldown: 30000,
            ratelimit: 1,
            description: 'Récupérer les logs',
        });
    }

    async exec(message, args) {
        let client = this.client;
        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);

        message.delete();
        message.channel.send("Logs", {files: ["/root/.pm2/logs/index-out.log"]});
        //message.channel.send("Logs", {files: ["C:\\Users\\Bad\\Documents\\AlfredProd\\data\\enmap.sqlite"]});


        /*
        switch (args.action) {
            case 'dl':

            break;
            case 'debug':

            break;
        }
        */


    }
}


module.exports = LogsCommand;