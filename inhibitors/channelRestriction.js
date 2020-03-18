const { Inhibitor } = require('discord-akairo');

class ChannelRestriction extends Inhibitor {
    constructor() {
        super('channelRestriction', {
            reason: 'channel'
        });
    }


exec(message, command) {
        let client = this.client;

        // Ne pas bloquer le propriétaire du serveur
        if (message.channel.type == 'dm') return false;
        //if (message.author.id == message.guild.ownerID) return false;

        if (message.channel.name === message.settings.modNotifChannel) return false;
        if (message.channel.name === message.settings.commandsChannel) return false;
        if (message.channel.name === message.settings.commandsTestChannel) return false;
        if (message.channel.name === message.settings.gameJoinChannel) return false;
        if (message.channel.name === message.settings.suggChannel) return false;

        if (command.id == "purge") return false;

        return true;
    }
}

module.exports = ChannelRestriction;