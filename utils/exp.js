const Discord = require("discord.js");
const datamodel = require("./datamodel");
const colors = require("./colors");
const constants = require("./constants");
const moment = require("moment");
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage,
    promptMessage
} = require("./messages");

module.exports = (client) => {

    client.activityCheck = async () => {
        client.log(`Méthode: exp/activityCheck`, "debug");
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        const games = client.gamesGetActive();

        const roleMembers = guild.roles.cache.find(r => r.name == settings.memberRole);

        if (!games) return;

        guild.members.cache.forEach(member => {
            if (member.roles.cache.has(roleMembers.id)) {
                let presenceGame = client.presenceGetGameName(member.presence);
                if (presenceGame) {
                    const game = client.gamesGet(presenceGame);
                    if (game) {
                        client.usergameUpdateLastPlayed(game, member);
                        client.usergameAddXP(member, game, "PLAY");

                        if (member.voice.channel && member.roles.cache.has(game.roleID)) {
                            if (member.voice.channel.name !== settings.AFKChannel) {
                                client.db.userdataAddXP(client, member, 2, `Joue à ${game.name}`);
                                client.usergameAddXP(member, game, "VOICE");
                            }
                        }
                    }
                } else {
                    if (member.voice.channel) {
                        if (member.voice.channel.name !== settings.AFKChannel) {
                            client.db.userdataAddXP(client, member, 1, `En vocal`);
                        }
                    }
                }
            }
        });

    };

    client.userdataAddXP = (member) => {
        client.log(`Méthode: exp/userdataAddXP`, "debug");
        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const userdata = client.userdataGet(member.id);




    };

    client.usergameAddXP = (member, game, type, amount = 1) => {
        client.log(`Méthode: exp/usergameAddXP`, "debug");
        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const usergame = client.usergameGet(member, game);

        usergame.xp += amount;
        let newLevel = client.xpGetLevel(usergame.xp);
        if (newLevel > usergame.level) {
            usergame.level = newLevel;
            client.log(`Jeu ${game.name}: Niveau supérieur pour ${member.displayName} qui est désormais level ${newLevel})`)
        };
        client.usergameSet(usergame);

        client.log(`usergameXP pour ${member.displayName} sur ${game.name} (${type}:${amount})`, "debug");

        let date = moment().format('DD.MM.YYYY');
        let key = `${date}-${member.id}-${game.id}`;

        let usergameXP = client.db_usergameXP.get(key)
        if (!usergameXP) {
            client.log(`usergameXP créé`, "debug");
            usergameXP = Object.assign({}, datamodel.tables.usergameXP);
            usergameXP.key = key;
            usergameXP.date = date;
            usergameXP.memberID = member.id;
            usergameXP.gameID = game.id;
            switch (type) {
                case "PLAY":
                    usergameXP.playXP = amount;
                    break;
                case "VOICE":
                    usergameXP.voiceXP = amount;
                    break;
                case "TEXT":
                    usergameXP.textXP = amount;
                    break;
            }
            usergameXP.totalXP = amount;
            client.db_usergameXP.set(key, usergameXP);
        } else {
            client.log(`usergameXP mis à jour`, "debug");
            switch (type) {
                case "PLAY":
                    usergameXP.playXP += amount;
                    break;
                case "VOICE":
                    usergameXP.voiceXP += amount;
                    break;
                case "TEXT":
                    usergameXP.textXP += amount;
                    break;
            }
            usergameXP.totalXP += amount;
            client.db_usergameXP.set(key, usergameXP);
        }
    };

    client.xpGetLevel = (xp) => {
        client.log(`Méthode: exp/xpGetLevel`, "debug");
        let coef = 600;
        // L = (25 + sqrt(25 * 25 - 4 * 25 * (-X) ))/ (2 * 25)
        let level = Math.floor(Math.floor(coef + Math.sqrt(coef * coef - 4 * coef * (-xp))) / (coef * 2));
        return level;
    };
    client.levelGetXP = async (level) => {
        client.log(`Méthode: exp/levelGetXP`, "debug");
        let coef = 600;
        // L = (25 + sqrt(25 * 25 - 4 * 25 * (-X) ))/ (2 * 25)
        let xp = Math.floor((coef * (level * level)) - (coef * level));
        return xp;
    };
    client.userLevelUp = async (member, level) => {
        client.log(`Méthode: exp/userLevelUp`, "debug");
        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = client.db_settings.get(guild.id);

        //let channel = guild.channels.cache.find(c => c.name === settings.welcomeMemberChannel);
        let channel = guild.channels.cache.find(c => c.name === settings.commandsTestChannel);

        let embed = new Discord.MessageEmbed();
        let indexLevel = parseInt(level);

        client.log(client.textes.get("EXP_LOG_LEVELUP", member, level));

        if (indexLevel == 1) {
            embed.setTitle(client.textes.get("EXP_MESSAGE_INFORMATIONS_TITRE"));
            embed.setDescription(client.textes.get("EXP_MESSAGE_INFORMATIONS_DESCRIPTION", member));
            embed.setColor(colors['darkgreen']);
            embed.setThumbnail(client.user.avatarURL())
            channel.send(embed);
        } else {
            embed.setAuthor(member.displayName, member.user.avatarURL());
            embed.setTitle(client.textes.get("EXP_MESSAGE_LEVELUP_TITRE"));
            embed.setDescription(client.textes.get("EXP_MESSAGE_LEVELUP_DESCRIPTION", member, level));
            embed.setColor(colors['darkgreen']);
            embed.setThumbnail(constants.images.levels[indexLevel]);
            channel.send(embed);
        }
    };

}