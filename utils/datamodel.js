exports.tables = {
    settings: {
        "id": "",
        "guildName": "",
        "logChannelID": "",
        "logToChan": "false",
        "debug": "true",
        "modRole": "Modérateurs",
        "adminRole": "Admins",
        "memberRole": "Membres", 
        "modNotifChannel": "notifications-modération" ,
        "welcomeChannel": "accueil",
        "welcomeEnabled": "true",
        "welcomeMemberChannel": "💬général",
        "welcomeMemberEnabled": "true",
        "newsChannel": "📢news",  
        "suggChannel": "💡suggestions",
        "freeVoiceChan": "➕ Créer salon",
        "voiceChansCategory": "🔷Salons vocaux",
        "accueilCategory": "🔷Espace Public",
        "contactChannelFree": "👋contact",
        "contactChannelWaiting": "🔒👋contact",
        "contactChannelInprogress": "🔒👋contact",
        "commandsChannel": "❗alfred",
        "commandsTestChannel": "tests-cmds",
        "AFKChannel": "⌛AFK",
        "quietChannel": "🔈Au calme",
        "gameJoinChannel": "🎮vos-jeux",
        "gameJoinMessage": "",
        "gameInfosLinkMessage": "",
        "gameCategoryPrefix": "🟧",
        "gameTextPrefix": "💬",
        "gameInfosPrefix": "📌",
        "gameStatusPrefix": "🚥",
        "gameEventPrefix": "📆",
        "gameMainRoleColor": "0xF1C40F",
        "gameModRoleColor": "0xCC7900",
        "gamePlayRoleColor": "0xC27C0E",
        "postedCitations": [],
        "postedAstuces": [],
        "xpToLevelCoef": 600,
        "maxPlayXPPerDay": 100,
        "maxVoiceXPPerDay": 100,
        "maxTextXPPerDay": 800,
        "maxCmdXPPerDay": 200,
        "maxReactInXPPerDay": 1000,
        "maxReactOutXPPerDay": 500,
        "mediaPath": "/root/Alfred/media/"
    },
    games: {
        "id": "",
        "name": "default",
        "emoji": "",
        "createdAt": "",
        "actif": false,
        "nbDaysInactive": 30,
        "lastPlayed": 0,
        "previousScore": 0,
        "currentScore": 0,
        "roleID": "",
        "modRoleID": "",
        "playRoleID": "",
        "categoryID": "",
        "textChannelID": "",
        "infosChannelID": "",
        "statusChannelID": "",
        "eventsChannelID": "",
        "voiceChannelID": "",
        "infosMessageID": "",
        "serversStatusMessageID": ""
    },
    gamealias: {
        'id': "",
        'gameID': ""
    },
    gameservers:{
        "id": "",
        "createdAt": "",
        "createdate": "",
        "createdTime": "",
        "isActive": true,
        "gamename": "",
        "servername": "",
        "ip": "",
        "portrcon": "",
        "portftp": "",
        "pwdrcon": "",
        "pwdftp": "",
        "userftp": "",
        "status": "",
        "steamlink": "",
        "version":"",
        "maxNumberOfPlayers": 0,
        "connected": 0,
        "mods": [],
        "playerlist": []
    },
    gameserverConfig:{
        'serverID': "",
        'filename': "",
        'section': "",
        'parameter': "",
        'value': ""
    },
    gameserversPlayers: {
        "id": "default",
        "steamName": "",
        "memberID": "",
        "firstSeenAt": "",
        "firstSeenDate": "",
        "firstSeenTime": "",
        "lastSeenAt": "",
        "lastSeenDate": "",
        "lastSeenTime": "",
        "isBanned": false
    },
    playersLogs: {
        "id": "",
        "serverID": "",
        "servername": "",
        "playerID": "",        
        "memberID": "",
        "displayName": "",
        "firstSeenAt": "",
        "firstSeenDate": "",
        "firstSeenTime": "",
        "lastSeenAt": "",
        "lastSeenDate": "",
        "lastSeenTime": "",
        "isActive": true

    },
    userdata: {
        "id": "",
        "username": "",
        "nickname": "",
        "displayName": "",
        "createdAt": "",
        "createdate": "",
        "createdTime": "",
        "joinedAt": "",
        "joinedDate": "",
        "joinedTime": "",
        "level": 0,
        "xp": 0,
        "logs": []
    },
    userdataLogs: {
        "createdAt": "",
        "createdBy": "",
        "date": "",
        "heure": "",
        "event": "",
        "commentaire": ""
    },
    userdataNicknames:{
        "date": "",
        "oldNickname": "",
        "newNickname": ""
    },
    usergame: {
        "id": "",
        "userid": "",
        "gameid": "",
        "joinedAt": 0,
        "joinedDate": "",
        "joinedTime": "",
        "xp": 0,
        "level": 0,
        "lastPlayed": 0,
        "lastAction": 0,
        "notInGroupWarns": 0,
        "notInGroupNotifiedAt": ""
    },
    userxplogs: {
        "id": "",
        "date": "",
        "userid": "",
        "xp": [],
        "gamexp": []
    },
    postedEmbeds: {
        "id": "",
        "name": "default",
        "channelID": "",
        "currentPage": 1,
        "totalPages": "",
        "pages": []
    },
    embeds:{
        "id": "",
        "statut": "",
        "titre": "",
        "createdAt": "",
        "createdDate": "",
        "createdTime": "",
        "createdBy": "",
        "createdByName": "",
        "ownedBy": "",
        "ownedByName": "",
        "changedAt": "",
        "changedDate": "",
        "changedTime": "",
        "changedBy": "",
        "changedByName": "",
        "copyFrom": null,
        "content": "",
        "isNews": false,
        "showTitle": true,
        "showFooter": true
    },
    astuce: {
        "id": "",
        "texte": "",
        "count": 0
    },
    citation: {
        "id": "",
        "texte": "",
        "count": 0
    },
    messagesLogs: {
        "messageID": "",
        "channelID": "",
        "channelName": "",
        "categoryName": "",
        "createdBy": "",
        "createdByName": "",
        "createdAt": "",
        "createdDate": "",
        "createdTime": "",
        "content": "",
        "url": ""
    },
    commandsLogs: {
        "messageID": "",
        "command": "",
        "channelID": "",
        "channelType": "",
        "createdBy": "",
        "createdByName": "",
        "createdAt": "",
        "createdDate": "",
        "createdTime": "",
        "content": ""
    },
    usergameXP: {
        "key": "",
        "date": "",
        "memberID": "",
        "gameID": "",
        "totalXP": 0
    },
    memberLog: {
        "key": "",
        "createdAt": "",
        "createdDate": "",
        "createdTime": "",
        "memberID": "",
        "type": "",
        "comment": "",
        "gameID": "",
        "voiceChannelName": "",
        "partyMemberID": "",
        "emoji": "",
        "nickOld": "",
        "nickNew": "",
        "note": "",
        "xpMaxReached": false,
        "hits": 0,
        "xpGained": 0,
        "xpNoLimit": 0
    }
}