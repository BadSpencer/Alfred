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
                    await client.gameVoiceChannelJoin(game, newMember);
                }

                if (newMember.voiceChannel.name == settings.freeVoiceChan) {
                    await client.renameFreeVoiceChannel(newMember);
                    // Création d'un nouveau salon "➕ Créer salon"
                    await client.createVoiceChannel();
                }
            }

            if (newMember.voiceChannel.name == settings.contactChannelFree ||
                newMember.voiceChannel.name == settings.contactChannelWaiting ||
                newMember.voiceChannel.name == settings.contactChannelInprogress) {
                await client.contactVoiceChannelJoin(newMember);
            };
        }

        // Quitte un salon vocal
        if (oldMember.voiceChannel && !newMember.voiceChannel) {
            if (oldMember.voiceChannel.members.size == "0") {

                const game = client.db_games.find(game => game.voiceChannelID == oldMember.voiceChannel.id);
                if (game) {
                    await client.gameVoiceChannelQuit(game, oldMember);
                } else {

                    if (oldMember.voiceChannel.name == settings.contactChannelFree ||
                        oldMember.voiceChannel.name !== settings.contactChannelWaiting ||
                        oldMember.voiceChannel.name !== settings.contactChannelInprogress) {
                        await client.contactVoiceChannelQuit(oldMember);
                    };
                    if (oldMember.voiceChannel.name !== settings.quietChannel &&
                        oldMember.voiceChannel.name !== settings.AFKChannel &&
                        oldMember.voiceChannel.name !== settings.contactChannelFree &&
                        oldMember.voiceChannel.name !== settings.contactChannelWaiting &&
                        oldMember.voiceChannel.name !== settings.contactChannelInprogress) {
                        oldMember.voiceChannel.delete();
                    };
                }
            }
        }

        // Change de salon
        if (oldMember.voiceChannel && newMember.voiceChannel) {
            if (oldMember.voiceChannel.members.size == "0") {
                const game = client.db_games.find(game => game.voiceChannelID == oldMember.voiceChannel.id);
                if (game) {
                    await client.gameVoiceChannelQuit(game, oldMember);
                } else {
                    if (oldMember.voiceChannel.name == settings.contactChannelFree ||
                        oldMember.voiceChannel.name !== settings.contactChannelWaiting ||
                        oldMember.voiceChannel.name !== settings.contactChannelInprogress) {
                        await client.contactVoiceChannelQuit(oldMember);
                    };
                    if (oldMember.voiceChannel.name !== settings.quietChannel &&
                        oldMember.voiceChannel.name !== settings.AFKChannel &&
                        oldMember.voiceChannel.name !== settings.contactChannelFree &&
                        oldMember.voiceChannel.name !== settings.contactChannelWaiting &&
                        oldMember.voiceChannel.name !== settings.contactChannelInprogress) {
                        oldMember.voiceChannel.delete();
                    };
                }
            }

            if (newMember.voiceChannel.members.size == "1") {
                const game = client.db_games.find(game => game.voiceChannelID == newMember.voiceChannel.id);
                if (game) {
                    await client.gameVoiceChannelJoin(game, newMember);
                }
                if (newMember.voiceChannel.name == settings.freeVoiceChan) {
                    await client.renameFreeVoiceChannel(newMember);
                    // Création d'un nouveau salon "➕ Créer salon"
                    await client.createVoiceChannel();
                }
            }
        }
    }
}



module.exports = voiceStateUpdateListener;