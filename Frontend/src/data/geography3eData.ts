import { Course } from '../types';

export const allGeography3eCourses: Partial<Course>[] = [
    {
        id: 304,
        title: "Géographie 3ème",
        description: "Programme officiel du Burkina Faso : Le Burkina Faso, population, environnement et économie.",
        level: "3ème",
        subject: "Géographie",
        lessons: [
            {
                id: 13401,
                order: 1,
                title: "L’homme et l’environnement physique",
                description: "Analyse des interactions entre l'homme et son milieu au Burkina Faso.",
                content: `### Leçon 1 : L’homme et l’environnement physique

**Objectifs d'apprentissage :**
- Analyser l'impact des aléas climatiques sur la vie des hommes au Burkina Faso.
- Analyser les conséquences de l'action de l'homme sur le milieu physique (végétation, sols, eau).
- Analyser les politiques de protection de l'environnement.

---

**1. Le milieu physique et le climat**
Le Burkina Faso possède un climat tropical sec avec deux saisons : une saison sèche et une saison pluvieuse. Les aléas climatiques (sécheresses, inondations) impactent fortement l'agriculture et les déplacements de population.

**2. Impact social et économique**
La dégradation de l'environnement entraîne une baisse des rendements agricoles, forçant souvent les populations à migrer des zones arides du Nord vers les zones plus humides du Sud et de l'Ouest.

**3. Action de l'homme sur l'environnement**
Les activités humaines (agriculture extensive, surpâturage, coupe de bois) dégradent la végétation et appauvrissent les sols. On estime la perte forestière à environ 105 000 hectares par an.

**4. Politiques de protection**
Pour lutter contre ces problèmes, l'État encourage :
- La gestion durable des ressources.
- L'utilisation du gaz butane pour réduire la consommation de bois.
- Des programmes comme le PNGT2 pour le développement local.`,
                course: 304,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 134011,
                        title: "Quiz Environnement",
                        description: "Conséquences de l'action humaine",
                        question: "Quelle est la principale cause de la dégradation de la végétation au Burkina Faso ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 10,
                        correct_answer: "Agriculture extensive et surpâturage",
                        explanation: "L'agriculture intensive et le surpâturage sont les causes majeures de la dégradation des sols et de la forêt."
                    },
                    {
                        id: 134012,
                        title: "Politiques de protection",
                        description: "Identifier une mesure de protection",
                        question: "Citez une mesure prise par l'État pour réduire la coupe du bois de chauffe.",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "Subvention du gaz butane",
                        explanation: "En subventionnant le gaz butane, l'État incite les ménages à moins utiliser le bois pour la cuisine."
                    }
                ]
            },
            {
                id: 13402,
                order: 2,
                title: "Population et développement",
                description: "Étude de la démographie burkinabè et de ses enjeux.",
                content: `### Leçon 2 : Population et développement

**Structure de la population :**
Le Burkina Faso a une population majoritairement jeune, ce qui représente à la fois un défi pour l'éducation et l'emploi, mais aussi un potentiel pour le développement futur.

**Enjeux :**
- Santé et éducation.
- Répartition géographique inégale.
- Migration interne et urbanisation galopante.`,
                course: 304,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 13403,
                order: 3,
                title: "Aménagement du territoire et économie",
                description: "Les secteurs d'activité et l'organisation de l'espace.",
                content: `### Leçon 3 : Aménagement du territoire et économie

**Secteurs d'activité :**
- **Primaire** : Agriculture, élevage, mines (Or).
- **Secondaire** : Industrie agro-alimentaire, artisanat.
- **Tertiaire** : Commerce, transports, services.

Un enjeu majeur est le désenclavement du pays et l'amélioration des infrastructures de transport.`,
                course: 304,
                created_at: new Date().toISOString(),
                exercises: []
            }
        ] as any
    }
];
