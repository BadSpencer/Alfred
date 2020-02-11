const { Listener } = require('discord-akairo');
const chalk = require('chalk');

class CommandLoadedListener extends Listener {
    constructor() {
        super('commandLoaded', {
            emitter: 'commandHandler',
            eventName: 'load',
        })
    }

    exec(command) {
        let text = `Chargement commande ${chalk.magenta.bold(command)}`
        this.client.logger.log(text);
    }
};

module.exports = CommandLoadedListener;