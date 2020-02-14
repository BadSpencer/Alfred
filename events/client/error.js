const {
    Listener
} = require('discord-akairo')
const chalk = require('chalk');
const moment = require('moment');

class ErrorListener extends Listener {
    constructor() {
        super('error', {
            emitter: 'client',
            event: 'error'
        })
    }

    async exec(error) {
        if (error) {
            //this.client.logger.error(`${JSON.stringify(error)}`);
            this.client.logger.error(`${error.message}\n${error.stack}`);
        }
    }
}

module.exports = ErrorListener