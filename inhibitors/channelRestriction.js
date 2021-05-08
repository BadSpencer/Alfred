const { Inhibitor } = require("discord-akairo");

class ChannelRestriction extends Inhibitor {
    constructor() {
        super('channelRestriction', {
            reason: 'channel'
        });
    }


exec(message, command) {
        let client = this.client;

        if (message.channel.type == 'dm') return false;

        // if (message.channel.name === message.settings.modNotifChannel) return false;
        if (message.channel.name === message.settings.commandsChannel) return false;
        if (message.channel.name === message.settings.commandsTestChannel) return false;
        if (message.channel.name === message.settings.gameJoinChannel) return false;
        if (message.channel.name === message.settings.suggChannel) return false;

        if (command.id === "purge") return false;
        if (command.id === "echo") return false;
        if (command.id === "embedpost") return false;
        if (command.id === "dé") return false;

        if (command.category.id === "Auto") return false;

        return true;
    }
}

module.exports = ChannelRestriction;