const {
    Listener
} = require('discord-akairo');


class MessageReactionAddListener extends Listener {
    constructor() {
        super('messageReactionAdd', {
            emitter: 'client',
            eventName: 'messageReactionAdd'
        });
    }

    exec(messageReaction, user) {
        if (user.bot) return;
        let reacted = `${user.id} à réagi sur le message ${messageReaction.message.id}`
        this.client.logger.log(`${reacted}`);


        let postedEmbed = this.client.db_postedEmbeds.get(messageReaction.message.id);
        if (postedEmbed) {
            switch (messageReaction.emoji.name) {
                case '▶': {
                    let totalPages = postedEmbed.pages.length;
                    let indexNewPage = postedEmbed.currentPage;

                    let newEmbed = postedEmbed.pages[indexNewPage].embed;
                    messageReaction.message.edit(newEmbed);
                    if (indexNewPage == totalPages - 1) {
                        messageReaction.message.clearReactions().then(() => messageReaction.message.react('◀'));
                    } else {
                        messageReaction.message.clearReactions().then(() => messageReaction.message.react('◀')
                            .then(() => messageReaction.message.react('▶')));
                    }
                    postedEmbed.currentPage = indexNewPage + 1;
                    this.client.db_postedEmbeds.set(messageReaction.message.id, postedEmbed);
                    break;
                }
                case '◀': {
                    let totalPages = postedEmbed.pages.length;
                    let indexNewPage = postedEmbed.currentPage - 2;
                    let newEmbed = postedEmbed.pages[indexNewPage].embed;
                    messageReaction.message.edit(newEmbed);
                    if (indexNewPage == 0) {
                        messageReaction.message.clearReactions().then(() => messageReaction.message.react('▶'));
                    } else {
                        messageReaction.message.clearReactions().then(() => messageReaction.message.react('◀')
                            .then(() => messageReaction.message.react('▶')));
                    }
                    postedEmbed.currentPage = indexNewPage + 1;
                    this.client.db_postedEmbeds.set(messageReaction.message.id, postedEmbed);
                    break;
                }
            }

        }
        //
        // Gestion de la pagination
        //

        /*
        if (packet.t == 'MESSAGE_REACTION_ADD') {

            if (packet.d.emoji.name == '▶') {
                let dispMessage = client.dispMessage.get(packet.d.message_id);
                let totalPages = dispMessage.pages.length;
                let indexNewPage = dispMessage.currentPage;
                let channel = client.channels.get(packet.d.channel_id);

                channel.fetchMessage(packet.d.message_id).then(msg => {
                    let newEmbed = dispMessage.pages[indexNewPage].embed;
                    if (msg) {
                        msg.edit(newEmbed);
                        if (indexNewPage == totalPages - 1) {
                            msg.clearReactions().then(() => msg.react('◀'));
                        } else {
                            msg.clearReactions().then(() => msg.react('◀')
                                .then(() => msg.react('▶')));
                        }
                    }
                });
                dispMessage.currentPage = indexNewPage + 1;
                client.dispMessage.set(packet.d.message_id, dispMessage);
            };

            if (packet.d.emoji.name == '◀') {
                let dispMessage = client.dispMessage.get(packet.d.message_id);
                let totalPages = dispMessage.pages.length;
                let indexNewPage = dispMessage.currentPage - 2;
                let channel = client.channels.get(packet.d.channel_id);

                channel.fetchMessage(packet.d.message_id).then(msg => {
                    let newEmbed = dispMessage.pages[indexNewPage].embed;
                    if (msg) {
                        msg.edit(newEmbed);

                        if (indexNewPage == 0) {
                            msg.clearReactions().then(() => msg.react('▶'));
                        } else {
                            msg.clearReactions().then(() => msg.react('◀')
                                .then(() => msg.react('▶')));
                        }
                    }
                });
                dispMessage.currentPage = indexNewPage + 1;
                client.dispMessage.set(packet.d.message_id, dispMessage);

            }
        }
        */









    }
}

module.exports = MessageReactionAddListener;