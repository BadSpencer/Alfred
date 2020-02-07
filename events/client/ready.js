const {
    Listener
} = require('discord-akairo');
const chalk = require('chalk');
const moment = require('moment');
const {
    errorMessage,
    warnMessage
} = require('../../utils/messages');

const datamodel = require('../../utils/datamodel');

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            eventName: 'ready'
        });
    }

    exec() {
        const pjson = require('../../package.json');
        let timestamp = `${moment(new Date()).format("DD-MM-YY HH:mm:ss")}`;
        let ready = `Alfred v${pjson.version} prêt !`;

        this.client.user.setActivity(`v${pjson.version}`, {
            type: "PLAYING"
          });
        console.log(`${timestamp} | ${ready}`);


        //let guilds = this.db_userdata.fetchEverything();

        this.client.guilds.forEach(guild  => {
            let guildSettings = this.client.db_settings.get(guild.id);
            if (!guildSettings) {
                let noguildsettings = `Configuration non trouvée pour serveur ${guild.name} (${guild.id}). La configuration par défaut à été appliquée.`;
                guild.owner.send(`La configuration du serveur ${guild.name} (${guild.id}) n\'a pas été faite. Veuillez lancer la commande !config`)
                console.log(`${timestamp} | ${noguildsettings}`)
                guildSettings = datamodel.tables.settings;

                guildSettings.id = guild.id;
                guildSettings.guildName = guild.name;
                this.client.db_settings.set(guild.id, guildSettings);
            } else {
                console.log(`${timestamp} | Configuration serveur ${guild.name} (${guild.id}) chargée`)
            }
        })

        


    }
}

module.exports = ReadyListener;