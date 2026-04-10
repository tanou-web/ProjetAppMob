import { Course } from '../types';

export const allFrench3eCourses: Partial<Course>[] = [
    {
        id: 303,
        title: "Français 3ème",
        description: "Programme officiel : Grammaire, registres de langue, types de phrases et analyse textuelle.",
        level: "3ème",
        subject: "Français",
        lessons: [
            {
                id: 13201,
                order: 1,
                title: "Les registres de langue",
                description: "Distinguer les niveaux familier, courant et soutenu.",
                content: `### Leçon : Les registres de langue

Dans la communication, on adapte son langage en fonction de son interlocuteur et de la situation. On distingue trois principaux registres (ou niveaux) de langue.

**1. Le registre familier**
*   **Usage** : Entre amis, en famille, avec des proches.
*   **Caractéristiques** : Syntaxe simplifiée, abréviations (ex: "t'es" au lieu de "tu es"), vocabulaire argotique ou populaire.
*   **Exemple** : "C'est quoi ce truc ?"

**2. Le registre courant**
*   **Usage** : Vie quotidienne, école, travail, conversations sociales standard.
*   **Caractéristiques** : Grammaire correcte, vocabulaire simple et précis, phrases claires.
*   **Exemple** : "Qu'est-ce que c'est ?"

**3. Le registre soutenu**
*   **Usage** : Écrit (littérature), discours officiels, s'adresser à une autorité.
*   **Caractéristiques** : Vocabulaire riche et rare, syntaxe complexe (inversion sujet-verbe), temps verbaux littéraires (passé simple, imparfait du subjonctif).
*   **Exemple** : "Quel est cet objet ?"

---

### Tableau Comparatif

| Registre Familier | Registre Courant | Registre Soutenu |
| :--- | :--- | :--- |
| Tu piges ? | Est-ce que tu comprends ? | Comprends-tu ? |
| Avoir la frousse | Avoir peur | Être en proie à l'effroi |
| C'est du gâteau | C'est facile | C'est d'une simplicité extrême |`,
                course: 303,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 132011,
                        title: "Identification du registre",
                        description: "Identifier le niveau de langue.",
                        question: "Quel est le registre de la phrase : 'C'est beau' ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "courant",
                        explanation: "La syntaxe est simple et correcte, sans être familière ou recherchée."
                    },
                    {
                        id: 132012,
                        title: "Transformation de registre",
                        description: "Passer du familier au soutenu.",
                        question: "Transformez 'On va où ?' en registre soutenu.",
                        type: "short_answer",
                        difficulty: 3,
                        points: 10,
                        correct_answer: "Où nous rendons-nous ?",
                        explanation: "En registre soutenu, on utilise l'inversion sujet-verbe et le pronom 'nous'."
                    }
                ]
            },
            {
                id: 13202,
                order: 2,
                title: "Les types de phrases",
                description: "Déclarative, Interrogative, Impérative et Exclamative.",
                content: `### Leçon : Les types de phrases

Toute phrase peut être classée selon quatre types principaux en fonction de l'intention de celui qui s'exprime.

**1. La phrase déclarative**
*   **But** : Donner une information, raconter un fait ou exprimer une opinion.
*   **Ponctuation** : Se termine par un point (.).
*   **Exemple** : "Le soleil se lève à l'est."

**2. La phrase interrogative**
*   **But** : Poser une question.
*   **Inversion** : Sujet-verbe ou utilisation de "Est-ce que".
*   **Ponctuation** : Se termine par un point d'interrogation (?).
*   *Interrogation Totale* : Réponse par Oui/Non.
*   *Interrogation Partielle* : Porte sur un élément (Qui, Où, Quand, Comment...).

**3. La phrase impérative (ou injonctive)**
*   **But** : Donner un ordre, un conseil, une interdiction ou faire une prière.
*   **Particularité** : Pas de sujet exprimé.
*   **Ponctuation** : Point (.) ou point d'exclamation (!).
*   **Exemple** : "Fermez la porte."

**4. La phrase exclamative**
*   **But** : Exprimer une émotion forte (joie, colère, surprise...).
*   **Ponctuation** : Se termine par un point d'exclamation (!).
*   **Exemple** : "Comme ce paysage est magnifique !"`,
                course: 303,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 132021,
                        title: "Classification de phrase",
                        description: "Identifier le type de phrase.",
                        question: "Rangez immédiatement cette pièce !",
                        type: "short_answer",
                        difficulty: 2,
                        points: 5,
                        correct_answer: "impérative",
                        explanation: "C'est un ordre donné sans sujet exprimé."
                    },
                    {
                        id: 132022,
                        title: "Analyse de l'interrogation",
                        description: "Totale ou Partielle ?",
                        question: "Dans la phrase 'Où se trouve la mairie ?', l'interrogation est-elle totale ou partielle ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 5,
                        correct_answer: "partielle",
                        explanation: "L'interrogation porte sur le lieu (Où) et non sur une réponse Oui/Non."
                    }
                ]
            },
            {
                id: 13203,
                order: 3,
                title: "Les classes grammaticales",
                description: "Identifier la nature des mots : noms, déterminants, adjectifs, etc.",
                content: `### Leçon : Les classes grammaticales

Chaque mot dans une phrase appartient à une catégorie appelée **classe grammaticale** (ou nature). On distingue les mots variables et les mots invariables.

**1. Les mots variables**
- **Le Nom** : Désigne une personne, un objet, un lieu (ex: Ali, table, Ouagadougou).
- **Le Déterminant** : Précède le nom (ex: le, une, mon, ces).
- **L'Adjectif** : Donne une précision sur le nom (ex: grand, rouge, intelligent).
- **Le Verbe** : Exprime une action ou un état (ex: manger, être).
- **Le Pronom** : Remplace un nom (ex: il, nous, celui-ci).

**2. Les mots invariables**
- **L'Adverbe** : Modifie le sens d'un verbe ou d'un adjectif (ex: hier, très, lentement).
- **La Préposition** : Relie deux mots (ex: à, dans, par, pour, en).
- **La Conjonction** : Relie deux phrases ou mots (ex: mais, ou, et, donc).`,
                course: 303,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 132031,
                        title: "Identification de nature",
                        description: "Identifier l'adjectif.",
                        question: "Dans la phrase 'Le petit chat dort', quel est l'adjectif ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "petit",
                        explanation: "'Petit' qualifie le nom 'chat'."
                    }
                ]
            },
            {
                id: 13204,
                order: 4,
                title: "La lettre privée et officielle",
                description: "Maîtriser la structure et le ton des lettres formelles et informelles.",
                content: `### Leçon : La lettre privée et officielle

Une lettre est un moyen de communication écrite. On distingue deux types principaux selon le destinataire et le contexte.

---

**1. La lettre privée (ou personnelle)**

**Caractéristiques :**
- **Destinataire** : Famille, amis, proches.
- **Ton** : Familier ou courant, affectueux, spontané.
- **Tutoiement** : Généralement utilisé.

**Structure :**
1. **Lieu et date** : En haut à droite (ex: Ouagadougou, le 15 février 2026).
2. **Formule d'appel** : "Cher ami", "Ma chère sœur", etc.
3. **Corps de la lettre** : Introduction, développement, conclusion.
4. **Formule de politesse finale** : "Amicalement", "Je t'embrasse", "Ton ami dévoué".
5. **Signature** : Prénom ou surnom.

---

**2. La lettre officielle (ou administrative)**

**Caractéristiques :**
- **Destinataire** : Administration, autorité, entreprise.
- **Ton** : Soutenu, respectueux, formel.
- **Vouvoiement** : Obligatoire.

**Structure :**
1. **Coordonnées de l'expéditeur** : En haut à gauche (nom, adresse).
2. **Coordonnées du destinataire** : En haut à droite (titre, fonction, adresse).
3. **Lieu et date** : Sous les coordonnées de l'expéditeur.
4. **Objet** : Précise le motif de la lettre.
5. **Formule d'appel** : "Monsieur le Proviseur", "Madame la Directrice".
6. **Corps de la lettre** : Exposé clair et structuré.
7. **Formule de politesse finale** : "Veuillez agréer, Monsieur, l'expression de mes salutations distinguées."
8. **Signature** : Nom complet.

> [!TIP]
> **Astuce** : Dans une lettre officielle, privilégiez le présent de l'indicatif et le passé composé. Évitez les abréviations et le langage familier.`,
                course: 303,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 132041,
                        title: "Identification du type de lettre",
                        description: "Distinguer lettre privée et officielle",
                        question: "Une lettre qui commence par 'Monsieur le Maire' et se termine par 'Veuillez agréer...' est de type :",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "officielle",
                        explanation: "Les formules formelles et le vouvoiement indiquent qu'il s'agit d'une lettre officielle."
                    },
                    {
                        id: 132042,
                        title: "Formule de politesse",
                        description: "Choisir la formule appropriée",
                        question: "Quelle formule de politesse convient pour terminer une lettre à un ami ? (Répondez par un seul mot)",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "Amicalement",
                        explanation: "Pour une lettre privée entre amis, on utilise des formules simples comme 'Amicalement', 'Cordialement', 'Ton ami'."
                    },
                    {
                        id: 132043,
                        title: "Rédaction d'objet",
                        description: "Formuler l'objet d'une lettre officielle",
                        question: "Vous écrivez au Proviseur pour demander une journée de salubrité. Quel objet indiquez-vous ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "Demande d'autorisation pour une journée de salubrité",
                        explanation: "L'objet doit être clair, concis et indiquer précisément le motif de la lettre."
                    }
                ]
            },
            {
                id: 13205,
                order: 5,
                title: "Le récit avec dialogue et portrait",
                description: "Intégrer dialogue et description de personnages dans un récit.",
                content: `### Leçon : Le récit avec dialogue et portrait

Un récit devient plus vivant lorsqu'on y intègre des **dialogues** (paroles des personnages) et des **portraits** (descriptions physiques et morales).

---

**1. Le dialogue dans le récit**

**Fonction :**
- Donner la parole aux personnages.
- Rendre l'action plus dynamique.
- Révéler la personnalité et les émotions.

**Règles de présentation :**
- Chaque réplique commence par un **tiret (—)** ou des **guillemets (« »)**.
- On va à la ligne à chaque changement d'interlocuteur.
- Les **verbes de parole** introduisent ou suivent les répliques : dire, répondre, s'exclamer, murmurer, etc.

**Exemple :**
> — Où vas-tu si vite ? demanda Aminata.  
> — Je vais au marché, répondit Moussa en souriant.

---

**2. Le portrait**

**Définition :**  
Le portrait est la description d'un personnage. Il peut être **physique** (apparence) ou **moral** (caractère, qualités, défauts).

**Portrait physique :**
- Taille, corpulence, visage, yeux, cheveux, vêtements.
- *Exemple* : "Ali était un homme grand et mince, aux yeux noirs perçants."

**Portrait moral :**
- Caractère, comportement, qualités, défauts.
- *Exemple* : "Généreux et courageux, il n'hésitait jamais à aider son prochain."

**Portrait en action :**
On peut aussi révéler le caractère par les actions et les paroles du personnage.

> [!IMPORTANT]
> **Cohérence** : Le portrait doit être cohérent avec les actions du personnage dans le récit.`,
                course: 303,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 132051,
                        title: "Identifier un verbe de parole",
                        description: "Reconnaître les verbes introducteurs de dialogue",
                        question: "Dans la phrase 'Il murmura doucement son secret', quel est le verbe de parole ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "murmura",
                        explanation: "'Murmurer' est un verbe de parole qui indique la manière dont les paroles sont prononcées."
                    },
                    {
                        id: 132052,
                        title: "Portrait physique ou moral ?",
                        description: "Distinguer les deux types de portrait",
                        question: "La phrase 'Fatou avait de longs cheveux tressés' relève du portrait : (physique ou moral ?)",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "physique",
                        explanation: "Cette description concerne l'apparence extérieure, donc le portrait physique."
                    },
                    {
                        id: 132053,
                        title: "Ponctuation du dialogue",
                        description: "Maîtriser la présentation du dialogue",
                        question: "Quel signe de ponctuation utilise-t-on pour introduire une réplique dans un dialogue ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "tiret",
                        explanation: "On utilise le tiret (—) ou les guillemets (« ») pour marquer les répliques dans un dialogue."
                    }
                ]
            },
            {
                id: 13206,
                order: 6,
                title: "L'argumentation",
                description: "Construire un texte argumentatif avec thèse, arguments et exemples.",
                content: `### Leçon : L'argumentation

Argumenter, c'est **défendre une opinion** en apportant des **preuves** pour convaincre le destinataire.

---

**1. Structure d'un texte argumentatif**

Un texte argumentatif bien construit comporte :

**a) La thèse**  
C'est l'**idée principale** que l'on défend ou que l'on combat.  
*Exemple* : "La scolarisation des filles est essentielle pour le développement."

**b) Les arguments**  
Ce sont les **raisons** qui soutiennent la thèse.  
*Exemple* : "Les filles éduquées contribuent mieux à l'économie familiale."

**c) Les exemples**  
Ils **illustrent** et renforcent les arguments.  
*Exemple* : "Au Burkina Faso, les femmes alphabétisées gèrent mieux les petits commerces."

---

**2. Les connecteurs logiques**

Pour organiser l'argumentation, on utilise des **mots de liaison** :

| Fonction | Connecteurs |
|----------|-------------|
| **Addition** | et, de plus, en outre, également |
| **Cause** | car, parce que, en effet, puisque |
| **Conséquence** | donc, ainsi, par conséquent, c'est pourquoi |
| **Opposition** | mais, cependant, pourtant, or, néanmoins |
| **Illustration** | par exemple, notamment, ainsi |

---

**3. Types d'arguments**

- **Argument d'autorité** : On cite un expert ou une source fiable.
- **Argument logique** : On utilise le raisonnement (cause/conséquence).
- **Argument par l'exemple** : On s'appuie sur des faits concrets.

> [!WARNING]
> **Attention** : Un argument doit toujours être en lien direct avec la thèse. Évitez les arguments hors sujet ou contradictoires.`,
                course: 303,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 132061,
                        title: "Identifier la thèse",
                        description: "Repérer l'idée principale",
                        question: "Dans un texte qui défend l'importance du sport à l'école, quelle est la thèse ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "Le sport est important à l'école",
                        explanation: "La thèse est l'idée centrale que l'auteur défend tout au long du texte."
                    },
                    {
                        id: 132062,
                        title: "Connecteur de cause",
                        description: "Utiliser le bon connecteur",
                        question: "Complétez : 'Il faut protéger l'environnement ___ la déforestation menace notre avenir.' (car, donc, mais)",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "car",
                        explanation: "'Car' exprime la cause et introduit la raison pour laquelle il faut protéger l'environnement."
                    },
                    {
                        id: 132063,
                        title: "Argument ou exemple ?",
                        description: "Distinguer argument et exemple",
                        question: "Dans 'L'éducation réduit la pauvreté. Au Rwanda, le taux de scolarisation a fait baisser la pauvreté de 20%', la deuxième phrase est un : (argument ou exemple ?)",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "exemple",
                        explanation: "La deuxième phrase illustre l'argument par un cas concret (le Rwanda)."
                    }
                ]
            }
        ] as any
    }
];
