const Discord = require("discord.js");
const moment = require("moment");
const colors = require('./colors');
const constants = require('./constants');

exports.createVoiceChannel = async (client, name = "") => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);
    const roleEveryone = guild.roles.find(r => r.name == "@everyone");
    const roleMembers = guild.roles.find(r => r.name == settings.memberRole);
    const voiceChannelsCategory = guild.channels.find(c => c.name === settings.voiceChansCategory);

    let channelName = "";
    if (!name) {
        channelName = settings.freeVoiceChan;
    } else {
        channelName = name;
    }

    await guild.createChannel(channelName, {
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
    //if (member.id == "193822534196658176") channelName = `🔊 Confinement COVID-19`;
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
    const gameCategory = guild.channels.get(game.categoryID);

    member.voiceChannel.setParent(gameCategory);
    member.voiceChannel.setName(`🔈${game.name}`);
    member.voiceChannel.overwritePermissions(roleMembers, {
        'VIEW_CHANNEL': false,
        'CONNECT': false,
    });
};
exports.messageOfTheDay = async (client) => {

    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    let embed = new Discord.RichEmbed();
    let description = "";

    let generalChannel = guild.channels.find(c => c.name === settings.welcomeMemberChannel);

    let astuces = client.db_astuces.array();
    astuces.sort(function (a, b) {
        return a.count - b.count;
    });
    let astuce = client.db_astuces.get(astuces[0].id);
    astuce.count += 1;
    client.db_astuces.set(astuces[0].id, astuce);


    let citations = client.db_citations.array();

    let sortedCitations = citations.sort(function (a, b) {
        return a.count - b.count;
    });

    let citation = client.db_citations.get(sortedCitations[0].id);

    citation.count += 1;
    client.db_citations.set(sortedCitations[0].id, citation)

    description += client.textes.get("MOTD_BONJOUR");
    description += "\n";
    description += "\n";
    description += client.textes.get("MOTD_ASTUCE");
    description += "\n";
    description += astuce.texte;
    description += "\n";
    description += "\n";
    description += client.textes.get("MOTD_CITATION");
    description += "\n";
    description += citation.texte;
    description += "\n";
    description += "\n";


    embed.setTitle(client.textes.get("MOTD_TITRE"));
    embed.setColor(`0xCC7900`);
    embed.setDescription(description);

    generalChannel.send(embed);




};
exports.modLog = async (client, content) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    //let timestamp = moment().format('DD.MM') + " " + moment().format('HH:mm');
    //let notification = timestamp + " " + content;

    let modNotifChannel = guild.channels.find(c => c.name === settings.modNotifChannel);

    if (modNotifChannel) {
        modNotifChannel.send(content);
    }
};