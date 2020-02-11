const { Listener } = require('discord-akairo');
const { errorMessage } = require('../../utils/messages');

class CommandErrorListener extends Listener {
    constructor() {
        super('commandError', {
            emitter: 'commandHandler',
            eventName: 'error'
        })
    }

    exec(error, message, command) {
        let log = `Erreur dans la commande: ${command} (${error.stack})`;

        // Send the error then log it
        errorMessage(`Il y a eu une erreur avec cette commande: ***\`${error.message}\`***`, message);
        this.client.logger.log(log);
    }
}

module.exports = CommandErrorListener;