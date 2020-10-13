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
        return /^[A,a]lfred(.*)crois(.*)tu que*/i;
    }

    async exec(message, args) {
        let client = this.client;
        let embed = new Discord.MessageEmbed();
        

        embed.setDescription(`⏳ Veuillez patienter...`);
        let reponse = await message.channel.send(embed);
        await client.sleep(2000);
        embed.setDescription(`⏳ ${textes.get("MAGICBALL_ACTION")}`);
        reponse.edit(embed);
        await client.sleep(4000);
        embed.setDescription(`👉 ${textes.get("MAGICBALL_REPONSES")}`);
        reponse.edit(embed);
    }
}

module.exports = magicballCommand;