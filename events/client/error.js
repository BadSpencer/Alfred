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
            let timestamp = `${moment(new Date()).format("DD-MM-YY HH:mm:ss")}`;
            console.log(`${timestamp} | ERROR:${error}`);
        }
    }
}

module.exports = ErrorListener