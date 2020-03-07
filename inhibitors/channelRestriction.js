const { Inhibitor } = require('discord-akairo');

class ChannelRestriction extends Inhibitor {
    constructor() {
        super('channelRestriction', {
            reason: 'channel'
        });
    }


exec(message) {
        let client = this.client;

        // Ne pas bloquer le propriétaire du serveur
        if (message.author.id == message.guild.ownerID) return false;

        if (message.channel.name === message.settings.modNotifChannel) return false;
        if (message.channel.name === message.settings.commandsChannel) return false;
        if (message.channel.name === message.settings.commandsTestChannel) return false;
        if (message.channel.name === message.settings.gameJoinChannel) return false;

        return true;
    }
}

module.exports = ChannelRestriction;