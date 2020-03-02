const colors = require('../../utils/colors');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('../../utils/messages');

// Translations
const {
    MESSAGES
} = require('../../localization/fr');
const channels = require('../../localization/channels');
const permissions = require('../../localization/permissions');

// Required things for using Embeds and extending Akairo Command
const {
    RichEmbed
} = require('discord.js');
const {
    Command
} = require('discord-akairo');

class EmbedPostCommand extends Command {
    constructor() {
        super('embedpost', {
            aliases: ['embedpost', 'post'],
            // define arg properties
            category: 'Modération',
            args: [{
                id: "embedID",
                type: 'number',
                prompt: {
                    start: `Quel est l'ID de l'embed à poster ?`,
                    retry: `Hmmm, je m'attendais à un nombre...`
                }
            }, ]
        });
    }




    async exec(message, args) {
        let client = this.client;
        await client.embeds.showEmbed(client, args.embedID, message.channel);
    }
}


module.exports = EmbedPostCommand;