const {
    Command
} = require('discord-akairo');
const colors = require('../../utils/colors');
const Discord = require("discord.js");

class AutoRepCommand extends Command {
    constructor() {
        super('autorep', {
            category: 'Auto',
        });
    }
    condition(message) {
        let client = this.client;
        return false;
    }


    exec(message) {
        let client = this.client;
    }

}


module.exports = AutoRepCommand;