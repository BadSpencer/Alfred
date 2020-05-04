const { Permissions } = require('discord.js');
const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const Discord = require("discord.js");
const colors = require('../../utils/colors');
const {
    successMessage,
    errorMessage,
    warnMessage
} = require('../../utils/messages');

class PurgeCommand extends Command {
    constructor() {
        super('purge', {
            aliases: ['purge', 'del', 'bulkdelete'],
            userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
            category: 'Modération',
            args: [{
                id: 'purge', type: 'number', default: 1,
            }],
            description: {
                usage: 'purge [ nombre ]',
                examples: ['purge 2', 'purge 100'],
                description: 'Supprime un certain nombre de messages dans un salon.'
            },
            cooldown: 6000,
            ratelimit: 2
        })
    }

    async exec(message, args) {
        let client = this.client;

        if (args.purge < 1 || args.purge > 100) return message.util.send('Le nombre de messages à supprimer doit être compris entre 1 et 100.');
        await message.delete()

        const deleted = await message.channel.fetchMessages({ limit: args.purge });
        await message.channel.bulkDelete(deleted)
            .then(deletedMsg => {
                successMessage(client.textes.get("PURGE_DELETE_SUCCESS", args, deletedMsg.size), message.channel);
            })
            .catch(error => {
                errorMessage(client.textes.get("PURGE_DELETE_ERROR", error), message.channel);
            });
    }
}

module.exports = PurgeCommand;