const {
    Listener
} = require('discord-akairo');

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            eventName: 'ready'
        });
    }

    exec() {
        const pjson = require('../../package.json');

        this.client.user.setActivity(`v${pjson.version}`, {
            type: "PLAYING"
          });
        
        console.log(`Alfred v${pjson.version} prêt !`);
    }
}

module.exports = ReadyListener;