const { Command } = require("discord-akairo");
const Discord = require("discord.js");
const textes = new (require("../../utils/textes.js"));

class magicballCommand extends Command {
    constructor() {
        super("magicball", {
            category: "Auto"
        });
    }

    regex(message) {
        return /^[A,a]lfred(.*)crois tu que*/i;
    }

    exec(message, args) {
        return message.channel.send(textes.get("MAGICBALL"));
    }
}

module.exports = magicballCommand;