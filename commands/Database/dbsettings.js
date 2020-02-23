const {
    Command
} = require('discord-akairo');
const {
    inspect
} = require("util");
const {
    successMessage,
    errorMessage,
    warnMessage
} = require('../../utils/messages');

class dbSettingsCommand extends Command {
    constructor() {
        super('dbsettings', {
            aliases: ['dbsettings', 'set'],
            split: 'quoted',

            description: {
                content: 'Gestion de la configuration d\'Alfred',
                usage: '<method> <...arguments>',
            },
            category: 'config',

            args: [{
                id: 'action',
                default: 'check'
            }, {
                id: 'key',
            }, {
                id: 'value',
            }],

        });
    }


    async exec(message, args) {

        const guild = this.client.guilds.get(this.client.config.guildID);
        const settings = this.client.db_settings.get(guild.id);

        switch (args.action) {
            case 'check': {

        
                message.channel.send(`***__Configuration__***\n\`\`\`json\n${inspect(settings)}\n\`\`\``)
                break;
            }

            case 'edit': {

                if (!args.key) return errorMessage('Veuillez spécifier une clé', message.channel);
                if (args.value.length < 1)  return errorMessage('Veuillez spécifier une valeur', message.channel);
                settings[args.key] = args.value;
                this.client.db_settings.set(guild.id, settings);

                successMessage(`${args.key} édité avec succès avec la valeur ${args.value}`, message.channel);
                break;
            }



        }
        

    }

}

module.exports = dbSettingsCommand;