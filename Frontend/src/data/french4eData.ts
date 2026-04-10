import { Course } from '../types';

export const allFrench4eCourses: Partial<Course>[] = [
    {
        id: 402,
        title: "Français 4ème",
        description: "Programme officiel : Rédaction d'articles, descriptions, récits et maîtrise de la langue.",
        level: "4ème",
        subject: "Français",
        lessons: [
            // MODULE: Expression Écrite / Communication
            {
                id: 13001,
                order: 1,
                title: "Produire un article d’information",
                description: "Apprendre les bases du journalisme scolaire : faits, sources et structure.",
                content: `### Leçon : L'article d'information

**1. Qu'est-ce qu'un article d'information ?**
*   C'est un texte court qui rapporte un événement réel.
*   Il répond aux questions : **Qui ? Quoi ? Où ? Quand ? Comment ? Pourquoi ?**

**2. La structure de l'article**
*   **Le titre** : Il doit être accrocheur et résumer le sujet.
*   **Le chapeau (lead)** : Un court paragraphe qui donne l'essentiel de l'info.
*   **Le corps de l'article** : Les détails du déroulement de l'événement.
*   **Les citations** : Rapporter les paroles des témoins ou des acteurs.

**3. Le style journalistique**
*   Utiliser des phrases courtes.
*   Être objectif (ne pas donner son avis personnel).
*   Utiliser un vocabulaire précis.`,
                course: 402,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 130001,
                        title: "Quiz Article",
                        description: "Les questions de base",
                        question: "Quelles sont les 5 questions clés auxquelles doit répondre un article ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 10,
                        correct_answer: "Qui, Quoi, Où, Quand, Pourquoi",
                        explanation: "Aussi appelées les 5W en anglais, elles permettent de couvrir tous les aspects d'un événement."
                    }
                ]
            },
            {
                id: 13002,
                order: 2,
                title: "Rédiger une description complète",
                description: "Savoir décrire un lieu, un objet ou une personne avec précision.",
                content: `### Leçon : L'art de la description

**1. Organiser sa description**
*   On peut aller du général au particulier, ou de haut en bas.
*   Utiliser des connecteurs spatiaux : *au premier plan, à l'arrière-plan, sur la gauche, au centre...*

**2. Les outils de la description**
*   **L'observation** : Utiliser les 5 sens (vue, ouïe, odorat...).
*   **Les adjectifs qualificatifs** : Pour apporter de la précision (couleurs, formes, textures).
*   **Les expansions du nom** : Compléments du nom et propositions subordonnées relatives.

**3. Le portrait**
*   Décrire l'aspect physique (le corps, le visage, les vêtements).
*   Décrire le caractère et l'attitude (le moral).`,
                course: 402,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 13003,
                order: 3,
                title: "Produire un récit comportant des péripéties",
                description: "Structurer une narration complexe avec des rebondissements.",
                content: `### Leçon : Le schéma narratif complexe

**1. Les étapes du récit**
1.  **Situation initiale** : Qui, où, quand ? (souvent à l'imparfait).
2.  **Élément perturbateur** : Ce qui déclenche l'action (passé simple).
3.  **Péripéties** : Les aventures et obstacles rencontrés.
4.  **Élément de résolution** : Fin de l'action.
5.  **Situation finale** : Le nouvel état des personnages.

**2. Créer du suspense**
*   Utiliser des ellipses narratives (passer sous silence des moments).
*   Utiliser des retours en arrière (analepses).
*   Décrire les émotions du héros face aux obstacles.`,
                course: 402,
                created_at: new Date().toISOString(),
                exercises: []
            },
            // MODULE: Grammaire
            {
                id: 13010,
                order: 10,
                title: "La phrase complexe : juxtaposition et coordination",
                description: "Relier des propositions entre elles.",
                content: `### Leçon : Les propositions indépendantes

Une phrase complexe contient plusieurs verbes conjugués.

**1. La juxtaposition**
*   Les propositions sont séparées par un signe de ponctuation faible (virgule, point-virgule, deux-points).
*   *Exemple* : Il pleut, je prends mon parapluie.

**2. La coordination**
*   Les propositions sont reliées par une conjonction de coordination (*mais, ou, et, donc, or, ni, car*) ou un adverbe de liaison (*puis, alors, pourtant...*).
*   *Exemple* : Il pleut **donc** je prends mon parapluie.

**3. La ponctuation et le sens**
*   Les deux-points peuvent exprimer la cause ou la conséquence.`,
                course: 402,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 13011,
                order: 11,
                title: "La subordination : la relative et la complétive",
                description: "Comprendre les propositions subordonnées de base.",
                content: `### Leçon : Introduction à la subordination

**1. La proposition subordonnée relative**
*   Introduite par un pronom relatif (*qui, que, dont, où...*).
*   Elle complète un nom (l'antécédent).
*   *Exemple* : Le livre **que je lis** est passionnant.

**2. La proposition subordonnée complétive**
*   Introduite par la conjonction "que".
*   Elle complète souvent un verbe et a la fonction de COD.
*   *Exemple* : Je pense **que tu as raison**.

**3. Différence majeure**
*   La relative complète un **nom**.
*   La complétive complète un **verbe**.`,
                course: 402,
                created_at: new Date().toISOString(),
                exercises: []
            },
            // MODULE: Conjugaison
            {
                id: 13020,
                order: 20,
                title: "Les valeurs des temps du récit",
                description: "Savoir quand utiliser l'imparfait ou le passé simple.",
                content: `### Leçon : Imparfait vs Passé Simple

**1. L'imparfait (temps de l'arrière-plan)**
*   Actions qui durent ou se répètent.
*   Descriptions et portraits.
*   Habitues du passé.

**2. Le passé simple (temps du premier plan)**
*   Actions brèves et soudaines.
*   Actions successives (énumération d'actions).
*   Actions limitées dans le temps.

**3. Le mélange des deux**
*   *Exemple* : "Il dormait (imparfait) quand le cri retentit (passé simple)."`,
                course: 402,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 13022,
                order: 22,
                title: "Le mode subjonctif présent",
                description: "Exprimer le souhait, le doute ou l'obligation.",
                content: `### Leçon : Le Subjonctif Présent

**1. Emploi**
*   Le subjonctif exprime une action incertaine, voulue ou sentie.
*   On le trouve souvent après "que".
*   Expression de la volonté : *Il faut que...*, *Je veux que...*

**2. Formation**
*   Radical de la 3ème personne du pluriel au présent (ils mang-ent).
*   Terminaisons : **-e, -es, -e, -ions, -iez, -ent**.
*   *Attention aux verbes du 3ème groupe* : que je sache, que je sois, que j'aie...

**3. Valeurs**
*   Le souhait : *Pourvu qu'il vienne !*
*   L'ordre : *Qu'il parte immédiatement !*`,
                course: 402,
                created_at: new Date().toISOString(),
                exercises: []
            }
        ] as any
    }
];
