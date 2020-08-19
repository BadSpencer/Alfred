const {
    Command
} = require("discord-akairo");
const {
    inspect
} = require("util");
const {
    successMessage,
    errorMessage,
    warnMessage
} = require('../../utils/messages');
const { Permissions } = require('discord.js');

class dbSettingsCommand extends Command {
    constructor() {
        super('settings', {
            aliases: ['settings', 'set'],
            category: 'Admin',
            userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
            split: 'quoted',

            description: {
                content: 'Gestion de la configuration d\'Alfred',
                usage: '<method> <...arguments>',
            },
            args: [{
                id: 'action',
                default: 'check'
            }, {
                id: 'key',
            }, {
                id: 'value',
                type: "content",
                match: "rest",
            }],

        });
    }


    async exec(message, args) {
        let client = this.client;

        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = client.db_settings.get(guild.id);

        switch (args.action) {
            case 'check': {
                message.channel.send(`***__Configuration__***\n\`\`\`json\n${inspect(settings)}\n\`\`\``)
                break;
            }

            case 'edit': {
                if (!args.key) return errorMessage('Veuillez spécifier une clé', message.channel);
                if (args.value.length < 1)  return errorMessage('Veuillez spécifier une valeur', message.channel);
                settings[args.key] = args.value;
                client.db_settings.set(guild.id, settings);

                successMessage(`${args.key} édité avec succès avec la valeur ${args.value}`, message.channel);
                break;
            }



        }
        
        if (message.channel.type === 'text') message.delete();;
    }

}

module.exports = dbSettingsCommand;