const {
    Listener
} = require('discord-akairo');
const cron = require('cron');

const datamodel = require('../../utils/datamodel');

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    async exec() {
        let client = this.client;
        const pjson = require('../../package.json');
        this.client.user.setActivity(`v${pjson.version}`, {
            type: "PLAYING"
        });

        await client.db.settingsCheck(client);


        await client.userdataCheck();
        await client.db.userlogsCheck(client);
        await client.db.embedsCheck(client);
        await client.db.gamesCheck(client);
        await client.checkGameServers();
        await client.db.usergameCheck(client);
        await client.db.postedEmbedsCheck(client);
        await client.db.textesCheck(client);


        if (!client.cron_activityCheck.running) client.cron_activityCheck.start();
        if (!client.cron_messageOfTheDay.running) client.cron_messageOfTheDay.start();
        if (!client.cron_gameList.running) client.cron_gameList.start();

        if (!client.cron_serversStatus.running) client.cron_serversStatus.start();
        if (!client.cron_serverMaintenanceOn.running) client.cron_serverMaintenanceOn.start();
        if (!client.cron_serverMaintenanceOff.running) client.cron_serverMaintenanceOff.start();

        if (!client.cron_serversInfos.running) client.cron_serversInfos.start();
        if (!client.cron_ArkDWD.running) client.cron_ArkDWD.start();

        if (!client.cron_gamePurge.running) client.cron_gamePurge.start();

        client.logger.log(`Alfred v${pjson.version} prêt !`, `ready`);

    }
}

module.exports = ReadyListener;