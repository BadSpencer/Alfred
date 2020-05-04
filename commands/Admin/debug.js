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
const { Permissions } = require('discord.js');

class debugCommand extends Command {
    constructor() {
        super('debug', {
            aliases: ['debug'],
            category: 'Admin',
            userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
            split: 'quoted',

            description: {
                content: 'Activation/désactivation du debug',
                usage: '<method> <...arguments>',
            },
            args: [{
                id: 'action',
                type: ['on', 'off'],
                prompt: {
                    start: 'Quelle action ? "on" ou "off" ?',
                    retry: 'Veuillez répondre avec "on" ou "off'
                },
            }],

        });
    }


    async exec(message, args) {
        let client = this.client;

        const guild = client.guilds.get(client.config.guildID);
        const settings = client.db_settings.get(guild.id);

        if (args.action == "on") {
            settings.debug = "true";
        } else {
            settings.debug = "false";
        }
        
        client.db_settings.set(guild.id, settings);

        successMessage(`Mode debug: ${args.action}`, message.channel);


        if (message.channel.type === 'text') if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();;;
    }

}

module.exports = debugCommand;