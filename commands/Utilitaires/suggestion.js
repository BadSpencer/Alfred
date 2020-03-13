const {
    Command
} = require('discord-akairo');
const { Permissions } = require('discord.js');

class SuggestionCommand extends Command {
    constructor() {
        super('logs', {
            aliases: ['logs'],
            userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
            category: 'Utilitaires',
            cooldown: 30000,
            ratelimit: 1,
            description: 'Récupérer les logs',
        });
    }

    async exec(message, args) {
        let client = this.client;
        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);


      


    }
}


module.exports = SuggestionCommand;