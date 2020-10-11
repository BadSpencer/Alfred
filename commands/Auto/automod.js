const {
    Command
} = require("discord-akairo");
const colors = require("../../utils/colors");
const textes = new (require("../../utils/textes.js"));
const Discord = require("discord.js");

class automodCommand extends Command {
    constructor() {
        super("automod", {
            category: "Auto",
        });
    }
    condition(message) {
        let client = this.client;
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        // Modération des salons accueil et général
        if (message.channel.name === settings.welcomeChannel || message.channel.name === settings.welcomeMemberChannel) {
            if (message.content.includes("discord.gg")) {
                return true;
            }
        };

        return false;
    }


    exec(message) {
        this.client.modLog(textes.get("MOD_NOTIF_AUTOMOD_DISCORDLINK", message));
        message.delete();
    }

}


module.exports = automodCommand;