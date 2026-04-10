import { Course } from '../types';

export const allSVTCourses: Partial<Course>[] = [
    {
        id: 505,
        title: "SVT 5ème",
        description: "Sciences de la Vie et de la Terre : la planète, le vivant et la santé humaine.",
        level: "5ème",
        subject: "SVT",
        lessons: [
            {
                id: 9001,
                order: 1,
                title: "La Terre dans le système solaire",
                description: "La place unique de la Terre et les conditions de la vie.",
                content: `### Leçon : La Terre, une planète habitée

**1. Une place privilégiée**
*   La Terre est la 3ème planète du système solaire.
*   Elle se situe dans la **zone d'habitabilité** : ni trop près ni trop loin du Soleil.

**2. Les conditions de la vie**
*   **Température clé** : La distance au Soleil permet à l'eau d'exister sous forme **liquide**.
*   **Atmosphère** : Elle contient de l'oxygène et nous protège des rayons dangereux.

**3. Les mouvements de la Terre**
*   **Rotation** : La Terre tourne sur elle-même en 24h (alternance jour/nuit).
*   **Révolution** : La Terre tourne autour du Soleil en 365,25 jours (rythme des saisons).`,
                course: 505,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 90001,
                        title: "Quiz Système Solaire",
                        description: "La Terre et l'eau",
                        question: "Sous quelle forme trouve-t-on l'eau majoritairement sur Terre grâce à sa distance au Soleil ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 10,
                        correct_answer: "liquide",
                        explanation: "La distance Terre-Soleil permet d'avoir une température moyenne de 15°C, idéale pour l'eau liquide."
                    }
                ]
            },
            {
                id: 90002,
                order: 2,
                title: "Les phénomènes météorologiques",
                description: "Comprendre les vents, les pluies et les climats.",
                content: `### Leçon : Météo et Climat

**1. Différencier météo et climat**
*   **Météorologie** : Temps qu'il fait à un endroit précis à un moment donné (court terme).
*   **Climatologie** : Moyenne des données météo sur une longue période (minimum 30 ans).

**2. Les mouvements de l'air et de l'eau**
*   Le Soleil chauffe la Terre de manière inégale (plus aux pôles qu'à l'équateur).
*   Cela crée des **courants atmosphériques** (vents) et des **courants marins** qui redistribuent la chaleur.

**3. Les risques météo**
*   Tempêtes, cyclones, inondations ou sécheresses sont des phénomènes naturels qui peuvent devenir des risques pour l'homme.`,
                course: 505,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 9003,
                order: 3,
                title: "Les risques à l’échelle locale",
                description: "Se protéger des séismes et des éruptions volcaniques.",
                content: `### Leçon : Risques géologiques

**1. Les séismes (tremblements de terre)**
*   C'est une rupture brutale des roches en profondeur.
*   L'énergie se propage sous forme d'**ondes sismiques**.
*   On mesure leur puissance avec l'échelle de Richter (magnitude).

**2. Le volcanisme**
*   **Éruptions effusives** : coulées de lave fluide (volcans rouges).
*   **Éruptions explosives** : projection de cendres et nuées ardentes (volcans gris).

**3. Prévention et protection**
*   On ne peut pas prévoir précisément quand un séisme aura lieu, mais on peut construire des bâtiments **parasismiques**.
*   On peut surveiller les volcans pour évacuer les populations à temps.`,
                course: 505,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 9004,
                order: 4,
                title: "Ressources naturelles et action humaine",
                description: "Comment l'homme exploite l'eau, le sol et les minerais.",
                content: `### Leçon : L'exploitation des ressources

**1. Des ressources indispensables**
*   L'homme puise dans la nature : eau douce (pour boire et cultiver), minerais (pour construire), énergies.

**2. L'impact sur l'environnement**
*   L'exploitation des ressources peut polluer l'eau et les sols.
*   Certaines ressources ne sont pas renouvelables (pétrole, métaux) et s'épuisent.

**3. Vers une gestion durable**
*   Recycler nos déchets.
*   Utiliser des énergies renouvelables.
*   Protéger la biodiversité des forêts et des océans.`,
                course: 505,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 9005,
                order: 5,
                title: "Les besoins nutritifs des êtres vivants",
                description: "Comment les plantes et les animaux se nourrissent.",
                content: `### Leçon : La nutrition du vivant

**1. Les plantes (producteurs primaires)**
*   Elles fabriquent leur propre matière à partir d'eau, de sels minéraux et de **CO2**, grâce à la lumière du Soleil (**photosynthèse**).

**2. Les animaux (producteurs secondaires)**
*   Ils doivent manger d'autres êtres vivants (matière organique) pour grandir et vivre.
*   **Régimes alimentaires** : phytophages (plantes), zoophages (animaux), omnivores (les deux).

**3. Le recyclage de la matière**
*   Dans le sol, les **décomposeurs** (vers, bactéries) transforment les restes d'êtres vivants en sels minéraux, utilisables par les plantes.`,
                course: 505,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 9006,
                order: 6,
                title: "Les différents modes de reproduction",
                description: "Assurer la survie des espèces.",
                content: `### Leçon : La reproduction des êtres vivants

**1. La reproduction sexuée**
*   Nécessite deux parents de sexes différents (mâle et femelle).
*   Rencontre d'un **spermatozoïde** et d'un **ovule** = fécondation.
*   Elle crée des individus uniques, différents des parents.

**2. Fécondation interne et externe**
*   **Interne** : La rencontre a lieu dans le corps de la femelle (ex: mammifères, oiseaux).
*   **Externe** : La rencontre a lieu dans l'eau (ex: poissons, oursins).

**3. La reproduction asexuée**
*   Un seul parent suffit (ex: bouturage des plantes, division des bactéries).
*   Les descendants sont des "clones" identiques au parent.`,
                course: 505,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 9007,
                order: 7,
                title: "L'unicité et la diversité du vivant",
                description: "La cellule, unité du vivant et la classification.",
                content: `### Leçon : L'unité et la diversité du vivant

**1. La cellule : le point commun**
*   Tous les êtres vivants sont constitués de **cellules**.
*   Une cellule contient un noyau, du cytoplasme et une membrane.

**2. Espèces et classification**
*   Une **espèce** regroupe des individus qui se ressemblent et peuvent se reproduire entre eux (descendance fertile).
*   On classe les êtres vivants selon des caractères qu'ils possèdent en commun (ex: squelette, plumes).

**3. L'évolution**
*   Les espèces changent au cours du temps. Les fossiles nous montrent des espèces disparues (ex: dinosaures).`,
                course: 505,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 9008,
                order: 8,
                title: "Effort musculaire et santé",
                description: "Le fonctionnement du corps durant l'exercice.",
                content: `### Leçon : Le corps à l'effort

**1. Les modifications visibles**
*   Lors d'un effort, le rythme cardiaque augmente.
*   Le rythme respiratoire s'accélère.
*   La température du corps monte (transpiration).

**2. Les besoins des muscles**
*   Pour fonctionner, les muscles consomment du **dioxygène (O2)** et des nutriments (ex: glucose).
*   Ils rejettent du dioxyde de carbone (CO2).

**3. Le rôle du sang**
*   Le sang assure le transport de l'O2 et des nutriments vers les muscles grâce au cœur qui bat plus vite.`,
                course: 505,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 9009,
                order: 9,
                title: "Alimentation et digestion",
                description: "Le trajet des aliments et leur transformation.",
                content: `### Leçon : La digestion

**1. Le trajet des aliments**
*   Bouche -> Œsophage -> Estomac -> Intestin grêle -> Gros intestin.

**2. Transformations mécaniques et chimiques**
*   **Mécaniques** : Dents (mâcher) et brassage dans l'estomac.
*   **Chimiques** : Les **enzymes digestives** découpent les aliments en tout petits morceaux : les **nutriments**.

**3. L'absorption**
*   Les nutriments traversent la paroi de l'intestin grêle pour passer dans le sang.
*   Le sang les distribue ensuite à tous les organes du corps.`,
                course: 505,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 9010,
                order: 10,
                title: "Les microbes et les défenses de l'organisme",
                description: "Se protéger des agressions extérieures.",
                content: `### Leçon : Hygiène et Santé

**1. Les microbes (micro-organismes)**
*   Il y en a partout (bactéries, virus, champignons).
*   Certains sont inoffensifs ou utiles, d'autres sont **pathogènes** (rendent malade).

**2. Barrières et contamination**
*   La peau et les muqueuses nous protègent.
*   La **contamination** a lieu quand les microbes entrent dans le corps.

**3. Le système immunitaire**
*   Les globules blancs défendent l'organisme.
*   On peut aider le corps avec les **antibiotiques** (contre les bactéries) et les **vaccins** (prévention).`,
                course: 505,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 9011,
                order: 11,
                title: "La puberté et la reproduction humaine",
                description: "Les transformations du corps à l'adolescence.",
                content: `### Leçon : Devenir capable de transmettre la vie

**1. La puberté**
*   Période où le corps change pour devenir capable de se reproduire.
*   Apparition des caractères sexuels secondaires (ex: mue de la voix, pilosité).
*   Le système reproducteur devient fonctionnel (règles chez la fille, éjaculations chez le garçon).

**2. Les organes reproducteurs**
*   Fille : ovaires (produisent les ovules) et utérus.
*   Garçon : testicules (produisent les spermatozoïdes) et pénis.

**3. Origine d'un nouvel individu**
*   La fusion d'un spermatozoïde et d'un ovule forme une **cellule-œuf**.
*   Elle se développe dans l'utérus pendant 9 mois (grossesse).`,
                course: 505,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 9012,
                order: 12,
                title: "Équilibre alimentaire et besoins d'énergie",
                description: "Bien manger pour être en bonne santé.",
                content: `### Leçon : Bien se nourrir

**1. Apports et dépenses**
*   La nourriture apporte de l'énergie (calories).
*   Le corps dépense cette énergie pour fonctionner et bouger.
*   Il faut un équilibre : Apports = Dépenses.

**2. Les groupes d'aliments**
*   Glucides (énergie rapide), Protides (bâtisseurs), Lipides (énergie stockée), Vitamines et Sels minéraux.

**3. Les risques liés à une mauvaise alimentation**
*   Trop de sucre/gras : obésité, diabète, maladies cardio-vasculaires.
*   Carences : manque de certaines vitamines ou minéraux.`,
                course: 505,
                created_at: new Date().toISOString(),
                exercises: []
            }
        ] as any
    }
];
