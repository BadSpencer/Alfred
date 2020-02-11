const {
Listener
} = require('discord-akairo');


class guildMemberUpdateListener extends Listener {
    constructor() {
        super('guildMemberUpdate', {
            emitter: 'client',
            eventName: 'guildMemberUpdate'
        });
    }

    exec(oldMember, newMember) {
        let memberUpdate = `Member update pour ${newMember.displayName}` 
        this.client.logger.log(`${memberUpdate}`);
    }
}

module.exports = guildMemberUpdateListener;