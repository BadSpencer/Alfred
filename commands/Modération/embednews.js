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

class EmbedNewsCommand extends Command {
    constructor() {
        super('embednews', {
            aliases: ['embednews', 'news'],
            // define arg properties
            category: 'Modération',
            args: [{
                id: "embedID",
                type: 'number',
                prompt: {
                    start: `Quel est l'ID de l'embed à postercomme news ?`,
                    retry: `Hmmm, je m'attendais à un nombre...`
                }
            }, ]
        });
    }

    async exec(message, args) {
        let client = this.client;
        const guild = client.guilds.get(client.config.guildID);
        const settings = client.db_settings.get(guild.id);
        let newsChannel = guild.channels.find(c => c.name === settings.newsChannel);
        await client.embeds.showEmbed(client, args.embedID, newsChannel, true);
    }
}


module.exports = EmbedNewsCommand;