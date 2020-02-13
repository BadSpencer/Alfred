const {
    Listener
} = require('discord-akairo');
const cron = require('cron');

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
        let ready = `Alfred v${pjson.version} prêt !`;

        this.client.user.setActivity(`v${pjson.version}`, {
            type: "PLAYING"
        });
        this.client.logger.log(`${ready}`, `ready`);


        // Contrôle configuration serveur présente
        this.client.guilds.forEach(guild => {
            let guildSettings = this.client.db_settings.get(guild.id);
            if (!guildSettings) {
                let noguildsettings = `Configuration non trouvée pour serveur ${guild.name} (${guild.id}). La configuration par défaut à été appliquée.`;
                guild.owner.send(`La configuration du serveur ${guild.name} (${guild.id}) n\'a pas été faite. Veuillez lancer la commande !config`)
                this.client.logger.log(`${noguildsettings}`)
                guildSettings = datamodel.tables.settings;

                guildSettings.id = guild.id;
                guildSettings.guildName = guild.name;
                this.client.db_settings.set(guild.id, guildSettings);
            } else {
                this.client.logger.log(`Configuration serveur ${guild.name} (${guild.id}) chargée`)
            }
        })
        
        let activityCheck = new cron.CronJob('00 * * * * *', () => { // Toutes les minutes
            this.client.exp.activityCheck(this.client);
        });

        activityCheck.start();
        
    }
}

module.exports = ReadyListener;