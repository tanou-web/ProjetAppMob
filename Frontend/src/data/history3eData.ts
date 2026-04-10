import { Course } from '../types';

export const allHistory3eCourses: Partial<Course>[] = [
    {
        id: 305,
        title: "Histoire 3ème",
        description: "Programme officiel : L'Afrique précoloniale, la colonisation, la décolonisation et le Burkina Faso indépendant.",
        level: "3ème",
        subject: "Histoire",
        lessons: [
            {
                id: 13501,
                order: 1,
                title: "L'Afrique précoloniale : Royaumes et Empires",
                description: "Découvrir les grandes civilisations africaines avant la colonisation.",
                content: `### Leçon : L'Afrique précoloniale

**Objectifs d'apprentissage :**
- Identifier les principaux royaumes et empires africains.
- Comprendre l'organisation politique et économique de ces États.
- Reconnaître les contributions culturelles de l'Afrique précoloniale.

---

**1. Les grands empires d'Afrique de l'Ouest**

**a) L'Empire du Ghana (IVe - XIIIe siècle)**
- Situé entre la Mauritanie et le Mali actuels.
- Riche grâce au commerce de l'or et du sel.
- Contrôlait les routes commerciales transsahariennes.

**b) L'Empire du Mali (XIIIe - XVe siècle)**
- Fondé par Soundiata Keïta en 1235.
- Apogée sous Kankan Moussa (1312-1337), célèbre pour son pèlerinage à La Mecque.
- Tombouctou devient un centre intellectuel majeur.

**c) L'Empire Songhaï (XVe - XVIe siècle)**
- Capitale : Gao.
- Dirigé par Askia Mohamed le Grand (1493-1528).
- Contrôle du commerce transsaharien.

---

**2. Le Royaume Mossi (Burkina Faso)**

**Caractéristiques :**
- Fondé au XIe siècle, résiste à l'islamisation jusqu'au XIXe siècle.
- Organisation politique autour du **Mogho Naaba** (Empereur).
- Structure administrative efficace avec des provinces dirigées par des chefs.
- Économie basée sur l'agriculture, l'élevage et l'artisanat.

**Résistance à la colonisation :**
Les royaumes Mossi ont farouchement résisté aux tentatives de conquête islamique et coloniale, préservant leur indépendance jusqu'à la fin du XIXe siècle.

> [!IMPORTANT]
> **Point clé** : L'Afrique précoloniale n'était pas un continent "sauvage" ou "sans histoire". Elle possédait des États organisés, des systèmes politiques sophistiqués et une riche vie culturelle.

---

**3. L'organisation sociale et économique**

**Société :**
- Hiérarchie sociale avec : nobles, guerriers, agriculteurs, artisans, griots.
- Les **griots** jouaient un rôle essentiel : gardiens de la tradition orale, conseillers des rois.

**Économie :**
- Commerce transsaharien : or, sel, esclaves, ivoire.
- Agriculture et élevage.
- Artisanat développé (métallurgie, tissage, poterie).`,
                course: 305,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 135011,
                        title: "Les empires d'Afrique de l'Ouest",
                        description: "Identifier les empires et leurs caractéristiques",
                        question: "Quel empire d'Afrique de l'Ouest était dirigé par Soundiata Keïta ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "Empire du Mali",
                        explanation: "Soundiata Keïta a fondé l'Empire du Mali en 1235 après la bataille de Kirina."
                    },
                    {
                        id: 135012,
                        title: "Le Royaume Mossi",
                        description: "Connaître l'organisation du royaume",
                        question: "Quel est le titre du chef suprême du Royaume Mossi ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "Mogho Naaba",
                        explanation: "Le Mogho Naaba est l'Empereur du Royaume Mossi, basé à Ouagadougou."
                    },
                    {
                        id: 135013,
                        title: "Commerce transsaharien",
                        description: "Comprendre l'économie précoloniale",
                        question: "Citez deux produits principaux du commerce transsaharien.",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "Or et sel",
                        explanation: "L'or (venant du sud) et le sel (venant du nord) étaient les deux piliers du commerce transsaharien."
                    }
                ]
            },
            {
                id: 13502,
                order: 2,
                title: "La colonisation de l'Afrique",
                description: "Comprendre le partage de l'Afrique et la résistance africaine.",
                content: `### Leçon : La colonisation de l'Afrique

**1. La Conférence de Berlin (1884-1885)**

**Contexte :**
- Les puissances européennes se disputent l'Afrique.
- Besoin de matières premières pour l'industrie européenne.

**Décisions de la Conférence :**
- Partage de l'Afrique entre puissances européennes (France, Royaume-Uni, Allemagne, Belgique, Portugal, Italie, Espagne).
- Tracé de frontières artificielles sans tenir compte des réalités ethniques et culturelles.
- Principe : "Occupation effective" pour revendiquer un territoire.

> [!WARNING]
> **Impact durable** : Les frontières coloniales sont restées en place après les indépendances, causant des conflits ethniques et territoriaux jusqu'à aujourd'hui.

---

**2. La conquête coloniale**

**Méthodes utilisées :**
- **Force militaire** : Supériorité technologique (armes à feu).
- **Traités inégaux** : Signature de "protectorats" par des chefs locaux souvent trompés.
- **Diviser pour régner** : Utilisation des rivalités entre royaumes.

**La conquête de la Haute-Volta (actuel Burkina Faso) :**
- 1896 : Défaite du Royaume Mossi de Ouagadougou.
- 1897 : Capture et exil du Mogho Naaba Wobgho.
- 1919 : Création de la colonie de Haute-Volta.

---

**3. Les résistances africaines**

**Exemples de résistances :**

**a) Samory Touré (Guinée/Mali)**
- Résistance militaire de 1882 à 1898.
- Création d'un empire pour s'opposer aux Français.
- Capturé en 1898, exilé au Gabon.

**b) Béhanzin (Dahomey - actuel Bénin)**
- Résiste aux Français de 1890 à 1894.
- Défaite et exil en Martinique puis en Algérie.

**c) Les royaumes Mossi**
- Résistance du Mogho Naaba Wobgho jusqu'en 1896.
- Maintien de l'organisation traditionnelle malgré la colonisation.

> [!NOTE]
> **Les résistances** montrent que les Africains n'ont pas accepté passivement la colonisation. Ils se sont battus avec courage pour défendre leur liberté et leur dignité.

---

**4. Le système colonial**

**Exploitation économique :**
- Travail forcé pour construire routes, chemins de fer.
- Culture obligatoire de produits d'exportation (coton, arachide, café).
- Extraction minière (or, diamants).

**Domination politique et culturelle :**
- Remplacement des chefs traditionnels par des administrateurs coloniaux.
- Imposition de la langue française.
- Interdiction de certaines pratiques culturelles.
- Mission "civilisatrice" : idée que l'Europe devait "éduquer" l'Afrique.`,
                course: 305,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 135021,
                        title: "La Conférence de Berlin",
                        description: "Date et signification",
                        question: "En quelle année a eu lieu la Conférence de Berlin qui a partagé l'Afrique ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "1884-1885",
                        explanation: "La Conférence de Berlin s'est tenue de novembre 1884 à février 1885."
                    },
                    {
                        id: 135022,
                        title: "Résistance africaine",
                        description: "Identifier un résistant",
                        question: "Quel leader a résisté aux Français en Guinée et au Mali de 1882 à 1898 ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "Samory Touré",
                        explanation: "Samory Touré a mené une longue résistance contre la colonisation française avant d'être capturé en 1898."
                    },
                    {
                        id: 135023,
                        title: "Impact de la colonisation",
                        description: "Comprendre les conséquences",
                        question: "Quel système de travail obligatoire les colons ont-ils imposé aux Africains ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "Travail forcé",
                        explanation: "Le travail forcé permettait aux colons de construire des infrastructures et d'exploiter les ressources sans payer les travailleurs africains."
                    }
                ]
            },
            {
                id: 13503,
                order: 3,
                title: "La décolonisation de l'Afrique",
                description: "Les luttes pour l'indépendance et la naissance des États africains.",
                content: `### Leçon : La décolonisation de l'Afrique

**1. Les causes de la décolonisation**

**Facteurs internes :**
- Montée du **nationalisme africain** : intellectuels africains formés en Europe revendiquent l'indépendance.
- Création de partis politiques et de mouvements indépendantistes.
- Congrès panafricains (Manchester 1945) : réunion de leaders africains pour l'indépendance.

**Facteurs externes :**
- **Seconde Guerre mondiale** : Affaiblissement des puissances coloniales.
- Participation des Africains à la guerre aux côtés des Alliés.
- Contexte de la **Guerre froide** : USA et URSS soutiennent la décolonisation.
- Charte des Nations Unies (1945) : Droit des peuples à disposer d'eux-mêmes.

---

**2. Les formes de décolonisation**

**a) Indépendance pacifique (négociée)**
- La plupart des colonies françaises et britanniques.
- Exemple : **Haute-Volta (Burkina Faso)** - 5 août 1960.
- Transfert progressif de pouvoir.

**b) Indépendance violente (guerre de libération)**
- **Algérie** : Guerre d'indépendance (1954-1962).
- **Kenya** : Révolte des Mau-Mau (1952-1960).
- **Mozambique, Angola** : Luttes armées contre le Portugal.

---

**3. L'année 1960 : "Année de l'Afrique"**

**Faits marquants :**
- **17 pays africains** accèdent à l'indépendance en 1960.
- Dont 14 anciennes colonies françaises.

**Exemples :**
- Cameroun (1er janvier)
- Sénégal (4 avril)
- Togo (27 avril)
- Mali (22 septembre)
- **Haute-Volta (Burkina Faso)** : **5 août 1960**
- Nigeria (1er octobre)

> [!IMPORTANT]
> **L'indépendance de la Haute-Volta** : Le 5 août 1960, Maurice Yaméogo devient le premier président de la République de Haute-Volta.

---

**4. Les leaders de la décolonisation**

**Kwame Nkrumah (Ghana)**
- Premier pays d'Afrique subsaharienne à obtenir l'indépendance (1957).
- Idéologie du **panafricanisme** : unité des peuples africains.

**Jomo Kenyatta (Kenya)**
- Leader du mouvement indépendantiste kenyan.
- Premier président du Kenya indépendant (1963).

**Patrice Lumumba (Congo)**
- Premier ministre du Congo belge indépendant (1960).
- Assassiné en 1961, symbole de la lutte contre le néocolonialisme.

**Léopold Sédar Senghor (Sénégal)**
- Poète et homme politique, président du Sénégal (1960-1980).
- Défenseur de la **Négritude** : valorisation de la culture africaine.

---

**5. Les défis de l'Afrique indépendante**

**Problèmes hérités de la colonisation :**
- Frontières artificielles créant des tensions ethniques.
- Économies dépendantes de l'exportation de matières premières.
- Manque de cadres formés pour administrer les nouveaux États.

**Défis politiques :**
- Instabilité politique (coups d'État).
- Guerre froide : influence des blocs occidental et soviétique.
- Néocolonialisme : dépendance économique persistante vis-à-vis de l'Europe.`,
                course: 305,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 135031,
                        title: "Date d'indépendance",
                        description: "Connaître la date clé",
                        question: "Quelle est la date de l'indépendance de la Haute-Volta (Burkina Faso) ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "5 août 1960",
                        explanation: "Le 5 août 1960 est la date de l'indépendance de la Haute-Volta, devenue Burkina Faso en 1984."
                    },
                    {
                        id: 135032,
                        title: "Année de l'Afrique",
                        description: "Comprendre l'importance de 1960",
                        question: "Pourquoi l'année 1960 est-elle appelée 'Année de l'Afrique' ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "17 pays africains ont accédé à l'indépendance",
                        explanation: "En 1960, 17 pays africains ont obtenu leur indépendance, marquant un tournant majeur dans la décolonisation."
                    },
                    {
                        id: 135033,
                        title: "Leader panafricain",
                        description: "Identifier un leader clé",
                        question: "Quel leader ghanéen a été le premier à obtenir l'indépendance en Afrique subsaharienne ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "Kwame Nkrumah",
                        explanation: "Kwame Nkrumah a conduit le Ghana à l'indépendance en 1957, devenant un modèle pour les autres pays africains."
                    }
                ]
            },
            {
                id: 13504,
                order: 4,
                title: "Le Burkina Faso indépendant",
                description: "Histoire du pays de 1960 à nos jours.",
                content: `### Leçon : Le Burkina Faso indépendant (1960 à nos jours)

**1. La Première République (1960-1966)**

**Maurice Yaméogo (1960-1966)**
- Premier président de la Haute-Volta indépendante.
- Politique de développement économique.
- **5 janvier 1966** : Renversé par un soulèvement populaire contre l'austérité et le train de vie du gouvernement.

---

**2. Les régimes militaires (1966-1991)**

**Le Lieutenant-Colonel Sangoulé Lamizana (1966-1980)**
- Coup d'État militaire en 1966.
- Alternance entre régimes militaires et civils.
- Renversé en 1980 par le Colonel Saye Zerbo.

**Le Capitaine Thomas Sankara (1983-1984)**
- Arrive au pouvoir le 4 août 1983.
- **4 août 1984** : Rebaptise la Haute-Volta en **"Burkina Faso"** (Pays des Hommes intègres).
- Politique révolutionnaire : lutte contre la corruption, promotion des femmes, autosuffisance alimentaire.
- Programme d'alphabétisation et de vaccination massive.
- **15 octobre 1987** : Assassiné lors d'un coup d'État.

> [!IMPORTANT]
> **Thomas Sankara** reste une figure emblématique de l'Afrique, symbole d'intégrité et de lutte pour la justice sociale. Son héritage inspire encore aujourd'hui.

**Blaise Compaoré (1987-2014)**
- Prend le pouvoir après l'assassinat de Sankara.
- Régime de 27 ans marqué par la stabilité politique mais aussi l'autoritarisme.
- **30 octobre 2014** : Chassé du pouvoir par un soulèvement populaire (insurrection populaire) après sa tentative de modifier la Constitution pour rester au pouvoir.

---

**3. La Transition démocratique (2014-2015)**

**Événements marquants :**
- **30-31 octobre 2014** : Insurrection populaire, incendie de l'Assemblée nationale.
- Transition dirigée par le Lieutenant-Colonel Isaac Zida puis Michel Kafando (président de transition).
- **16-17 septembre 2015** : Tentative de coup d'État du Régiment de Sécurité Présidentielle (RSP).

---

**4. Le Burkina Faso contemporain (2015 - aujourd'hui)**

**Roch Marc Christian Kaboré (2015-2022)**
- Élu président en novembre 2015.
- Défi majeur : **Insécurité terroriste** dans le Nord et l'Est du pays.
- Attaques de groupes armés djihadistes.
- Déplacés internes : plus d'1 million de personnes.

**Situation actuelle :**
- Crise sécuritaire persistante.
- Efforts de développement malgré les défis.
- Jeunesse engagée pour un avenir meilleur.

---

**5. Les symboles nationaux**

**Drapeau :**
- Rouge : Révolution d'août 1983.
- Vert : Richesses naturelles.
- Étoile jaune : Lumière guidant la révolution.

**Devise :** "Unité - Progrès - Justice"

**Hymne national :** "Le Ditanyè" (L'Hymne de la Victoire)

> [!TIP]
> **Fête nationale** : Le 11 décembre commémore la proclamation de la République en 1958, tandis que le 5 août célèbre l'indépendance.`,
                course: 305,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 135041,
                        title: "Changement de nom",
                        description: "Date historique",
                        question: "En quelle année la Haute-Volta a-t-elle été rebaptisée Burkina Faso ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "1984",
                        explanation: "Le 4 août 1984, Thomas Sankara rebaptise la Haute-Volta en Burkina Faso, qui signifie 'Pays des Hommes intègres'."
                    },
                    {
                        id: 135042,
                        title: "L'insurrection populaire",
                        description: "Événement majeur",
                        question: "En quelle année l'insurrection populaire a-t-elle chassé Blaise Compaoré du pouvoir ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "2014",
                        explanation: "Les 30-31 octobre 2014, une insurrection populaire a mis fin au régime de Blaise Compaoré après 27 ans de pouvoir."
                    },
                    {
                        id: 135043,
                        title: "Signification du nom",
                        description: "Culture et identité",
                        question: "Que signifie 'Burkina Faso' ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "Pays des Hommes intègres",
                        explanation: "'Burkina' signifie 'intègre' en mooré et 'Faso' signifie 'patrie' en dioula, donc 'Pays des Hommes intègres'."
                    }
                ]
            }
        ] as any
    }
];
