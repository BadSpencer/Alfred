const {
Listener
} = require('discord-akairo');


class presenceUpdateListener extends Listener {
    constructor() {
        super('presenceUpdate', {
            emitter: 'client',
            eventName: 'presenceUpdate'
        });
    }

    exec(oldMember, newMember) {
        let memberUpdate = `Presence update pour ${newMember.displayName}` 
        this.client.logger.log(`${memberUpdate}`);
    }
}

module.exports = presenceUpdateListener;