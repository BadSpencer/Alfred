const { Listener } = require('discord-akairo');

class UnhandledRejectionListener extends Listener {
    constructor() {
        super('unhandledRejection', {
            eventName: 'unhandledRejection',
            emitter: 'process'
        });
    }

    exec(error) {
        this.client.logger.error(`${error.message}\n${error.stack}`);
    }
}

module.exports = UnhandledRejectionListener;