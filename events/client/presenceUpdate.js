const {
    Listener
} = require('discord-akairo');

const statusTexts = {
    'online': 'en ligne',
    'offline': 'hors ligne',
    'idle': 'inactif',
    'dnd': 'en mode "Ne pas déranger"',
};


class presenceUpdateListener extends Listener {
    constructor() {
        super('presenceUpdate', {
            emitter: 'client',
            eventName: 'presenceUpdate'
        });
    }

    exec(oldMember, newMember) {
        // Log membre qui change de statut
        if (oldMember.presence.status !== newMember.presence.status) {
            this.client.logger.log(`${newMember.displayName} (${newMember.id}) est désormais ${statusTexts[newMember.presence.status]}`);
        }
    }
}

module.exports = presenceUpdateListener;