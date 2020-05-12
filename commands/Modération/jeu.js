const {
    Command
} = require('discord-akairo');
const { Permissions } = require('discord.js');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage,
    promptMessage
} = require('../../utils/messages');
const colors = require('../../utils/colors');


class JeuCommand extends Command {
    constructor() {
        super('jeu', {
            aliases: ['jeu', 'j'],
            category: 'Modération',
            args: [
                {
                    id: 'game',
                    type: 'game',
                    prompt: {
                        start: 'Veuillez spécifier un nom de jeu',
                        retry: 'Veuillez spécifier un nom de jeu'
                    },
                }
            ],
            description: {
                content: '',
                usage: '',
                examples: ['']
            }
        });
    }

    async exec(message, args) {
        let client = this.client;
        const guild = client.guilds.get(client.config.guildID);

        client.gamesPlayersDetail(args.game.name, message)

    }
}


module.exports = JeuCommand;