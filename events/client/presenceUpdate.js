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
            event: 'presenceUpdate'
        });
    }

    async exec(oldPresence, newPresence) {
        let client = this.client;
        client.log(`EVENT: ${this.emitter}/${this.event} pour ${newPresence.member.displayName}`, 'debug');
        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = await client.db.getSettings(client);

        if (newPresence.member.bot) return;

        let newPresenceGame = null;
        if (newPresence) {
            if (newPresence.activities) {
                if (newPresence.activities.length > 0) {
                    let newPresencePlaying = newPresence.activities.find(rec => rec.type == "PLAYING");
                    if (newPresencePlaying) newPresenceGame = newPresencePlaying.name;
                }
            }
        }
        let oldPresenceGame = null;
        if (oldPresence) {
            if (oldPresence.activities) {
                if (oldPresence.activities.length > 0) {
                    let oldPresencePlaying = oldPresence.activities.find(rec => rec.type == "PLAYING");
                    if (oldPresencePlaying) oldPresenceGame = oldPresencePlaying.name;
                }
            }
        }

        // Log membre qui change de statut
        if (oldPresence.status !== newPresence.status) {
            client.log(client.textes.get("COM_USER_NEW_STATUS", newPresence.member, statusTexts[newPresence.status]), "debug")
        }

        // Ajout du jeu dans la base s'il n'ets pas trouvé
        if (newPresenceGame !== null) {
            let gamePlayed = client.db_games.get(newPresenceGame);
            if (!gamePlayed) {
                await client.gamesCreate(newPresenceGame);
            }
        }

        /*---------------------------------------------------------------------------------------------*/
        /*                       Le membre se met à jouer à quelque chose                              */
        /*---------------------------------------------------------------------------------------------*/
        if (oldPresenceGame == null && newPresenceGame !== null) {
            let gamePlayed = client.db_games.get(newPresenceGame);
            if (gamePlayed && gamePlayed.actif) {

                await client.usergameUpdateLastPlayed(gamePlayed, newPresence.member);

                if (gamePlayed.actif) {
                    let gamePlayRole = newPresence.member.guild.roles.cache.get(gamePlayed.playRoleID);
                    if (newPresence.member.roles.cache.has(gamePlayed.roleID)) {
                        await newPresence.member.roles.add(gamePlayRole);

                        let voicechannel = client.channels.cache.get(newPresence.member.voice.channelID);
                        if (voicechannel) {
                            if (voicechannel.name == "🔊 Salon vocal") {
                                voicechannel.setName(`🔊 ${gamePlayed.name}`);
                            }
                        }
                    }
                }
            }
        }

        /*---------------------------------------------------------------------------------------------*/
        /*                           Membre a arreté de jouer à un jeu                                 */
        /*---------------------------------------------------------------------------------------------*/
        if (oldPresenceGame !== null && newPresenceGame == null) {
            let gamePlayed = client.db_games.get(oldPresenceGame);
            if (gamePlayed) {
                if (gamePlayed.actif) {
                    let gamePlayRole = oldPresence.member.guild.roles.cache.get(gamePlayed.playRoleID);
                    if (oldPresence.member.roles.cache.has(gamePlayed.roleID)) {
                        await oldPresence.member.roles.remove(gamePlayRole);
                    }
                }
            }
        }


        /*---------------------------------------------------------------------------------------------*/
        /*                                 Membre a changé de jeu                                      */
        /*---------------------------------------------------------------------------------------------*/
        if (oldPresenceGame !== null && newPresenceGame !== null) {
            let gamePlayedOld = client.db_games.get(oldPresenceGame);
            if (gamePlayedOld) {
                let gamePlayRole = oldPresence.guild.roles.cache.get(gamePlayedOld.playRoleID);
                if (oldPresence.member.roles.cache.has(gamePlayedOld.roleID)) {
                    await oldPresence.member.roles.remove(gamePlayRole);
                }
            }
            let gamePlayedNew = client.db_games.get(newPresenceGame);
            if (gamePlayedNew) {

                await client.usergameUpdateLastPlayed(gamePlayedNew, newPresence.member);

                let gamePlayRole = newPresence.member.guild.roles.cache.get(gamePlayedNew.playRoleID);
                if (newPresence.member.roles.cache.has(gamePlayedNew.roleID)) {
                    await newPresence.member.roles.add(gamePlayRole);
                }
            }

        }

    }
}

module.exports = presenceUpdateListener;