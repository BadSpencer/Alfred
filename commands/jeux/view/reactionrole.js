const { Command } = require('discord-akairo');
const { successMessage, errorMessage, warnMessage } = require('../../../utils/messages');
class GamesReactionroleCommand extends Command {
    constructor() {
        super('games-reactionrole', {
            aliases: ['games-reactionrole'],
            category: 'games',
            description: {
                content: 'Poste ou mets à jour le message pour rejoindre les jeux',
                usage: '!games reactionrole [new]',
            },
            args: [{
                id: 'option',
                match: 'content',
            }],
        });
    }
    async exec(message, args) {
        const guild = this.client.guilds.get(this.client.config.guildID);
        let settings = await this.client.db.getSettings(this.client);



    }
}
module.exports = GamesReactionroleCommand;