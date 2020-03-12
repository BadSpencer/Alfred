const {
    Listener
} = require('discord-akairo');

const statusTexts = {
    'online': 'en ligne',
    'offline': 'hors ligne',
    'idle': 'inactif',
    'dnd': 'en mode "Ne pas déranger"',
};


class voiceStateUpdateListener extends Listener {
    constructor() {
        super('voiceStateUpdate', {
            emitter: 'client',
            eventName: 'voiceStateUpdate'
        });
    }

    async exec(oldMember, newMember) {
        let client = this.client;
        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);
        const roleEveryone = guild.roles.find(r => r.name == "@everyone");
        const roleMembers = guild.roles.find(r => r.name == settings.memberRole);
        const voiceChannelsCategory = guild.channels.find(c => c.name === settings.voiceChansCategory);

        // Rejoint un salon vocal
        if (!oldMember.voiceChannel && newMember.voiceChannel) {
            if (newMember.voiceChannel.members.size == "1") {

                const game = client.db_games.find(game => game.voiceChannelID == newMember.voiceChannel.id);
                if (game) {
                    await client.core.gameVoiceChannelJoin(client, game, newMember);
                }

                if (newMember.voiceChannel.name == settings.freeVoiceChan) {
                    await client.core.renameFreeVoiceChannel(client, newMember);
                    // Création d'un nouveau salon "➕ Créer salon"
                    await client.core.createVoiceChannel(client);
                }
            }
        }

        // Quitte un salon vocal
        if (oldMember.voiceChannel && !newMember.voiceChannel) {
            if (oldMember.voiceChannel.members.size == "0") {

                const game = client.db_games.find(game => game.voiceChannelID == oldMember.voiceChannel.id);
                if (game) {
                    await client.core.gameVoiceChannelQuit(client, game, oldMember);
                } else {
                    if (oldMember.voiceChannel.name == settings.quietChannel) return;
                    if (oldMember.voiceChannel.name == settings.AFKChannel) return;
                    if (oldMember.voiceChannel.name == "contact") return;
                    oldMember.voiceChannel.delete();
                }
            }
        }

        // Change de salon
        if (oldMember.voiceChannel && newMember.voiceChannel) {
            if (oldMember.voiceChannel.members.size == "0") {
                const game = client.db_games.find(game => game.voiceChannelID == oldMember.voiceChannel.id);
                if (game) {
                    await client.core.gameVoiceChannelQuit(client, game, oldMember);
                } else {
                    if (oldMember.voiceChannel.name !== settings.quietChannel &&
                        oldMember.voiceChannel.name !== settings.AFKChannel &&
                        oldMember.voiceChannel.name !== "contact") {
                        oldMember.voiceChannel.delete();
                    }
                }
            }

            if (newMember.voiceChannel.members.size == "1") {
                const game = client.db_games.find(game => game.voiceChannelID == newMember.voiceChannel.id);
                if (game) {
                    await client.core.gameVoiceChannelJoin(client, game, newMember);
                }
                if (newMember.voiceChannel.name == settings.freeVoiceChan) {
                    await client.core.renameFreeVoiceChannel(client, newMember);
                    // Création d'un nouveau salon "➕ Créer salon"
                    await client.core.createVoiceChannel(client);
                }
            }
        }
    }
}



module.exports = voiceStateUpdateListener;