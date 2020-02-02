const { Listener } = require('discord-akairo');
const chalk = require('chalk');
const moment = require('moment');

class CommandLoadedListener extends Listener {
    constructor() {
        super('commandLoaded', {
            emitter: 'commandHandler',
            eventName: 'load',
        })
    }

    exec(mod) {
        let commandLoaded = mod;
        let timestamp = `${moment(new Date()).format("DD-MM-YY HH:mm:ss")}`;

        // Create the log itself with Chalk and Moment
        let text = `${timestamp} | Chargement commande ${chalk.magenta.bold(commandLoaded)}`
        console.log(text);
    }
};

module.exports = CommandLoadedListener;