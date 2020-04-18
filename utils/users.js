const constants = require('./constants');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('./messages');
const colors = require('./colors');
const {
    RichEmbed
} = require('discord.js');
const datamodel = require('./datamodel');
const moment = require("moment");

module.exports = (client) => {
    // Message d'annonce lorsque quelqu'un rejoint le serveur
    client.serverJoinNotification = async (member) => {
        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);

        if (settings.welcomeEnabled !== "true") return client.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"), "warn");

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
    };
    // Message d'acceuil du nouvel utilisateur (lien vers site)
    client.serverJoinInformation = async (member) => {
        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);

        if (settings.welcomeEnabled !== "true") return client.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"));

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
    client.serverJoinInformationAgain = async (member) => {
        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);

        if (settings.welcomeEnabled !== "true") return client.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"));

        let welcomeChannel = guild.channels.find(c => c.name === settings.welcomeChannel);

        if (welcomeChannel) {
            const welcomeMessage = new RichEmbed()
                .setTitle(client.textes.get("USER_MESSAGE_ACCUEIL_TITRE"))
                .setURL("https://www.casual-effect.org/")
                .setColor(colors['darkorange'])
                .setThumbnail(client.user.avatarURL)
                .setDescription(client.textes.get("USER_MESSAGE_ACCUEIL_DESCRIPTION_AGAIN", member));
            welcomeChannel.send(welcomeMessage);
        };
    };
    // Message d'annonce lorsque quelqu'un quitte le serveur
    client.serverQuitNotification = async (member) => {
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



    };
    client.serverKickNotification = async (member, memberBy, raison) => {
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
                .setDescription(client.textes.get("MESSAGES_SERVER_KICK", member, memberBy, raison))
                .setFooter(client.textes.get("LOG_EVENT_USER_KICK_SERVER", member), avatar);
            welcomeChannel.send(welcomeMessage);
        };
    };
    client.serverBanNotification = async (member, memberBy, raison) => {
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
                .setDescription(client.textes.get("MESSAGES_SERVER_BAN", member, memberBy, raison))
                .setFooter(client.textes.get("LOG_EVENT_USER_BAN_SERVER", member), avatar);
            welcomeChannel.send(welcomeMessage);
        };
    };
    client.userdataCheck = async () => {
        client.log(`Vérification de la base des membres`, "debug");
        const guild = client.guilds.get(client.config.guildID);

        await client.db_userdata.delete("default");
        await client.db_userdata.set("default", datamodel.tables.userdata);



        guild.members.forEach(async member => {
            if (member.user.bot) return; // Ne pas enregistrer les bots
            let userdata = client.db_userdata.get(member.id);

            if (!userdata) {
                await client.userdataCreate(member);
            }
        })
    };

    client.userdataCreate = async (member) => {
        let userdata = client.db_userdata.get("default");
        let userdataLogs = datamodel.tables.userdataLogs;
        let userdataNicknames = datamodel.tables.userdataNicknames;

        let userJoinedDate = moment(member.joinedAt).format('DD.MM.YYYY');
        let userJoinedTime = moment(member.joinedAt).format('HH:mm');

        userdata.id = member.id;
        userdata.name = member.displayName;
        userdata.createdAt = +new Date;
        userdata.joinedDate = userJoinedDate;
        userdata.joinedTime = userJoinedTime;
        userdata.level = 0;
        userdata.xp = 0;


        userdataNicknames.date = userJoinedDate;
        userdataNicknames.oldNickname = member.user.username;
        userdataNicknames.newNickname = member.displayName;
        userdata.nicknames.push(userdataNicknames);





        await client.db_userdata.set(member.id, userdata);
        client.log(`Membre ${member.displayName} à été ajouté à la base de données`);
        client.userdataAddLog(member, member, "JOIN", "A rejoint le discord");
    };

    client.userdataAddLog = async (member, memberBy, event, commentaire) => {
        let userdata = client.db_userdata.get(member.id);
        let userdataLogs = datamodel.tables.userdataLogs;

        if (!userdata) return;

        let date;
        if (event == "JOIN") {
            date = +new Date(member.joinedAt);
        } else {
            date = +new Date;
        }

        userdataLogs.createdAt = date;
        userdataLogs.createdBy = memberBy.id;
        userdataLogs.date = moment(date).format('DD.MM.YYYY');
        userdataLogs.heure = moment(date).format('HH:mm');
        userdataLogs.event = event;
        userdataLogs.commentaire = commentaire;
        userdata.logs.push(userdataLogs);

        client.db_userdata.set(member.id, userdata);
        client.log(`Log membre **${event}** pour ${member.displayName}`, "debug");
    };

    client.userdataClearLogs = async (memberID) => {
        let userdata = client.db_userdata.get(memberID);
        if (userdata) {
            if (userdata.logs) {
            userdata.logs = [];
            client.db_userdata.set(memberID, userdata);
            client.log(`Logs membre effacés pour ${userdata.name}`, "debug");
            }
        }

    };
};