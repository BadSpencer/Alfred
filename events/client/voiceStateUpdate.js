const {
    Listener
} = require("discord-akairo");

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
            event: 'voiceStateUpdate'
        });
    }

    async exec(oldState, newState) {
        let client = this.client;
        client.log(`EVENT: ${this.emitter}/${this.event}`, "debug");
        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const roleEveryone = guild.roles.cache.find(r => r.name == "@everyone");
        const roleMembers = guild.roles.cache.find(r => r.name == settings.memberRole);
        const voiceChannelsCategory = guild.channels.cache.find(c => c.name === settings.voiceChansCategory);

        // Rejoint un salon vocal
        if (!oldState.channel && newState.channel) {
            client.log(`voiceStateUpdate: Rejoint un salon`, "debug");
            if (newState.channel.members.size == "1") {

                const game = client.db_games.find(game => game.voiceChannelID == newState.channel.id);
                if (game) {
                    await client.gameVoiceChannelJoin(game, newState.channel);
                }

                if (newState.channel.name == settings.freeVoiceChan) {
                    await client.renameFreeVoiceChannel(newState.member);
                    // Création d'un nouveau salon "➕ Créer salon"
                    await client.createVoiceChannel();
                }
            }

            if (newState.channel.name == settings.contactChannelFree ||
                newState.channel.name == settings.contactChannelWaiting ||
                newState.channel.name == settings.contactChannelInprogress) {
                await client.contactVoiceChannelJoin(newState.member);
            };
        }

        // Quitte un salon vocal
        if (oldState.channel && !newState.channel) {
            client.log(`voiceStateUpdate: Quitte un salon`, "debug");
            if (oldState.channel.members.size == "0") {

                const game = client.db_games.find(game => game.voiceChannelID == oldState.channel.id);
                if (game) {
                    await client.gameVoiceChannelQuit(game, oldState.channel);
                } else {

                    if (oldState.channel.name === settings.contactChannelFree ||
                        oldState.channel.name === settings.contactChannelWaiting ||
                        oldState.channel.name === settings.contactChannelInprogress) {
                        await client.contactVoiceChannelQuit(oldState.channel);
                    };
                    if (client.db_freeVoiceChannels.has(oldState.channel.id)) {
                        oldState.channel.delete();  
                        client.db_freeVoiceChannels.delete(oldState.channel.id);
                    }
                }
            }
        }

        // Change de salon
        if (oldState.channel && newState.channel) {
            client.log(`voiceStateUpdate: Change de salon`, "debug");
            if (oldState.channel.members.size == "0") {
                const game = client.db_games.find(game => game.voiceChannelID == oldState.channel.id);
                if (game) {
                    await client.gameVoiceChannelQuit(game, oldState.channel);
                } else {
                    if (oldState.channel.name === settings.contactChannelFree ||
                        oldState.channel.name === settings.contactChannelWaiting ||
                        oldState.channel.name === settings.contactChannelInprogress) {
                        await client.contactVoiceChannelQuit(oldState.channel);
                    };
                    if (client.db_freeVoiceChannels.has(oldState.channel.id)) {
                        oldState.channel.delete();  
                        client.db_freeVoiceChannels.delete(oldState.channel.id);
                    }
                }
            }

            if (newState.channel.members.size == "1") {
                const game = client.db_games.find(game => game.voiceChannelID == newState.channel.id);
                if (game) {
                    await client.gameVoiceChannelJoin(game, newState.channel);
                }
                if (newState.channel.name == settings.freeVoiceChan) {
                    await client.renameFreeVoiceChannel(newState.member);
                    // Création d'un nouveau salon "➕ Créer salon"
                    await client.createVoiceChannel();
                }
            }
        }
    }
}



module.exports = voiceStateUpdateListener;