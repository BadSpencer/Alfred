const {
    Command
} = require("discord-akairo");
const { Permissions } = require("discord.js");
const steamServerStatus = require('steam-server-status');

class EchoCommand extends Command {
    constructor() {
        super('echo', {
            aliases: ['echo', 'say', 'dire'],
            category: '🟪 Admin',
            cooldown: 30000,
            ratelimit: 1,
            description: 'Pour faire causer Alfred',
        });
    }

    *args(message) {
        const phrase = yield {
            type: "string",
            prompt: {
                start: message => promptMessage(`Que souhaitez vous que je dise ?`)
            }
        };
        return { phrase };
    }

    async exec(message, args) {
        
        await message.delete()
        message.channel.send(args.phrase);

    }
}


module.exports = EchoCommand;