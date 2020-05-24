const constants = require('./constants');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('./messages');
const colors = require('./colors');
const Discord = require("discord.js");

module.exports = (client) => {
    // Message d'annonce lorsqu'un utilisateur est passé membre
    client.newMemberNotification = async (member) => {
        client.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_MEMBERS", member));

        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = await client.db.getSettings(client);

        if (settings.welcomeMemberEnabled !== "true") return client.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"), "warn");

        let welcomeMemberChannel = guild.channels.cache.find(c => c.name === settings.welcomeMemberChannel);

        if (welcomeMemberChannel) {
            const welcomeMessage = new Discord.MessageEmbed()
                .setTimestamp()
                .setColor(colors['darkgreen'])
                .setThumbnail(member.user.avatarURL())
                .setDescription(client.textes.get("MEMBER_NEW_MEMBER_NOTIFICATION", member));
            welcomeMemberChannel.send(welcomeMessage);
        };
        client.modLog(client.textes.get("MOD_NOTIF_NEW_MEMBER", member));
    };
    // Message d'acceuil lorsqu'un utilisateur est passé membre
    client.newMemberWelcome = async (member) => {
        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = await client.db.getSettings(client);

        if (settings.welcomeMemberEnabled !== "true") return client.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"), "warn");

        let welcomeMemberChannel = guild.channels.cache.find(c => c.name === settings.welcomeMemberChannel);

        if (welcomeMemberChannel) {
            const welcomeMessage = new Discord.MessageEmbed()
                //.setTitle(client.textes.get("MEMBER_MESSAGE_ACCUEIL_TITRE", member))
                .setColor(colors['darkorange'])
                .setThumbnail(client.user.avatarURL())
                .setDescription(client.textes.get("MEMBER_MESSAGE_ACCUEIL_DESCRIPTION", member));
            welcomeMemberChannel.send(welcomeMessage);
        };

    };
}