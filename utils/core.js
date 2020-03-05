const Discord = require("discord.js");
const colors = require('./colors');
const constants = require('./constants');

exports.createFreeVoiceChannel = async (client) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);
    const roleEveryone = guild.roles.find(r => r.name == "@everyone");
    const roleMembers = guild.roles.find(r => r.name == settings.memberRole);
    const voiceChannelsCategory = guild.channels.find(c => c.name === settings.voiceChansCategory);

    await guild.createChannel(`${settings.freeVoiceChan}`, {
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

};
exports.renameFreeVoiceChannel = async (client, member) => {
    let channelName = client.textes.get("VOICE_NEW_VOICE_CHANNEL");
    if (member.presence.game) {
        let game = client.db_games.get(member.presence.game.name);
        if (game) {
            channelName = `🔊 ${game.name}`
        }
    }
    await member.voiceChannel.setName(channelName);
    await member.voiceChannel.overwritePermissions(member, {
        'MANAGE_CHANNELS': true,
    });

};
exports.gameVoiceChannelJoin = async (client, game, member) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);
    const roleMembers = guild.roles.find(r => r.name == settings.memberRole);
    const voiceChannelsCategory = guild.channels.find(c => c.name === settings.voiceChansCategory);

    member.voiceChannel.setParent(voiceChannelsCategory);
    member.voiceChannel.setName(`🔊${game.name}`);
    member.voiceChannel.overwritePermissions(roleMembers, {
        'VIEW_CHANNEL': true,
        'CONNECT': true,
    });
};
exports.gameVoiceChannelQuit = async (client, game, member) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);
    const roleMembers = guild.roles.find(r => r.name == settings.memberRole);
    const  gameCategory = guild.channels.get(game.categoryID);

    member.voiceChannel.setParent(gameCategory);
    member.voiceChannel.setName(`🔈${game.name}`);
    member.voiceChannel.overwritePermissions(roleMembers, {
        'VIEW_CHANNEL': false,
        'CONNECT': false,
    });
};



exports.messageOfTheDay = async (client) => {

};