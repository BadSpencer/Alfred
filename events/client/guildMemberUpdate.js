const {
    Listener
} = require('discord-akairo');


class guildMemberUpdateListener extends Listener {
    constructor() {
        super('guildMemberUpdate', {
            emitter: 'client',
            eventName: 'guildMemberUpdate'
        });
    }

    async exec(oldMember, newMember) {
        const guild = this.client.guilds.get(this.client.config.guildID);
        const settings = await this.client.db.getSettings(this.client);
        const roleMembers = newMember.guild.roles.find(r => r.name == settings.memberRole);

        let memberUpdate = `Member update pour ${newMember.displayName}`
        this.client.logger.log(`${memberUpdate}`);



        // Role ajouté
        if (newMember.roles.size > oldMember.roles.size) {
            this.client.games.PostRoleReaction(this.client);

            /*
            if (newRole.id == roleMembers.id && settings.welcomeMemberEnabled == "true") {
                const welcomeMemberMessage = settings.welcomeMemberMessage.replace("{{user}}", `${newMember.toString()}`);
                newMember.guild.channels.find(c => c.name === settings.welcomeMemberChannel).send(welcomeMemberMessage).catch(console.error);
            }
            */

        }


        // Role retiré
        if (newMember.roles.size < oldMember.roles.size) {
            this.client.games.PostRoleReaction(this.client);

        }



    }
}

module.exports = guildMemberUpdateListener;