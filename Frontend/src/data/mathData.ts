import { Course } from '../types';

export const allLocalCourses: Partial<Course>[] = [
    {
        id: 101,
        title: "Mathématiques CP1 - Vocabulaire",
        description: "Concepts de base: plus que, moins que, autant que et identification d'objets.",
        level: "CP1",
        subject: "Mathématiques",
        lessons: [
            {
                id: 1001,
                order: 1,
                title: "Les Cailloux",
                description: "Apprendre à compter des objets réels",
                content: `
### Fiche de Leçon : Les Cailloux

**Objectifs d'apprentissage :**
- L'apprenant doit être capable de compter des objets jusqu'à 10.
- L'apprenant doit être capable d'identifier la quantité "un" et "plusieurs".

**Mots clés :**
Caillou, compter, un, deux, trois, beaucoup, pile, tas.

**DÉROULEMENT :**
1. MANIPULATION : On donne un sac de cailloux à l'élève.
2. ÉTAPE 1 : L'élève sort les cailloux un par un en disant le chiffre.
3. ÉTAPE 2 : On forme des petits tas de 3, 4 ou 5 cailloux.
                `,
                course: 101,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 10001,
                        title: "Comptage simple",
                        description: "Combien y a-t-il de cailloux ?",
                        question: "Si j'ai 3 cailloux et que j'en ajoute 2, combien en ai-je ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 10,
                        correct_answer: "5",
                        explanation: "Il faut faire 3 + 2 = 5."
                    }
                ]
            },
            {
                id: 1002,
                order: 2,
                title: "Les Bâtonnets",
                description: "Identifier les bâtonnets",
                content: "Les bâtonnets nous aident à comprendre les dizaines et les unités.",
                course: 101,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 10002,
                        title: "Les dizaines",
                        description: "Comprendre le groupement par 10",
                        question: "Combien de bâtonnets font une dizaine ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 10,
                        correct_answer: "10",
                        explanation: "Une dizaine est un groupe de 10 unités."
                    }
                ]
            },
            {
                id: 1003,
                order: 3,
                title: "Plus que / Moins que",
                description: "Comparer des quantités",
                content: "Apprendre à comparer deux groupes d'objets.",
                course: 101,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 10003,
                        title: "Comparaison",
                        description: "Plus que ou Moins que ?",
                        question: "Si Ali a 5 pommes et Moussa a 3 pommes, qui en a le plus ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "Ali",
                        explanation: "5 est plus grand que 3."
                    }
                ]
            }
        ] as any
    },
    {
        id: 111,
        title: "Expression Orale CP1",
        description: "S'exprimer sur le corps humain et les objets du quotidien.",
        level: "CP1",
        subject: "Expression Orale",
        lessons: [
            {
                id: 11101,
                order: 1,
                title: "Le corps humain",
                description: "Nommer les parties de son corps.",
                content: `### Leçon : Mon corps

**Notre but aujourd'hui :**
- Tu vas apprendre à nommer les parties de ton corps.
- Tu vas montrer ta tête, tes bras et tes jambes.

**Mots clés :**
Tête, Bras, Main, Jambe, Pied, Ventre.

**Phase d'observation :**
Regarde ton ami. Il a une tête, deux bras et deux jambes. Touche ta tête !

**Phase d'exécution :**
Montre-moi tes mains ! Tape dans tes mains. Montre-moi tes pieds ! Tape des pieds.`,
                course: 111,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 11102,
                order: 2,
                title: "Les objets de la maison",
                description: "Identifier le mobilier et les ustensiles.",
                content: `### Leçon : La maison

**Notre but aujourd'hui :**
- Tu vas nommer les objets que tu utilises à la maison.
- Tu vas dire à quoi ils servent.

**Mots clés :**
Canari, Balai, Natte, Plat, Cuillère.

**Phase d'observation :**
Maman utilise le balai pour nettoyer la cour. On boit de l'eau dans le canari.

**Phase d'exécution :**
À toi ! Que fais-tu avec le balai ? Et avec la cuillère ?`,
                course: 111,
                created_at: new Date().toISOString(),
                exercises: []
            }
        ] as any
    },
    {
        id: 112,
        title: "Lecture CP1",
        description: "Apprentissage des voyelles et des premières consonnes.",
        level: "CP1",
        subject: "Lecture",
        lessons: [
            {
                id: 11201,
                order: 1,
                title: "Les voyelles : i, u, o, a",
                description: "Découverte des sons et des lettres i, u, o, a.",
                content: `### Leçon : Les Voyelles (i, u, o, a)

**Notre but aujourd'hui :**
- Tu vas découvrir les sons [i], [u], [o], [a].
- Tu vas apprendre des phrases clés.

**Phrases clés :**
1. **i** : "Ali est vêtu." (Ali met ses habits)
2. **u** : "Ali est vêtu." (Le son [u] dans "vêtu")
3. **o** : "La moto de papa."
4. **a** : "Papa a un ananas."

**Phase d'exécution :**
Montre-moi la lettre "o" dans "moto".
Dis le son "aaaaaaaa" comme un bébé qui pleure.`,
                course: 112,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 11202,
                order: 2,
                title: "Les voyelles : e, é, è",
                description: "Découverte des sons e, é, è.",
                content: `### Leçon : Les Voyelles (e, é, è)

**Notre but aujourd'hui :**
- Tu vas faire la différence entre "e", "é" et "è".

**Phrases clés :**
1. **e** : "Le vélo." (Le petit mot "le")
2. **é** : "Ali lave un vélo." (Le vélo est sale)
3. **è** : "La chèvre de mon père."

**Jeu des sons :**
Écoute bien : "Bébé". Tu entends [é] ? Oui !
"Mère". Tu entends [è] ? Oui !`,
                course: 112,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 11203,
                order: 3,
                title: "Premières consonnes : l, m",
                description: "Lecture des syllabes avec l et m.",
                content: `### Leçon : Consonnes l et m

**Notre but aujourd'hui :**
- Tu vas marier les consonnes avec les voyelles.
- Tu vas lire tes premières syllabes.

**Syllabes avec l :**
l + a = **la** (La moto)
l + i = **li** (Le lit)
l + o = **lo** (Le vélo)

**Syllabes avec m :**
m + a = **ma** (Maman)
m + i = **mi** (Missa)
m + o = **mo** (Moto)

**Phrase clé :**
"Maman a lavé la moto."`,
                course: 112,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 11204,
                order: 4,
                title: "Consonnes : p, t, r",
                description: "Lecture courante de syllabes simples.",
                content: `### Leçon : Consonnes p, t, r

**Notre but aujourd'hui :**
- Tu vas lire des mots avec p, t, r.

**Lecture :**
1. **p** : Pa-pa. Pi-pe. Po-t.
   *Phrase : "Papa fume la pipe."*

2. **t** : To-to. Tê-te.
   *Phrase : "Toto a mal à la tête."*

3. **r** : Ra-t. Ri-z.
   *Phrase : "Le rat mange le riz."*`,
                course: 112,
                created_at: new Date().toISOString(),
                exercises: []
            }
        ] as any
    },
    {
        id: 102,
        title: "Arithmétique CP2 - Les Nombres",
        description: "Apprentissage des nombres de 0 à 100, additions et soustractions simples.",
        level: "CP2",
        subject: "Mathématiques",
        lessons: [
            {
                id: 2001,
                order: 1,
                title: "Révision : Les nombres de 0 à 20",
                description: "Apprendre à compter, lire et écrire les nombres de 0 à 20.",
                content: `
### Fiche de Leçon : Les nombres de 0 à 20

**Notre but aujourd'hui :**
- Tu vas être capable de compter oralement jusqu'à 20.
- Tu vas être capable d'écrire les nombres de 0 à 20 en chiffres.

**Mots clés :**
Un, deux, trois, dix, onze, douze, vingt, quantité, chiffre, nombre.

**DÉROULEMENT :**

**PHASE DE PRÉSENTATION :**
Nous allons jouer avec les nombres. Regarde bien les images qui vont s'afficher.

**Phase d'observation :**
Regardons ensemble ces objets. "Combien y a-t-il" de cailloux ? Et là, combien de bâtonnets ?

**Phase d'exécution :**
Comptons les nombres de 0 à 20. Appuie sur le bouton pour faire apparaître les nombres !
                `,
                course: 102,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 2003,
                order: 2,
                title: "Les nombres de 20 à 69",
                description: "Compter et identifier les nombres jusqu'à 69.",
                content: `
### Leçon : Les nombres de 20 à 69

**Mots clés :**
Vingt, Trente, Quarante, Cinquante, Soixante, Famille des nombres.

**Phase d'observation :**
Observons comment les nombres grandissent. Après 19, c'est la famille des 20. Après 29, c'est la famille des 30.

**Phase d'exécution :**
Comptons ensemble les nombres de 20 à 69 ! Écoute bien la musique des nombres.
                `,
                course: 102,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 2004,
                order: 3,
                title: "Les nombres de 70 à 100",
                description: "Les particularités : 70, 80, 90 et 100.",
                content: `
### Leçon : Les nombres de 70 à 100

**Mots clés :**
Soixante-dix, Quatre-vingts, Quatre-vingt-dix, Cent.

**Phase d'observation :**
Attention, ici les nombres sont coquins ! Quand on entend "soixante", on doit bien écouter la suite. Si c'est petit, ça commence par 6. Si c'est grand comme "onze", ça commence par 7.

**Phase d'exécution :**
Allons jusqu'au bout ! Comptons les nombres de 70 à 100. Tu es prêt ?
                `,
                course: 102,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 2002,
                order: 4,
                title: "L'addition simple",
                description: "Additionner des nombres sans retenue.",
                content: `
### Leçon : L'addition

**Mots clés :**
Ajouter, Plus, Ensemble, Somme.

**Phase d'observation :**
J'ai 3 bonbons. Mon ami m'en donne 2 de plus. Maintenant, j'en ai 5 ! "Ajouter", c'est mettre tout ensemble.

**Phase de manipulation :**
Prends tes cailloux. Mets-en 4 d'un côté et 3 de l'autre. Pousse-les tous ensemble. Compte tout ! Ça fait 7. Bravo !
                `,
                course: 102,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 2005,
                order: 5,
                title: "La soustraction simple",
                description: "Apprendre à enlever, retirer.",
                content: `
### Leçon : La soustraction

**Mots clés :**
Enlever, Retirer, Moins, Reste.

**Phase d'observation :**
Imagine que tu as 5 biscuits. Tu en manges 2. Il t'en "reste" 3. "Soustraire", c'est quand on en a moins à la fin.

**Phase de manipulation :**
Mets 10 cailloux devant toi. Enlève 3 cailloux et cache-les. Compte ceux qui restent. C'est ça la soustraction !
                `,
                course: 102,
                created_at: new Date().toISOString(),
                exercises: []
            }
        ] as any
    },
    {
        id: 103,
        title: "Géométrie CE1 - Formes et Figures",
        description: "Identification des figures planes : carré, rectangle, triangle et cercle.",
        level: "CE1",
        subject: "Mathématiques",
        lessons: [
            {
                id: 3001,
                order: 1,
                title: "Le Carré et le Rectangle",
                description: "Les polygones",
                content: "### Leçon : Carré et Rectangle\nDifférencier les deux formes par leurs côtés.",
                course: 103,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 30001,
                        title: "Côtés du carré",
                        description: "Propriétés du carré",
                        question: "Combien de côtés a un carré ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 10,
                        correct_answer: "4",
                        explanation: "Un carré a 4 côtés égaux."
                    }
                ]
            },
            {
                id: 3002,
                order: 2,
                title: "Le Triangle",
                description: "Forme à 3 côtés",
                content: "### Leçon : Le Triangle\nUne forme à trois côtés et trois sommets.",
                course: 103,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 30002,
                        title: "Sommets du triangle",
                        description: "Propriétés du triangle",
                        question: "Combien de sommets a un triangle ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 10,
                        correct_answer: "3",
                        explanation: "Le triangle a 3 sommets."
                    }
                ]
            }
        ] as any
    },
    {
        id: 104,
        title: "Mathématiques 3ème - Thalès & Pythagore",
        description: "Théorèmes fondamentaux de la géométrie pour le brevet.",
        level: "3ème",
        subject: "Mathématiques",
        lessons: [
            {
                id: 4001,
                order: 1,
                title: "Théorème de Pythagore",
                description: "Calculer des longueurs dans un triangle rectangle",
                content: "### Leçon : Pythagore\nDans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés.",
                course: 104,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 40001,
                        title: "Application directe",
                        description: "Calcul d'hypoténuse",
                        question: "Un triangle rectangle a des côtés de 3cm et 4cm. Quelle est la longueur de l'hypoténuse ?",
                        type: "short_answer",
                        difficulty: 3,
                        points: 15,
                        correct_answer: "5",
                        explanation: "3² + 4² = 9 + 16 = 25. Racine de 25 = 5."
                    }
                ]
            },
            {
                id: 4002,
                order: 2,
                title: "Théorème de Thalès",
                description: "Proportionnalité dans les triangles",
                content: "### Leçon : Thalès\nSi deux droites parallèles coupent deux sécantes, alors elles déterminent des segments proportionnels.",
                course: 104,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 40002,
                        title: "Rapport de Thalès",
                        description: "Calcul de longueur",
                        question: "Dans une configuration de Thalès, si AB=10, AD=2 et AC=15, combien mesure AE ?",
                        type: "short_answer",
                        difficulty: 4,
                        points: 20,
                        correct_answer: "3",
                        explanation: "AD/AB = AE/AC => 2/10 = AE/15 => AE = (2*15)/10 = 3."
                    }
                ]
            }
        ] as any
    },
    {
        id: 201,
        title: "Expression Orale CP2",
        description: "S'exprimer, décrire, raconter et dialoguer.",
        level: "CP2",
        subject: "Expression Orale",
        lessons: [
            {
                id: 20101,
                order: 1,
                title: "Premier jour de classe",
                description: "Se présenter et identifier les personnes de l'école.",
                content: `### Leçon : Premier jour de classe

**Notre but aujourd'hui :**
- Tu vas apprendre à saluer le maître et te présenter.
- Tu vas dire : "C'est la rentrée des classes".

**Mots clés :**
Directeur, Écolier, Maître, Ami, Rentrée.

**Phase d'observation :**
Regarde dans la cour. C'est la rentrée ! Salue ton maître : "Bonjour Monsieur". Dis ton nom : "Je m'appelle..."

**Phase d'exécution :**
Joue la scène avec ton voisin. Salue-le et présente-toi !`,
                course: 201,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 20102,
                order: 2,
                title: "Mon école",
                description: "Décrire sa classe et son école.",
                content: `### Leçon : Mon École

**Notre but aujourd'hui :**
- Tu vas apprendre à décrire ta classe.
- Tu vas nommer les objets de l'école.

**Mots clés :**
Table, Banc, Tableau, Maître, Maîtresse, École, Cour.

**Phase d'observation :**
Nous sommes en classe. Le maître écrit au tableau. Les élèves sont assis sur les bancs.

**Phase d'exécution :**
Que vois-tu dans ta classe ? Regarde autour de toi et nomme 3 objets.`,
                course: 201,
                created_at: new Date().toISOString(),
                exercises: []
            }
        ] as any
    },
    {
        id: 202,
        title: "Lecture CP2",
        description: "Lecture de mots, de phrases et de petits textes.",
        level: "CP2",
        subject: "Lecture",
        lessons: [
            {
                id: 20201,
                order: 1,
                title: "Étude des sons : am, em",
                description: "Découverte des sons 'am' et 'em'.",
                content: `### Leçon : Le son "am" et "em"

**Notre but aujourd'hui :**
- Tu vas découvrir le son [am] comme dans "Champ".
- Tu vas lire la phrase clé.

**Mots clés :**
Sambo, Daba, Champ, Emporte.

**Phase d'observation :**
Regarde l'image : Sambo va au champ. Il a une daba.
Phrase clé : **"Sambo emporte une daba au champ."**

**Phase d'exécution :**
Lis avec moi :
Sambo... am... Sambo.
Champ... am... Champ.
Emporte... em... Emporte.`,
                course: 202,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 20202,
                order: 2,
                title: "Formation des syllabes (am/em)",
                description: "Lecture de syllabes et de mots.",
                content: `### Leçon : Syllabes avec am/em

**Notre but aujourd'hui :**
- Tu vas chasser les sons "am" et "em".
- Tu vas lire des mots nouveaux.

**Mots clés :**
Lampe, Tam-tam, Tempête, Jambe.

**Phase d'observation :**
Écoute bien : "Ta...m...bou...r". Entends-tu "am" ? Oui !

**Phase d'exécution :**
Lis ces syllabes : PAM, TAM, RAM, MEM, TEM.
Lis ces mots : Une lampe. La jambe.`,
                course: 202,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 20203,
                order: 3,
                title: "Lecture : Sur le chemin de l'école",
                description: "Lecture courante (Page 68).",
                content: `### Leçon : Sur le chemin de l'école

**Notre but aujourd'hui :**
- Tu vas lire un petit texte tout seul.
- Tu vas répondre aux questions sur l'histoire.

**Mots clés :**
École, Cartable, Chemin, Amis.

**Phase d'observation :**
Regarde l'image du livre page 68. On voit les élèves qui marchent vers l'école.

**Phase d'exécution :**
*(Texte adapté)*
Moussa et Fatou vont à l'école. Ils ont leurs sacs. Sur le chemin, ils chantent. Ils sont contents d'arriver en classe.

**As-tu bien compris ?**
1. Qui va à l'école ?
2. Sont-ils tristes ou contents ?`,
                course: 202,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 20204,
                order: 4,
                title: "Situation : Mariétou et ses amis",
                description: "Lecture de sons complexes et phrases.",
                content: `### Leçon : Mariétou et ses amis

**Notre but aujourd'hui :**
- Tu vas lire des mots difficiles avec "ph", "ien", "ion".
- Tu vas découvrir l'histoire de Mariétou.

**Mots clés :**
Mariétou, Safiatou, Avion, Chien, Lion.

**Phase d'observation :**
Mariétou est malade. Ses cousins viennent la voir. Un ami lui apporte un livre pour lire.

**Phase d'exécution :**
Lis les mots difficiles :
- Olivier, un pied.
- Un vieux chien.
- C'est un avion.
- Il est fort comme un lion.

**Phrase clé :**
"Rien n'est facile. Il est sérieux."`,
                course: 202,
                created_at: new Date().toISOString(),
                exercises: []
            }
        ] as any
    },
    {
        id: 301,
        title: "Français CE1",
        description: "Grammaire, Conjugaison, Orthographe et Expression Orale.",
        level: "CE1",
        subject: "Français",
        lessons: [
            {
                id: 30101,
                order: 1,
                title: "Grammaire : Le Nom",
                description: "Identifier le nom et ses déterminants.",
                content: `### Leçon : Le Nom

**Notre but aujourd'hui :**
- Tu vas apprendre à reconnaître les noms dans une phrase.
- Le nom sert à désigner une personne, un animal ou une chose.

**Texte de lecture :**
"Le vieillard enferme un mouton. Le riz est bon. Madina apprête le lait."

**Phase d'observation :**
Regarde les mots soulignés :
- **Mouton** : C'est un animal.
- **Riz** : C'est une chose (nourriture).
- **Madina** : C'est une personne.

**Phase d'exécution :**
Souligne les noms dans cette phrase :
"Papa achète un vélo."`,
                course: 301,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 30102,
                order: 2,
                title: "Conjugaison : Le verbe chanter",
                description: "Le présent de l'indicatif (1er groupe).",
                content: `### Leçon : Le verbe Chanter

**Notre but aujourd'hui :**
- Tu vas apprendre à conjuguer le verbe chanter au présent.
- C'est une action que l'on fait maintenant.

**Phase d'observation :**
À l'école, nous chantons l'hymne national.
Moi, je chante. Et toi ? Tu chantes.

**Tableau de conjugaison :**
- Je chant**e**
- Tu chant**es**
- Il/Elle chant**e**
- Nous chant**ons**
- Vous chant**ez**
- Ils/Elles chant**ent**

**Phase d'exécution :**
Complète : "Aujourd'hui, nous ... (chanter) en classe."`,
                course: 301,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 30103,
                order: 3,
                title: "Orthographe : pr, tr, vr, br",
                description: "Les articulations composées avec 'r'.",
                content: `### Leçon : Sons complexes avec R

**Notre but aujourd'hui :**
- Tu vas lire et écrire des mots avec pr, tr, vr, br...

**Texte de lecture :**
"Demain, les enfants vont reprendre le chemin de l’école. Le petit Raogo va trouver Sita :
— Sita, est-ce que tu es **prête** pour la **rentrée** ?
— Oui, mon père m'a acheté une **trousse**."

**Mots clés :**
Prête, Rentrée, Trousse, Arbre, Chevreau.

**Phase d'exécution :**
Lis très vite : "Trois gros rats gris."`,
                course: 301,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 30104,
                order: 4,
                title: "Expression Orale : Qu'est-ce que ?",
                description: "Poser des questions avec 'Qu'est-ce que'.",
                content: `### Leçon : "Qu'est-ce que ?"

**Notre but aujourd'hui :**
- Tu vas apprendre à poser des questions.

**Histoire :**
Bako tombe de l’arbre en poussant un grand cri.
Le berger lui demande : « **Qu’est-ce que** tu as petit ? »
Mais Bako pleure et ne répond pas.

**Phase d'exécution :**
Pose une question à ton ami avec "Qu'est-ce que..."
Exemple : "Qu'est-ce que tu manges ?"`,
                course: 301,
                created_at: new Date().toISOString(),
                exercises: []
            }
        ] as any
    },
    {
        id: 501,
        title: "Mathématiques 5ème",
        description: "Programme officiel de 5ème : Nombres relatifs, fractions, géométrie et statistiques.",
        level: "5ème",
        subject: "Mathématiques",
        lessons: [
            {
                id: 5001,
                order: 1,
                title: "Les nombres relatifs",
                description: "Découverte des nombres positifs, négatifs et de la droite graduée.",
                content: `### Leçon : Les nombres relatifs

**Objectifs :**
*   Comprendre la notion de nombre relatif (positif ou négatif).
*   Repérer un point sur une droite graduée.
*   Connaître la notion d'opposé.
*   Comparaison et rangement.

**1. Définitions**
*   Un **nombre positif** est un nombre supérieur à zéro (ex: +3, 5). On peut supprimer le signe +.
*   Un **nombre négatif** est un nombre inférieur à zéro (ex: -3, -12.5). Le signe - est obligatoire.
*   Les nombres positifs et négatifs forment l'ensemble des **nombres relatifs**.
*   Zéro est le seul nombre à la fois positif et négatif.

**2. La droite graduée et le repérage**
Sur une droite graduée, chaque point est repéré par un nombre relatif appelé son **abscisse**.
*   L'origine correspond au nombre 0.
*   Le sens de la droite est généralement de la gauche vers la droite (croissant).
*   La **distance à zéro** est la distance entre le point et l'origine (toujours positive).

**3. Opposé d'un nombre**
Deux nombres sont **opposés** s'ils ont la même distance à zéro mais des signes contraires.
*   Exemple : L'opposé de 5 est -5. L'opposé de -12 est 12.
*   La somme de deux nombres opposés est toujours égale à 0.

**4. Comparaison**
*   Un nombre positif est toujours plus grand qu'un nombre négatif (ex: 2 > -10).
*   Pour deux nombres négatifs, le plus grand est celui qui a la **plus petite distance à zéro** (ex: -2 > -5 car -2 est plus proche de zéro).`,
                course: 501,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 50001,
                        title: "Comparaison de relatifs",
                        description: "Comparer deux nombres relatifs",
                        question: "Quel nombre est le plus grand : -3 ou -6 ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "-3",
                        explanation: "Sur la droite graduée, -3 est à droite de -6, il est donc plus grand (car plus proche de zéro)."
                    }
                ]
            },
            {
                id: 5002,
                order: 2,
                title: "Les nombres rationnels (Fractions)",
                description: "Égalité, simplification et addition de fractions.",
                content: `### Leçon : Les nombres rationnels

**Objectifs :**
*   Reconnaître et produire des fractions égales.
*   Simplifier une fraction.
*   Additionner et soustraire des nombres en écriture fractionnaire.

**1. Fractions égales**
On ne change pas la valeur d'une fraction si on multiplie (ou divise) son numérateur et son dénominateur par un même nombre non nul.
*   Exemple : 2/3 = (2×4)/(3×4) = 8/12.

**2. Simplification**
Simplifier une fraction, c'est trouver une fraction égale avec un numérateur et un dénominateur plus petits.
*   Exemple : 15/20. On divise par 5 en haut et en bas => 3/4.

**3. Addition et Soustraction**
Pour additionner ou soustraire deux fractions, elles doivent avoir le **même dénominateur**.
*   Si le dénominateur est le même : on ajoute les numérateurs et on garde le dénominateur.
*   Si les dénominateurs sont différents : on les met au même dénominateur d'abord.`,
                course: 501,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 50002,
                        title: "Simplification",
                        description: "Simplifier une fraction",
                        question: "Simplifie la fraction 10/14 au maximum.",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "5/7",
                        explanation: "On divise 10 et 14 par 2 (leur pgcd)."
                    }
                ]
            },
            {
                id: 5003,
                order: 3,
                title: "Divisibilité et nombres premiers",
                description: "Critères de divisibilité et décomposition.",
                content: `### Leçon : Divisibilité et Nombres Premiers

**1. Divisibilité**
Un nombre entier $a$ est divisible par un entier $b$ si le reste de la division euclidienne de $a$ par $b$ est nul.

**Critères de divisibilité :**
*   Par 2 : se termine par 0, 2, 4, 6, 8.
*   Par 5 : se termine par 0 ou 5.
*   Par 10 : se termine par 0.
*   Par 3 : la somme des chiffres est divisible par 3.
*   Par 9 : la somme des chiffres est divisible par 9.
*   Par 4 : le nombre formé par les deux derniers chiffres est divisible par 4.

**2. Nombres Premiers**
Un nombre est **premier** s'il possède exactement deux diviseurs : 1 et lui-même.
*   Liste des premiers nombres premiers : 2, 3, 5, 7, 11, 13, 17, 19, 23...
*   Le nombre 1 n'est pas premier.

**3. Décomposition**
Tout nombre entier supérieur à 1 peut s'écrire de manière unique comme un produit de facteurs premiers.`,
                course: 501,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 50003,
                        title: "Critère par 3",
                        description: "Identifier un multiple de 3",
                        question: "Est-ce que le nombre 123 est divisible par 3 ? (Oui/Non)",
                        type: "short_answer",
                        difficulty: 1,
                        points: 10,
                        correct_answer: "Oui",
                        explanation: "1 + 2 + 3 = 6, et 6 est divisible par 3."
                    }
                ]
            },
            {
                id: 5004,
                order: 4,
                title: "Expressions littérales (Calcul littéral)",
                description: "Simplifier et produire une expression littérale.",
                content: `### Leçon : Calcul Littéral

**1. Vocabulaire**
Une expression littérale est une expression mathématique contenant une ou plusieurs lettres qui désignent des nombres.

**2. Simplification d'écriture**
Pour alléger l'écriture, on peut supprimer le signe "×" devant une lettre ou une parenthèse.
*   $3 × a$ s'écrit $3a$.
*   $a × b$ s'écrit $ab$.
*   $1 × x$ s'écrit $x$.
*   $x × x$ s'écrit $x^2$.

**3. Distributivité simple**
Pour tous nombres k, a et b :
*   $k(a + b) = ka + kb$
*   On dit qu'on **développe** l'expression.
*   Exemple : $3(x + 4) = 3x + 12$.`,
                course: 501,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 5005,
                order: 5,
                title: "Les statistiques",
                description: "Fréquence et moyenne.",
                content: `### Leçon : Statistiques

**1. Effectif et fréquences**
*   L'**effectif** d'une donnée est le nombre de fois que cette donnée apparaît.
*   L'**effectif total** est la somme de tous les effectifs.
*   La **fréquence** est le quotient de l'effectif de la valeur par l'effectif total (souvent exprimée en pourcentage).

**2. Moyenne**
La moyenne d'une série de valeurs est le quotient de la somme de toutes les valeurs par l'effectif total.
*   Exemple : Notes 10, 12, 14.
*   Moyenne = (10 + 12 + 14) / 3 = 12.`,
                course: 501,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 5006,
                order: 6,
                title: "Les probabilités",
                description: "Introduction au hasard.",
                content: `### Leçon : Probabilités

Une expérience est dite **aléatoire** si on ne peut pas prévoir avec certitude son résultat.
*   Chaque résultat possible est une **issue**.
*   Un **événement** est un ensemble d'issues.
*   La **probabilité** d'un événement est un nombre compris entre 0 (événement impossible) et 1 (événement certain) qui mesure les chances qu'il se réalise.`,
                course: 501,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 5007,
                order: 7,
                title: "La proportionnalité",
                description: "Reconnaître et utiliser la proportionnalité.",
                content: `### Leçon : Proportionnalité

**1. Tableau de proportionnalité**
Deux grandeurs sont proportionnelles si on peut passer de l'une à l'autre en multipliant par un même nombre appelé **coefficient de proportionnalité**.

**2. Quatrième proportionnelle**
Dans un tableau de proportionnalité à 4 cases, si on connaît 3 valeurs, on peut calculer la 4ème.
*   Produit en croix : Si $\frac{a}{b} = \frac{c}{d}$, alors $a \times d = b \times c$.

**3. Pourcentages**
Un pourcentage est une fraction de dénominateur 100.
*   Calculer $p\%$ d'un nombre, c'est multiplier ce nombre par $\frac{p}{100}$.`,
                course: 501,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 5008,
                order: 8,
                title: "Grandeurs et mesures (Aires et volumes)",
                description: "Conversions et calculs.",
                content: `### Leçon : Grandeurs et Mesures

**Conversions de durées :**
*   1h = 60 min
*   1 min = 60 s

**Aires et Périmètres :**
*   Rectangle : Aire = $L \times l$, Périmètre = $2 \times (L + l)$
*   Triangle : Aire = $(base \times hauteur) / 2$
*   Disque : Aire = $\pi \times R^2$, Périmètre = $2 \times \pi \times R$`,
                course: 501,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 5009,
                order: 9,
                title: "Se repérer dans l'espace",
                description: "Abscisse, ordonnée et altitude.",
                content: `### Leçon : Repérage

Pour se repérer dans un plan, on utilise un repère formé de deux axes sécants (souvent orthogonaux).
*   Un point est repéré par ses coordonnées $(x ; y)$.
*   $x$ est l'**abscisse** (axe horizontal).
*   $y$ est l'**ordonnée** (axe vertical).

Dans l'espace (pavé droit), on peut utiliser 3 coordonnées.`,
                course: 501,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 5010,
                order: 10,
                title: "Les angles",
                description: "Angles alternes-internes et somme des angles.",
                content: `### Leçon : Les Angles

**1. Somme des angles d'un triangle**
Dans un triangle, la somme des mesures des trois angles est toujours égale à **180°**.

**2. Angles et parallélisme**
Si deux droites parallèles sont coupées par une sécante :
*   Les angles **alternes-internes** sont égaux.
*   Les angles **correspondants** sont égaux.`,
                course: 501,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 5011,
                order: 11,
                title: "La symétrie centrale",
                description: "Transformation géométrique.",
                content: `### Leçon : Symétrie Centrale

Deux figures sont symétriques par rapport à un point O si elles se superposent par un demi-tour autour de ce point.
*   Le point O est le **centre de symétrie**.
*   Le symétrique d'un segment est un segment de même longueur et parallèle.
*   La symétrie centrale conserve les longueurs, les angles et les aires.`,
                course: 501,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 5012,
                order: 12,
                title: "Les triangles (Construction et inégalité)",
                description: "Inégalité triangulaire et médiatrices.",
                content: `### Leçon : Triangles

**1. Inégalité triangulaire**
Dans un triangle, la longueur de chaque côté est inférieure à la somme des longueurs des deux autres côtés.
*   Pour que le triangle existe, la plus grande longueur doit être inférieure à la somme des deux autres.
*   Si égalité : les points sont alignés (triangle aplati).

**2. Médiatrices**
La médiatrice d'un segment est la droite perpendiculaire à ce segment en son milieu.
Les 3 médiatrices d'un triangle sont concourantes en un point appelé le centre du cercle circonscrit.`,
                course: 501,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 5013,
                order: 13,
                title: "Les parallélogrammes",
                description: "Propriétés et reconnaissance.",
                content: `### Leçon : Parallélogrammes

**Définition :**
Un parallélogramme est un quadrilatère qui a ses côtés opposés parallèles deux à deux.

**Propriétés :**
*   Les diagonales se coupent en leur milieu.
*   Les côtés opposés sont de même longueur.
*   Les angles opposés sont de même mesure.
*   Le centre de symétrie est le point d'intersection des diagonales.

**Parallélogrammes particuliers :**
*   Rectangle (4 angles droits)
*   Losange (4 côtés égaux)
*   Carré (4 angles droits + 4 côtés égaux)`,
                course: 501,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 5014,
                order: 14,
                title: "Algorithmique et Programmation",
                description: "Déplacements et boucles avec Scratch.",
                content: `### Leçon : Algorithmique

**1. Algorithme**
Un algorithme est une suite d’instructions précises qui permet de résoudre un problème ou d’accomplir une tâche.

**2. Programmation par blocs (Scratch)**
*   **Les événements** : "Quand le drapeau vert est cliqué"...
*   **Les mouvements** : "Avancer de 10 pas", "Tourner de 90 degrés"...
*   **Les boucles** : "Répéter 10 fois", "Répéter indéfiniment"...
Cela permet de faire dessiner des figures ou bouger des lutins.`,
                course: 501,
                created_at: new Date().toISOString(),
                exercises: []
            }
        ] as any
    }
];

