const {
    RichEmbed
} = require('discord.js');
const colors = require('./colors');
const {
    client
} = require('discord-akairo');

module.exports.errorMessage = async (error, channel, del = true, timer = 10000) => {
    const errorMsg = new RichEmbed()
        .setColor(colors['red'])
        .setDescription(`❌ ${error}`);

    return channel.send(errorMsg).then(msgSent => {
        if (del) msgSent.delete(timer);
    });
};

module.exports.warnMessage = async (warning, channel, del = true, timer = 10000) => {
    const warnMsg = new RichEmbed()
        .setColor(colors['orange'])
        .setDescription(`⚠️ ${warning}`);
    return channel.send(warnMsg).then(msgSent => {
        if (del) msgSent.delete(timer);
    });
};

module.exports.successMessage = async (content, channel, del = true, timer = 10000) => {
    const succMsg = new RichEmbed()
        .setColor(colors['green'])
        .setDescription(`✅ ${content}`);

    return channel.send(succMsg).then(msgSent => {
        if (del) msgSent.delete(timer);
    });
};

module.exports.questionMessage = async (question, channel, del = true, timer = 60000) => {
    const questMsg = new RichEmbed()
        .setColor(colors['blueviolet'])
        .setDescription(`❔ ${question}`);

    return channel.send(questMsg).then(msgSent => {
        if (del) msgSent.delete(timer);
    });
};

module.exports.promptMessage = async (question) => {
    const questMsg = new RichEmbed()
        .setColor(colors['blueviolet'])
        .setDescription(`❔ ${question}`);

    return questMsg;
};