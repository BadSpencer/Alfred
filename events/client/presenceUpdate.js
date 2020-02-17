const {
    Listener
} = require('discord-akairo');

const statusTexts = {
    'online': 'en ligne',
    'offline': 'hors ligne',
    'idle': 'inactif',
    'dnd': 'en mode "Ne pas déranger"',
};


class presenceUpdateListener extends Listener {
    constructor() {
        super('presenceUpdate', {
            emitter: 'client',
            eventName: 'presenceUpdate'
        });
    }

    async exec(oldMember, newMember) {
        let gamesAll = await this.client.db.gamesGetActive(this.client);

        // Log membre qui change de statut
        if (oldMember.presence.status !== newMember.presence.status) {
            this.client.logger.log(`${newMember.displayName} (${newMember.id}) est désormais ${statusTexts[newMember.presence.status]}`);
        }

        // Ajout du jeu dans la base s'il n'ets pas trouvé
        if (newMember.presence.game) {
            let gamePlayed = this.client.db_games.get(newMember.presence.game.name);
            if (!gamePlayed) {
                await this.client.db.gamesCreate(this.client, newMember.presence.game.name);
            }
        }

        if (oldMember.presence.game == null && newMember.presence.game !== null) {
            let gamePlayed = this.client.db_games.get(newMember.presence.game.name);
            if (gamePlayed) {
                let gamePlayRole = newMember.guild.roles.get(gamePlayed.playRoleID);
                if (newMember.roles.has(gamePlayed.roleID)) {
                    await newMember.addRole(gamePlayRole);
                    this.client.log(`${newMember.displayName} ajout du rôle "${gamePlayRole.name}"`, "debug");
                }
            }
        }
        /*
        if (oldMember.presence.game == null && newMember.presence.game !== null) {
            let gamePlayed = games.find("id", newMember.presence.game.name);
            if (gamePlayed) {
                this.client.logger.debug(`${gamePlayed.name} à été trouvé`);
                //client.usergameUpdateLastPlayed(gamePlayed.name, newMember);
                let gamePlayRole = newMember.guild.roles.get(gamePlayed.playRoleID);
                if (newMember.roles.has(gamePlayed.roleID)) {
                    await newMember.addRole(gamePlayRole);
                    this.client.log(`${newMember.displayName} ajout du rôle "${gamePlayRole.name}"`, "debug");
                }
            } else {
                this.client.log(`Jeu ${newMember.presence.game.name} non trouvé`, "debug");
            }
        }
        */


    }
}


module.exports = presenceUpdateListener;