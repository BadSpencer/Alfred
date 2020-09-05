const {
    Listener
} = require("discord-akairo");

class CommandFinishedListener extends Listener {
    constructor() {
        super('commandFinished', {
            emitter: 'commandHandler',
            event: 'commandFinished',
        })
    }

    async exec(message, command) {
        let client = this.client;
        client.log(`EVENT: ${this.emitter}/${this.event}`, "debug");
        client.memberLogCmd(message.member.id, command, message);

    }
};

module.exports = CommandFinishedListener;