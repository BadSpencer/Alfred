const colors = require('../../../utils/colors');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('../../../utils/messages');

const { Permissions } = require("discord.js");
const {
    Command
} = require("discord-akairo");

class EmbedPostCommand extends Command {
    constructor() {
        super('embedpost', {
            aliases: ['embedpost', 'post'],
            userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
            // define arg properties
            category: 'Modération',
            args: [{
                id: "embedID",
                type: 'number',
                prompt: {
                    start: `Quel est l'ID de l'embed à poster ?`,
                    retry: `Hmmm, je m'attendais à un nombre...`
                }
            }, ],
            description: {
                content: 'Poster un "Embed" dans n\'importe quel salon',
                usage: '',
                examples: ['']
              }
        });
    }




    async exec(message, args) {
        let client = this.client;
        if (message.channel.type === 'text') message.delete();;
        await client.embedShow(args.embedID, message);
    }
}


module.exports = EmbedPostCommand;