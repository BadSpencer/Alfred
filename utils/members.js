const constants = require('./constants');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('../utils/messages');
const colors = require('./colors');
const {
    RichEmbed
} = require('discord.js');

exports.serverJoinNotification = async (client, member) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    if (settings.welcomeEnabled !== "true") return client.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"),"warn");

    let welcomeChannel = guild.channels.find(c => c.name === settings.welcomeChannel);


    let avatar;
    if (!member.user.avatarURL) {
        avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
    } else {
        avatar = member.user.avatarURL;
    }

    if (welcomeChannel) {
        const welcomeMessage = new RichEmbed()
            .setTimestamp()
            .setColor(colors['darkgreen'])
            .setDescription(client.textes.get("MESSAGES_SERVER_JOIN", member))
            .setFooter(client.textes.get("LOG_EVENT_USER_JOIN_SERVER", member), avatar);
        welcomeChannel.send(welcomeMessage);
    };

    client.core.modLog(client, client.textes.get("MOD_NOTIF_SERVER_JOIN", member));

};
exports.serverJoinInformation = async (client, member) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    if (settings.welcomeEnabled !== "true") return client.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"),);

    let welcomeChannel = guild.channels.find(c => c.name === settings.welcomeChannel);

    if (welcomeChannel) {
        const welcomeMessage = new RichEmbed()
            .setTitle(client.textes.get("USER_MESSAGE_ACCUEIL_TITRE"))
            .setURL("https://www.casual-effect.org/")
            .setColor(colors['darkorange'])
            .setThumbnail(client.user.avatarURL)
            .setDescription(client.textes.get("USER_MESSAGE_ACCUEIL_DESCRIPTION", member));
        welcomeChannel.send(welcomeMessage);
    };
};
exports.serverQuitNotification = async (client, member) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    let welcomeChannel = guild.channels.find(c => c.name === settings.welcomeChannel);

    let avatar;
    if (!member.user.avatarURL) {
        avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
    } else {
        avatar = member.user.avatarURL;
    }

    if (welcomeChannel) {

        const welcomeMessage = new RichEmbed()
            .setTimestamp()
            .setColor(colors['yellow'])
            .setDescription(client.textes.get("MESSAGES_SERVER_QUIT", member))
            .setFooter(client.textes.get("LOG_EVENT_USER_QUIT_SERVER", member), avatar);
        welcomeChannel.send(welcomeMessage);
    };

    client.core.modLog(client, client.textes.get("MOD_NOTIF_SERVER_QUIT", member));

}
exports.newMemberNotification = async (client, member) => {
    client.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_MEMBERS", member));

    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    if (settings.welcomeMemberEnabled !== "true") return client.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"),"warn");

    let welcomeMemberChannel = guild.channels.find(c => c.name === settings.welcomeMemberChannel);

    if (welcomeMemberChannel) {
        const welcomeMessage = new RichEmbed()
            .setTimestamp()
            .setColor(colors['darkgreen'])
            .setThumbnail(member.user.avatarURL)
            .setDescription(client.textes.get("MEMBER_NEW_MEMBER_NOTIFICATION", member));
        welcomeMemberChannel.send(welcomeMessage);
    };
    client.core.modLog(client, client.textes.get("MOD_NOTIF_NEW_MEMBER", member));
};
exports.newMemberWelcome = async (client, member) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    if (settings.welcomeMemberEnabled !== "true") return client.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"),"warn");

    let welcomeMemberChannel = guild.channels.find(c => c.name === settings.welcomeMemberChannel);

    if (welcomeMemberChannel) {
        const welcomeMessage = new RichEmbed()
            //.setTitle(client.textes.get("MEMBER_MESSAGE_ACCUEIL_TITRE", member))
            .setColor(colors['darkorange'])
            .setThumbnail(client.user.avatarURL)
            .setDescription(client.textes.get("MEMBER_MESSAGE_ACCUEIL_DESCRIPTION", member));
        welcomeMemberChannel.send(welcomeMessage);
    };

};