module.exports = (client) => {

  client.log = async (msg, type = "log") => {
    const settings = await client.db.getSettings(client);
    if (!settings) {
      console.log(msg);
    } else {
      client.logger.log(msg, type, settings.debug);
      if (settings.logChannelID && settings.logToChan == "true") {
        if (type == "debug" && settings.debug == "false") return;
        client.channels.get(settings.logChannelID).send(`[${type.toUpperCase()}] ${msg}`).catch(console.error);
      }
    }
  }
};


