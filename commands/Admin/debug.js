const {
    Command
} = require("discord-akairo");
const {
    inspect
} = require("util");
const {
    successMessage,
    errorMessage,
    warnMessage,
    promptMessage
} = require('../../utils/messages');
const {
    Permissions
} = require("discord.js");

class DebugCommand extends Command {
    constructor() {
        super("debug", {
            aliases: ["debug"],
            category: '🟪 Admin',
            description: {
                content: 'Activation/désactivation du debug',
                usage: '!debug <on/off>',
            },
        });
    }

    * args(message) {
        const action = yield {
            type: ['on', 'off'],
            prompt: {
                start: message => promptMessage(`Quelle action ? "on" ou "off" ?`),
                retry: message => promptMessage(`Veuillez répondre avec "on" ou "off`)
            },
        };
        return {
            action
        };
    }


    async exec(message, args) {
        let client = this.client;
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        if (args.action == "on") {
            settings.debug = "true";
        } else {
            settings.debug = "false";
        }

        client.db_settings.set(guild.id, settings);

        successMessage(`Mode debug: ${args.action}`, message.channel);


        if (message.channel.type === "text") {
            message.delete();
        };
    }

}

module.exports = DebugCommand;