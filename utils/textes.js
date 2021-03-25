const Discord = require("discord.js");
const moment = require("moment");
const textes = require('./textes');


module.exports = class {
    constructor() {
        this.textes = {

            COM_ACTION_ANNULLE: "Action annulée",
            COM_ACTION_TIMEOUT: "Vous avez mis trop de temps à répondre. Action annulée",
            COM_REPLY_MESSAGE_SEND_BY_DM: "Je vous ai répondu par message privé",
            COM_USER_NEW_STATUS: (member, status) => {
                return `${member.displayName} (${member.id}) est désormais ${status}`;
            },
            COM_MEMBER_ACCEPTED: (member) => {
                return `${member.displayName} à rejoint Casual Effect !`;
            },
            COMMAND_COOLDOWN_MESSAGE: (commande, reste) => {
                return `Attendez encore ${this.convertMs(reste)} avant de pouvoir utiliser la commande "${commande}"`;
            },
            COMMAND_BLOCKED_MESSAGE: (commande, raison) => {
                return `La commande "${commande}" à été bloquée\nRaison: ${raison}`;
            },
            COMMAND_ONLY_DM_MESSAGE: (commande, content) => {
                return `La commande "${commande}" n'est disponible que via message privé.
                Veuillez relancer votre commande ici`
            },
            COMMAND_BLOCKED_REASON_BLACKLIST: "Vous êtes blacklisté",
            COMMAND_BLOCKED_REASON_USERPERMISSIONS: "Vous n'êtes pas autorisé à utiliser cette commande",
            COMMAND_BLOCKED_REASON_CHANNELS: (channel) => {
                return `Les commandes ne sont pas autorisées dans le salon **${channel.name}**

                Merci de lancer vos commandes dans le salon <#562683604690534400> ou bien directement ici en m'envoyant la commande par message privé.`;
            },

            SUGG_NOTIF_TITLE: "Suggestion...",
            SUGG_NOTIF_PROPOSED_BY: (displayName) => {
                return `Proposée par ${displayName}`;
            },

            MAGICBALL_ACTION: [
                "Je consulte les astres...",
                "Les esprits communiquent avec moi...",
                "Des visions me viennent...",
                "Les Tarots Anciens ne mentent jamais...",
                "Je regarde dans ma Boule de cristal...",
                "Patte de lapin et bave de crapaud, révèle moi le destin de ce sombre nigaud...",
                "Je m'adresse au conseil des Druides...",
                "Laissez moi consulter les Runes Ancestrâles...",
                "Plouf Plouf, ce sera toi qui...",
                "Hocus Pocus, révèle moi l'avenir de ce gugus...",
                "3615 MADAMESOLEIL... connexion...",
                "Je demande à la concierge, elle sait tout...",
                "On va se la jouer à pile ou face...",
                "Activation du Pifomètre",
                "Je dois consulter l'Oracle",
                "Lancement des algorithmes d'analyse heuristique",
                "Je vais prendre 'l'appel à un ami' Jean-Pierre"
            ],
            MAGICBALL_REPONSES: [
                "Le service est momentanément indisponible",
                "La question est trop difficle",
                "Je n'ai pas d'avis sur la question",
                "Il y a 50% de chances pour que soit oui",
                "Reposez votre question plus tard",
                "D'après moi, c'est oui",
                "Oui. C'est certain !",
                "Oui absolument",
                "Oui, tu peux compter dessus",
                "Oui, sans aucun doute",
                "C'est très probable",
                "Pour moi, c'est oui sans hésitation",
                "C'est plutôt bien parti",
                "La réponse est oui",
                "Oui, à coup sûr",
                "Alors pour moi c'est non",
                "C'est peu probable",
                "Non mais faut pas rêver",
                "N'y compte pas, aucune chance",
                "Heu... non",
                "C'est impossible",
            ],

            CITATIONS: [
                "C'est merveilleux la vieillesse, dommage que ça finisse si mal ! (François Mauriac)",
                "Dieu a inventé le chat pour que l'homme ait un tigre à caresser chez lui. (Victor Hugo)",
                "On n'est vieux que le jour où on le décide. (Jean Anouilh)",
                "De toutes les écoles que j'ai fréquentées, c'est l'école buissonnière qui m'a paru la meilleure. (Anatole France)",
                "Je ne sais pas comment sera la troisième guerre mondiale, mais je sais qu'il n'y aura plus beaucoup de monde pour voir la quatrième. (Albert Einstein)",
                "L'avantage d'être intelligent, c'est qu'on peut toujours faire l'imbécile, alors que l'inverse est totalement impossible. (Woody Allen)",
                "Il vaut mieux hasarder de sauver un coupable que de condamner un innocent. (Voltaire)",
                "La joie est en tout. Il faut savoir l'extraire. (Confucius)",
                "Ce n'est pas que j'aie vraiment peur de mourir, mais je préfère ne pas être là quand ça arrivera. (Woody Allen)",
                "Ne sais-tu pas que la source de toutes les misères de l'homme, ce n'est pas la mort, mais la crainte de la mort ? (Epictète)",
                "Le plaisir le plus délicat est de faire celui d'autrui. (Jean de La Bruyère)",
                "Je me presse de rire de tout, de peur d'être obligé d'en pleurer. (Pierre-Augustin Caron de Beaumarchais)",
                "La règle d'or de la conduite est la tolérance mutuelle, car nous ne penserons jamais tous de la même façon, nous ne verrons qu'une partie de la vérité et sous des angles différents. (Gandhi)",
                "Ne prenez pas la vie au sérieux. De toute façon, vous n'en sortirez pas vivant. (Bernard Le Bouyer de Fontenelle)",
                "Vis comme si tu devais mourir demain. Apprends comme si tu devais vivre toujours. (Gandhi)",
                "La seule façon de se faire un ami est d'en être un. (Ralph Emerson)",
                "Pour être heureux, il faut penser au bonheur d'un autre. (Gaston Bachelard)",
                "Il y a autant de manières d'être heureux qu'il y a d'individus. (Denis Diderot)",
                "Ne laissez personne venir à vous et repartir sans être plus heureux. (Mère Teresa)",
                "Lorsque tu es arrivé au sommet de la montagne, continue de monter. (Bouddha)",
                "Si j'avance, suivez moi ; si je meurs, vengez-moi ; si je recule, tuez-moi. (Henri de la Rochejaquelein)",
                "J'ai appris que le courage n'est pas l'absence de peur, mais la capacité de la vaincre. (Nelson Mandela)",
                "Définissez-moi d'abord ce que vous entendez par Dieu et je vous dirai si j'y crois. (Albert Einstein)",
                "J'ai appris qu'un homme n'a le droit d'en regarder un autre de haut que pour l'aider à se lever. (Gabriel Garcia Marquez)",
                "Je m'intéresse beaucoup à l'avenir, car c'est là que j'ai décidé de passer le reste de mes jours. (Woody Allen)",
                "L'éternité c'est long, surtout vers la fin. (Franz Kafka)",
                "Il vaut mieux se taire et passer pour un con plutôt que de parler et de ne laisser aucun doute sur le sujet. (Pierre Desproges)",
                "Il me semble parfois qu'en créant l'homme Dieu ait surestimé ses possibilités. (Oscar Wilde)",
                "Nous n'héritons pas de la terre de nos parents, nous l'empruntons à nos enfants. (Antoine de Saint-Exupéry)",
                "L'art du compromis consiste à partager un gâteau de telle sorte que chacun croie avoir la plus grosse part. (Henry Kissinger)",
                "L’admission des femmes à l’égalité parfaite serait la marque la plus sûre de la civilisation, et elle doublerait les forces intellectuelles du genre humain. (Stendhal)",
                "Ceux qui rêvent éveillés ont connaissance de choses qui échappent à ceux qui ne rêvent qu'endormis. (Edgar Allan Poe)",
                "Croyez en vos rêves et ils se réaliseront peut-être. Croyez en vous et ils se réaliseront sûrement. (Martin Luther King)",
                "Je ne cherche pas à connaître les réponses, je cherche à comprendre les questions. (Confucius)",
                "Ne prend la parole que si ce que tu vas dire est plus fort que le silence. (Euripide)",
                "Tout ce que je sais, c'est que je ne sais rien. (Socrate)",
                "Ne jamais parler de soi aux autres et leur parler toujours d'eux-mêmes, c'est tout l'art de plaire. (Edmond et Jules de Goncourt)",
                "L'avenir n'est pas ce qui va arriver mais ce que nous allons en faire. (Henri Bergson)",
                "Le monde ne sera pas détruit par ceux qui font le mal, mais par ceux qui les regardent sans rien faire. (Albert Einstein)",
                "Si tu donnes un poisson à un homme, il mangera un jour. Si tu lui apprends à pêcher, il mangera toujours. (Lao-Tse)",
                "C'est le devoir de chaque homme de rendre au monde au moins autant qu'il en a reçu. (Albert Einstein)",
                "La logique vous mènera d'un point A à un point B. L'imagination vous mènera partout. (Albert Einstein)",
                "Il y a beaucoup de causes pour lesquelles je suis prêt à mourir mais aucune cause pour laquelle je suis prêt à tuer. (Gandhi)",
                "Il n'y a point de génie sans un grain de folie. (Aristote)",
                "La connaissance s'acquiert par l'expérience, tout le reste n'est que de l'information. (Albert Einstein)",
                "Il ne faut pas chercher à rajouter des années à sa vie, mais plutôt essayer de rajouter de la vie à ses années. (John Fitzgerald Kennedy)",
                "A New-York les taxis sont jaunes, à Londres ils sont noirs et à Paris ils sont cons. (Frédéric Beigbeder)",
                "A notre époque, on se refuse à croire que le plomb puisse être transformé en or... jusqu'au moment où on reçoit la facture du plombier. (George Bernard Shaw)",
                "À vaincre sans péril, on triomphe sans gloire. (Pierre Corneille)",
                "Agissez comme s'il était impossible d'échouer. (Winston Churchill)",
                "Au pays des cyclopes, les borgnes sont aveugles. (Philippe Geluck)",
                "Au pays des travestis, les rois sont reines. (Philippe Geluck)",
                "Aujourd'hui la plupart des gens se consument dans je ne sais quelle sagesse terre à terre et découvrent, quand il n'en est plus temps, que les folies sont les seules choses qu'on ne regrette jamais. (Oscar Wilde)",
                "Aujourd'hui les gens savent le prix de tout et ne connaissent la valeur de rien. (Oscar Wilde)",
                "C'est au moment où tu vois un moustique se poser sur tes testicules que tu te rends compte qu'il y a moyen de régler certains problèmes autrement que par la violence. (Lao-Tseu)",
                "C'est drôle comme les gens qui se croient instruits éprouvent le besoin de faire chier le monde. (Boris Vian)",
                "C'est en voulant connaître toujours davantage qu'on se rend compte qu'on ne sait pas grand-chose. (Frédéric Dard)",
                "C'est pas vraiment de ma faute si y'en a qui ont faim, mais ça le deviendrait si on y changeait rien. (Coluche)",
                "Ce qu'un homme possède réellement est ce qui est en lui. Ce qui lui est extérieur ne devrait pas avoir la moindre importance. (Oscar Wilde)",
                "Ce qui m'intéresse surtout dans le jazz, c'est que c'est un bon mot pour le Scrabble. (Philippe Geluck)",
                "Ce sont toujours les cons qui l'emportent. Question de surnombre !. (Frédéric Dard)",
                "Celui qui ne connaît pas l'histoire est condamné à la revivre. (Karl Marx)",
                "Certains ont peur du vide, moi vu le prix de l'essence j'ai plutôt peur du plein ! (Anonyme)",
                "Certains papillons ne vivent qu'une journée et en général il s'agit pour eux du plus beau jour de leur vie... (Philippe Geluck)",
                "Ceux qui boivent pour oublier sont priés de payer d'avance, merci (Anonyme)",
                "Chaque parole a une conséquence. Chaque silence aussi. (Jean-Paul Sartre)",
                "Dans la vie, y a pas de grands, y a pas de petits. La bonne longueur pour les jambes, c'est quand les pieds touchent bien par terre. (Coluche)",
                "Dans le domaine de la création, la pauvreté des moyens engendre la richesse du résultat. (Philippe Geluck)",
                "De tous ceux qui n’ont rien à dire, les plus agréables sont ceux qui se taisent. (Coluche)",
                "Depuis qu'on calcule le temps olympique en millièmes de secondes, un type qui a un grand nez a plus de chances que les autres. (Philippe Geluck)",
                "Depuis que j'ai appris à rire de moi-même, je ne m'ennuie plus jamais. (Georges Bernard Shaw)",
                "Deux choses sont infinies : l'univers et la bêtise humaine. En ce qui concerne l'univers, je n'en ai pas acquis la certitude absolue. (Albert Einstein)",
                "Dieu a créé l'homme. Et ensuite, pour le remercier l'homme a créé Dieu. (Philippe Geluck)",
                "Dire du mal des autres est une façon malhonnête de se flatter. (Oscar Wilde)",
                "Donnez à ceux que vous aimez des ailes pour voler, des racines pour revenir, et des raisons de rester. (Dalaï Lama)",
                "Donnez à chaque jour la chance de devenir le plus beau jour de votre vie. (Mark Twain)",
                "Elle avait un nez si grand que lorsqu'on l'embrassait sur les deux joues, on avait plus vite fait de passer par derrière. (Tristan Bernard)",
                "Elle chante tellement faux que même les sourds refusent de regarder ses lèvres bouger. (Woody Allen)",
                "En hiver, on dit souvent : «Fermez la porte, il fait froid dehors !» Mais quand la porte est fermée… il fait toujours aussi froid dehors ! (Pierre Dac)",
                "Entre une mauvaise cuisinière et une empoisonneuse, il n'y a qu'une différence d'intention. (Pierre Desproges)",
                "Etre heureux ne signifie pas que tout est parfait. Cela signifie que vous avez décidé de regarder au-delà des imperfections. (Aristote)",
                "Expérience : nom dont les hommes baptisent leurs erreurs. (Oscar Wilde)",
                "Faire du bien aux autres, c'est de l'égoïsme éclairé. (Aristote)",
                "Goéland qui s'gratte le gland Signe de mauvais temps Goéland qui s'gratte le cul F'ra pas beau non plus (Proverbe Breton)",
                "Il est bon de traiter l'amitié comme les vins et de se méfier des mélanges. (Colette)",
                "Il existe deux sortes de justice : vous avez l'avocat qui connaît bien la loi et vous avez l'avocat qui connaît bien le juge (Coluche)",
                "Il m'arrive de me parler à moi-même pour être certain que quelqu'un m'écoute. (Philippe Geluck)",
                "Il n'est pas nécessaire d'aller vite, le tout est de ne pas s'arrêter. (Confucius)",
                "Il n'y a pas de Paradis, mais il faut tâcher de mériter qu'il y en ait un. (Jules Renard)",
                "Il n'y a personne qui soit née sous une mauvaise étoile, il n'y a que des gens qui ne savent pas lire le ciel. (Dalaï Lama)",
                "Il n'y a point de pires sourds que ceux qui ne veulent pas entendre. (Molière)",
                "Il n'y a qu'une façon d'échouer, c'est d'abandonner avant d'avoir réussi ! (Olivier Lockert)",
                "Il ne faut pas attendre d'être parfait pour commencer quelque chose de bien. (Abbé Pierre)",
                "Il ne faut pas se fier aux apparences. Beaucoup de gens n'ont pas l'air aussi bêtes qu'ils ne le sont réellement. (Oscar Wilde)",
                "Il paraît que l'inventeur de la cédille est un certain Groçon. (Philippe Geluck)",
                "Il paraît que les efforts sont payants ! J'avais déjà du mal à en faire ! (Anonyme)",
                "Il paraît que même à Monaco les rues ne sont plus sûres. Les milliardaires n'osent plus sortir le soir... Il y a des millionnaires qui rôdent. (Philippe Geluck)",
                "Il vaut mieux qu'il pleuve un jour comme aujourd'hui, plutôt qu'un jour où il fait beau. (Frédéric Dard)",
                "Il vaut mieux se tromper et le reconnaître que ne pas se tromper et le nier ! Je me trompe ? (Philippe Geluck)",
                "Il y a des choses qu'on a parfois peine à croire : le type qui a inventé le code de la route n'avait même pas son permis... (Philippe Geluck)",
                "Il y a malgré tout un avantage à tomber en panne sèche c'est que c'est moins lourd à pousser que si le réservoir était plein. (Philippe Geluck)",
                "Il y a un proverbe chinois qui ne dit rien. Il m'arrive de le citer quand je n'ai rien à dire... (Philippe Geluck)",
                "Ils ne savaient pas que c'était impossible, alors ils l'ont fait. (Mark Twain)",
                "J'adore les cacahuètes. Tu bois une bière et tu en as marre du goût. Alors tu manges des cacahuètes. Les cacahuètes c'est doux et salé, fort et tendre, comme une femme. Manger des cacahuètes, it's a really strong feeling. Et après tu as de nouveau envie de boire de la bière. Les cacahuètes c'est le mouvement perpétuel à la portée de l'homme. (Jean Claude Van Damme)",
                "J'adore parler de rien, c'est le seul domaine où j'ai de vagues connaissances (Oscar Wilde)",
                "J'ai compris que je devenais chauve quand ça me prenait de plus en plus de temps pour me laver le visage. (Harry Hill)",
                "J'ai vu un film tellement mauvais que les gens faisaient la queue pour sortir de la salle. (Robert Frost)",
                "J'aimerais terminer sur un message d'espoir. Je n'en ai pas. En échange, est-ce-que deux messages de désespoir vous iraient ?. (Woody Allen)",
                "Je fais deux régimes en même temps, parce qu'avec un seul, j'avais pas assez à manger. (Coluche)",
                "Je n'ai jamais admiré le courage des dompteurs. Dans une cage, ils sont à l'abri des hommes ! (Georges Bernard Shaw)",
                "Je ne connais absolument rien à la musique, mais dans mon domaine ce n'est pas nécessaire. (Elvis Presley)",
                "Je pense sincèrement que la pollution de la planète ce n'est pas aussi grave qu'on le dit... C'est beaucoup plus grave qu'on le dit. (Philippe Geluck)",
                "Je vous raconterais bien une connerie mais vraiment il y en a plein les journaux. (Coluche)",
                "L'amitié, c'est ce qui vient au coeur quant on fait ensemble des choses belles et difficiles. (Abbé Pierre)",
                "L'amour c'est un sport. Surtout s'l y en a un des deux qui ne veut pas. (Jean Yanne)",
                "L'an dernier j'étais encore un peu prétentieux, cette année je suis parfait. (Frédéric Dard)",
                "L'histoire me sera indulgente, car j'ai l'intention de l'écrire. (Winston Churchill)",
                "L'homme est le seul animal qui rougisse ; c'est d'ailleurs le seul animal qui ait à rougir de quelque chose. (Georges Bernard Shaw)",
                "L'homme qui ne tente rien ne se trompe qu'une fois. (Lao-Tseu)",
                "L'humanité serait depuis longtemps heureuse si les hommes mettaient tout leur génie non à réparer leurs bêtises, mais à ne pas les commettre. (Georges Bernard Shaw)",
                "L'intelligence a été inventée il y a très longtemps par un type vachement malin. La connerie, c'est autre chose, c'est une création collective. (Philippe Geluck)",
                "L'inventeur de l'escalier habitait sûrement au premier étage. (Philippe Geluck)",
                "La beauté est dans les yeux de celui qui regarde. (Oscar Wilde)",
                "La chance existe. Sinon, comment expliquerait-on la réussite des autres? (Marcel Achard)",
                "La lecture est un stratagème qui dispense de réfléchir. (Georges Bernard Shaw)",
                "La méchanceté et la grossièreté sont les armes de la simplicité. (Coluche)",
                "La meilleure manière de prendre les choses du bon côté, c'est d'attendre qu'elles se retournent. (P. Ouanich)",
                "La merde a de l'avenir. Vous verrez qu'un jour on en fera des discours. (Louis-Ferdinand Céline)",
                "La météo est une science qui permet de connaître le temps qu'il aurait dû faire. (Bouvard)",
                "La mode des cocktails avant les repas a été lancée par un cuisinier qui avait brûlé le rôti. (Chester Anthony)",
                "La modestie, c'est espérer que les autres découvrent enfin à quel point vous êtes formidable. (Aldo Cammarota)",
                "La mort, c'est un peu comme la connerie. Le mort, lui, il ne sait pas qu'il est mort, ce sont les autres qui sont tristes. Le con c'est pareil. (Philippe Geluck)",
                "La nature fait les choses sans se presser, et pourtant tout est accompli. (Lao-Tseu)",
                "La première partie de notre vie est gâchée par nos parents, et la seconde par nos enfants. (Clarence Darrow)",
                "La preuve que la Terre est ronde, c'est que les gens qui ont les pieds plats ont du mal à marcher. (Charles Bernard)",
                "La principale différence entre le boucher et le banquier c'est qu'il y en a un des deux qui ne dira jamais : \"Il y en a un peu plus, je vous le mets ?\" (Philippe Geluck)",
                "La sagesse, c'est d'avoir des rêves suffisamment grands pour ne pas les perdre de vue lorsqu'on les poursuit. (Oscar Wilde)",
                "La seule chose que la politesse peut nous faire perdre c'est, de temps en temps, un siège dans un autobus bondé. (Oscar Wilde)",
                "La solitude est un plat qui se mange seul. (Achille Chavée)",
                "La vérité de demain se nourrit de l'erreur d'hier. (Antoine de Saint-Exupéry)",
                "La vie est une maladie mortelle sexuellement transmissible. (Woody Allen)",
                "La violence à la télévision, ça donne envie de tout casser. Sauf, hélas, la télévision. (Philippe Geluck)",
                "La violence, sous quelque forme qu'elle se manifeste, est un échec. (Jean-Paul Sartre)",
                "La visite fait toujours plaisir ; Si ce n'est en arrivant, c'est en partant. (Anonyme)",
                "La vraie connaissance est de connaître l'étendue de son ignorance. (Confucius)",
                "La vraie faute est celle qu'on ne corrige pas. (Confucius)",
                "Le chaînon manquant entre le singe et l'homme c'est nous. (Frédéric Dard)",
                "Le champignon le plus vénéneux, c'est celui qu'on trouve dans les voitures. (Coluche)",
                "Le chemin le plus court d'un point à un autre est la ligne droite, à condition que les deux points soient bien en face l'un de l'autre. (Frédéric Dard)",
                "Le ciel et le cul, les deux grands leviers. (Emile Zola)",
                "Le comble de l'optimisme, c'est de rentrer dans un grand restaurant et compter sur la perle qu'on trouvera dans une huître pour payer la note. (Tristan Bernard)",
                "Le commencement est beaucoup plus que la moitié de l'objectif. (Aristote)",
                "Le contraire de la misère ce n'est pas la richesse. Le contraire de la misère, c'est le partage. (Abbé Pierre)",
                "Le contraire du rire, ce n'est pas le sérieux, c'est la réalité. (Georg Wilhelm Friedrich Hegel)",
                "Le coup du lapin ça doit être terrible chez la girafe. (Philippe Geluck)",
                "Le courage est le juste milieu entre la peur et l'audace. (Aristote)",
                "Le divertissement est le meilleur régime contre le poids de l'existence (Franck Dhumes)",
                "Le doute est le commencement de la sagesse. (Aristote)",
                "Le ping-pong, c'est comme le tennis sauf qu'au tennis , les mecs ils sont debout sur la table. (Coluche)",
                "Le pire con, c'est le vieux con, on ne peut rien contre l'expérience. (Jacob Braude)",
                "Le rôle de tout être humain, c'est de faire la preuve que le monde n'est pas sans raison. (Abbé Pierre)",
                "Le succès n'est pas final L'echec n'est pas fatal C'est le courage de continuer qui compte. (Winston Churchill)",
                "Le temps est le plus sage de tous les conseillers. (Plutarque)",
                "Le temps mène la vie dure à ceux qui veulent le tuer. (Jacques Prévert)",
                "Le temps qui nous reste à vivre est plus important que toutes les années écoulées. (Léon Tolstoï)",
                "Le travail c'est bien une maladie, puisqu'il y a une médecine du travail. (Coluche)",
                "Le travail le plus fatigant n'est pas celui que l'on fait, mais celui qui nous reste à faire. (Jean Brassard)",
                "Le travail, c'est le refuge des gens qui n'ont rien de mieux à faire. (Oscar Wilde)",
                "Les conneries c'est comme les impôts , tu finis toujours par les payer (Anonyme)",
                "Les enfants c'est comme les pets, on supporte surtout les siens. (Frédéric Dard)",
                "Les ennuis, c'est comme le papier hygiénique, on en tire un, il en vient dix. (Woody Allen)",
                "Les étrangers qui habitent tout près de la frontière sont un peu moins étrangers que les autres. (Philippe Geluck)",
                "Les gagnants trouvent des moyens, les perdants des excuses. (Franklin D. Roosevelt)",
                "Les hommes sont toujours sincères. Ils changent de sincérité voilà tout. (Tristant Bernard)",
                "Les jeunes sont toujours prêts à donner à leurs aînés le bénéfice de leur inexpérience. (Oscar Wilde)",
                "Les miroirs feraient bien de réfléchir avant de renvoyer les images. (Jean Cocteau)",
                "Les personnes âgées croient tout, les adultes doutent de tout et les jeunes savent tout. (Oscar Wilde)",
                "Lorsque la vie te fait plonger dans une mer de larmes, tu as le choix : te noyer ou apprendre à nager. (Michel Dechamplain)",
                "Mieux vaut réaliser son souhait que souhaiter l'avoir fait. (Woody Allen)",
                "Moi au moins je ne mache pas mes mots, sauf les mots \"chewing-gum\" et \"steack coriace\". (Philippe Geluck)",
                "On n'est jamais heureux que dans le bonheur qu'on donne. Donner, c'est recevoir. (Abbé Pierre)",
                "On ne m’enlèvera pas de l’idée que la connerie est une forme d’intelligence. (Coluche)",
                "On ne peut pas dire la vérité à la télé : il y a trop de monde qui regarde. (Coluche)",
                "On regrette rarement d'avoir osé, mais toujours de ne pas avoir essayer. (Serge Lafrance)",
                "Pardonne toujours à tes ennemis - Il n'est rien qui puisse les contrarier autant. (Oscar Wilde)",
                "Paresse : habitude prise de se reposer avant la fatigue. (Jules Renard)",
                "Passer pour un idiot aux yeux d'un imbécile est une volupté de fin gourmet. (Georges Courteline)",
                "Plus j'aurai l'air con, et plus ce que je dirai aura l'air malin. (Philippe Geluck)",
                "Pour être le meilleur, il suffit parfois que les autres soient moins bons. (Philippe Geluck)",
                "Pourquoi essayer de faire semblant d'avoir l'air de travailler ? C'est de la fatigue inutile ! (Frédéric Dard)",
                "Quand les gens sont de mon avis, j'ai toujours le sentiment de m'être trompé. (Oscar Wilde)",
                "Quand on ne peut revenir en arrière, on ne doit se préoccuper que de la meilleure façon d'aller de l'avant. (Paulo Coelho)",
                "Quand on ne sait pas où l'on va, tous les chemins mènent nulle part. (Henry Kissinger)",
                "Quand on voit ce qu'on voit, que l'on entend ce qu'on entend et que l'on sait ce que qu'on sait, on a raison de penser ce qu'on pense. (Frédéric Dard)",
                "Quand tu prends confiance en la confiance, tu deviens confiant. (Jean Claude Van Damme)",
                "Quand, durant tout un jour, il est tombé de la pluie, de la neige, de la grêle et du verglas, on est tranquille. Parce que, à part ça, qu'est-ce que vous voulez qu'il tombe ? ... Oui, je sais, mais enfin, c'est rare... (Frédéric Dard)",
                "Quelle belle chose la jeunesse! Quel crime de la laisser gâcher par les jeunes. (Georges Bernard Shaw)",
                "Rien n'est plus agaçant que de ne pas se rappeler ce dont on ne parvient pas à se souvenir et rien n'est plus énervant que de se souvenir de ce qu'on voudrait parvenir à oublier. (Frédéric Dard)",
                "S'aimer soi-même est le début d'une histoire d'amour qui durera toute une vie. (Oscar Wilde)",
                "S'endormir au volant, c'est très dangereux. S'endormir à vélo, c'est très rare. S'endormir à pied, c'est très con. (Philippe Geluck)",
                "S'il ne vous reste qu'un jour à vivre, allez faire un tour au bureau de poste le plus proche, ça passera moins vite. (Pat Foley)",
                "Se rebeller est juste, désobéir est un devoir, agir est nécessaire ! (Oscar Wilde)",
                "Secret : Information que l’on ne communique qu’à une seule personne à la fois. (Anonyme)",
                "Selon les statistiques il y a une personne sur cinq qui est déséquilibré. S'il y a quatre personnes autour de toi et qu'elles te semblent normales, c'est pas bon. (Jean Claude Van Damme)",
                "Si ceux qui disent du mal de moi savaient exactement ce que je pense d'eux, ils en diraient bien davantage. (Sacha Guitry)",
                "Si l'on veut gagner sa vie, il suffit de travailler. Mais si l'on veut devenir riche, il faut trouver autre chose. (Alphonse Karr)",
                "Si la méchanceté n'existait pas, il n'y aurait aucun mérite à être gentil. (Philippe Geluck)",
                "Si on ne peut pas fumer au paradis, je ne suis pas intéressé. (Mark Twain)",
                "Si tu dors et que tu rêves que tu dors, il faut que tu te réveilles deux fois pour te lever. (Jean Claude Van Damme)",
                "Si tu empruntes le chemin de la vengeance, prépare deux cercueils. (Confucius)",
                "Si tu téléphones à une voyante et qu'elle ne décroche pas avant que ça sonne, raccroche ! (Jean Claude Van Damme)",
                "Si voter changeait quelque chose, il y a longtemps que ça serait interdit. (Coluche)",
                "Si vous avez compris tout ce que je viens de vous dire, c'est que j'ai dû faire une erreur quelque part. (Alan Greenspan)",
                "Si vous voulez vivre une vie heureuse, attachez-la à un but, non pas à des personnes ou des choses. (Albert Einstein)",
                "Tout est drôle, dès l'instant que ça arrive aux autres. (Marcel Achard)",
                "Toute vérité n'est pas bonne à croire. (Pierre-Augustin Caron de Beaumarchais)",
                "Un bon mari ne se souvient jamais de l'âge de sa femme mais de son anniversaire, toujours. (Jacques Audiberti)",
                "Un égoïste c'est quelqu'un qui ne pense pas à moi. (Rabab)",
                "Un groupe de loups, c'est une horde. Un groupe de vaches, c'est un troupeau. Un groupe d'hommes, c'est souvent une bande de cons. (Philippe Geluck)",
                "Un sourire coûte moins cher que l'électricité, mais donne autant de lumière. (Abbé Pierre)",
                "Un type qui se trouve pile sur le pôle Nord, dans n'importe quelle direction qu'il reparte, il ira forcément vers le Sud, c'est dingue ! (Philippe Geluck)",
                "Un voyage de mille lieues commence par un pas. (Lao-Tseu)",
                "Une personne ayant un père casse-pied n’a pas forcément une mère Caspienne. (Marc Escayrol)",
                "Une seule hirondelle ne fait pas le printemps ; un seul acte moral ne fait pas la vertu. (Aristote)",
                "Vivre est la chose la plus rare. La plupart des gens se contente d'exister. (Oscar Wilde)",
                "Vouloir être de son temps, c'est déjà être dépassé. (Eugène Ionesco)",
                "Vous n'êtes pas responsable de la tête que vous avez mais vous êtes responsable de la gueule que vous faites. (Coluche)",
                "Vous pouvez vous construire un trône avec des baïonnettes, mais vous ne resterez pas assis longtemps dessus. (Boris Eltsine)",
                "Tout homme qui dirige, qui fait quelque chose, a contre lui ceux qui voudraient faire la même chose, ceux qui font précisément le contraire, et surtout la grande armée des gens d'autant plus sévères qu'ils ne font rien du tout. (Jules Claretie)",
                "On a toujours tort d'essayer d'avoir raison devant des gens qui ont toutes les bonnes raisons de croire qu'ils n'ont pas tort ! (Raymond Devos)",
                "La grippe, ça dure huit jours si on la soigne et une semaine si on ne fait rien. (Raymond Devos)",
                "Mon pied droit est jaloux de mon pied gauche. Quand l'un avance, l'autre veut le dépasser. Et moi, comme un imbécile, je marche ! (Raymond Devos)",
                "Monsieur, ce que j'admire en vous, c'est que vous avez le courage d'être vous-même ; avec tout ce que cela comporte de ridicule ! (Raymond Devos)",
                "Si tu étais plus belle, je me serais déjà lassé. Tandis que là, je ne m'y suis pas encore habitué ! (Raymond Devos)",
                "Quand on s'est connus, ma femme et moi, on était tellement timides tous les deux qu'on n'osait pas se regarder. Maintenant, on ne peut plus se voir ! (Raymond Devos)",
                "Quand j'ai tort, j'ai mes raisons, que je ne donne pas. Ce serait reconnaître mes torts ! (Raymond Devos)",
                "Je crois à l'immortalité et pourtant je crains bien de mourir avant de la connaître. (Raymond Devos)",
                "Une rengaine, c'est un air qui commence par vous entrer par une oreille et qui finit par vous sortir par les yeux. (Raymond Devos)",
                "Si ma femme doit être veuve un jour, j'aimerais mieux que ce soit de mon vivant. (Raymond Devos)",
                "Il ne faudrait pas croire que les responsables d'hier étaient plus ignorants de la situation que ne le sont ceux d'aujourd'hui ! (Raymond Devos)",
                "La différence entre l'amour et l'argent, c'est que si on partage son argent, il diminue, tandis que si on partage son amour, il augmente. L'idéal étant d'arriver à partager son amour avec quelqu'un qui a du pognon. (Philippe Geluck)",
                "Dieu a tout créé. Dieu a créé le racisme. Mais Dieu a aussi créé l'antiracisme. Avec tout le respect que je lui dois, Dieu est un sacré fouteur de merde. (Philippe Geluck)",
                "Terrorisme, missile ou pollution sont des plus gros mots que caca, merde ou prout. (Philippe Geluck)",
                "Si la méchanceté n'existait pas, il n'y aurait aucun mérite à être gentil. (Philippe Geluck)",
                "Les imbéciles pensent que tous les noirs se ressemblent. Je connais un noir qui trouve, lui, que tous les imbéciles se ressemblent. (Philippe Geluck)",
                "Au fond, est-ce que ranger ça ne revient pas un peu à foutre le bordel dans son désordre ? (Philippe Geluck)",
                "Si on payait mieux les bénévoles, ça donnerait peut-être envie à plus de gens de travailler gratuitement. (Philippe Geluck)",
                "Avec le temps qui passe ceux qui étaient con le restent et ceux qui ne l'étaient pas le deviennent. (Philippe Geluck)",
                "Si je devais me suicider un jour, je me pendrais à un noyer, ce serait mon dernier jeu de mot. (Philippe Geluck)",
                "Un joueur d'échecs c'est comme de la peinture, s'il n'est pas brillant il est mat. (Philippe Geluck)",
                "Il y a des gens qui arrivent à écrire leur nom dans la neige en faisant pipi... parmi eux il y a cependant davantage de Luc et de Jo que de Jean-Sébastien ! (Philippe Geluck)",
                "Si les lentilles vous font péter, portez des lunettes. (Philippe Geluck)",
                "Peut-on rire du malheur des autres ? Ca dépend... Si le malheur des autres est rigolo, oui. (Philippe Geluck)",
                "La différence entre la chasse et la guerre, c'est qu'à la chasse on ne fait pas de prisonniers. (Philippe Geluck)",
                "Se rendre compte qu'on est un imbécile est un signe d'intelligence. (Philippe Geluck)",
                "Il y a des gens qui arrivent à joindre l'inutile au désagréable. (Philippe Geluck)",
                "Le chemin le plus court d'un point à un autre c'est de ne pas y aller. (Philippe Geluck)",
                "Le lancement du poids, c'est la pétanque des costauds. (Philippe Geluck)",
                "Si tu donnes à quelqu'un un poisson que tu as volé, il mangera une fois. Si tu lui apprends à voler, il mangera toute sa vie. (Philippe Geluck)",
                "La spéléologie, c'est l'alpinisme de ceux qui ont le vertige. (Philippe Geluck)",
                "J'essaye de noyer mon chagrin dans l'alcool mais depuis le temps... il appris à nager, mon chagrin. (Philippe Geluck)",
                "Au fond quand on y pense, un type qui doit être vachement frustré, c'est le type qui a réalisé le plancher de la chapelle Sixtine... (Philippe Geluck)",
                "J'ai une écharde dans le pouce, pourvu que ça ne s'infecte pas... je touche du bois ! (Philippe Geluck)",
                "Les animaux se lavent en se léchant. Sauf les hérissons et les oursins. (Philippe Geluck)",
                "Les jeunes, c'est tous des bons-à-rien . Et ça devient pire avec l'âge. (Philippe Geluck)",
                "Je suis tout prêt à croire en Dieu. Mais je pense que Dieu n'est pas tout-à-fait prêt à croire en moi. (Philippe Geluck)",
                "On dit qu'on apprend avec ses erreurs, mais à mon avis c'est une erreur... et si je me trompe au moins j'aurais appris quelque chose ! (Philippe Geluck)",
                "Plus mon cigare raccourcit, et plus je dois tendre le bras vers le cendrier. Un patron aussi a ses soucis. (Philippe Geluck)",
                "Meilleurs voeux pour toute la vie, comme ça, c'est fait une fois pour toutes. (Philippe Geluck)",
                "Un type qui se trompe en disant quelche chose de faux dit peut-être quelque chose de vrai. (Philippe Geluck)",
                "La recherche a besoin d'argent dans deux domaines prioritaires : le cancer et les missiles antimissiles. Pour les missiles antimissiles, il y a les impôts. Pour le cancer, on fait la quête. (Pierre Desproges)",
                "L'intelligence, c'est comme les parachutes, quand on n'en a pas, on s'écrase. (Pierre Desproges)",
                "J'aime bien les histoires qui finissent mal. Ce sont les plus belles car ce sont celles qui ressemblent le plus à la vie. (Pierre Desproges)",
                "Il ne faut pas désespérer des imbéciles. Avec un peu d'entraînement, on peut arriver à en faire des militaires. (Pierre Desproges)",
                "Je ne suis pas raciste, mais il faut bien voir les choses en face : les enfants ne sont pas des gens comme nous. (Pierre Desproges)",
                "Au Paradis, on est assis à la droite de Dieu : c'est normal, c'est la place du mort. (Pierre Desproges)",
                "L'homme de science le sait bien, lui, que seule la science, a pu, au fil des siècles, lui apporter l'horloge pointeuse et le parcmètre automatique sans lesquels il n'est pas de bonheur terrestre possible. (Pierre Desproges)",
                "Ce n'est pas parce que l'homme a soif d'amour qu'il doit se jeter sur la première gourde. (Pierre Desproges)",
                "Il n'y a que deux sortes de chauffeurs de taxis : ceux qui puent le tabac, et ceux qui vous empêchent de fumer. (Pierre Desproges)",
                "Je suis trop conscient de la vanité de l'existence pour avoir un plan de carrière ou de l'ambition. (Pierre Desproges)",
                "Il ne suffit pas d'être heureux. Encore faut-il que les autres soient malheureux. (Pierre Desproges)"

            ],

            ASTUCES: [
                `Si vous avez besoin d'aide ou que vous êtes perdus, lancez la commande \`!aide\``,
                `Lorsque vous créez un salon vocal, vous (et vous seul) pouvez modifier son nom. Faite un clic droit sur le salon puis "Modifier le salon".`,
                `Si vous jouez à un jeu lorsque vous créez un salon vocal, le salon sera nommé avec le nom du jeu.`,
                `Votre jeu préféré n'a pas encore sa place sur le Discord ? Proposez le ! Vous aurez ainsi une section dédiée pour partager des informations.`,
                `Vous pouvez m'envoyer vos commandes par message privé, comme ça, ça restera entre nous !`,
                `Si le salon "+ Créer salon" est absent ou inacessible, lancez la commande **!vocal** pour en créer un autre`,
                ``
            ],

            COM_USERS_INITMESSLOGS_RESULT: (messageCount) => {
                return `${messageCount} messages loggués dans la base`;
            },







            MOTD_TITRE: "Bonne journée à tous sur Casual Effect",
            MOTD_BONJOUR: [
                "Bonjour à tous, je vous souhaite une bonne journée.",
                "Je vous souhaite à toutes et à tous une excellente journée.",
                "Bonne journée à vous.",
                "Je vous souhaite de passer une excellente journée",
                "Je sens que ça va être une bonne journée, pas vous ?",
                "Ah une nouvelle journée qui commence ! J'espère que ce sera une bonne journée pour vous.",
                "Une bien belle journée qui s'annonce..."
            ],
            MOTD_ASTUCE: ":grey_question:  **Le saviez-vous ?**",
            MOTD_CITATION: ":bulb: **Citation du jour**",

            MESSAGES_SERVER_JOIN_OLD: (member) => {
                let textes = [
                    `Z'ai cru voir passer un ro**${member.displayName}**minet !`,
                    `Ah ! **${member.displayName}** nous a enfin rejoint ! Nous n'attendions plus que lui...`,
                    `Tel qu'annoncé par la prophétie, **${member.displayName}** est apparu !`,
                    `Oh my Bot ! **${member.displayName}** à rejoint le discord !`,
                    `**${member.displayName}** est le 999.999ème visiteur de ce Discord ! Dommage, il aurait pu gagner un pin's...`,
                    `**${member.displayName}** nous arrive tout droit... du néant !?!?`,
                    `Et bah voilà, c'est malin, maintenant y'a **${member.displayName}** qui nous a rejoint`,
                    `Chut, chut, chut ! Arrêtez vos conneries **${member.displayName}** vient de rejoindre le discord`,
                    `AAAAaah ! J'ai eu peur ! Mais non c'est juste **${member.displayName}** qui à rejoint le discord... on a eu chaud !`,
                    `Le petit **${member.displayName}** à été retrouvé seul dans le salon 'accueil' merci de venir le chercher`,
                    `Bon alors pour ton premier jour **${member.displayName}** ce sera corvée de chiottes !`,
                    `**${member.displayName}** vient d'arrriver. Ne bougez surtout pas! Sa vision est basée sur le mouvement...`,
                    `Et puis t'as des mecs comme **${member.displayName}** qui débarquent, comme ça, sans prévenir...`,
                    `Attention **${member.displayName}** vient d'arriver sur le discord. Je suis prêt à parier qu'il aime tuer des gens`,
                    `Quelqu'un à laissé la porte ouverte et **${member.displayName}** est rentré !`
                ]
                return textes.random();
            },
            MESSAGES_SERVER_JOIN_OLD2: (member) => {
                let textes = [
                    `Nous avons un certain **${member.displayName}** à la porte.`,
                    `Nous avons un visiteur, un certain **${member.displayName}**.`,
                    `Nous avons un nouveau visiteur, un certain **${member.displayName}**.`,
                    `Nous avons de la visite, un certain **${member.displayName}** est à la porte.`,
                    `Je vais ouvrir. Un certain **${member.displayName}** vient de toquer à la porte.`,
                    `Je vais ouvrir. Nous avons un certain **${member.displayName}** qui vient de toquer à la porte.`,
                    `Je vais ouvrir. Nous avons un visiteur, un certain **${member.displayName}**.`,
                    `Je vais ouvrir. Nous avons un nouveau visiteur, un certain **${member.displayName}**.`,
                    `Il me semble avoir entendu toquer à la porte... Ah oui, un certain **${member.displayName}** est là.`,
                    `Il me semble avoir entendu toquer à la porte... Ah oui, nous avons un certain **${member.displayName}**.`,
                    `Il me semble avoir entendu toquer à la porte... Ah oui, nous avons un visiteur, un certain **${member.displayName}**.`,
                    `**${member.displayName}** a rejoint le serveur.`
                ]
                return textes.random();
            },
            MESSAGES_SERVER_JOIN: (member) => {
                return `Monsieur, nous avons un visiteur, un certain **${member.displayName}** est à la porte.`;
            },
            MESSAGES_SERVER_QUIT: (user) => {
                let textes = [
                    `Adieu <@${user.id}> tu vas nous manquer... ou pas !`,
                    `RIP <@${user.id}> petit Ange parti trop tôt`,
                    `Ah Enfin ! On est débarrassé de <@${user.id}>`,
                    `Ah bah voilà ! Vous avez fait peur à <@${user.id}> et il est parti !`,
                    `T'as raison <@${user.id}> ! Casse-toi ! Et qu'on ne te revoit plus jamais par ici`,
                    `T'as les vrais, et puis t'as les mecs comme <@${user.id}> qui se barrent sans rien dire.`
                ]
                return textes.random();
            },
            MESSAGES_SERVER_KICK: (user, userBy, raison) => {
                return `<@${user.id}> à été expulsé du serveur par <@${userBy.id}>
                
                **Raison**: ${raison}`;
            },
            MESSAGES_SERVER_BAN: (user, userBy, raison) => {
                return `<@${user.id}> à été banni du serveur par <@${userBy.id}>
                
                **Raison**: ${raison}`;
            },
            MESSAGES_NEW_MEMBER: (member) => {
                let textes = [
                    `${member.displayName} a passé son épreuve d'initiation avec succès et fait désormais partie de Casual Effect`,
                    `${member.displayName} a été intronisé (ça ne fait pas mal) et fait désormais partie de Casual Effect`
                ]
                return textes.random();
            },
            WELCOME: (name) => {
                let textes = [
                    `Z'ai cru voir passer un ro${name}minet !`,
                    `Ah ! ${name} nous a enfin rejoint ! Nous n'attendions plus que lui...`
                ]
                return textes.random();

            },
            MESSAGES_AUREVOIR: [],

            VOICE_NEW_VOICE_CHANNEL: "🔊 Salon vocal",

            USER_MESSAGE_ACCUEIL_TITRE: "Bienvenue sur Casual Effect",
            USER_MESSAGE_ACCUEIL_DESCRIPTION: (member) => {
                return `Bonjour ${member.toString()}, je vous souhaite la bienvenue sur le discord Casual Effect
                Je suis Alfred, le majordome de ce discord. Mon rôle est de vous assister sur ce serveur et de rendre votre séjour parmi nous plus agréable.

                Cet endroit peut vous sembler un peu vide, c’est normal. Pour le moment, vous n’avez accès qu’à cette section. Avant de pouvoir accéder au reste, Il vous faut l’approbation de mes patrons.

                Je vous invite à vous présenter pour nous dire ce qui vous amène ici. Si vous avez été invité par un membre, précisez le, ça peut avoir son importance.

                Les personnes susceptibles (et elles le sont croyez moi!) de vous accueillir sont <@!186143653008244746> <@!157584976525656064> <@!193822534196658176> et <@!291545597205544971>. Ils prendront contact avec vous pour un petit entretien vocal. Il vous présenteront cette communauté et le discord, sûrement mieux que je ne saurais le faire. Notez qu’ils ne sont pas toujours disponibles, il semblerait qu’ils aient d’autres activités ailleurs qu’ici, soyez un peu patient.                                
                
                Si vous ne savez pas où vous êtes ou ce que vous faites ici, je vous invite à consulter [notre site](https://www.casual-effect.org/) pour en savoir plus sur ce qu'on fait ici.`;
            },
            USER_MESSAGE_ACCUEIL_DESCRIPTION_AGAIN: (member) => {
                return `Bonjour ${member.toString()}, je vous souhaite un bon retour parmi nous.
                
                Que nous vaut le plaisir de votre visite ?`;
            },




            USER_KICK_CHECK_BEFORE: (member) => {
                return `Êtes vous certain de vouloir expulser **${member.displayName}** du serveur ?`;
            },
            USER_KICK_NOTIFICATION_TO_USER: (memberBy, raison) => {
                return `Vous avez été expulsé du discord Casual Effect par ${memberBy.displayName} pour la raison suivante:\n${raison}`;
            },
            USER_KICK_CHECK_SUCCESS: (member) => {
                return `Le membre **${member.displayName}** à été explusé du serveur avec succès.`;
            },

            USER_BAN_CHECK_BEFORE: (member) => {
                return `Êtes vous certain de vouloir bannir **${member.displayName}** du serveur ?`;
            },
            USER_BAN_NOTIFICATION_TO_USER: (memberBy, raison) => {
                return `Vous avez été banni du discord Casual Effect par ${memberBy.displayName} pour la raison:\n${raison}`;
            },
            USER_BAN_CHECK_SUCCESS: (member) => {
                return `Le membre **${member.displayName}** à été banni du serveur avec succès.`;
            },

            USER_ERROR_NOT_A_MEMBER: (memberDisplayName) => {
                return `Le membre **${memberDisplayName}** n'est plus sur le serveur.`;
            },
            USER_ERROR_NOT_KICKABLE: (memberDisplayName) => {
                return `Le membre **${memberDisplayName}** ne peut pas être expulsé.`;
            },
            USER_ERROR_NOT_BANABLE: (memberDisplayName) => {
                return `Le membre **${memberDisplayName}** ne peut pas être banni.`;
            },

            USER_ERROR_MEMBERID_NOT_FOUND: (memberID) => {
                return `Aucun membre trouvé avec l'ID **${memberID}** sur le serveur.`;
            },




            USERDATA_USERBOARD_TITLE: `Informations utilsateurs`,

            MEMBERS_LIST_DESCRIPTION_CONTENT: `Afficher la liste des membres`,
            MEMBERS_LIST_DESCRIPTION_USAGE: `Lancez cette commande sans paramètre pour obtenir la liste des membres
            Syntaxe: \`!member-list`,

            MEMBER_NEW_MEMBER_NOTIFICATION: (member) => {
                return `**${member.displayName}** à été accepté en tant que membre de Casual Effect`;
            },

            MEMBER_MESSAGE_ACCUEIL_TITRE: (member) => {
                return `Nouveau membre ${member.displayName}`;
            },
            MEMBER_MESSAGE_ACCUEIL_DESCRIPTION: (member) => {
                return `Félicitations ${member.toString()}, tout le monde ne réussi pas le test !

                Vous avez désormais accès à l'ensemble des salons du discord. Si vous souhaitez une visite guidée, allez voir <#698424583908360223> nous ferons le tour du propriétaire.
                
                J'ai des pouvoirs divinatoires, vous verrez, et mon petit doigt me dit que vous êtes ici pour jouer. Je vous invite à aller dans le salon <#601792379644805140> pour rejoindre les groupes de jeux.

                Je vous souhaite de bien vous amuser sur Casual Effect !`;
            },
            MEMBER_INIT_LOGS_MEMBER_SUCCESS: (member) => {
                return `Logs  pour **${member.displayName}** réinitialisés avec succès`;
            },
            MEMBER_INIT_LOGS_MEMBER_NOTFOUND: (memberID) => {
                return `**${memberID}** n'est plus sur le serveur. Traitement manuel`;
            },

            // EXPERIENCE
            EXP_MESSAGE_INFORMATIONS_TITRE: "Expérience et niveau sur Casual Effect",
            EXP_MESSAGE_INFORMATIONS_DESCRIPTION: (member) => {
                return `Bonjour ${member.displayName},
                
                En tant que membre de Casual Effect, votre participation sur le discord vous rapporte de l'expérience qui vous permet de progresser en niveau.
                Vous débutez au niveau 1 et vous progresserez de niveau en niveau grâce au points d'expérience gagnés.

                Vous gagnez de l'expérience lorsque vous:
                - êtes connecté dans un salon vocal
                - jouez à un jeu du serveur
                - postez des messages
                - réagissez ou recevez des réactions à vos messages

                Je vous souhaite de bien vous amuser sur Casual Effect !`;
            },
            EXP_MESSAGE_LEVELUP_TITRE: "Niveau supérieur !",
            EXP_MESSAGE_LEVELUP_DESCRIPTION: (member, level) => {
                return `Félicitations ${member.displayName}, vous avez atteint le niveau ${level}`;
            },
            EXP_MESSAGE_LEVELUP_COMMENTAIRE: (member, level) => {
                let msg = {
                    2: [
                        `Bravo ! c'est un bon début !`,
                        `C'était facile, hein ?`,
                        `Et c'est parti mon kiki !`,
                        `Vers l'infini et plus encore ! Hein, quoi ?`
                    ]
                }

                return `${member.displayName} à rejoint Casual Effect !`;
            },

            EXP_CMD_REINIT_DESCRIPTION_CONTENT: `Réinitialisation de l'expérience`,
            EXP_CMD_REINIT_DESCRIPTION_USAGE: `La commande se lance sans paramètre: \`!expreinit\`
            
            Attention: Cette commande réinitialise l'expérience de tous les membres du discord.`,

            EXP_CMD_REINIT_SUCCESS: (number) => {
                return `L'expérience à été remise à zéro pour ${number} membres`;
            },
            EXP_CMD_ADD_DESCRIPTION_CONTENT: `Ajouter de l'expérience à un membre`,
            EXP_CMD_ADD_DESCRIPTION_USAGE: `La commande se lance sans paramètre: \`!expadd\`
            Elle peut aussi se lancer en spécifiant les paramètres: \`!expadd <ID membre> <montant exp>\``,
            EXP_CMD_ADD_XPAMOUNT_PROMPT: `Quel est le montant d'expérience à ajouter ?`,
            EXP_CMD_ADD_XPAMOUNT_RETRY: `Veuillez spécifier un nombre. Quel est le montant d'expérience à ajouter ?`,
            EXP_CMD_ADD_SUCCESS: (userdata, xpamount) => {
                return `${xpamount} points d'expérience ont été ajoutés ${userdata.displayName}. Il a désormais ${userdata.xp} points d'expérience et il est level ${userdata.level}`;
            },

            EXP_CMD_SETCOEF_DESCRIPTION_CONTENT: `Modifier le coefficient d'expérience ⚠️`,
            EXP_CMD_SETCOEF_DESCRIPTION_USAGE: `Commande de maintenance. 
            ⚠️ Ne pas utiliser à moins de savoir ce que vous faites ⚠️`,
            EXP_CMD_SETCOEF_COEF_PROMPT: `Quel est le nouveau coefficient d'expérience ?`,
            EXP_CMD_SETCOEF_COEF_RETRY: `Veuillez spécifier un nombre. Quel est le nouveau coefficient d'expérience ?`,
            EXP_CMD_SETCOEF_SUCCESS: (coef) => {
                return `Le nouveau coefficient d'expérience est de ${coef}`;
            },

            EXP_CMD_SET_DESCRIPTION_CONTENT: `Attribue un montant d'expérience à un membre`,
            EXP_CMD_SET_DESCRIPTION_USAGE: `La commande se lance sans paramètre: \`!expset\`
            Elle peut aussi se lancer en spécifiant les paramètres: \`!expset <ID membre> <montant exp>\``,
            EXP_CMD_SET_XPTOTAL_PROMPT: `Quel est le nouveau montant total d'expérience ?`,
            EXP_CMD_SET_XPTOTAL_RETRY: `Veuillez spécifier un nombre. Quel est le montant total d'expérience ?`,
            EXP_CMD_SET_SUCCESS: (userdata) => {
                return `${userdata.displayName} a désormais ${userdata.xp} points d'expérience et il est level ${userdata.level}`;
            },

            EXP_CMD_LVLSET_DESCRIPTION_CONTENT: `Attribue un level à un membre`,
            EXP_CMD_LVLSET_DESCRIPTION_USAGE: `La commande se lance sans paramètre: \`!explvlset\`
            Elle peut aussi se lancer en spécifiant les paramètres: \`!explvlset <ID membre> <level>\``,
            EXP_CMD_LVLSET_LEVEL_PROMPT: `Quel est le nouveau level pour ce membre ?`,
            EXP_CMD_LVLSET_LEVEL_RETRY: `Veuillez spécifier un nombre. Quel est le nouveau level pour ce membre ?`,
            EXP_CMD_LVLSET_SUCCESS: (userdata) => {
                return `${userdata.displayName} est désormais ${userdata.level} avec ${userdata.xp} points d'expérience`;
            },

            EXP_LOG_ADDXP: (member, xp, reason) => {
                return `${member.displayName} à gagné ${xp}xp (${reason})`;
            },
            EXP_LOG_LEVELUP: (member, level) => {
                return `Niveau supérieur pour ${member.displayName} qui est désormais level ${level}`;
            },

            // PLAY
            PLAY_LOG_YOUTUBE: (member, url, titre) => {
                return `${member.displayName} à lancé la lecture de ${titre} (${url})`;
            },
            // GAMES

            GAMES_LIST_UPDATED: "Liste des jeux mise à jour",
            GAMES_LIST_SUCCESS_CREATED: "Liste des jeux créée",
            GAMES_LIST_SUCCESS_UPDATED: "Liste des jeux mise à jour",
            GAMES_LIST_SUCCESS_DELETED: "Liste des jeux supprimée",
            GAMES_LIST_SUCCESS_LOADED: "Liste des jeux chargée",
            GAMES_LIST_WARN_NOTFOUND: "Liste des jeux non trouvée",
            GAMES_LISTLINK_SUCCESS_LOADED: "Liste des liens d'informations des jeux chargée",
            GAMES_LISTLINK_WARN_NOTFOUND: "Liste des liens d'informations des jeux non trouvée",
            GAMES_LISTLINK_SUCCESS_CREATED: "Liste des liens d'informations des jeux créée",
            GAMES_LISTLINK_SUCCESS_UPDATED: "Liste des liens d'informations des jeux mise à jour",
            GAMES_LISTLINK_SUCCESS_DELETED: "Liste des liens d'informations des jeux supprimée",
            GAMES_LIST_WARN_NOTFOUND_DELETION: "Liste des jeux non trouvée (suppression)",

            GAMES_SCORE_TITLE: "Activité des jeux",


            GAMES_CHANNEL_LINKED_TO_CATEGORY: (channel, category) => {
                return `Le salon ${channel.name} à été affecté à la catégorie ${category.name}`;
            },
            GAMES_CHANNEL_PERM_FOR_GROUP: (channel, group) => {
                return `Le permissions pour de ${group.name} ont été appliquées sur le salon ${channel.name}`;
            },
            GAMES_CHANNEL_CREATED: (channel) => {
                return `Le salon ${channel.name} à étét correctement créé`;
            },
            GAMES_ACTIVE_NOTIFICATION: (game, member, gameRole, joinChannel) => {
                return `Bonjour ${member.displayName},
                
                Je vois que vous jouez à ${game.name}.
                Saviez-vous qu'il y a un espace dédié à ${game.name} sur Casual Effect ?
                Je vous invite à vous rendre dans le salon ${joinChannel.toString()} et rejoignez les ${gameRole.members.size} joueurs qui y jouent.`;
            },
            GAMES_JOIN_SUCCESS: (jeu) => {
                let textes = [
                    `Félicitations ! Vous avez rejoint le groupe ${jeu}`,
                    `Vous faites désormais partie du groupe ${jeu}`,
                    `Amusez vous bien avec ${jeu}`
                ]
                return textes.random();
            },
            GAMES_JOIN_NOTIFICATION: (game, member) => {
                let textes = [
                    `${member.displayName} à rejoint le groupe ${game.name}`,
                    `${member.displayName} vient complèter les rangs du groupe ${game.name}`
                ]
                return textes.random();
            },
            GAMES_JOIN_INFORMATION_CHANNEL_NOTIFICATION: (game, channel, member) => {
                return `${member.toString()}\nVous trouverez toutes les informations utiles et nécessaires pour **${game.name}** dans le salon ${channel.toString()}.`;
            },
            GAMES_MEMBER_BLACKLISTED: "Vous n'avez pas l'autorisation d'utiliser la liste des jeux pour rejoindre ou quitter un groupe. Veuillez contacter un admin.",
            GAMES_QUIT_NOTIFICATION: (game, member) => {
                let textes = [
                    `${member.displayName} à quitté le groupe ${game.name}`,
                    `${member.displayName} vient de quitter le groupe ${game.name}`
                ]
                return textes.random();
            },
            GAMES_PURGE_NOTIFICATION: (game, member) => {
                return `${member.displayName} a été retiré du groupe car il est inactif sur ${game.name} depuis plus de ${game.nbDaysInactive} jours.`;
            },
            GAMES_PURGE_MEMBER_NOTIFICATION: (game) => {
                return `Vous avez été retiré du groupe **${game.name}** car vous êtes inactif sur ce jeu depuis plus de ${game.nbDaysInactive} jours.`;
            },
            GAMES_QUIT_SUCCESS: (jeu) => {
                let textes = [
                    `Vous avez quitté le groupe ${jeu}. Vous allez nous manquer!`,
                    `Vous ne faites désormais plus partie du groupe ${jeu}. J'espère vous revoir bientôt !`
                ]
                return textes.random();
            },
            GAMES_QUIT_CANCEL: (jeu) => {
                return `J'attendais une confirmation de votre part.\nAction annulée, il va falloir recommencer.`;
            },
            GAMES_JOIN_ALREADY_IN: (jeu) => {
                return `Vous êtes déjà dans le groupe ${jeu}.`;
            },
            GAMES_JOIN_WANT_TO_QUIT: (jeu) => {
                return `Vous êtes déjà dans le groupe ${jeu}.\n\n**Souhaitez vous le quitter ?** (oui/non)`;
            },
            GAMES_INFOSJEU_DESCRIPTION: (game, role) => {
                return `
                Ajouté le ${moment(game.createdAt).format('DD.MM.YYYY')}
                `;
            },

            GAMES_ADD_ERROR_GAME_ALREADY_EXIST: (gamename) => {
                return `Le jeu **${gamename}** est déjà enregistré dans la base`;
            },
            GAMES_ADD_ERROR_GAME_ALREADY_EXIST_ALIAS: (gamename, game) => {
                return `Le nom de jeu **${gamename}** est associé à un jeu déjà dans la base: **${game.name}**`;
            },
            GAMES_ADD_SUCCESS: (gamename) => {
                return `Le jeu **${gamename}** a correctement été ajouté à la base de données`;
            },




            GAMES_GAMEALIAS_ADD_DESCRIPTION_CONTENT: `Ajouter un alias à un jeu`,
            GAMES_GAMEALIAS_ADD_DESCRIPTION_USAGE: `Lancez la commande sans paramètre et laissez-vous guider
            
            Les jeux sont identifiés par leur nom. Un alias permet d'identifier un jeu par un nom plus court.`,
            GAMES_GAMEALIAS_ADD_GAME_PROMPT: `Pour quel **jeu** souhaitez vous ajouter un alias ?`,
            GAMES_GAMEALIAS_ADD_GAME_RETRY: `Ce jeu est inconnu ! Veuillez saisir un nom de jeu`,
            GAMES_GAMEALIAS_ADD_ALIAS_PROMPT: (game) => {
                return `Quel est **l'alias** pour le jeu **${game.name}** ?`;
            },
            GAMES_GAMEALIAS_ADD_ALIAS_RETRY: `Cet alias est déjà utilisé, veuillez en choisir un autre`,
            GAMES_GAMEALIAS_ADD_SUCCESS: (game, alias) => {
                return `L'alias **${alias}** à été ajouté pour le jeu **${game.name}** avec succès.`;
            },

            GAMES_GAME_ACTIVE_DESCRIPTION_CONTENT: `Activer un jeu`,
            GAMES_GAME_ACTIVE_DESCRIPTION_USAGE: `Description à écrire`,
            GAMES_GAME_ACTIVE_ERROR_GAME_ACTIVE: (game) => {
                return `Le jeu **${game.name}** est déjà actif`;
            },
            GAMES_GAME_ACTIVE_SUCCESS: (game) => {
                return `Le jeu  **${game.name}** à été activé.`;
            },
            GAMES_GAME_ACTIVE_STATE_TITLE: (game) => {
                return `Activation du jeu **${game.name}**`;
            },
            GAMES_GAME_ACTIVE_STATE_ROLE_CREATE_START: `**Rôle** ⏳ En cours `,
            GAMES_GAME_ACTIVE_STATE_ROLE_CREATE_SUCCESS: `**Rôle** ✅ Correctement créé`,
            GAMES_GAME_ACTIVE_STATE_ROLE_CREATE_FAILED: `**Rôle** 🟥 Le rôle n'a pas été créé`,

            GAMES_GAME_ACTIVE_STATE_TEXTCHANNEL_CREATE_START: `**Salon texte** ⏳ En cours `,
            GAMES_GAME_ACTIVE_STATE_TEXTCHANNEL_CREATE_SUCCESS: `**Salon texte** ✅ Correctement créé`,
            GAMES_GAME_ACTIVE_STATE_TEXTCHANNEL_CREATE_FAILED: `**Salon texte** 🟥 Le salon n'a pas été créé`,

            GAMES_GAME_ACTIVE_STATE_TEXTCHANNELPERM_CREATE_START: `**Permissions salon texte** ⏳ En cours `,
            GAMES_GAME_ACTIVE_STATE_TEXTCHANNELPERM_CREATE_SUCCESS: `**Permissions salon texte** ✅ Effectué`,
            GAMES_GAME_ACTIVE_STATE_TEXTCHANNELPERM_CREATE_FAILED: `**Permissions salon texte** 🟥 Permiussions non appliquées`,

            GAMES_GAME_ACTIVE_CATEGORY_NOT_FOUND: `La catégorie enregistrée pour le jeu n'a pas été trouvée. Elle sera recréée`,
            GAMES_GAME_ACTIVE_TEXTCHANNEL_NOT_FOUND: `La salon de discussions enregistrée pour le jeu n'a pas été trouvé. Il sera recréé`,
            GAMES_GAME_ACTIVE_MAINROLE_ALREADY_EXIST: `Le rôle principal pour le jeu existe déjà (ce n'est pas normal). Il va être réutilisé`,

            GAMES_GAME_ACTIVE_STATE_COMPLETE: (game) => {
                return `Activation du jeu **${game.name}** complètée`;
            },

            GAMES_GAME_INACTIVE_STATE_TITLE: (game) => {
                return `Désactivation du jeu **${game.name}**`;
            },
            GAMES_GAME_INACTIVE_STATE_ROLE_DELETE_START: `**Suppression Rôle** ⏳ En cours `,
            GAMES_GAME_INACTIVE_STATE_ROLE_DELETE_SUCCESS: `**Suppression Rôle** ✅ Correctement supprimé`,
            GAMES_GAME_INACTIVE_STATE_ROLE_DELETE_NO_ROLE: `**Suppression Rôle** ⚠️ Aucun rôle associé `,
            GAMES_GAME_INACTIVE_STATE_ROLE_DELETE_NOT_FOUND: (roleId) => {
                return `**Suppression Rôle** 🟥 Rôle ${roleId} non trouvé`;
            },
            GAMES_GAME_INACTIVE_STATE_ROLE_DELETE_FAILED: `**Suppression Rôle** 🟥 Le rôle n'a pas été créé`,


            GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_RENAME_START: `**Renommer salon** ⏳ En cours `,
            GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_RENAME_SUCCESS: `**Renommer salon** ✅ Correctement renommé`,
            GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_RENAME_NO_ID: `**Renommer salon** ⚠️ Aucun salon associé `,
            GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_RENAME_NOT_FOUND: (channelId) => {
                return `**Renommer salon** 🟥 Salon ${channelId} non trouvé`;
            },
            GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_RENAME_FAILED: `**Renommer salon** 🟥 Le salon n'a pas été renommé`,


            GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_EVERYONEPERM_START: `**Perm. everyone salon** ⏳ En cours `,
            GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_EVERYONEPERM_SUCCESS: `**Perm. everyone salon** ✅ Correctement effectué`,
            GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_EVERYONEPERM_NO_ID: `**Perm. everyone salon** ⚠️ Aucun salon associé `,
            GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_EVERYONEPERM_NOT_FOUND: (channelId) => {
                return `**Perm. everyone salon** 🟥 Salon ${channelId} non trouvé`;
            },
            GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_EVERYONEPERM_FAILED: `**Perm. everyone salon** 🟥 Le rôle n'a pas été créé`,


            GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_MEMBERPERM_START: `**Perm. membres salon** ⏳ En cours `,
            GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_MEMBERPERM_SUCCESS: `**Perm. membres salon** ✅ Correctement effectué`,
            GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_MEMBERPERM_NO_ID: `**Perm. membres salon** ⚠️ Aucun salon associé `,
            GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_MEMBERPERM_NOT_FOUND: (channelId) => {
                return `**Perm. membres salon** 🟥 Salon ${channelId} non trouvé`;
            },
            GAMES_GAME_INACTIVE_STATE_TEXTCHANNEL_MEMBERPERM_FAILED: `**Perm. membres salon** 🟥 Le rôle n'a pas été créé`,


            GAMES_GAME_CHAN_DESCRIPTION_CONTENT: `Ajouter un salon à un jeu`,
            GAMES_GAME_CHAN_DESCRIPTION_USAGE: `Description à écrire`,
            GAMES_GAME_CHAN_GAME_PROMPT: `Pour quel **jeu** souhaitez ajouter un salon ?`,
            GAMES_GAME_CHAN_GAME_RETRY: `Ce jeu est inconnu ! Veuillez saisir un nom ou un alias de jeu`,
            GAMES_GAME_CHAN_CHAN_PROMPT: `Quel **type de salon** souhaitez vous ajouter ?
            infos
            event`,
            GAMES_GAME_CHAN_GAME_RETRY: `Ce n'est pas un type de salon valide. Veuillez me donner un type valide.
            infos
            event`,

            GAMES_GAME_INACTIVE_DESCRIPTION_CONTENT: `Désactiver un jeu`,
            GAMES_GAME_INACTIVE_DESCRIPTION_USAGE: `Description à écrire`,
            GAMES_GAME_INACTIVE_ERROR_GAME_INACTIVE: (game) => {
                return `Le jeu **${game.name}** est déjà désactivé`;
            },
            GAMES_GAME_INACTIVE_STATE_START: (game) => {
                return `Désactivation du jeu **${game.name}**
                `;
            },
            GAMES_GAME_INACTIVE_SUCCESS: (game) => {
                return `Le jeu  **${game.name}** à été désactivé.`;
            },

            GAMES_GAME_DELETE_DESCRIPTION_CONTENT: `Supprimer un jeu`,
            GAMES_GAME_DELETE_DESCRIPTION_USAGE: `Description à écrire`,
            GAMES_GAME_DELETE_ERROR_GAME_ACTIVE: (game) => {
                return `Le jeu **${game.name}** est actif. Le jeu doit être désactivé avant d'être supprimé.`;
            },
            GAMES_GAME_DELETE_SUCCESS: (game) => {
                return `Le jeu  **${game.name}** à été supprimé.`;
            },
            GAMES_GAME_DELETE_STATE_START: (game) => {
                return `Suppression rôles et salons du jeu **${game.name}**
                `;
            },

            GAMES_GAME_INFOS_DESCRIPTION_CONTENT: `Afficher la fiche d'un jeu`,
            GAMES_GAME_INFOS_DESCRIPTION_USAGE: `Lancez cette commande avec l'ID ou l'alias d'un jeu
            Syntaxe: \`!game-infos [gameID]\`
            `,
            GAMES_GAME_INFOS_GAME_PROMPT: `Pour quel **jeu** souhaitez vous des informations ?`,


            GAMES_GAME_EDIT_DESCRIPTION_CONTENT: `Modifier les données d'un jeu`,
            GAMES_GAME_EDIT_DESCRIPTION_USAGE: `Cette commande ne requiert aucun argument pour fonctionner`,
            GAMES_GAME_EDIT_GAME_PROMPT: `Quel **jeu** souhaitez vous éditer ?`,
            GAMES_GAME_EDIT_GAME_RETRY: `Ce jeu est inconnu ! Veuillez saisir un nom de jeu`,
            GAMES_GAME_EDIT_SUCCESS: (game) => {
                return `Le jeu  **${game.name}** à correctment été modifié.`;
            },

            GAMES_GAME_LIST_DESCRIPTION_CONTENT: `Afficher la liste des jeux`,
            GAMES_GAME_LIST_DESCRIPTION_USAGE: `Lancez cette commande sans paramètre pour obtenir la liste des jeux
            Syntaxe: \`!game-list [option]\`
            
            Options:
            "**actif**" seuls les jeux actifs seronts affichés
            "**inactif**" seuls les jeux inactifs seront affichés`,
            GAMES_GAME_LIST_OPTION_RETRY: `Cette option n'est pas valide.
            Options valides: 'tout, 'actif ou 'inactif'.`,

            GAMES_GAME_SCORES_DESCRIPTION_CONTENT: `Affiche la liste des scores pour les jeux`,
            GAMES_GAME_SCORES_DESCRIPTION_USAGE: `Lancez cette commande sans paramètre pour obtenir la liste des jeux qui ont un score supérieur à 0`,


            GAMES_GAME_PLAYER_DESCRIPTION_CONTENT: `Afficher les membres d'un jeu`,
            GAMES_GAME_PLAYER_DESCRIPTION_USAGE: `Lancez la commande sans paramètre et laissez-vous guider`,
            GAMES_GAME_PLAYER_GAME_PROMPT: `Pour quel **jeu** souhaitez vous afficher la liste des joueurs ?`,
            GAMES_GAME_PLAYER_GAME_RETRY: `Ce jeu est inconnu ! Veuillez saisir un nom de jeu`,

            GAMES_GAME_ADD_DESCRIPTION_CONTENT: `Ajouter un jeu avec son nom`,
            GAMES_GAME_ADD_DESCRIPTION_USAGE: `Cette commande ne requiert aucun argument pour fonctionner`,
            GAMES_GAME_ADD_GAME_PROMPT: `Quel **jeu** souhaitez vous ajouter ?`,


            GAMES_GAME_VIEW_DESCRIPTION_CONTENT: `Afficher les données d'un jeu`,
            GAMES_GAME_VIEW_DESCRIPTION_USAGE: `Cette commande ne requiert aucun argument pour fonctionner`,
            GAMES_GAME_VIEW_GAME_PROMPT: `Quel **jeu** souhaitez vous afficher ?`,
            GAMES_GAME_VIEW_GAME_RETRY: `Ce jeu est inconnu ! Veuillez saisir un nom de jeu`,

            GAMESERVER_SERVER_DESCRIPTION_CONTENT: `Informations et aide sur les serveurs`,
            GAMESERVER_SERVER_DESCRIPTION_USAGE: `Lancez la commande sans paramètre et laissez-vous guider`,

            GAMESERVER_SERVER_ADD_SUCCESS: (serverID) => {
                return `Le serveur à correctment été ajouté avec l\'id ${serverID}.`;
            },
            GAMESERVER_SERVER_ADD_DESCRIPTION_CONTENT: `Ajouter un nouveau serveur de jeu`,
            GAMESERVER_SERVER_ADD_DESCRIPTION_USAGE: `Lancez la commande sans paramètre et laissez-vous guider
            Munissez-vous des informations suivantes :
            - Nom du jeu concerné et un nom pour le serveur
            - Adresse IP et port du serveur
            - Mot de passe RCON
            - User, port et mot de passe FTP`,
            GAMESERVER_SERVER_ADD_GAME_PROMPT: `Pour quel **jeu** souhaitez vous ajouter un serveur ?`,
            GAMESERVER_SERVER_ADD_GAME_RETRY: `Ce jeu est inconnu ! Veuillez saisir un nom de jeu`,
            GAMESERVER_SERVER_ADD_NAME_PROMPT: `Quel est le **nom** de ce serveur ?`,
            GAMESERVER_SERVER_ADD_IP_PROMPT: `Quelle est l'adresse **ip** du serveur ?`,
            GAMESERVER_SERVER_ADD_PORTRCON_PROMPT: `Quel est le **port RCON** du serveur ?`,
            GAMESERVER_SERVER_ADD_PORTRCON_RETRY: `Veuillez saisir un port valide !`,
            GAMESERVER_SERVER_ADD_PWDRCON_PROMPT: `Quel est le **mot de passe RCON** du serveur ?`,
            GAMESERVER_SERVER_ADD_PORTFTP_PROMPT: `Quel est le **port FTP** du serveur ?`,
            GAMESERVER_SERVER_ADD_PORTFTP_RETRY: `Veuillez saisir un port valide !`,
            GAMESERVER_SERVER_ADD_USERFTP_PROMPT: `Quel est le **user FTP** du serveur ?`,
            GAMESERVER_SERVER_ADD_PWDFTP_PROMPT: `Quel est le **mot de passe FTP** du serveur ?`,

            GAMESERVER_SERVER_CHAT_DESCRIPTION_CONTENT: `Envoyer un message dans le chat d'un serveur ou sur tous.`,
            GAMESERVER_SERVER_CHAT_DESCRIPTION_USAGE: `Cette commande peut être lancée sans paramètre.
            Syntaxe: \`!server-chat <ID/*> <Message à envoyer>\`
            
            Note: Le message sera reformatté pour qu'il s'affiche correctement dans le chat du serveur (accents, ponctuation...)`,
            GAMESERVER_SERVER_CHAT_SERVER_PROMPT: `Spécifiez un **ID de serveur** ou bien **'*'** pour sélectionner tous les serveurs`,
            GAMESERVER_SERVER_CHAT_SERVER_RETRY: `Je ne trouve pas ce serveur ! Veuillez saisir son ID ou bien '*'`,
            GAMESERVER_SERVER_CHAT_MSG_PROMPT: `Quel message souhaitez vous envoyer ?`,

            GAMESERVER_SERVER_CMD_DESCRIPTION_CONTENT: `Envoyer une commande RCON sur un serveur ou sur tous.`,
            GAMESERVER_SERVER_CMD_DESCRIPTION_USAGE: `Cette commande peut être lancée sans paramètre. Une liste des commandes courantes sera affichée.
            Syntaxe: \`!server-cmd <ID/*> <commande>\`
            `,
            GAMESERVER_SERVER_CMD_SERVER_PROMPT: `Spécifiez un **ID de serveur** ou bien **'*'** pour sélectionner tous les serveurs`,
            GAMESERVER_SERVER_CMD_SERVER_RETRY: `Je ne trouve pas ce serveur ! Veuillez saisir son ID ou bien '*'`,
            GAMESERVER_SERVER_CMD_CMD_PROMPT: `Quelle commande souhaitez vous envoyer ?
            DestroyWildDinos
            SaveWorld`,

            GAMESERVER_SERVER_DEL_DESCRIPTION_CONTENT: `Supprimer un serveur de la base.⚠️ (ne pas utiliser)`,
            GAMESERVER_SERVER_DEL_DESCRIPTION_USAGE: `Un serveur ne doit pas être supprimé mais désactivé.
            Pour désactiver un serveur, utilisez la commande \`!server-edit\` et modifiez la valeur de "isActive" à "false"

            Syntaxe: \`!server-del <ID>\``,
            GAMESERVER_SERVER_DEL_SERVER_PROMPT: `⚠️ Un serveur ne doit pas être supprimé mais désactivé. A n'utiliser qu'en cas de problème avec la base de données
            Quel serveur souhaitez vous supprimer ?`,
            GAMESERVER_SERVER_DEL_SERVER_RETRY: `Je ne trouve pas ce serveur ! Veuillez saisir son ID`,
            GAMESERVER_SERVER_DEL_CONFIRMATION_PROMPT: `Êtes-vous sûr de vouloir supprimer ce serveur ? (oui/non)`,
            GAMESERVER_SERVER_DEL_CONFIRMATION_RETRY: `Veuillez répondre par 'oui' ou 'non'`,

            GAMESERVER_SERVER_EDIT_DESCRIPTION_CONTENT: `Modifier les données d'un serveur`,
            GAMESERVER_SERVER_EDIT_DESCRIPTION_USAGE: `Lancez la commande sans paramètre et laissez-vous guider`,
            GAMESERVER_SERVER_EDIT_SERVER_PROMPT: `Quel **serveur** souhaitez vous modifier ? (ID)`,
            GAMESERVER_SERVER_EDIT_SERVER_RETRY: `Je ne trouve pas ce serveur ! Veuillez saisir son ID`,

            GAMESERVER_SERVER_LIST_DESCRIPTION_CONTENT: `Afficher la liste des serveurs`,
            GAMESERVER_SERVER_LIST_DESCRIPTION_USAGE: `Cette commande ne requiert aucun argument pour fonctionner`,

            GAMESERVER_SERVER_VIEW_DESCRIPTION_CONTENT: `Afficher les données d'un serveur de jeu`,
            GAMESERVER_SERVER_VIEW_DESCRIPTION_USAGE: `Lancez la commande sans paramètre et laissez-vous guider
            
            Syntaxe: \`!server-view <ID>\``,
            GAMESERVER_SERVER_VIEW_SERVER_PROMPT: `Quel **serveur** souhaitez vous afficher ? (ID)`,
            GAMESERVER_SERVER_VIEW_SERVER_RETRY: `Je ne trouve pas ce serveur ! Veuillez saisir son ID`,

            GAMESERVER_SERVER_MAINT_DESCRIPTION_CONTENT: `Activer la maintenance sur un serveur ou tous à la fois.`,
            GAMESERVER_SERVER_MAINT_DESCRIPTION_USAGE: `Lorsque vous activez la maintenance, vous serez prévenu si des joueurs sont actuellement connectés sur les serveurs concernés. Les joueurs seront eux aussi prévénus via un message sur le discord et dans le chat en jeu.
            
            Lorsqu'un serveur est en maintenance, aucune notification ne sera faite à son sujet.`,
            GAMESERVER_SERVER_MAINT_MODE_PROMPT: `Spécifiez le **mode**:
            - **on** pour activer la maintenance
            - **off** pour désactiver la maintenance`,
            GAMESERVER_SERVER_MAINT_MODE_RETRY: `Veuillez répondre par 'on' ou par 'off'`,
            GAMESERVER_SERVER_MAINT_SERVER_PROMPT: `Spécifiez un **ID de serveur** ou bien **'*'** pour sélectionner tous les serveurs`,
            GAMESERVER_SERVER_MAINT_SERVER_RETRY: `Je ne trouve pas ce serveur ! Veuillez saisir son ID ou bien '*'`,

            GAMESERVER_SERVER_MAINT_WARN_GAME_MAINT_ON: (gamename) => {
                return `Les serveurs "${gamename}" entrent en maintenance.`;
            },
            GAMESERVER_SERVER_MAINT_WARN_SERVER_MAINT_ON: (server) => {
                return `Le serveur ${server.servername} entre en maintenance.`;
            },
            GAMESERVER_SERVER_MAINT_SUCCESS_MAINT_OVER: `Maintenance terminée !`,
            GAMESERVER_SERVER_MAINT_WARN_PLAYERS_CONNECTED: (server) => {
                return `Attention, il y a **${server.connected} joueur(s)** connecté(s) sur ${server.servername}.`;
            },
            GAMESERVER_SERVER_MAINT_SUCCESS_NO_PLAYERS: (server) => {
                return `Aucun joueur connecté sur ${server.servername} vous pouvez y aller!`;
            },
            GAMESERVER_SERVER_MAINT_MSG_TO_PLAYERS: `Le serveur va entrer en maintenance. Merci de vous mettre a l'abri et de vous deconnecter`,

            GAMESERVER_SERVER_SESS_DESCRIPTION_CONTENT: `Sessions de jeu d'un serveur`,
            GAMESERVER_SERVER_SESS_DESCRIPTION_USAGE: `Permet d'afficher les sessions de jeu d'un serveur sur les 2 derniers jours.
            Lancez la commande sans paramètre. La liste des serveurs sera affichée pour vous permettre de sélectionner le bon.

            Syntaxe: \`!server-sessions <ID>\``,




            GAMESERVER_SERVER_EDIT_SUCCESS: (server) => {
                return `Le serveur  **${server.servername}** (${server.id}) à correctment été modifié.`;
            },
            GAMESERVER_SERVER_DELETE_SUCCESS: (server) => {
                return `Le serveur **${server.servername} (${server.id})** à été supprimé avec succès.`;
            },

            GAMESERVER_ERROR_SERVER_NOT_FOUND: (serverID) => {
                return `Aucun serveur trouvé avec l'ID **${serverID}**. Lancez la commande \`!servers\` pour obtenir la liste des serveurs disponibles.`;
            },

            GAMESERVER_ERROR_PLAYERID_ALREADY_LINKED: (playerID, userdata) => {
                return `Le joueur avec l'ID **${playerID}** est déjà lié au membre **${userdata.displayName}**. Si vous continuez, le lien sera mis à jour.`;
            },
            GAMESERVER_ERROR_PLAYERID_NOT_FOUND: (playerID) => {
                return `Aucun joueur trouvé avec l'ID **${playerID}**. Lancez la commande \`!players\` pour obtenir la liste des joueurs.`;
            },

            GAMESERVER_ARK_INFORMATIONS: (timeDwD) => {
                return `Mot de passe: **Pirates**
                Redémarrage automatique tous les jours à **5h30**
                Réinitialisation dinos dans **${timeDwD}**`;
            },
            GAMESERVER_ARK_MODS: () => {
                return `**Super Structure** [🔗](https://steamcommunity.com/sharedfiles/filedetails/?id=1999447172)
                **Awesome Spyglass** [🔗](https://steamcommunity.com/sharedfiles/filedetails/?id=1404697612)
                **Genesis Grinder** [🔗](https://steamcommunity.com/sharedfiles/filedetails/?id=2010338386)
                **Ebenus Astrum** [🔗](https://steamcommunity.com/sharedfiles/filedetails/?id=916417001)`;
            },
            GAMESERVER_ARK_RATES: () => {
                return `Exp: **2**x
                Récolte: **3**x
                Appriv.: **6**x
                Int. repro: **0.05**x
                Eclosion: **4**x
                Maturation: **6**x`;
            },
            GAMESERVER_ARK_DWD_SUCCESS: (server) => {
                return `DestroyWildDinos effectué avec succès sur le serveur **${server.servername}** (${server.id})`;
            },
            GAMESERVER_ARK_DWD_ERROR: (server) => {
                return `Une erreur s'est produite avec la commande DestroyWildDinos sur le serveur **${server.servername}** (${server.id})`;
            },

            GAMESERVER_ARK_BAN_SUCCESS: (player, server) => {
                return `Le joueur **${player.steamName}** (${player.id}) à correctement été banni du serveur **${server.servername}** (${server.id})`;
            },
            GAMESERVER_ARK_BAN_ERROR: (player, server) => {
                return `Erreur. Impossible de bannir le joueur **${player.steamName}** (${player.id}) du serveur **${server.servername}** (${server.id})`;
            },
            GAMESERVER_ARK_UNBAN_SUCCESS: (player, server) => {
                return `Le joueur **${player.steamName}** (${player.id}) à correctement été débanni du serveur **${server.servername}** (${server.id})`;
            },
            GAMESERVER_ARK_UNBAN_ERROR: (player, server) => {
                return `Erreur. Impossible de débannir le joueur **${player.steamName}** (${player.id}) du serveur **${server.servername}** (${server.id})`;
            },
            GAMESERVER_NEW_PLAYER_DETECTED: (server, playerID, playerName) => {
                return `Nouveau joueur détecté sur le serveur **${server.servername}** (${server.gamename})
                Compte Steam: **${playerName}** ID Steam: **${playerID}**
            
                Veuillez relier ce joueur à un membre du serveur:
                Voici la commande à lancer: \`!player-link ${playerID}\` ou \`!plink ${playerID}\`
                Vous devrez spécifier l'ID du membre sur le discord`;
            },
            GAMESERVER_PLAYER_OLD_MEMBER_DETECTED: (userdata, gameserversPlayer, server) => {
                return `Le membre **${userdata.displayName}** est actuellement connecté sur le serveur **${server.servername}**
                **Ce membre ne fait plus partie du discord**
                Pour bannir ce joueur des serveurs de jeu, veuillez lancer la commande suivante:
                \`!player-ban ${gameserversPlayer.id}\` ou \`!pban ${gameserversPlayer.id}\``
            },

            GAMESERVER_PLAYER_LINK_SUCCESS: (gameserversPlayer, member) => {
                return `Le joueur **${gameserversPlayer.steamName}** (${gameserversPlayer.id}) à correctement été lié au membre **${member.displayName}**`
            },

            GAMESERVER_CONFIG_NEW_PARAMETER: (gameserverConfig, server) => {
                return `Nouveau paramètre détecté **${gameserverConfig.parameter}** dans le fichier ${gameserverConfig.filename} (serveur: ${server.servername})`
            },

            GAMESERVER_CONFIG_CHANGED_PARAMETER: (gameserverConfigCurrent, gameserverConfig, server) => {
                return `Le paramètre **${gameserverConfig.parameter}** à été modifié.
                Ancienne valeur: ${gameserverConfig.value}
                Nouvelle valeur: ${gameserverConfigCurrent.value}
                Serveur: ${server.servername}`
            },


            CMD_CMDALIAS_PROMPT: `Quel est l'ID du membre ?`,
            CMD_CMDALIAS_RETRY: `Je ne connais pas cette commande. Veuillez spécifier une commande ou un alias valide.
            Lacez la commande \`!aide\` pour obtenir la liste des commandes disponibles.`,

            CMD_USERDATA_PROMPT: `Quel est l'ID du membre ?`,
            CMD_USERDATA_RETRY: `Je ne trouve aucun membre avec cet ID, êtes vous sûr de votre saisie ?`,

            CMD_MEMBER_PROMPT: `Quel est le membre concerné par cette action ?`,
            CMD_MEMBER_RETRY: `Je ne trouve aucun membre avec ce nom, êtes vous sûr de votre saisie ?
            Essayez avec son ID`,


            CMD_STEAMID_PROMPT: `Quel est le SteamID du joueur ?`,
            CMD_STEAMID_RETRY: `Ce n'est pas un SteamID valide. Il doit commencer par "7656" et comporte 17 caractères en tout`,

            CMD_PLAYER_PROMPT: `Quel est l'ID du joueur ?`,
            CMD_PLAYER_RETRY: `Cet ID n'est pas enregistré dans la base des joueurs. Vérifiez votre sasie.`,

            CMD_EDIT_FIELD_PROMPT: `Quel **champ** souhaitez vous modifier ?`,
            CMD_EDIT_VALUE_PROMPT: `Quelle est la **nouvelle valeur** pour ce champ ?`,


            CMD_NOTE_PROMPT: `Quel est l'ID de la note ?`,
            CMD_NOTE_RETRY: `Je ne trouve aucune note avec cet ID. Vérifiez votre saisie`,

            CMD_OUINON_RETRY: `Veuillez répondre par 'oui' ou par 'non`,





            AIDE_AIDE_DESCRIPTION_CONTENT: `Affiche ce message d'aide et une aide détaillée pour chaque commande`,
            AIDE_AIDE_DESCRIPTION_USAGE: `\`!aide [commande ou alias]\` Les crochets \`[...]\` signifient que le paramètre est optionnel
            Lancée sans paramètre, j\'afficherai ce menu d\'aide
            Si vous spécifiez une commande ou bien un de ses alias, alors j'afficherais une aide plus détaillée sur la commande.`,
            AIDE_CATEGORY_ADMIN_DESCRIPTION: `Description pour la catégorie "Admin"`,

            // PLAYER
            PLAYER_PLAYER_DESCRIPTION_CONTENT: `Aide commandes: **joueurs**`,
            PLAYER_PLAYER_DESCRIPTION_USAGE: `Cette commande ne requiert aucun argument pour fonctionner`,
            PLAYER_PLAYER_HELP_DESCRIPTION: `Voici la liste des commandes qui permettent de gèrer les joueurs.
            
            `,

            PLAYER_ADD_DESCRIPTION_CONTENT: `Ajouter manuellement un joueur.`,
            PLAYER_ADD_DESCRIPTION_USAGE: `Les joueurs sont ajoutés automatiquement. Cette commande ne sert qu'en cas de test/maintnenance`,


            PLAYER_ADD_PLAYERNAME_PROMPT: `Quel est le compte Steam du joueur ?`,

            PLAYER_BAN_DESCRIPTION_CONTENT: `Bannir un joueur des serveurs privés`,
            PLAYER_BAN_DESCRIPTION_USAGE: `Cette commande permet de bannir un joueur de tous les serveurs privés enregistrés et actifs. Le ban ne concerne que les serveurs privés, pas le discord.
            Lancez cette commande sans paramètre. Une liste des joueurs actifs sera affichée et vous devrez préciser le steamID du joueur à bannir.

            Note: Les joueurs qui quittent le groupe Ark ou le discord sont automatiquement bannis.`,

            PLAYER_UNBAN_DESCRIPTION_CONTENT: `Lever le ban d'un joueur des serveurs privés`,
            PLAYER_UNBAN_DESCRIPTION_USAGE: `Cette commande permet de lever le ban d'un joueur de tous les serveurs privés enregistrés et actifs.
            Lancez cette commande sans paramètre. Une liste des joueurs bannis sera affichée et vous devrez préciser le steamID du joueur.`,

            PLAYER_LINK_DESCRIPTION_CONTENT: `Créer ou modifier le lien entre joueur et un membre`,
            PLAYER_LINK_DESCRIPTION_USAGE: `Lancez la commande sans paramètre. La liste des joueurs non liés sera affichée pour vous permettre de sélectionner le bon steamID à lier.
            Vous devrez aussi préciser l'ID du membre discord.`,

            PLAYER_SESS_DESCRIPTION_CONTENT: `Sessions de jeu d'un joueur`,
            PLAYER_SESS_DESCRIPTION_USAGE: `Permet d'afficher les sessions de jeu d'un joueur sur les 2 derniers jours.
            Lancez la commande sans paramètre. La liste des joueurs sera affichée pour vous permettre de sélectionner le bon steamID`,

            PLAYER_LIST_DESCRIPTION_CONTENT: `Afficher la liste des joueurs.`,
            PLAYER_LIST_DESCRIPTION_USAGE: `Cette commande ne requiert aucun argument pour fonctionner
            La liste est trièe avec les joueurs qui se sont connectés récement en premier.`,

            USER_MEMBER_PROMPT: `Veuillez spécifier un membre pour cette action`,
            USER_MEMBER_RETRY: `Je n'arrive pas à trouver de membre avec ce nom. Essayer peut-être avec son ID`,

            USER_INFOS_DESCRIPTION_CONTENT: `Informations sur un membre`,
            USER_INFOS_DESCRIPTION_USAGE: `Permet d'afficher les informations détaillées d'un membre`,

            USER_NOTE_DESCRIPTION_CONTENT: `Notes pour un membre`,
            USER_NOTE_DESCRIPTION_USAGE: `Affiche les dernière notes pour un membres et permet des actions`,

            NOTE_EDIT_DESCRIPTION_CONTENT: `Modifier une note`,
            NOTE_EDIT_DESCRIPTION_USAGE: `Permet de modifier le texte d'une note`,
            NOTE_CHANGEDATE_PROMPT: (createdDate, createdTime) => {
                return `Cette note est datée du  **${createdDate}** à **${createdTime}**
                Souhaitez-vous modifier cette date ? (**oui**/**non**)`;
            },
            NOTE_CHANGEDATE_RETRY: `Je n'arrive pas à trouver de membre avec ce nom. Essayer peut-être avec son ID`,

            NOTE_CHANGENOTE_PROMPT: (note) => {
                return `Voici le texte actuel de la note: 
                ${note}

                Souhaitez-vous modifier ce texte ? (**oui**/**non**)`;
            },

            NOTE_NEWNOTE_PROMPT: (note) => {
                return `Voici le texte actuel de la note: 
                ${note}

                Saisissez le texte de remplacement`;
            },

            NOTE_DATE_PROMPT: `Veuillez sisir la nouvelle date au format \`AAAA-MM-JJ hh:mm\``,
            NOTE_DATE_RETRY: `Cette date n'est pas valide. J'attends une date au format \`AAAA-MM-JJ hh:mm\``,

            NOTE_DEL_DESCRIPTION_CONTENT: `Supprimer une note`,
            NOTE_DEL_DESCRIPTION_USAGE: `Permet de supprimer une note`,
            NOTE_DEL_CONFIRM_PROMPT: (note, party, member) => {
                return `**${note.key}** \`${note.createdDate} ${note.createdTime}\` par **${party}** pour **${member}**
                ${note.note} 
                
                Êtes-vous sûr de vouloir supprimer cette note ? (**oui**/**non**)`;
            },
            WARN_DEL_CONFIRM_PROMPT: (note, party, member) => {
                return `**${note.key}** \`${note.createdDate} ${note.createdTime}\` par **${party}** pour **${member}**
                ${note.note} 
                
                ⚠️ **Attention** cette note est un **warning** en supprimant cette note le compteur de warning du membre diminuera aussi.
                Êtes-vous sûr de vouloir supprimer cette note ? (**oui**/**non**)`;
            },

            NOTE_LIST_DESCRIPTION_CONTENT: `Liste de toutes les notes`,
            NOTE_LIST_DESCRIPTION_USAGE: `Affiche la liste des notes pour tous les membres`,


            USER_NOTEADD_DESCRIPTION_CONTENT: `Ajouter une note sur un membre`,
            USER_NOTEADD_DESCRIPTION_USAGE: `Permet d'ajouter une note de modération sur un membre`,
            USER_NOTEADD_MEMBER_PROMPT: `Pour quel membre souhaitez-vous ajouter une note ?`,
            USER_NOTEADD_MEMBER_RETRY: `Je n'arrive pas à trouver de membre avec ce nom. Essayer peut-être avec son ID`,
            USER_NOTEADD_NOTE_PROMPT: (member) => {
                return `Ajouter une note pour **${member}**
                
                Veuillez saisir la note à ajouter`;
            },
            USER_USERINFO_MEMBER_PROMPT: `Pour quel membre souhaitez-vous afficher les informations ?`,
            USER_USERINFO_MEMBER_RETRY: `Je n'arrive pas à trouver de membre avec ce nom. Essayer peut-être avec son ID`,


            USER_WARN_DESCRIPTION_CONTENT: `Avertir un membre`,
            USER_WARN_DESCRIPTION_USAGE: `Permet d'aavertir un membre avec ajout d'une note`,
            USER_WARN_NOTE_PROMPT: (member) => {
                return `Donner un avertissment pour **${member}**
                
                Veuillez saisir la note à ajouter à votre avertissement`;
            },

            INFOS_PROFIL_DESCRIPTION_CONTENT: `Afficher son profil ou celui d'un autre membre`,
            INFOS_PROFIL_DESCRIPTION_USAGE: `Si cette commande est lancée sans paramètre elle affichera votre profil
            Pour afficher le profil d'un autre membre vous devez préciser son nom, une partie de son nom ou son ID`,
            INFOS_PROFIL_MEMBER_PROMPT: `Pour quel membre souhaitez-vous afficher le profil ?`,
            INFOS_PROFIL_MEMBER_RETRY: `Je n'arrive pas à trouver de membre avec ce nom. Essayer peut-être avec son ID`,

            // EMBED
            EMBED_CREATION_SUCCESS: (titre, id) => {
                return `L'embed **${titre}** (${id}) à été correctement créé`;
            },
            EMBED_EDIT_SUCCESS: (titre, id) => {
                return `L'embed **${titre}** (${id}) est désormais en cours d'édition`;
            },
            EMBED_UPDATE_SUCCESS: (id, titre, zone) => {
                return `Le champs "**${zone}**" de l'embed **${titre}** (${id}) à correctement été mis à jour`;
            },
            EMBED_COPY_SUCCESS: (origID, copyID, titre) => {
                return `L'embed **${titre}** (${origID}) à correctement été copié. Nouvel ID: ${copyID}`;
            },
            EMBED_ARCHIVED_SUCCESS: (titre, id) => {
                return `L'embed **${titre}** (${id}) à été correctement été archivé`;
            },
            EMBED_CURRENT_EDIT_ARCHIVED: (embed) => {
                return `Votre embed **${embed.titre}** (${embed.id}) est en cours d'édition. Il va être archivé`;
            },
            EMBED_USERBOARD_TITLE: (name) => {
                return `Gestion des embeds de ${name}`;
            },
            EMBED_USERBOARD_DESCRIPTION: (totalEmbeds, editEmbed,) => {
                let texte = `Total: **${totalEmbeds}** embeds\n`;
                if (editEmbed) {
                    texte += `En cours d'édition: **${editEmbed.titre}** (id:${editEmbed.id})\n\n`;
                } else {
                    texte += `Aucun embed en cours d'édition\n\n`;
                }
                texte += `Aide: \`!embed aide\`\n`;
                return texte;
            },
            EMBED_AIDE_TITLE_1: `Aide embeds: Introduction`,
            EMBED_AIDE_TITLE_2: `Aide embeds: Commandes de base`,
            EMBED_AIDE_DESCRIPTION_1: () => {
                return `La commande \`!embed\` est une commande complexe qui permet à la fois ge gèrer les embeds (création, copie, suppression) mais aussi de modifier un embed.
                Pour simplifier les commandes d'édition, et ne pas avoir à répéter à chaque fois l'id de l'embed qu'on souhaite modifier, il y a un mode "édition". On ne peut avoir qu'un seul embed en cours d'édition à la fois.
                
                **Tableau de bord**
                La commande \`!embed\` lancée sans paramètre, affiche votre tableau de bord.
                Ce tableau de bord vous permet de savoir où vous en êtes, il affiche une liste de vos 10 derniers embeds et une liste des 10 derniers embeds des autre utilisateurs. Les embeds de ces listes sont triés par date de modification et ceux qui sont en mode édition sur affichés en gras.

                **Commandes de base**
                

                `;
            },
            EMBED_AIDE_DESCRIPTION_2: () => {
                return `Voici l'aide détaillée de la fonction embed
                
                Vous ne pouvez avoir qu'un seul embed en cours d'édition pour simplifier les commandes d'édition. Voici les commandes qui vous permettrons de gérer les embeds: 
                \`!embed liste\`: Liste de vos embeds (alias: list, ls)
                \`!embed voir [id]\` Affiche l'embed spécifié ou celui en cours d'édition (alias: afficher, aff, view)
                \`!embed ajouter <Titre>\` Créer un nouvel embed avec le titre spécifié (alias: ajout, add)
                \`!embed editer <id>\` Active l'édition sur l'embed archivé spécifié (alias: edit)
                \`!embed copier <id>\` Crée un nouvel embed par copie de l'embed spécifié (alias: copy, cp)
                \`!embed archiver\` Archive l'embed en cours d'édition (alias: arch)

                Voici les commandes qui vous permettrons d'éditer un embed en cours d'édition:
                \`!embed titre <titre>\`: Modifier le titre
                \`!embed desc <description>\`: Modifier la description
                \`!embed showdesc\`: Afficher la commande "!embed desc" avec la description actuelle. Prête à être copiée, modifiée et lancée
                \`!embed thumbnail <url>\`: Ajoute un thumbnail (vignette) à partir de l'url de l'image
                \`!embed image <url>\`: Ajoute une image à partir de son url
                \`!embed footer <footer>\`: Modifier le texte de bas de page
                \`!embed url <url>\`: Assigne une url à l'embed. Le titre de l'embed sera un lien
                `;
            },
            EMBED_EDIT_NOEDITEMBED: "Vous n'avez aucun embed en cours d'édition",
            EMBED_NOT_FOUND: (embedID) => {
                return `L'embed **${embedID}** n'a pas été trouvé`;
            },
            EMBED_ERROR_NOT_OWNER: (embedID, ownerName) => {
                return `Vous n'êtes pas le propriétaire de l'embed **${embedID}**. Demandez à **${ownerName}** de vous le transférer.`;
            },
            EMBED_WARN_ALREADY_ARCHIVED: (embedID) => {
                return `L'embed **${embedID}** est déjà archivé. Aucune action réalisée.`;
            },

            MEMBER_NOT_FOUND: (memberID) => {
                return `Aucun membre trouvé sur le serveur avec l'ID: **${memberID}**`;
            },

            AUTOREP_ALFRED_RESP_QUESTION_DEFAULT: [
                "On parle de moi ?",
                "Plaît-il ?",
                "Vous m'avez demandé ?",
                "Veuillez m'excuser, mais je n'ai pas compris votre question",
                "Veuillez m'excuser, mais je ne comprends pas encore toutes les subtilités du langage humain",
                "Veuillez m'excuser, mais je n'ai pas saisi le sens de votre question."
            ],

            // PURGE
            PURGE_DELETE_SUCCESS: (nbdel, sizeDeleted) => {

                if (nbdel == sizeDeleted) {
                    if (sizeDeleted == 1) {
                        return `${sizeDeleted} message a été correctement supprimé.`;
                    } else {
                        return `${sizeDeleted} messages ont été correctement supprimés.`;
                    }
                } else {
                    if (sizeDeleted == 1) {
                        return `${sizeDeleted} message a été supprimé sur les ${nbdel} demandés.`;
                    } else {
                        return `${sizeDeleted} messages ont été supprimés sur les ${nbdel} demandés.`;
                    }
                }

            },
            PURGE_DELETE_ERROR: (error) => {
                return `Je n'ai pas réussi à supprimer les messages pour la raison: ${error}`;
            },

            ERROR_FIELD_NOT_FOUND: (field) => {
                return `Le champ "${field}" n'existe pas`;
            },

            ERROR_SETTINGS_ROLE_MEMBERS_NOT_FOUND: (rolename) => {
                return `Erreur de configuration: Aucun rôle avec le nom "${rolename} n'a été trouvé sur ce serveur.`;
            },

            // DEBUG

            DEBUG_EVENT_GUILD_MEMBER_UPDATE: (member) => {
                return `guildMemberUpdate (${member.displayName})`;
            },
            LOG_EVENT_USER_ADD_ROLE: (member, role) => {
                return `${member.displayName} ajout du rôle "${role.name}"`;
            },
            LOG_EVENT_USER_REMOVE_ROLE: (member, role) => {
                return `${member.displayName} retrait du rôle "${role.name}"`;
            },


            LOG_EVENT_REACTION_ADD: (messageReaction, member) => {
                if (messageReaction.message.channel.type === "dm") {
                    return `${member.displayName} à réagi avec ${messageReaction.emoji.name}  sur le message ${messageReaction.message.id}(${messageReaction.message.author.username}) via message privé`;
                } else {
                    return `${member.displayName} à réagi avec ${messageReaction.emoji.name}  sur le message ${messageReaction.message.id}(${messageReaction.message.author.username}) dans ${messageReaction.message.channel.name}`;
                }
            },
            LOG_EVENT_REACTION_REMOVE: (messageReaction, member) => {
                if (messageReaction.message.channel.type === "dm") {
                    return `${member.displayName} à retiré sa réaction ${messageReaction.emoji.name}  sur le message ${messageReaction.message.id}(${messageReaction.message.author.username}) via message privé`;
                } else {
                    return `${member.displayName} à retiré sa réaction ${messageReaction.emoji.name}  sur le message ${messageReaction.message.id}(${messageReaction.message.author.username}) dans ${messageReaction.message.channel.name}`;
                }
            },
            LOG_EVENT_USER_JOIN_SERVER: (member) => {
                return `${member.displayName} à rejoint le serveur`;
            },
            LOG_EVENT_USER_QUIT_SERVER: (user) => {
                return `${user.tag} à quitté le serveur`;
            },
            LOG_EVENT_USER_KICK_SERVER: (user) => {
                return `${user.tag} à été expulsé du serveur`;
            },
            LOG_EVENT_USER_BAN_SERVER: (user) => {
                return `${user.tag} à été banni du serveur`;
            },
            LOG_EVENT_MEMBER_JOIN_MEMBERS: (member) => {
                return `${member.displayName} à rejoint Casual Effect`;
            },
            LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION: "Notification nouveau membre désactivée",
            LOG_EVENT_USERGAME_CREATED: (member, game) => {
                return `Création des données de jeu pour ${member.displayName} sur ${game.name}`;
            },

            MOD_NOTIF_USER_JOIN_CONTACT: (member) => {
                return `⚠️ Membre **<@${member.id}>** est dans le salon "contact". Il attend sûrement qu'un admin ou modo aille l'acceuillir !`;
            },
            MOD_NOTIF_MEMBER_NOTIFIED_GAME_EXIST: (member, game) => {
                return `⚠️ **<@${member.id}>** joue à ${game.name} mais n'est pas dans le groupe. Il à été notifié par message privé de l'existence du groupe.`;
            },
            MOD_NOTIF_SERVER_JOIN: (member) => {
                return `✅ **<@${member.id}>** à rejoint le serveur`;
            },
            MOD_NOTIF_SERVER_JOIN_AGAIN: (member) => {
                return `❗️✅ **<@${member.id}>** à rejoint le serveur (c'est pas la première fois)`;
            },
            MOD_NOTIF_SERVER_QUIT: (member) => {
                return `❗️ **<@${member.id}>** à quitté le serveur`;
            },
            MOD_NOTIF_SERVER_KICK: (target, executor, reason) => {
                return `❗️ **<@${target.id}>** à été expulsé du serveur par **<@${executor.id}>**
                
                **Raison**: ${reason}`;
            },
            MOD_NOTIF_SERVER_BAN: (target, executor, reason) => {
                return `❗️ **<@${target.id}>** à été banni du serveur par **<@${executor.id}>**
                
                **Raison**: ${reason}`;
            },
            MOD_NOTIF_NEW_MEMBER: (member) => {
                return `✅ **<@${member.id}>** à été accepté et ajouté au groupe des membres`;
            },
            MOD_NOTIF_MEMBER_NICK_CHANGE: (oldNick, newNick) => {
                return `⚠️ **${oldNick}** à changé de pseudo, c'est désormais: **${newNick}**`;
            },
            MOD_NOTIF_MEMBER_NEW_NOTE: (member, party, note) => {
                return `⚠️ Une nouvelle note à été ajoutée pour **${member}** par **${party}**
                
                **Note**: ${note}`;
            },
            MOD_NOTIF_MEMBER_NEW_WARN: (memberID, partyID, note) => {
                return `⚠️ Un avertissement à été ajouté pour <@${memberID}> par <@${partyID}>
                
                **Note**: ${note}`;
            },
            MOD_NOTIF_MEMBER_NEW_WARN_LIMIT: (memberID, partyID, note, warn) => {
                return `⚠️ Un avertissement à été ajouté pour <@${memberID}> par <@${partyID}>
                
                **Note**: ${note}
                
                ⚠️ **ATTENTION** ce membre comptabilise **${warn}** avertissements`;
            },
            MOD_NOTIF_MEMBER_JOIN_GAME: (member, game) => {
                return `✅ **${member.displayName}** à rejoint le groupe du jeu ${game.name}`;
            },
            MOD_NOTIF_MEMBER_QUIT_GAME: (member, game) => {
                return `⚠️ **${member.displayName}** à quitté le groupe du jeu ${game.name}`;
            },
            MOD_NOTIF_MEMBER_PURGE_GAME: (member, game) => {
                return `⚠️ **${member.displayName}** à été retiré du groupe du jeu ${game.name} pour inactivité.`;
            },

            MOD_NOTIF_MEMBER_NEW_MESSAGE: (user, message) => {
                return `✉️ Message de **<@${user.id}>** pour le Staff
                
                **Message**: ${message}`;
            },
            MOD_NOTIF_MEMBER_NEW_MESSAGE_CONFIRM: `Merci ! Votre message à bien été transmis au Staff.`,


            MOD_NOTIF_SERVER_VERSION_CHANGE: (server, oldVers, newVers) => {
                return `⚠️ Le serveur **${server.servername}** à été mis à jour de la ${oldVers} vers la **${newVers}**`;
            },
            MOD_NOTIF_SERVER_SLOTS_CHANGE: (server, oldSlots, newSlots) => {
                return `⚠️ Le serveur **${server.servername}** à changé de nombre de slots, il passe de ${oldSlots} slots à **${newSlots}** slots`;
            },

            MOD_NOTIF_GAME_NO_INFO_CHANNEL: (game) => {
                return `⚠️ Le jeu **${game.name}** n'a pas de salon "informations"`;
            },

            MOD_NOTIF_AUTOMOD_DISCORDLINK: (message) => {
                return `❗️ Message avec lien d'invitation Discord supprimé dans <#${message.channel.id}>
                Auteur: <@${message.author.id}>
                Contenu: 
                ${message.cleanContent}`;
            },

            USER_NOTIF_AUTOMOD_DISCORDLINK: (message) => {
                return `Votre message dans <#${message.channel.id}> à été supprimé car il contenait un lien d'invitation discord. Ceci est contraire à notre <#règlement>.`;
            },


            AIDE_EMBED_TITLE_1: `Aide en ligne Alfred`,
            AIDE_EMBED_DESCRIPTION_1: `Voici la liste des commandes d'Alfred.

            La plupart des commandes doivent être lancées ici (message privé) pour éviter les notifications inutiles sur le discord. 
            
            Les commandes qui produisent un "résultat" (comme la commande "dé") ont besoin d'être lancées dans le salon où l'on souhaite que le résultat s'affiche. Ces commandes sont notées avec l'emoji 🔹

            Pour avoir une aide détaillée sur une commande, lancez: \`!aide <commande>\` par exemple \`!aide dé\` affichera une aide détaillée sur la commande "dé".
            
            Les prochaines pages présentent les commandes disponibles. Elles sont classées par catégories, une catégorie par page.
            Utilisez les réactions ◀️ et ▶️ pour naviguer entre les pages.
            
            **Sommaire:**
            **1**: Accueil *(cette page)*
            `,
        }
    }


    get(term, ...args) {
        const value = this.textes[term];
        /* eslint-disable new-cap */
        switch (typeof value) {
            case "function":
                return value(...args);
            case "object":
                return value.random();
            default:
                return value;
        }
    }

    getCitations() {
        return this.textes["CITATIONS"];
    }

    getAstuces() {
        return this.textes["ASTUCES"];
    }




    /**
     * Parse ms and returns a string
     * @param {number} milliseconds The amount of milliseconds
     * @returns The parsed milliseconds
     */
    convertMs(milliseconds) {
        let roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
        let days = roundTowardsZero(milliseconds / 86400000),
            hours = roundTowardsZero(milliseconds / 3600000) % 24,
            minutes = roundTowardsZero(milliseconds / 60000) % 60,
            seconds = roundTowardsZero(milliseconds / 1000) % 60;
        if (seconds === 0) {
            seconds++;
        }
        let isDays = days > 0,
            isHours = hours > 0,
            isMinutes = minutes > 0;
        let pattern =
            `${(!isDays ? "" : (isMinutes || isHours) ? "{days} jours, " : "{days} jours et ")}${(!isHours ? "" : (isMinutes) ? "{hours} heures, " : "{hours} heures et ")}${(!isMinutes ? "" : "{minutes} minutes et ")}${("{seconds} secondes")}`;
        let sentence = pattern
            .replace("{duration}", pattern)
            .replace("{days}", days)
            .replace("{hours}", hours)
            .replace("{minutes}", minutes)
            .replace("{seconds}", seconds);
        return sentence;
    }

}