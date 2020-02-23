const {
    RichEmbed
} = require('discord.js');
const colors = require('./colors');
const {
    client
} = require('discord-akairo');

module.exports.errorMessage = (error, channel) => {
    const errorMsg = new RichEmbed()
        .setColor(colors['red'])
        //.setThumbnail(`https://i.imgur.com/WgWfhEg.png?1`)
        .setDescription(`❌ ${error}`);

    return channel.send(errorMsg).then(msgSent => {msgSent.delete(10000)});
};

module.exports.warnMessage = (warning, channel) => {
    const warnMsg = new RichEmbed()
        .setColor(colors['orange'])
        //.setThumbnail(`https://i.imgur.com/jkxC5Am.png?1`)
        .setDescription(`⚠️ ${warning}`);
    return channel.send(warnMsg).then(msgSent => {msgSent.delete(10000)});
};

module.exports.successMessage = (content, channel) => {
    const succMsg = new RichEmbed()
        .setColor(colors['green'])
        //.setThumbnail(`https://i.imgur.com/PTDLRcr.png?1`)
        .setDescription(`✅ ${content}`);

    return channel.send(succMsg).then(msgSent => {msgSent.delete(10000)});
};

module.exports.questionMessage = (question, channel) => {
    const questMsg = new RichEmbed()
        .setColor(colors['blueviolet'])
        //.setThumbnail(`https://i.imgur.com/jo6uOII.png?1`)
        .setDescription(`❔ ${question}`);

    return channel.send(questMsg).then(msgSent => {msgSent.delete(10000)});
};