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
                    newMember.voiceChannel.setParent(voiceChannelsCategory);
                    newMember.voiceChannel.setName(`🔊${game.name}`);
                    newMember.voiceChannel.overwritePermissions(roleMembers, {
                        'VIEW_CHANNEL': true,
                        'CONNECT': true,
                    });
                }

                if (newMember.voiceChannel.name == settings.freeVoiceChan) {
                    // Création d'un nouveau salon libre
                    await newMember.guild.createChannel(`${settings.freeVoiceChan}`, {
                        type: 'voice'
                    }).then(freeVoiceChannel => {
                        freeVoiceChannel.overwritePermissions(newMember, {
                            'MANAGE_CHANNELS': true,
                        });
                        freeVoiceChannel.overwritePermissions(roleEveryone, {
                            'CONNECT': false,
                        });
                        freeVoiceChannel.overwritePermissions(roleMembers, {
                            'CONNECT': true,
                        });
                        freeVoiceChannel.setParent(voiceChannelsCategory);
                    });
                }
            }
        }

        // Quitte un salon vocal
        if (oldMember.voiceChannel && !newMember.voiceChannel) {
            if (oldMember.voiceChannel.members.size == "0") {

                const game = client.db_games.find(game => game.voiceChannelID == oldMember.voiceChannel.id);
                if (game) {
                    let gameCategory = newMember.guild.channels.get(game.categoryID);
                    oldMember.voiceChannel.setParent(gameCategory);
                    oldMember.voiceChannel.setName(`🔈${game.name}`);
                    oldMember.voiceChannel.overwritePermissions(roleMembers, {
                        'VIEW_CHANNEL': false,
                        'CONNECT': false,
                    });
                } else {
                    if (oldMember.voiceChannel.name == settings.quietChannel) return;
                    if (oldMember.voiceChannel.name == settings.AFKChannel) return;
                    oldMember.voiceChannel.delete();
                }
            }
        }

        // Change de salon
        if (oldMember.voiceChannel && newMember.voiceChannel) {
            if (oldMember.voiceChannel.members.size == "0") {

                const game = client.db_games.find(game => game.voiceChannelID == oldMember.voiceChannel.id);
                if (game) {
                    let gameCategory = newMember.guild.channels.get(game.categoryID);
                    oldMember.voiceChannel.setParent(gameCategory);
                    oldMember.voiceChannel.setName(`🔈${game.name}`);
                    oldMember.voiceChannel.overwritePermissions(roleMembers, {
                        'VIEW_CHANNEL': false,
                        'CONNECT': false,
                    });
                } else {
                    if (oldMember.voiceChannel.name == settings.quietChannel) return;
                    if (oldMember.voiceChannel.name == settings.AFKChannel) return;
                    oldMember.voiceChannel.delete();
                }
            }

            if (newMember.voiceChannel.members.size == "1") {
                const game = client.db_games.find(game => game.voiceChannelID == newMember.voiceChannel.id);
                if (game) {
                    newMember.voiceChannel.setParent(voiceChannelsCategory);
                    newMember.voiceChannel.setName(`🔊${game.name}`);
                    newMember.voiceChannel.overwritePermissions(roleMembers, {
                        'VIEW_CHANNEL': true,
                        'CONNECT': true,
                    });
                }
                if (newMember.voiceChannel.name == settings.freeVoiceChan) {
                    // Création d'un nouveau salon libre
                    await newMember.guild.createChannel(`${settings.freeVoiceChan}`, {
                        type: 'voice'
                    }).then(freeVoiceChannel => {
                        freeVoiceChannel.overwritePermissions(roleEveryone, {
                            'CONNECT': false,
                        });
                        freeVoiceChannel.overwritePermissions(roleMembers, {
                            'CONNECT': true,
                        });
                        freeVoiceChannel.setParent(voiceChannelsCategory);
                    });
                }
            }



        }

    }
}



module.exports = voiceStateUpdateListener;