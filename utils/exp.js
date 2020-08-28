
const Discord = require("discord.js");
const colors = require('./colors');
const constants = require('./constants');

module.exports = (client) => {

    client.activityCheck = async () => {

        const guild = client.guilds.cache.get(client.config.guildID);
        const games = client.gamesGetActive();


        const settings = client.getSettings();
        const roleMembers = guild.roles.cache.find(r => r.name == settings.memberRole);

        if (!games) return;

        guild.members.cache.forEach(member =>  {
            if (member.roles.cache.has(roleMembers.id)) {
                let presenceGame = client.presenceGetGameName(member.presence);
                if (presenceGame) {
                    const game = client.db_games.find(game => game.name == presenceGame);
                    if (game) {
                        client.usergameUpdateLastPlayed(game, member);
                        client.db.usergameAddXP(client, member, 1, game);
                        client.usergameAddXP(member, game, "PLAY");

                        if (member.voice.channel && member.roles.cache.has(game.roleID)) {
                            if (member.voice.channel.name !== settings.AFKChannel) {
                                client.db.userdataAddXP(client, member, 2, `Joue à ${game.name}`);
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
    client.xpGetLevel = (xp) => {
        let coef = 600;
        // L = (25 + sqrt(25 * 25 - 4 * 25 * (-X) ))/ (2 * 25)
        let level = Math.floor(Math.floor(coef + Math.sqrt(coef * coef - 4 * coef * (-xp))) / (coef * 2));
        return level;
    };
    client.levelGetXP = async (level) => {
        let coef = 600;
        // L = (25 + sqrt(25 * 25 - 4 * 25 * (-X) ))/ (2 * 25)
        let xp = Math.floor((coef * (level * level)) - (coef * level));
        return xp;
    };
    client.userLevelUp = async (member, level) => {

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