const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } = require("discord-akairo");
const path = require('path');


class AlfredClient extends AkairoClient {
	constructor(config) {
		super({ ownerID: config.owner }, {
			messageCacheMaxSize: 500,
			messageCacheLifetime: 10800,
			messageSweepInterval: 21600,
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
			partials: ['MESSAGE', 'REACTION']
		});

		this.commandHandler = new CommandHandler(this, {
			directory: "./commands/",
			aliasReplacement: /-/g,
			prefix: '!',
			allowMention: true,
			fetchMembers: true,
			commandUtil: true,
			commandUtilLifetime: 3e5,
			commandUtilSweepInterval: 9e5,
			handleEdits: true,
			defaultCooldown: 2500,
			argumentDefaults: {
				prompt: {
					cancelWord: 'stop',
					timeout: msg => `Vous avez mis trop de temps à répondre. Commande annulée`,
					ended: msg => `Trop de tentatives. Commande annulée`,
					cancel: msg => `Commande annulée`,
					retries: 4,
					time: 180000
				}
			}
		});

		this.inhibitorHandler = new InhibitorHandler(this, { directory: './inhibitors' });
		this.listenerHandler = new ListenerHandler(this, { directory: "./events/" });

		this.config = config;

		this.setup();


	}

	setup() {
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			inhibitorHandler: this.inhibitorHandler,
			listenerHandler: this.listenerHandler
		});

		this.commandHandler.loadAll();
		this.inhibitorHandler.loadAll();
		this.listenerHandler.loadAll();
	}

	async start() {
		return this.login(this.config.token);
	}
}

module.exports = AlfredClient;