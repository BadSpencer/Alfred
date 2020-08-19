const {
    Listener
} = require("discord-akairo")
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
        let client = this.client;
        client.log(`EVENT: ${this.emitter}/${this.event}`, 'debug');
        if (error) {
            client.log(`${error.message}\n${error.stack}`, "error");
        }
    }
}

module.exports = ErrorListener