const constants = require('./constants');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('../utils/messages');

exports.welcomeServerJoin = async (client, member) => {
    client.logger.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_SERVER", member));

    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

};
exports.welcomeNewMember = async (client, member) => {
    client.logger.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_MEMBERS", member));

    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    if (settings.welcomeMemberEnabled !== "true") return client.logger.log(client.textes.get("LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION"));

    let welcomeChannel = guild.channels.find(c => c.name === settings.welcomeChannel);
    let modNotifChannel = guild.channels.find(c => c.name === settings.modNotifChannel)
    

    if(welcomeChannel) {

    };

    if(modNotifChannel) {
 
    }
    
    //.send(welcomeMessage).catch(console.error);


};
