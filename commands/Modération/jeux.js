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


class JeuxCommand extends Command {
    constructor() {
        super('jeux', {
            aliases: ['jeux', 'jeu', 'j'],
            category: 'Modération',
            args: [
                {
                    id: 'game',
                    type: 'game',
                    match: 'content',
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

        client.gameDisplayInfos(args.game, message.channel);

        if (message.channel.type === 'text') message.delete();;
    }
}


module.exports = JeuxCommand;