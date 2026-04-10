import { Course } from '../types';

export const allGeographyCourses: Partial<Course>[] = [
    {
        id: 504,
        title: "Géographie 5ème",
        description: "Enjeux mondiaux : démographie, ressources et environnement.",
        level: "5ème",
        subject: "Géographie",
        lessons: [
            {
                id: 8001,
                order: 1,
                title: "La croissance démographique et ses effets",
                description: "Comprendre l'évolution de la population mondiale et ses défis.",
                content: `### Leçon : La croissance démographique mondiale

**1. Une population en forte hausse**
*   La population mondiale a dépassé les 8 milliards d'habitants.
*   Cette croissance est due à l'amélioration de l'hygiène et de la médecine (baisse de la mortalité).

**2. Une croissance inégale**
*   **Pays développés (Europe, Amérique du Nord)** : La croissance est faible, la population vieillit.
*   **Pays en développement (Afrique, Asie du Sud)** : La croissance est très forte car la natalité reste élevée.

**3. Les défis à relever**
*   **Besoins vitaux** : Nourrir, loger, soigner et éduquer des milliards de personnes supplémentaires.
*   **Pression sur les ressources** : Plus d'habitants signifie une consommation accrue d'eau, d'énergie et de terres cultivables.
*   **Vieillissement** : Dans certains pays, il faut financer les retraites et les soins pour les personnes âgées.`,
                course: 504,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 80001,
                        title: "Quiz Démographie",
                        description: "Facteurs de croissance",
                        question: "Pourquoi la population mondiale augmente-t-elle fortement depuis le XIXe siècle ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 10,
                        correct_answer: "Progrès de la médecine et de l'hygiène",
                        explanation: "L'amélioration des soins et de l'hygiène a permis de faire baisser la mortalité, augmentant ainsi la population."
                    }
                ]
            },
            {
                id: 8002,
                order: 2,
                title: "Richesse et pauvreté dans le monde",
                description: "Les inégalités de développement entre les populations.",
                content: `### Leçon : Inégalités de richesse et développement

**1. Un monde d'inégalités**
*   La richesse mondiale est mal répartie : une minorité d'habitants possède la majorité des richesses.
*   On mesure le développement avec l'**IDH** (Indice de Développement Humain), qui prend en compte la richesse (PIB), l'éducation et l'espérance de vie.

**2. Des écarts à toutes les échelles**
*   **Échelle mondiale** : Opposition entre les pays du "Nord" (riches) et les pays du "Sud" (souvent plus pauvres).
*   **Échelle nationale** : Dans un même pays (ex: Chine, Brésil), il y a des régions très riches et des régions très pauvres.
*   **Échelle locale** : En ville, des quartiers de luxe peuvent côtoyer des bidonvilles.

**3. Les enjeux**
*   Réduire la pauvreté extrême.
*   Garantir l'accès à l'éducation et à la santé pour tous.`,
                course: 504,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 8003,
                order: 3,
                title: "L'énergie et l'eau : des ressources à ménager",
                description: "Gérer durablement les ressources vitales de la planète.",
                content: `### Leçon : Gérer l'eau et l'énergie

**1. L'eau : une ressource précieuse et inégalement répartie**
*   L'eau douce est rare (3% de l'eau totale).
*   Certaines régions souffrent de **pénurie** (stress hydrique), tandis que d'autres en ont en abondance.
*   L'agriculture consomme 70% de l'eau douce mondiale.

**2. L'énergie : entre fossile et renouvelable**
*   **Énergies fossiles** (pétrole, charbon, gaz) : polluent et s'épuisent.
*   **Énergies renouvelables** (solaire, éolien, hydraulique) : se renouvellent naturellement et sont moins polluantes.

**3. Vers une gestion durable**
*   Économiser l'eau (irrigation goutte à goutte).
*   Réaliser la **transition énergétique** en passant des énergies fossiles aux renouvelables.`,
                course: 504,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 8004,
                order: 4,
                title: "L'alimentation : nourrir l'humanité",
                description: "Le défi alimentaire face à la croissance démographique.",
                content: `### Leçon : Le défi alimentaire mondial

**1. Des situations contrastées**
*   Plus de 800 millions de personnes souffrent de **sous-nutrition** (pas assez de calories).
*   Parallèlement, l'obésité augmente dans les pays riches et émergents.

**2. Produire plus et mieux**
*   L'agriculture doit produire plus pour nourrir 8 à 10 milliards d'humains.
*   **Agriculture intensive** : hauts rendements mais utilisation de pesticides et engrais chimiques.
*   **Agriculture durable/bio** : respecte l'environnement mais produit parfois moins.

**3. Les solutions**
*   Réduire le gaspillage alimentaire.
*   Améliorer le stockage et le transport de la nourriture au Sud.`,
                course: 504,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 8005,
                order: 5,
                title: "Le changement global et ses effets",
                description: "Les conséquences du réchauffement climatique sur les territoires.",
                content: `### Leçon : Le changement climatique global

**1. Un réchauffement constaté**
*   La température moyenne de la Terre augmente à cause des gaz à effet de serre émis par les activités humaines (industrie, transport).

**2. Des effets multiples**
*   Fonte des glaciers et montée du niveau des océans.
*   Multiplication des événements extrêmes (canicules, tempêtes, inondations).
*   Déplacement de populations (réfugiés climatiques).

**3. Des effets régionaux différents**
*   L'Arctique fond deux fois plus vite que le reste du monde.
*   Les îles du Pacifique risquent de disparaître sous les eaux.
*   Certaines zones deviennent trop sèches pour l'agriculture.`,
                course: 504,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 8006,
                order: 6,
                title: "Prévenir et s'adapter aux risques",
                description: "Comment les sociétés font face aux catastrophes.",
                content: `### Leçon : Sociétés face aux risques

**1. Aléas et vulnérabilité**
*   **Aléa** : événement naturel ou technologique dangereux (cyclone, séisme, explosion d'usine).
*   **Risque** : quand un aléa menace une population vulnérable.

**2. Prévenir les risques**
*   Constructions parasismiques.
*   Digues contre les inondations.
*   Systèmes d'alerte (sirènes, SMS).

**3. S'adapter**
*   Éduquer les populations (exercices d'évacuation).
*   Organiser les secours.
*   Adapter l'agriculture au manque d'eau.`,
                course: 504,
                created_at: new Date().toISOString(),
                exercises: []
            }
        ] as any
    }
];
