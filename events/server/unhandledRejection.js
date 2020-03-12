const { Listener } = require('discord-akairo');

class UnhandledRejectionListener extends Listener {
    constructor() {
        super('unhandledRejection', {
            eventName: 'unhandledRejection',
            emitter: 'process'
        });
    }

    exec(error) {
        this.client.log(`${error.message}\n${error.stack}`, "error");
    }
}

module.exports = UnhandledRejectionListener;