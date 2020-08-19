const {
    Command
} = require("discord-akairo");
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
        
        if (message.channel.type == "dm") return false;

        if (message.author.id !== "291545597205544971") return false;



        let regexp = new RegExp("[A,a]lfred");
        if (regexp.test(message.content) == true) {
            return true;
        }
        return false;
    }


    exec(message) {
        let client = this.client;
        let regs = [];
        let regexp;

        regs.push([{
            "pattern": "^[A,a]lfred(.*)crois tu que*",
            "texte": "MAGICBALL"
        }]);

        regs.forEach(reg => {
            console.log(reg)
            regexp = new RegExp(reg.pattern);
            if (regexp.test(message.content) == true) {
                message.channel.send(client.textes.get(reg.texte));
            }
        });



    }

}


module.exports = AutoRepCommand;