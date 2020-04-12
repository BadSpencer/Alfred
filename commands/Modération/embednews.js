const colors = require('../../utils/colors');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('../../utils/messages');


// Required things for using Embeds and extending Akairo Command
const { Permissions } = require('discord.js');
const {
    Command
} = require('discord-akairo');

class EmbedNewsCommand extends Command {
    constructor() {
        super('embednews', {
            aliases: ['embednews', 'news'],
            userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
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
        let generalChannel = guild.channels.find(c => c.name === settings.welcomeMemberChannel);
    
        message.delete();
        let news = await client.embedShowChannel(args.embedID, newsChannel, true);
    }
}


module.exports = EmbedNewsCommand;