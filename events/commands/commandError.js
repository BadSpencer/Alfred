const { Listener } = require("discord-akairo");
const { errorMessage } = require('../../utils/messages');

class CommandErrorListener extends Listener {
    constructor() {
        super('commandError', {
            emitter: 'commandHandler',
            event: 'error'
        })
    }

    exec(error, message, command) {
        let client = this.client;
        client.log(`EVENT: ${this.emitter}/${this.event}`, 'debug');
        // Send the error then log it
        errorMessage(`Il y a eu une erreur avec cette commande: ***\`${error.message}\`***`, message.channel);
        client.log(`Erreur dans la commande ${command}: ${error.message}\n${error.stack}`, "error");
        if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();;
    }
}

module.exports = CommandErrorListener;