const Discord = require("discord.js");
const {
    Listener
} = require("discord-akairo");
const chalk = require('chalk');
const moment = require('moment');
const datamodel = require("../../utils/datamodel");

class inviteCreateListener extends Listener {
    constructor() {
        super('inviteCreate', {
            emitter: 'client',
            event: 'inviteCreate'
        });
    }

    async exec(invite) {
        const guild = this.client.getGuild();
        const settings = this.client.getSettings(guild);

        const verifiedRole = guild.roles.cache.find(c => c.name === settings.verifiedRole);
        const roleEveryone = guild.roles.cache.find(r => r.name === "@everyone");

        const serverInvites = await guild.fetchInvites();

        if (invite.channel.type === 'voice') {
            await invite.channel.createOverwrite(verifiedRole, {
                VIEW_CHANNEL: true,
                CONNECT: true,
                SPEAK: true,
                USE_VAD: true
            });
            await invite.channel.createOverwrite(roleEveryone, {
                VIEW_CHANNEL: true,
                CONNECT: true,
                SPEAK: true,
                USE_VAD: true
            });
        }

        this.client.db_invites.clear();

        for (const serverInvite of serverInvites) {
            let newinvite = Object.assign({}, datamodel.tables.invites);
            newinvite.id = serverInvite[1].code;
            newinvite.uses = serverInvite[1].uses;
            this.client.db_invites.set(newinvite.id, newinvite);
        }
        

    }
}

module.exports = inviteCreateListener;