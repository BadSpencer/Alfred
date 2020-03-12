
const Discord = require("discord.js");
const colors = require('./colors');
const constants = require('./constants');

exports.activityCheck = async (client) => {

    const guild = client.guilds.get(client.config.guildID);
    const games = await client.db.gamesGetActive(client);


    const settings = await client.db.getSettings(client);
    const roleMembers = guild.roles.find(r => r.name == settings.memberRole);

    if (!games) return;

    guild.members.forEach(member => {
        if (member.roles.has(roleMembers.id)) {
            if (member.presence.game) {
                const game = client.db_games.find(game => game.name == member.presence.game.name);
                if (game) {
                    client.games.createUsergame(client, game, member);
                    client.db.usergameAddXP(client, member, 1, game);

                    if (member.voiceChannel) {
                        if (member.voiceChannel.name !== settings.AFKChannel) {
                            client.db.userdataAddXP(client, member, 2, `Joue à ${game.name}`);
                        }
                    }
                }
            } else {
                if (member.voiceChannel) {
                    if (member.voiceChannel.name !== settings.AFKChannel) {
                        client.db.userdataAddXP(client, member, 1, `En vocal`);
                    }
                }
            }
        }
    });

};
exports.xpGetLevel = async (xp) => {
    let coef = 600;
    // L = (25 + sqrt(25 * 25 - 4 * 25 * (-X) ))/ (2 * 25)
    let level = Math.floor(Math.floor(coef + Math.sqrt(coef * coef - 4 * coef * (-xp))) / (coef * 2));
    return level;
};
exports.levelGetXP = async (level) => {
    let coef = 600;
    // L = (25 + sqrt(25 * 25 - 4 * 25 * (-X) ))/ (2 * 25)
    let xp = Math.floor((coef * (level * level)) - (coef * level));
    return xp;
};
exports.userLevelUp = async (client, member, level) => {

    const guild = client.guilds.get(client.config.guildID);
    const settings = client.db_settings.get(guild.id);

    //let channel = guild.channels.find(c => c.name === settings.welcomeMemberChannel);
    let channel = guild.channels.find(c => c.name === settings.modNotifChannel);

    let embed = new Discord.RichEmbed();
    let indexLevel = parseInt(level);

    client.log(client.textes.get("EXP_LOG_LEVELUP", member, level));

    if (indexLevel == 1) {
        embed.setTitle(client.textes.get("EXP_MESSAGE_INFORMATIONS_TITRE"));
        embed.setDescription(client.textes.get("EXP_MESSAGE_INFORMATIONS_DESCRIPTION", member));
        embed.setColor(colors['darkgreen']);
        embed.setThumbnail(client.user.displayAvatarURL)
        //member.send(embed);
        channel.send(embed);
    } else {
        embed.setAuthor(member.displayName, member.user.avatarURL);
        embed.setTitle(client.textes.get("EXP_MESSAGE_LEVELUP_TITRE"));
        embed.setDescription(client.textes.get("EXP_MESSAGE_LEVELUP_DESCRIPTION", member, level));
        embed.setColor(colors['darkgreen']);
        embed.setThumbnail(constants.images.levels[indexLevel]);
        channel.send(embed);
    }
};