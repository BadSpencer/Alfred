module.exports = (client) => {

    client.log = async (msg, type = "log") => {
        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);
        client.logger.log(msg, type);
        if (settings.logChannelID) {
          if (type == "debug" && settings.debug == "false") return;
          client.channels.get(settings.logChannelID).send(`[${type.toUpperCase()}] ${msg}`).catch(console.error);
        }
      };


}