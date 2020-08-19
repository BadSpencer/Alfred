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
        let client = this.client;

        if (args.nbdel < 1 || args.nbdel > 100) return message.util.send('Le nombre de messages à supprimer doit être compris entre 1 et 100.');
        await message.delete()

        const deleted = await message.channel.messages.fetch({ limit: args.nbdel });
        await message.channel.bulkDelete(deleted)
            .then(deletedMsg => {
                successMessage(client.textes.get("PURGE_DELETE_SUCCESS", args.nbdel, deletedMsg.size), message.channel);
            })
            .catch(error => {
                errorMessage(client.textes.get("PURGE_DELETE_ERROR", error), message.channel);
            });
    }
}

module.exports = PurgeCommand;