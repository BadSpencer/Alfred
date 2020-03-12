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
        let client = this.client;
        // Send the error then log it
        errorMessage(`Il y a eu une erreur avec cette commande: ***\`${error.message}\`***`, message.channel);
        client.log(`Erreur dans la commande ${command}: ${error.message}\n${error.stack}`, "error");
        message.delete();
    }
}

module.exports = CommandErrorListener;