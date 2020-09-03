const constants = require("./constants");
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('./messages');
const colors = require("./colors");
const Discord = require("discord.js");
const textes = new(require("./textes.js"));

module.exports = (client) => {
    // Message d'annonce lorsqu'un utilisateur est passé membre
    client.newMemberNotification = async (member) => {
        client.log(textes.get("LOG_EVENT_MEMBER_JOIN_MEMBERS", member));

        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        if (settings.welcomeMemberEnabled !== "true") return client.log(textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"), "warn");

        let welcomeMemberChannel = guild.channels.cache.find((channel) => channel.name === settings.welcomeMemberChannel);

        if (welcomeMemberChannel) {
            const welcomeMessage = new Discord.MessageEmbed()
                .setTimestamp()
                .setColor(colors['darkgreen'])
                .setThumbnail(member.user.avatarURL())
                .setDescription(textes.get("MEMBER_NEW_MEMBER_NOTIFICATION", member));
            welcomeMemberChannel.send(welcomeMessage);
        };
        client.modLog(textes.get("MOD_NOTIF_NEW_MEMBER", member));
    };
    // Message d'acceuil lorsqu'un utilisateur est passé membre
    client.newMemberWelcome = async (member) => {
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        if (settings.welcomeMemberEnabled !== "true") return client.log(textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"), "warn");

        let welcomeMemberChannel = guild.channels.cache.find(c => c.name === settings.welcomeMemberChannel);

        if (welcomeMemberChannel) {
            const welcomeMessage = new Discord.MessageEmbed()
                //.setTitle(client.textes.get("MEMBER_MESSAGE_ACCUEIL_TITRE", member))
                .setColor(colors['darkorange'])
                .setThumbnail(client.user.avatarURL())
                .setDescription(textes.get("MEMBER_MESSAGE_ACCUEIL_DESCRIPTION", member));
            welcomeMemberChannel.send(welcomeMessage);
        };

    };


    client.memberExperienceAdd = async (member, type, amount, reason = null, game = null) => {

        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = client.db_settings.get(guild.id);
        const userdata = client.db_userdata.get(member.id);

        const roleMembers = guild.roles.cache.find((role) => role.name === settings.memberRole);

        if (roleMembers) {
            if (member.roles.cache.has(roleMembers.id)) {

            }
        } else {
            client.log(textes.get("ERROR_SETTINGS_ROLE_MEMBERS_NOT_FOUND", settings.memberRole), "error")
        }


    };
}