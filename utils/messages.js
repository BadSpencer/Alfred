const {
    RichEmbed
} = require('discord.js');
const colors = require('./colors');
const {
    client
} = require('discord-akairo');

module.exports.errorMessage = (error, channel, del = true) => {
    const errorMsg = new RichEmbed()
        .setColor(colors['red'])
        .setDescription(`❌ ${error}`);

    return channel.send(errorMsg).then(msgSent => {
        if (del) msgSent.delete(10000);
    });
};

module.exports.warnMessage = (warning, channel, del = true) => {
    const warnMsg = new RichEmbed()
        .setColor(colors['orange'])
        .setDescription(`⚠️ ${warning}`);
    return channel.send(warnMsg).then(msgSent => {
        if (del) msgSent.delete(10000);
    });
};

module.exports.successMessage = (content, channel, del = true) => {
    const succMsg = new RichEmbed()
        .setColor(colors['green'])
        .setDescription(`✅ ${content}`);

    return channel.send(succMsg).then(msgSent => {
        if (del) msgSent.delete(10000);
    });
};

module.exports.questionMessage = (question, channel, del = true) => {
    const questMsg = new RichEmbed()
        .setColor(colors['blueviolet'])
        .setDescription(`❔ ${question}`);

    return channel.send(questMsg).then(msgSent => {
        if (del) msgSent.delete(30000);
    });
};

module.exports.promptMessage = (question, channel, del = true) => {
    const questMsg = new RichEmbed()
        .setColor(colors['blueviolet'])
        .setDescription(`❔ ${question}`);

    return questMsg;
};