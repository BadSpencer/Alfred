const { Listener } = require("discord-akairo");

class presenceUpdateListener extends Listener {
    constructor() {
        super('presenceUpdate', {
            emitter: 'client',
            event: 'presenceUpdate'
        });
    }

    async exec(oldPresence, newPresence) {
        // Ne pas vérifier la présence des bots
        if (newPresence.member.user.bot) return;

        let client = this.client;
        client.log(`EVENT: ${this.emitter}/${this.event} pour ${newPresence.member.displayName}`, "debug");
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        const gamePlayRole =  client.commandHandler.resolver.type('role')(settings.playRole);

        

        let newPresenceGame = null;
        if (newPresence) {
            newPresenceGame = await client.presenceGetGameName(newPresence);
        }
        let oldPresenceGame = null;
        if (oldPresence) {
            oldPresenceGame = await client.presenceGetGameName(oldPresence);
        }

        // Ajout du jeu dans la base s'il n'est pas trouvé
        if (newPresenceGame !== null) {
            let gamePlayed = client.gamesGet(newPresenceGame);
            if (!gamePlayed) {
                await client.gamesCreate(newPresenceGame);
            }
        }

        /*---------------------------------------------------------------------------------------------*/
        /*                       Le membre se met à jouer à quelque chose                              */
        /*---------------------------------------------------------------------------------------------*/
        if (oldPresenceGame == null && newPresenceGame !== null) {
            let gamePlayed = client.gamesGet(newPresenceGame);
            if (gamePlayed && gamePlayed.actif) {

                await client.usergameUpdateLastPlayed(gamePlayed, newPresence.member);

                if (gamePlayed.actif) {
                    if (newPresence.member.roles.cache.has(gamePlayed.roleID)) {
                        await newPresence.member.roles.add(gamePlayRole);

                        let voicechannel = client.channels.cache.get(newPresence.member.voice.channelID);
                        if (voicechannel) {
                            if (voicechannel.name === settings.createdVoiceChan) {
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
            let gamePlayed = client.gamesGet(oldPresenceGame);
            if (gamePlayed) {
                if (gamePlayed.actif) {
                    if (oldPresence.member.roles.cache.has(gamePlayRole.id)) {
                        await oldPresence.member.roles.remove(gamePlayRole);
                    }
                }
            }
        }


        /*---------------------------------------------------------------------------------------------*/
        /*                                 Membre a changé de jeu                                      */
        /*---------------------------------------------------------------------------------------------*/
        if (oldPresenceGame !== null && newPresenceGame !== null) {
            let gamePlayedOld = client.gamesGet(oldPresenceGame);
            if (gamePlayedOld) {
                let gamePlayRole = oldPresence.guild.roles.cache.get(gamePlayedOld.playRoleID);
                if (oldPresence.member.roles.cache.has(gamePlayedOld.roleID)) {
                    await oldPresence.member.roles.remove(gamePlayRole);
                }
            }
            let gamePlayedNew = client.gamesGet(newPresenceGame);
            if (gamePlayedNew) {
                await client.usergameUpdateLastPlayed(gamePlayedNew, newPresence.member);
                if (newPresence.member.roles.cache.has(gamePlayedNew.roleID)) {
                    await newPresence.member.roles.add(gamePlayRole);
                }
            }

        }

    }
}

module.exports = presenceUpdateListener;