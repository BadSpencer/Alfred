const {
    AkairoClient
} = require("discord-akairo");
const {
    owner,
    token,
    prefix
} = require('./config.js');
const Enmap = require("enmap");
const cron = require('cron');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage,
    promptMessage
} = require('./utils/messages');

const AlfredClient = require('./utils/AlfredClient');
const config = require('./config.js');

const client = new AlfredClient(config);

client.logger = require("./utils/logger");
client.db = require("./utils/db");

require("./utils/core.js")(client);
require("./utils/logs.js")(client);
require("./utils/games.js")(client);
require("./utils/gameservers.js")(client);
require("./utils/embeds.js")(client);
require("./utils/members.js")(client);
require("./utils/users.js")(client);
require("./utils/aide.js")(client);
require("./utils/exp.js")(client);

client.textes = new (require(`./utils/textes.js`));

client.on('shardDisconnect', () => client.log('Connection perdue...', 'warn'))
    .on('shardReconnecting', () => {
        client.log('Tentative de reconnexion...', 'warn');

    })
    .on('shardResume', () => {
        client.log('Reconnexion effectuée', 'warn');
        const pjson = require('./package.json');
        client.user.setActivity(`v${pjson.version}`, {
            type: "PLAYING"
        });
    })
    .on("error", err => client.log(err, "error"))
    .on('warn', info => client.log(info, 'warn'));

client.db_settings = new Enmap({
    name: "settings"
});
client.db_userdata = new Enmap({
    name: "userdata"
});
client.db_games = new Enmap({
    name: "games"
});
client.db_gamealias = new Enmap({
    name: "gamealias"
});
client.db_gameservers = new Enmap({
    name: "gameservers"
});
client.db_gameserverconfig = new Enmap({
    name: "gameserverconfig"
});

client.db_gameserversPlayers = new Enmap({
    name: "gameserversPlayers"
});
client.db_usergame = new Enmap({
    name: "usergame"
});
client.db_embeds = new Enmap({
    name: "embeds"
});
client.db_userxplogs = new Enmap({
    name: "userxplogs"
});
client.db_postedEmbeds = new Enmap({
    name: "postedEmbeds"
});
client.db_astuces = new Enmap({
    name: "astuces"
});
client.db_citations = new Enmap({
    name: "citations"
});

client.db_messageslogs = new Enmap({
    name: "messageslogs"
});

client.db_commandsLogs = new Enmap({
    name: "commandsLogs"
});

client.db_playersLogs = new Enmap({
    name: "playersLogs"
});

client.db_usergameXP = new Enmap({
    name: "usergameXP"
});

client.db_memberLog = new Enmap({
    name: "memberLog"
});

client.db_freeVoiceChannels = new Enmap({
    name: "freeVoiceChannels"
});


// client.cron_exemple = new cron.CronJob('00 00 06 * * 5', () => { // Le vendredi à 6h00
// });

client.cron_activityCheck = new cron.CronJob('00 * * * * *', () => { // Toutes les minutes
    client.activityCheck();
});
client.cron_serversStatus = new cron.CronJob('5 * * * * *', () => { // Toutes les minutes après 5sec
    client.gameServersStatus();
});

client.cron_serverMaintenanceOn = new cron.CronJob('00 25 05 * * *', () => { // Tous les jours à 5h25
    client.gameServersSetMaintenanceOn("*");
});

client.cron_serverMaintenanceOff = new cron.CronJob('00 45 05 * * *', () => { // Tous les jours à 5h45
    client.gameServersSetMaintenanceOff("*");
});

client.cron_serverUpdateInfos = new cron.CronJob('00 50 05 * * *', () => { // Tous les jours à 5h50
    client.gameserverUpdateInfos();
});

client.cron_serversInfos = new cron.CronJob('10 * * * * *', () => { // Toutes les minutes après 10sec
    client.gameServersPostStatusMessage();
});
client.cron_messageOfTheDay = new cron.CronJob('00 00 09 * * *', () => { // Tous les jours à 9h
    client.messageOfTheDay();
});
client.cron_gameList = new cron.CronJob('15 00 */1 * * *', () => { // Tous les heures après 15sec
    client.gamesJoinListPost();
    client.gamesInfosPost();
});

client.cron_gamePurge = new cron.CronJob('20 30 14 * * *', () => { // Toutes les jours à 14h30 et 20sec
    client.gamesPurge();
});

client.cron_credit = new cron.CronJob('00 00 01 * * *', () => { // Tous les jours à 1h
    client.setcredit();
});


client.commandHandler.resolver.addType('game', (message, phrase) => {
    if (!phrase) return null;
    return client.gamesGet(phrase);
});

client.commandHandler.resolver.addType('gamealiasNew', (message, phrase) => {
    if (!phrase) return null;

    const gamealias = client.db_gamealias.get(phrase);
    if (gamealias) {
        return null;
    }
    return phrase;
});

client.commandHandler.resolver.addType('userdata', (message, phrase) => {
    if (!phrase) return null;

    const guild = client.getGuild();
    const member = client.util.resolveMember(phrase, guild.members.cache);
    if (member) {
        const userdata = client.db_userdata.get(member.id);
        if (userdata) {
            return userdata;
        }
        return null;
    }
    return null;

});

client.commandHandler.resolver.addType('note', (message, phrase) => {
    if (!phrase) return null;

    let note = client.db_memberLog.get(phrase)
    if (note) {
        if (note.type == 'NOTE' || note.type == 'WARN') {
            return note;
        }
    }
    return null;
});

client.commandHandler.resolver.addType('steamID', (message, phrase) => {
    if (!phrase) return null;
    if (phrase.length == 17 && phrase.startsWith('7656')) {
        return phrase;
    } else {
        return null;
    }
});

client.commandHandler.resolver.addType('server', (message, phrase) => {
    if (!phrase) return null;

    const server = client.db_gameservers.get(phrase);
    if (server) {
        return server;
    } else {
        return null;
    }
});
client.commandHandler.resolver.addType('serverID', (message, phrase) => {
    if (!phrase) return null;
    if (phrase == "*") return phrase;

    const server = client.db_gameservers.get(phrase);
    if (server) {
        return phrase;
    } else {
        return null;
    }
});

client.commandHandler.resolver.addType('player', (message, phrase) => {
    if (!phrase) return null;

    const player = client.db_gameserversPlayers.get(phrase);
    if (player) {
        return player;
    } else {
        return null;
    }
});

client.commandHandler.resolver.addType('ouinon', (message, phrase) => {
    if (!phrase) return null;
    if (phrase == 'oui' || phrase == 'non') {
        return phrase;
    } else {
        return null;
    }
});

client.commandHandler.resolver.addType('onoff', (message, phrase) => {
    if (!phrase) return null;
    if (phrase == 'on' || phrase == 'off') {
        return phrase;
    } else {
        return null;
    }
});

// <Array>.random() returns a single random element from an array
// [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
Object.defineProperty(Array.prototype, "random", {
    value: function () {
        return this[Math.floor(Math.random() * this.length)];
    }
});


client.start();

process.on('unhandledRejection', error => {
    client.log(`${error.message}\n${error.stack}`, "error");
});