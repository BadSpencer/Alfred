const {
    Command
} = require("discord-akairo");
const colors = require('../../utils/colors');
const Discord = require("discord.js");

class AutoCleanCommand extends Command {
    constructor() {
        super('autoclean', {
            category: 'Auto',
        });
    }
    condition(message) {
        let client = this.client;
        const guild = client.guilds.cache.get(client.config.guildID);
        let settings = client.db_settings.get(guild.id);

        if (message.author.bot) return false;
        if (message.channel.type == 'dm') return false;
        if (message.channel.name == settings.gameJoinChannel) {
            if (message.mentions.roles.size == 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    }


    exec(message) {
        let client = this.client;

        if (message.channel.type === 'text') message.delete();;

    }

}


module.exports = AutoCleanCommand;