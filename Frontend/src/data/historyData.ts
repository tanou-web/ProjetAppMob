import { Course } from '../types';

export const allHistoryCourses: Partial<Course>[] = [
    {
        id: 503,
        title: "Histoire 5ème",
        description: "Le passage du Moyen Âge à l'époque moderne : empires, féodalité et Renaissance.",
        level: "5ème",
        subject: "Histoire",
        lessons: [
            {
                id: 7001,
                order: 1,
                title: "Byzance et l'Europe carolingienne",
                description: "Deux empires héritiers de l'Empire romain.",
                content: `### Leçon : Byzance et l'Europe carolingienne

Après la chute de l'Empire romain d'Occident en 476, deux grands empires chrétiens se partagent l'Europe et la Méditerranée.

**1. L'Empire byzantin (Orient)**
*   **Capitale** : Constantinople (ancienne Byzance).
*   **Empereur célèbre** : Justinien (VIe siècle) qui veut reconstruire l'Empire romain.
*   **Religion** : Chrétiens orthodoxes (rupture avec Rome en 1054 : le Schisme).
*   **Culture** : Langue grecque, art de la mosaïque (ex: Sainte-Sophie).

**2. L'Empire carolingien (Occident)**
*   **Chef célèbre** : Charlemagne, sacré empereur à Rome en l'an 800.
*   **Capitale** : Aix-la-Chapelle.
*   **Organisation** : L'empire est divisé en comtés dirigés par des comtes surveillés par les "missi dominici".
*   **Religion** : Chrétiens catholiques (fidèles au Pape).

**3. Les points communs**
*   L'empereur est considéré comme le représentant de Dieu sur Terre.
*   Ils cherchent à convertir les peuples païens au christianisme.`,
                course: 503,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 70001,
                        title: "Quiz Empires",
                        description: "Identifier les capitales",
                        question: "Quelle était la capitale de l'Empire de Charlemagne ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 10,
                        correct_answer: "Aix-la-Chapelle",
                        explanation: "Charlemagne avait établi sa capitale et son palais à Aix-la-Chapelle."
                    }
                ]
            },
            {
                id: 7002,
                order: 2,
                title: "L'Islam : pouvoirs, sociétés et cultures",
                description: "De la naissance de l'Islam à l'expansion des califats.",
                content: `### Leçon : Le monde musulman (VIIe-XIIIe siècles)

**1. La naissance de l'Islam**
*   **Prophète** : Mahomet (Muhammad) reçoit la révélation en Arabie.
*   **Date clé** : 622 (l'Hégire), départ de Mahomet pour Médine, début du calendrier musulman.
*   **Livre sacré** : Le Coran.

**2. Une expansion rapide**
*   Les successeurs de Mahomet, les **califes**, conquièrent un immense territoire de l'Espagne à l'Inde.
*   **Villes majeures** : Bagdad (califat abbasside), Cordoue, Le Caire.

**3. Une civilisation brillante**
*   **Commerce** : Développement des routes commerciales (soie, épices).
*   **Sciences** : Progrès en médecine, mathématiques (algèbre), astronomie.
*   **Architecture** : Mosquées magnifiques (ex: Grande Mosquée de Damas).`,
                course: 503,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 7003,
                order: 3,
                title: "L'ordre seigneurial et les campagnes",
                description: "La vie des paysans et la domination des seigneurs.",
                content: `### Leçon : Seigneurs et paysans au Moyen Âge

Entre le XIe et le XVe siècle, la société est organisée autour de la **seigneurie**.

**1. La seigneurie**
Territoire appartenant à un seigneur (noble ou ecclésiastique). Il comprend :
*   **La réserve** : terres que le seigneur garde pour lui.
*   **Les tenures** : terres louées aux paysans en échange de taxes.
*   **Le château** : lieu de protection et symbole de pouvoir.

**2. La vie des paysans**
*   Ils travaillent dur pour se nourrir et payer les redevances (cens, corvées).
*   **Les vilains** : paysans libres.
*   **Les serfs** : paysans attachés à la terre du seigneur.

**3. L'importance de l'Église**
L'Église rythme la vie quotidienne (cloches, calendrier religieux) et possède de vastes terres.`,
                course: 503,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 7004,
                order: 4,
                title: "L'émergence d'une nouvelle société urbaine",
                description: "Le développement des villes et du commerce.",
                content: `### Leçon : L'essor des villes au Moyen Âge

À partir du XIe siècle, le commerce se développe et les villes grandissent.

**1. La croissance urbaine**
*   Les villes s'entourent de remparts.
*   Les habitants des villes s'appellent les **bourgeois**.
*   Ils obtiennent des libertés (chartes de franchise) face aux seigneurs.

**2. Activités économiques**
*   **Artisanat** : regroupé par métiers (corporations).
*   **Commerce** : développement des foires (ex: Foires de Champagne) et des banques.

**3. Lieux de pouvoir et de culture**
*   Construction de grandes **cathédrales** gothiques.
*   Création des premières **universités**.`,
                course: 503,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 7005,
                order: 5,
                title: "L'affirmation de l'État monarchique",
                description: "Le renforcement du pouvoir royal en France.",
                content: `### Leçon : La naissance de l'État royal (XIe-XVe s.)

En 987, Hugues Capet est élu roi. C'est le début de la dynastie des **Capétiens**.

**1. Un pouvoir faible au début**
*   Le roi ne commande directement qu'un petit territoire : le **domaine royal**.
*   Les grands seigneurs sont souvent plus puissants que lui.

**2. L'agrandissement du domaine royal**
*   Les rois utilisent la guerre, le mariage ou l'achat pour étendre leurs terres.
*   **Philippe Auguste** bat le roi d'Angleterre à Bouvines (1214).

**3. La mise en place d'une administration**
*   Le roi nomme des **baillis** et des **sénéchaux** pour rendre la justice et collecter les impôts.
*   La Guerre de Cent Ans (1337-1453) renforce le sentiment national derrière le roi.`,
                course: 503,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 7006,
                order: 6,
                title: "Le monde au temps de Charles Quint et de Soliman",
                description: "Grandes découvertes et luttes de pouvoir mondiales.",
                content: `### Leçon : L'Europe s'ouvre au monde (XVIe s.)

**1. Les grandes découvertes**
*   Cherchant de nouvelles routes vers les Indes, les Européens découvrent de nouveaux mondes.
*   **1492** : Christophe Colomb arrive en Amérique.
*   **Vasco de Gama** atteint les Indes par le sud de l'Afrique.

**2. Deux souverains face à face**
*   **Charles Quint** : dirige un empire immense "sur lequel le soleil ne se couche jamais" (Espagne, Allemagne, Amériques).
*   **Soliman le Magnifique** : sultan de l'Empire ottoman qui menace l'Europe par l'Est.

**3. Les conséquences**
*   Afflux d'or et d'argent en Europe.
*   Début de la colonisation.`,
                course: 503,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 7007,
                order: 7,
                title: "Humanisme, réformes et conflits religieux",
                description: "La Renaissance intellectuelle et religieuse.",
                content: `### Leçon : La Renaissance et la Réforme

**1. L'Humanisme**
*   Nouvelle façon de penser qui place l'homme au centre du monde.
*   Redécouverte des textes de l'Antiquité.
*   **Rôle de l'imprimerie** (Gutenberg, 1450) pour diffuser les idées.

**2. La Renaissance artistique**
*   Nées en Italie, de nouvelles techniques apparaissent (perspective).
*   Artistes célèbres : Léonard de Vinci, Michel-Ange.

**3. La fracture religieuse**
*   **Martin Luther** critique l'Église catholique et crée le **Protestantisme**.
*   Guerres de religion violentes entre catholiques et protestants en Europe.`,
                course: 503,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 7008,
                order: 8,
                title: "Du prince de la Renaissance au roi absolu",
                description: "L'évolution de la monarchie française.",
                content: `### Leçon : L'affirmation du pouvoir absolu

**1. François Ier (XVIe s.)**
*   Roi mécène (Renaissance).
*   Renforce l'autorité royale (Ordonnance de Villers-Cotterêts imposant le français).

**2. Henri IV et la paix religieuse**
*   Met fin aux guerres de religion par l'**Édit de Nantes** (1598) accordant la liberté de culte aux protestants.

**3. Louis XIV : le "Roi-Soleil"**
*   Met en place la **monarchie absolue** de droit divin.
*   Il contrôle tout depuis son palais de **Versailles**.
*   Il révoque l'Édit de Nantes en 1685.`,
                course: 503,
                created_at: new Date().toISOString(),
                exercises: []
            }
        ] as any
    }
];
