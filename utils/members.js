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

    if (settings.welcomeEnabled !== "true") return client.logger.warn(client.textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"));

    let welcomeChannel = guild.channels.find(c => c.name === settings.welcomeChannel);
    let modNotifChannel = guild.channels.find(c => c.name === settings.modNotifChannel);

    let avatar;
    if (!member.user.avatarURL) {
        avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
      } else {
        avatar = member.user.avatarURL;
      }

    if (welcomeChannel) {
        const welcomeMessage = new RichEmbed()
            .setColor(colors['darkgreen'])
            .setThumbnail(avatar)
            .setDescription(client.textes.get("MESSAGES_SERVER_JOIN", member));
        welcomeChannel.send(welcomeMessage);
    };

    if (modNotifChannel) {
        warnMessage(client.textes.get("MOD_NOTIF_SERVER_JOIN", member), modNotifChannel, false)
    }

};
exports.serverQuitNotification = async (client, member) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    let welcomeChannel = guild.channels.find(c => c.name === settings.welcomeChannel);
    let modNotifChannel = guild.channels.find(c => c.name === settings.modNotifChannel);

    let avatar;
    if (!member.user.avatarURL) {
        avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
      } else {
        avatar = member.user.avatarURL;
      }

    if (welcomeChannel) {

        const welcomeMessage = new RichEmbed()
            .setColor(colors['darkred'])
            .setThumbnail(avatar)
            .setDescription(client.textes.get("MESSAGES_SERVER_QUIT", member));
        welcomeChannel.send(welcomeMessage);
    };

    if (modNotifChannel) {
        warnMessage(client.textes.get("MOD_NOTIF_SERVER_QUIT", member), modNotifChannel, false)
    }

}
exports.welcomeNewMember = async (client, member) => {
    client.logger.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_MEMBERS", member));

    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    if (settings.welcomeMemberEnabled !== "true") return client.logger.warn(client.textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"));

    let welcomeMemberChannel = guild.channels.find(c => c.name === settings.welcomeMemberChannel);
    let modNotifChannel = guild.channels.find(c => c.name === settings.modNotifChannel);


    if (welcomeMemberChannel) {
        const welcomeMessage = new RichEmbed()
            .setColor(colors['violet'])
            .setThumbnail(member.user.avatarURL)
            .setDescription(client.textes.get("MESSAGES_NEW_MEMBER", member));
        welcomeMemberChannel.send(welcomeMessage);
    };

    if (modNotifChannel) {
        warnMessage(client.textes.get("MOD_NOTIF_NEW_MEMBER", member), modNotifChannel, false)
    }

};