module.exports = (client) => {

    client.log = async (msg, type = "log") => {
        const settings = await client.db.getSettings(client);
        client.logger.log(msg, type);
        if (settings.logChannelID && settings.logToChan == "true") {
          if (type == "debug" && settings.debug == "false") return;
          client.channels.get(settings.logChannelID).send(`[${type.toUpperCase()}] ${msg}`).catch(console.error);
        }
      };


}