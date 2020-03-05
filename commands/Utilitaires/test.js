const {
    Command
} = require('discord-akairo');

class TestCommand extends Command {
    constructor() {
        super('test', {
            aliases: ['test'],
            category: 'Utilitaires',
            description: 'Commande de test',
        });
    }

    async exec(message) {
        let client = this.client;

        let astuces = client.textes.getAstuce(client);

      // message.channel.send();



    }
}


module.exports = TestCommand;