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
                        client.db.userdataAddXP(client, member, 2, `Joue à ${game.name}`);
                    }
                }
            } else {
                if (member.voiceChannel) {
                    client.db.userdataAddXP(client, member, 2, `Joue à ${game.name}`);
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
    const Discord = require("discord.js");
    const guild = client.guilds.get(client.config.guildID);
    const settings = client.db_settings.get(guild.id);

    let channel = guild.channels.find(c => c.name === settings.modNotifChannel);

    let embed = new Discord.RichEmbed();
    let indexLevel = parseInt(level);
    let avatar = constants.images.levels[indexLevel];

    embed.setAuthor(member.displayName, member.user.avatarURL);
    embed.setTitle(`Niveau supérieur !`);
    embed.setColor(`${member.displayHexColor}`);
    embed.setDescription(`Félicitations ${member.displayName} ! Vous avez atteint le niveau ${level}`);
    embed.setThumbnail(avatar);

    channel.send(embed);

};