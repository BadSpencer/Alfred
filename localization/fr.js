exports.MESSAGES = {
	COMMANDS: {
		HELP: {
            DESCRIPTION: 'Affiche la liste des commandes disponible, ou donne des détails à propos d\'une commande en particulier.',

			OWNER_ONLY: granted => `${granted ? this.HELP.EMOJIS.GRANTED : this.HELP.EMOJIS.DENIED} Owner only`,
			GUILD_ONLY: granted => `${granted ? this.HELP.EMOJIS.GRANTED : this.HELP.EMOJIS.DENIED} Server only`,
			USER_PERMISSIONS: (granted, permissions) => `${granted ? this.HELP.EMOJIS.GRANTED : this.HELP.EMOJIS.DENIED} User permissions: ${permissions}`,
			BOT_PERMISSIONS: (granted, permissions) => `${granted ? this.HELP.EMOJIS.GRANTED : this.HELP.EMOJIS.DENIED} Bot permissions: ${permissions}`,
			AVAILABLE_COMMANDS_INTRO: 'Your available commands are:',
			MORE_INFORMATION: (prefix, commandname) => `You can use \`${prefix}${commandname} <commandname>\` to get more information about a command.
			`
		},
		PING: {
			WAITING: 'awaiting ping...',
			SUCCESS: (latency, heartbeat) => `${this.PREFIXES.SUCCESS} pong! Api latency is ${latency}ms. Av. heartbeat is ${heartbeat}`
		}
	},
	LISTENERS: {
		COMMAND_BLOCKED: {
			GUILD_ONLY: commandname => `${this.PREFIXES.ERROR}The command \`${commandname}\` is not available in direct messages`
		},
		COOLDOWN: {
			TRY_AGAIN_IN: offset => `${this.PREFIXES.ERROR}Try again in ${offset}s.`
		},
		MESSAGE_INVALID: {
			ERRORS: {
				NO_CONNECTION: (verificationEmoji, username) => `${this.PREFIXES.ERROR}[${verificationEmoji}] Connection to \`${username}\` could not be established.`,
				NO_RECIPIENT: verificationEmoji => `${this.PREFIXES.ERROR}[${verificationEmoji}] Recipient not found`
			},
			TOPIC: (verificationEmoji, user) => `${verificationEmoji} DM with: ${user} | ${user.tag} (${user.id})`
		},
		MISSING_PERMISSIONS: {
			USER: (permissions, commandname) => `${this.PREFIXES.ERROR}You need the permission${permissions.length > 1 ? 's' : ''} ${permissions} to execute the command \`${commandname}\`.`,
			BOT: (permissions, commandname) => `${this.PREFIXES.ERROR}I need the permission${permissions.length > 1 ? 's' : ''} ${permissions} to execute the command \`${commandname}\`.`
		},
		LOGIN: {
			LOG: client => `Logged in as ${client.user.tag} (${client.user.id}).`
		},
		DISCONNECT: {
			LOG: code => `Disconnected with eventcode ${code}.`
		},
		RESUMED: {
			LOG: number => `Resumed (Replayed ${number} events).`
		}
	}
};