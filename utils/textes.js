const Discord = require("discord.js");
const moment = require("moment");
const textes = require('./textes');
// This class is used to store languages strings

module.exports = class {
    constructor() {
        this.textes = {

            COM_ACTION_ANNULLE: "Action annulée",
            COM_MEMBER_ACCEPTED: (member) => {
                return `${member.displayName} à rejoint Casual Effect !`;
            },

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
                "Vous pouvez vous construire un trône avec des baïonnettes, mais vous ne resterez pas assis longtemps dessus. (Boris Eltsine)"
            ],
            MESSAGES_SERVER_JOIN: (member) => {
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
                    `Quelqu'un à laissé la porte ouverte et **${member.displayName}**est rentré !`
                ]
                return textes.random();
            },
            MESSAGES_SERVER_QUIT: (member) => {
                let textes = [
                    `Adieu **${member.displayName}** tu vas nous manquer... ou pas !`,
                    `RIP **${member.displayName}** petit Ange parti trop tôt`,
                    `Ah Enfin ! On est débarrassé de **${member.displayName}**`,
                    `Ah bah voilà ! Vous avez fait peur à **${member.displayName}** et il est parti !`,
                    `T'as raison **${member.displayName}** ! Casse-toi ! Et qu'on ne te revoit plus jamais par ici`,
                    `T'as les vrai, et puis t'as les mecs comme **${member.displayName}** qui se barrent sans rien dire.`
                ]
                return textes.random();
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

            USER_MESSAGE_ACCUEIL_TITRE: "Bienvenue sur Casual Effect",
            USER_MESSAGE_ACCUEIL_DESCRIPTION: (member) => {
                return `Bonjour ${member.displayName},
                
                Je me présente, Alfred, je suis le majordome de Casual Effect.
                Je m'occupe du bon fonctionnement de ce serveur discord et j'apporte quelques services pour améliorer votre séjour parmis nous.

                Pour en savoir plus sur ce que je peux faire pour vous, envoyez moi la commande \`!aide\`, ici par message privé et je vous donnerais la liste des commandes que je peux comprendre.
                
                Je vous souhaite de bien vous amuser sur Casual Effect !`;
            },

            MEMBER_MESSAGE_ACCUEIL_TITRE: "Bienvenue sur Casual Effect",
            MEMBER_MESSAGE_ACCUEIL_DESCRIPTION: (member) => {
                return `Bonjour ${member.displayName},
                
                Je me présente, Alfred, je suis le majordome de Casual Effect.
                Je m'occupe du bon fonctionnement de ce serveur discord et j'apporte quelques services pour améliorer votre séjour parmis nous.

                Pour en savoir plus sur ce que je peux faire pour vous, envoyez moi la commande \`!aide\`, ici par message privé et je vous donnerais la liste des commandes que je peux comprendre.
                
                Je vous souhaite de bien vous amuser sur Casual Effect !`;
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
            EXP_LOG_ADDXP: (member, xp, reason) => {
                return `${member.displayName} à gagné ${xp}xp (${reason})`;
            },
            EXP_LOG_LEVELUP: (member, level) => {
                return `Niveau supérieur pour ${member.displayName} qui est désormais level ${level}`;
            },
            // GAMES

            GAMES_LIST_UPDATED: "Liste des jeux mise à jour",
            GAMES_LIST_SUCCESS_CREATED: "Liste des jeux créée",
            GAMES_LIST_SUCCESS_UPDATED: "Liste des jeux mise à jour",
            GAMES_LIST_SUCCESS_DELETED: "Liste des jeux supprimée",
            GAMES_LIST_SUCCESS_LOADED: "Liste des jeux chargée",
            GAMES_LIST_WARN_NOTFOUND: "Liste des jeux non trouvée",
            GAMES_LIST_WARN_NOTFOUND_DELETION: "Liste des jeux non trouvée (suppression)",
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
            GAMES_QUIT_NOTIFICATION: (game, member) => {
                let textes = [
                    `${member.displayName} à quitté le groupe ${game.name}`,
                    `${member.displayName} vient de quitter le groupe ${game.name}`
                ]
                return textes.random();
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

            // EMBED
            EMBED_CREATION_SUCCESS: (titre, id) => {
                return `L'embed **${titre}** (${id}) à été correctement créé`;
            },
            EMBED_CREATION_EDIT_EXIST: (embed) => {
                return `Votre embed **${embed.titre}** (${embed.id}) est en cours d'édition. Il va être archivé`;
            },
            EMBED_USERBOARD_TITLE: (name) => {
                return `Gestion des embeds de ${name}`;
            },
            EMBED_USERBOARD_DESCRIPTION: (totalEmbeds, editEmbed, ) => {
                let texte = `Total: **${totalEmbeds}** embeds\n`;
                if (editEmbed) {
                    texte += `En cours d'édition: **${editEmbed.titre}** (id:${editEmbed.id})\n\n`;
                } else {
                    texte += `Aucun embed en cours d'édition\n\n`;
                }
                texte += `Aide: \`!embed aide\``;
                return texte;
            },
            EMBED_AIDE_TITLE: `Gestion des embeds: Aide`,
            EMBED_AIDE_DESCRIPTION: () => {
                return `Voici l'aide détaille de la fonction embed
                
                Vous ne pouvez avoir qu'un seul embed en cours d'édition pour simplifier les commandes d'édition. Voic les commandes qui vous permettrons de gérer les embeds: 
                \`!embed liste\`: Affiche la liste de vos embeds (alias: list, ls)
                \`!embed voir [id]\` Affiche l'embed spécifié ou celui en cours d'édition si aucun id fourni (alias: afficher, aff, view)
                \`!embed ajouter <Titre>\` Créer un nouvel embed avec le titre spécifié (alias: ajout, add)
                \`!embed editer <id>\` Active l'édition sur l'embed archivé spécifié (alias: edit)
                \`!embed copier <id>\` Crée un nouvel embed par copie de l'embed spécifié (alias: copy, cp)
                \`!embed archiver\` Archive l'embed en cours d'édition (alias: arch)

                Voici les commandes qui vous permettrons d'éditer un embed en cours d'édition:
                \`!embed titre <tire>\`: Modifier le titre
                \`!embed desc <description>\`: Modifier la description
                \`!embed showdesc\`: Afficher la commande "!embed desc" avec la description actuelle. Prête à être copiée, modifiée et lancée
                \`!embed thumbnail <url>\`: Ajoute un thumbnail (vignette) à partir de l'url de l'image
                \`!embed image <url>\`: Ajoute une image à partir de son url
                \`!embed footer <footer>\`: Modifier le texte de bas de page
                \`!embed url <url>\`: Assigne une adresse http à l'embed. Le titre de l'embed sera un lien clicable vers cet url
                `;
            },
            EMBED_EDIT_NOEDITEMBED: "Vous n'avez aucun embed en cours d'édition",
            EMBED_NOT_FOUND: (embedID) => {
                return `L'embed **${embedID}** n'a pas été trouvé`;
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
                return `${member.displayName} à réagi avec ${messageReaction.emoji.name}  sur le message ${messageReaction.message.id}(${messageReaction.message.author.username}) dans ${messageReaction.message.channel.name}`;
            },
            LOG_EVENT_REACTION_REMOVE: (messageReaction, member) => {
                return `${member.displayName} à retiré sa réaction ${messageReaction.emoji.name}  sur le message ${messageReaction.message.id}(${messageReaction.message.author.username}) dans ${messageReaction.message.channel.name}`;
            },
            LOG_EVENT_USER_JOIN_SERVER: (member) => {
                return `${member.displayName} à rejoint le serveur`;
            },
            LOG_EVENT_USER_QUIT_SERVER: (member) => {
                return `${member.displayName} à quitté le serveur`;
            },
            LOG_EVENT_MEMBER_JOIN_MEMBERS: (member) => {
                return `${member.displayName} à rejoint Casual Effect`;
            },
            LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION: "Notification nouveau membre désactivée",
            LOG_EVENT_USERGAME_CREATED: (member, game) => {
                return `Création des données de jeu pour ${member.displayName} sur ${game.name}`;
            },
            MOD_NOTIF_SERVER_JOIN: (member) => {
                return `${member.displayName} à rejoint le serveur`;
            },
            MOD_NOTIF_SERVER_QUIT: (member) => {
                return `${member.displayName} à quitté le serveur`;
            },
            MOD_NOTIF_NEW_MEMBER: (member) => {
                return `${member.displayName} à été accepté et ajouté au groupe des membres`;
            }
        }
    }

    /**
     * The method to get language strings
     * @param {string} term The string or function to look up
     * @param {...*} args Any arguments to pass to the lookup
     * @returns {string|Function}
     */
    get(term, ...args) {
        //if (!this.enabled && this !== this.store.default) return this.store.default.get(term, ...args);
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

    getCitation() {
        const value = this.textes["CITATIONS"];



    }


    printDate(pdate, isLongDate) {
        let monthNames = [
            "janvier", "février", "mars",
            "avril", "mai", "juin", "juillet",
            "août", "septembre", "octobre",
            "novembre", "décembre"
        ];

        let day = pdate.getDate();
        let monthIndex = pdate.getMonth();
        let year = pdate.getFullYear();
        let hour = pdate.getHours() < 10 ? "0" + pdate.getHours() : pdate.getHours();
        let minute = pdate.getMinutes() < 10 ? "0" + pdate.getMinutes() : pdate.getMinutes();

        let thedate = (isLongDate) ? day + " " + monthNames[monthIndex] + " " + year + " à " + hour + "h" + minute :
            day + " " + monthNames[monthIndex] + " " + year;
        return thedate;
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
            (!isDays ? "" : (isMinutes || isHours) ? "{days} jours, " : "{days} jours et ") +
            (!isHours ? "" : (isMinutes) ? "{hours} heures, " : "{hours} heures et ") +
            (!isMinutes ? "" : "{minutes} minutes et ") +
            ("{seconds} secondes");
        let sentence = pattern
            .replace("{duration}", pattern)
            .replace("{days}", days)
            .replace("{hours}", hours)
            .replace("{minutes}", minutes)
            .replace("{seconds}", seconds);
        return sentence;
    }

}