import { Course } from '../types';

export const allGeography4eCourses: Partial<Course>[] = [
    {
        id: 405,
        title: "Géographie 4ème",
        description: "Programme APC : Étude de la Terre et Géographie physique du Burkina Faso.",
        level: "4ème",
        subject: "Géographie",
        lessons: [
            // MODULE: ÉTUDE DE LA TERRE
            {
                id: 15101,
                order: 1,
                title: "La Terre : forme, dimensions et orientation",
                description: "Comprendre les caractéristiques physiques de notre planète.",
                content: `### Leçon : Les caractéristiques de la Terre

**1. Forme et dimensions**
*   La Terre n'est pas une sphère parfaite ; c'est un **géoïde** (aplati aux pôles).
*   Rayon équatorial : environ 6 378 km.
*   Circonférence à l'équateur : environ 40 000 km.

**2. Les lignes imaginaires**
*   **L'Équateur** : Sépare la Terre en deux hémisphères (Nord et Sud).
*   **Les méridiens** : Cercles passant par les deux pôles (utilisés pour la longitude). Le méridien d'origine est celui de Greenwich.
*   **Les parallèles** : Cercles parallèles à l'équateur (utilisés pour la latitude).

**3. L'orientation**
*   Les 4 points cardinaux : Nord, Sud, Est, Ouest.
*   Utilisation de la boussole et repérage par rapport au soleil.`,
                course: 405,
                created_at: new Date().toISOString(),
                exercises: []
            },
            // MODULE: GÉOGRAPHIE PHYSIQUE DU BURKINA FASO
            {
                id: 15201,
                order: 2,
                title: "Le Relief et les sols du Burkina Faso",
                description: "Étude des formes de terrain et de la diversité des sols.",
                content: `### Leçon : Relief et Sols

**1. Un pays de plaines et de plateaux**
*   Le Burkina Faso est globalement un pays plat avec une altitude moyenne de 400m.
*   **Le Plateau Central** : Vaste étendue cristalline.
*   **Les Chaînes de falaises** : À l'Ouest (falaises de Banfora).
*   Point culminant : **Le Tenakourou** (749 m).

**2. Les types de sols**
*   **Sols ferrugineux tropicaux** (latéritiques) : Les plus répandus, souvent pauvres.
*   **Sols hydro-morphes** : Le long des cours d'eau, fertiles pour l'agriculture.
*   **Sols peu évolués** : Dans les zones érodées.

**3. Importance pour l'agriculture**
*   La nature du sol détermine les cultures possibles (mil, sorgho, coton).`,
                course: 405,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 15202,
                order: 3,
                title: "Le Climat du Burkina Faso",
                description: "Les saisons et les types de climats tropicaux.",
                content: `### Leçon : Le climat burkinabè

**1. Les deux saisons**
*   **La saison sèche** (novembre à mai) : Marquée par l'Harmattan (vent chaud et sec).
*   **La saison des pluies** (juin à octobre) : Apportée par la Mousson.

**2. Les zones climatiques**
*   **Zone sahélienne** (Nord) : Moins de 600 mm de pluie par an.
*   **Zone soudano-sahélienne** (Centre) : Entre 600 et 900 mm.
*   **Zone soudanienne** (Sud) : Plus de 900 mm, climat plus humide.

**3. Les facteurs climatiques**
*   Influence de la latitude et de la continentalité (éloignement de la mer).`,
                course: 405,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 152001,
                        title: "Quiz Climat",
                        description: "Vents du Burkina",
                        question: "Quel vent souffle durant la saison sèche au Burkina Faso ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 10,
                        correct_answer: "L'Harmattan",
                        explanation: "L'Harmattan est un vent d'Est-Nord-Est, chaud et sec, venant du Sahara."
                    }
                ]
            },
            {
                id: 15203,
                order: 4,
                title: "Végétation et Hydrographie",
                description: "La flore et les ressources en eau du pays.",
                content: `### Leçon : Nature et Eau

**1. La végétation**
*   **La steppe** au Nord : Buissons épineux et herbes courtes.
*   **La savane** au Centre : Herbes hautes et arbres clairsemés (baobabs, karités).
*   **La forêt claire/galerie** au Sud : Le long des rivières.

**2. Les cours d'eau**
*   Trois bassins principaux :
    *   **Le bassin de la Volta** (Mouhoun, Nakambé, Nazinon).
    *   **Le bassin du Niger** (rivières au Nord-Est).
    *   **Le bassin de la Comoé** (Sud-Ouest).

**3. Les défis de l'eau**
*   Irrégularité des pluies et sècheresses récurrentes.`,
                course: 405,
                created_at: new Date().toISOString(),
                exercises: []
            }
        ] as any
    }
];
