const { Inhibitor } = require('discord-akairo');

class ModerationCheck extends Inhibitor {
    constructor() {
        super('moderation', {
            reason: 'moderation'
        })
    }


    exec(message, command) {
        let client = this.client;
        const guild = client.guilds.cache.get(client.config.guildID);
        let member = guild.members.cache.get(message.author.id);

        //const roleEve = guild.roles.cache.find(r => { return r.name == "@everyone" });
        //const roleMem = guild.roles.cache.find(r => { return r.name == message.settings.memberRole });
        const roleMod = guild.roles.cache.find(r => { return r.name == message.settings.modRole });
        const roleAdm = guild.roles.cache.find(r => { return r.name == message.settings.adminRole });

        const modCategories = [
            'Modération',
            'Jeux',
            'Serveurs',
            'Joueurs',
            'Admin'
        ];


        // Les commandes de la catégorie "Modérations" ne sont autorisé que pour les modérateurs et admins
        if (modCategories.includes(command.category.id)) {
            if (member.roles.cache.has(roleMod.id) || member.roles.cache.has(roleAdm.id)) {
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