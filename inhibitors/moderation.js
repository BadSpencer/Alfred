const { Inhibitor } = require('discord-akairo');

class ModerationCheck extends Inhibitor {
    constructor() {
        super('moderation', {
            reason: 'moderation'
        })
    }


    exec(message, command) {
        let client = this.client;
        const guild = client.guilds.get(client.config.guildID);
        let member = guild.members.get(message.author.id);

        //const roleEve = guild.roles.find(r => { return r.name == "@everyone" });
        //const roleMem = guild.roles.find(r => { return r.name == message.settings.memberRole });
        const roleMod = guild.roles.find(r => { return r.name == message.settings.modRole });
        const roleAdm = guild.roles.find(r => { return r.name == message.settings.adminRole });

        // Les commandes de la catégorie "Modérations" ne sont autorisé que pour les modérateurs et admins
        if (command.category.id == "Modération" || command.category.id == "Admin") {
            if (member.roles.has(roleMod.id) || member.roles.has(roleAdm.id)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }

    }
}

module.exports = ModerationCheck;