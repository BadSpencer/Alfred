const { Command } = require("discord-akairo");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');

class PurgeCommand extends Command {
    constructor() {
        super('purge', {
            aliases: ['purge', 'del', 'bulkdelete'],
            category: 'Modération',
            description: {
                usage: 'purge [ nombre ]',
                examples: ['purge 2', 'purge 100'],
                description: 'Supprime un certain nombre de messages dans un salon.'
            },
            cooldown: 6000,
            ratelimit: 2
        })
    }

    *args(message) {
        const nbdel = yield {
            type: 'number',
            default: 1

        }
        return { nbdel };
    }

    async exec(message, args) {
        if (args.nbdel < 1 || args.nbdel > 100) return message.util.send('Le nombre de messages à supprimer doit être compris entre 1 et 100.');
        await message.delete()
        const deleted = await message.channel.messages.fetch({ limit: args.nbdel });
        await message.channel.bulkDelete(deleted);
    }
}

module.exports = PurgeCommand;