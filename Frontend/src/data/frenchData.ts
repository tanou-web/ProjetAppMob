import { Course } from '../types';

export const allFrenchCourses: Partial<Course>[] = [
    {
        id: 502,
        title: "Français 5ème",
        description: "Programme complet de Français 5ème : Grammaire, Conjugaison, Orthographe et Littérature.",
        level: "5ème",
        subject: "Français",
        lessons: [
            // MODULE: Grammaire
            {
                id: 6001,
                order: 1,
                title: "La ponctuation",
                description: "Les signes de ponctuation et leur rôle dans la phrase.",
                content: `### Leçon : La ponctuation

La ponctuation permet de structurer un texte, de marquer des pauses et d'en préciser le sens ou l'intonation.

**1. La ponctuation en fin de phrase**
*   **Le point (.)** : Termine une phrase déclarative. La voix descend.
*   **Le point d'interrogation (?)** : Pose une question. La voix monte.
*   **Le point d'exclamation (!)** : Exprime une émotion (joie, colère, surprise) ou un ordre. La voix monte.
*   **Les points de suspension (...)** : Signalent une phrase inachevée, une hésitation ou une liste qui continue.

**2. La ponctuation à l'intérieur de la phrase**
*   **La virgule (,)** : Marque une courte pause sans que la voix change. Elle sépare des mots ou des groupes de mots.
*   **Le point-virgule (;)** : Sépare deux parties d'une phrase qui ont un lien de sens, mais qui pourraient être deux phrases séparées. La pause est plus longue que pour la virgule.
*   **Les deux-points (:)** : Introduisent une explication, une citation ou une liste.

**3. Les autres signes**
*   **Les guillemets (" ")** : Encadrent des paroles rapportées (dialogue ou citation).
*   **Les tirets (—)** : Marquent le changement d'interlocuteur dans un dialogue.
*   **Les parenthèses ( )** : Permettent d'ajouter une information complémentaire ou une précision.`,
                course: 502,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 60001,
                        title: "Identification du signe",
                        description: "Choisir le bon signe de ponctuation",
                        question: "Quel signe utilise-t-on pour poser une question ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 10,
                        correct_answer: "?",
                        explanation: "Le point d'interrogation est utilisé pour les phrases interrogatives."
                    }
                ]
            },
            {
                id: 6002,
                order: 2,
                title: "La classe et la fonction grammaticales",
                description: "Différencier la nature (classe) et le rôle (fonction) d'un mot.",
                content: `### Leçon : Classe et Fonction

**1. La classe grammaticale (la nature)**
C'est l'identité du mot, ce qu'il est. Elle ne change pas, quelle que soit la phrase.
*   **Noms** : chat, liberté, Marie.
*   **Déterminants** : le, une, mon, ces.
*   **Adjectifs** : grand, bleu, joyeux.
*   **Verbes** : courir, être, manger.
*   **Pronoms** : je, lui, celui-ci.
*   **Mots invariables** : mais, bien, rapidement.

**2. La fonction grammaticale**
C'est le rôle du mot dans la phrase, ce qu'il fait. Elle peut changer selon la phrase.
*   **Sujet** : fait l'action. (Ex: **Le chat** dort.)
*   **Complément d'Objet (COD/COI)** : complète le verbe. (Ex: Il mange **une pomme**.)
*   **Attribut du sujet** : donne une caractéristique au sujet via un verbe d'état. (Ex: Il est **gentil**.)
*   **Complément circonstanciel** : précise le temps, le lieu, la manière. (Ex: Il court **vite**.)`,
                course: 502,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 6003,
                order: 3,
                title: "Les déterminants",
                description: "Articles, adjectifs possessifs, démonstratifs...",
                content: `### Leçon : Les déterminants

Le déterminant est un mot placé devant le nom pour former un groupe nominal. Il indique le genre et le nombre.

**1. Les articles**
*   **Définis** : le, la, l', les (objet connu).
*   **Indéfinis** : un, une, des (objet quelconque).
*   **Partitifs** : du, de la, des (quantité indénombrable : du pain).

**2. Les déterminants possessifs**
Indiquent l'appartenance : mon, ton, son, notre, votre, leur, mes, tes, ses...

**3. Les déterminants démonstratifs**
Permettent de montrer : ce, cet, cette, ces.

**4. Les autres déterminants**
*   **Numéraux** : un, deux, mille (indiquent le nombre).
*   **Indéfinis** : chaque, plusieurs, certains.
*   **Interrogatifs/Exclamatifs** : quel, quelle.`,
                course: 502,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 6004,
                order: 4,
                title: "L'adjectif qualificatif",
                description: "L'accord et les degrés de l'adjectif.",
                content: `### Leçon : L'adjectif qualificatif

**1. L'accord**
L'adjectif se rapporte à un nom ou un pronom. Il s'accorde en **genre** (masculin/féminin) et en **nombre** (singulier/pluriel) avec ce nom.

**2. Les fonctions de l'adjectif**
*   **Épithète** : placé directement à côté du nom. (Ex: Un **petit** chien.)
*   **Attribut du sujet** : séparé du sujet par un verbe d'état. (Ex: Ce chien est **petit**.)

**3. Les degrés de l'adjectif**
*   **Le comparatif** : comparatif de supériorité (plus... que), d'égalité (aussi... que), d'infériorité (moins... que).
*   **Le superlatif** : superlatif relatif (le plus, le moins) ou absolu (très, extrêmement).`,
                course: 502,
                created_at: new Date().toISOString(),
                exercises: []
            },
            // ... Plus de leçons de grammaire simplifiées
            {
                id: 6018,
                order: 18,
                title: "Les temps simples de l'indicatif",
                description: "Présent, Imparfait, Futur simple, Passé simple.",
                content: `### Leçon : Les temps simples de l'indicatif

**1. Le Présent** : Pour une action en cours ou une vérité générale.
*   Terminaisons régulières : -e, -es, -e, -ons, -ez, -ent (1er groupe) ; -is, -is, -it, -issons, -issez, -issent (2ème groupe).

**2. L'Imparfait** : Pour une description dans le passé ou une habitude.
*   Terminaisons : -ais, -ais, -ait, -ions, -iez, -aient (tous les groupes).

**3. Le Passé Simple** : Pour une action brève et achevée dans le passé.
*   1er groupe : -ai, -as, -a, -âmes, -âtes, -èrent.
*   2ème groupe : -is, -is, -it, -îmes, -îtes, -irent.

**4. Le Futur Simple** : Pour une action à venir.
*   Terminaisons : -rai, -ras, -ra, -rons, -rez, -ront.`,
                course: 502,
                created_at: new Date().toISOString(),
                exercises: []
            },
            // MODULE: Orthographe et Vocabulaire
            {
                id: 6024,
                order: 24,
                title: "L'accord du verbe avec le sujet",
                description: "Règles d'accord simples et complexes.",
                content: `### Leçon : L'accord sujet-verbe

Le verbe s'accorde toujours en personne et en nombre avec son sujet.

**1. Règle générale**
On identifie le sujet en posant la question "Qui est-ce qui... ?".
*   Ex: Les enfants (sujet) jouent (verbe).

**2. Cas particuliers**
*   **Plusieurs sujets** : Le verbe se met au pluriel. (Ex: Paul et Lucie jouent.)
*   **Sujet inversé** : Même si le sujet est après le verbe, il faut l'accorder. (Ex: Dans la cour jouent les enfants.)
*   **Sujet collectif** : L'accord se fait souvent au singulier ou selon le sens. (Ex: Une foule de gens s'approche.)`,
                course: 502,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 6030,
                order: 30,
                title: "Le champ lexical",
                description: "Identifier et utiliser les champs lexicaux.",
                content: `### Leçon : Le champ lexical

Un champ lexical est un ensemble de mots qui se rapportent à une même idée ou un même thème.

**Exemple : Le champ lexical de la mer**
*   Bateau, vagues, salé, naviguer, océan, plage, bleu...

**À quoi ça sert ?**
*   À identifier le thème principal d'un texte.
*   À créer une atmosphère particulière dans une rédaction.`,
                course: 502,
                created_at: new Date().toISOString(),
                exercises: []
            },
            // MODULE: Culture Littéraire
            {
                id: 6033,
                order: 33,
                title: "Le voyage et l'aventure",
                description: "Découverte des récits de voyage et de l'aventure.",
                content: `### Leçon : Le voyage et l'aventure

Ce thème explore la soif de découverte et les épreuves rencontrées par les voyageurs.

**1. Les types de récits**
*   **Le carnet de voyage** : récit réel (ex: Marco Polo, "Le Livre des Merveilles").
*   **Le roman d'aventures** : récit fictif centré sur l'action et le dépaysement (ex: Jules Verne).

**2. Les caractéristiques**
*   Le héros quitte son milieu habituel.
*   Il affronte l'inconnu, des dangers et des monstres.
*   Le récit est souvent chronologique.`,
                course: 502,
                created_at: new Date().toISOString(),
                exercises: []
            },
            // MODULE: Étude de Textes
            {
                id: 6040,
                order: 40,
                title: "Les figures de style",
                description: "Comparaison, métaphore, personnification.",
                content: `### Leçon : Les figures de style

Les figures de style permettent d'exprimer une idée de façon imagée ou expressive.

**1. Les figures d'analogie (ressemblance)**
*   **La comparaison** : Rapproche deux éléments avec un mot outil (comme, tel que, semblable à). (Ex: Il est fort comme un lion.)
*   **La métaphore** : Rapproche deux éléments sans mot outil. (Ex: Cet homme est un lion.)
*   **La personnification** : Donne des traits humains à un objet ou un animal. (Ex: La forêt gémit sous le vent.)

**2. Les figures d'exagération**
*   **L'hyperbole** : Exagère une idée pour frapper les esprits. (Ex: Je meurs de soif.)`,
                course: 502,
                created_at: new Date().toISOString(),
                exercises: []
            }
        ] as any
    }
];

