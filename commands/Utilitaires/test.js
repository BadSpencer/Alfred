const {
    Command
} = require('discord-akairo');

class TestCommand extends Command {
    constructor() {
        super('test', {
            aliases: ['test'],
            description: 'Commande de test',
        });
    }

    async exec(message) {

       // let games = {[ ]}


    }
}


module.exports = TestCommand;