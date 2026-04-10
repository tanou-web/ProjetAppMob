import { Course } from '../types';

export const allSVT3eCourses: Partial<Course>[] = [
    {
        id: 306,
        title: "SVT / Sciences 3ème",
        description: "Programme officiel : Sciences de la Vie et de la Terre, Physique et Chimie pour la classe de 3ème.",
        level: "3ème",
        subject: "SVT",
        lessons: [
            {
                id: 13601,
                order: 1,
                title: "La reproduction humaine",
                description: "Appareil reproducteur, puberté, fécondation et développement.",
                content: `### Leçon : La reproduction humaine

**Objectifs d'apprentissage :**
- Décrire les transformations liées à la puberté.
- Identifier les organes de l'appareil reproducteur masculin et féminin.
- Comprendre le processus de fécondation et de développement embryonnaire.

---

**1. La puberté**

**Définition :**
La puberté est la période de transition entre l'enfance et l'âge adulte, marquée par des transformations physiques et psychologiques permettant à l'organisme de devenir capable de se reproduire.

**Âge de la puberté :**
- **Filles** : Entre 10 et 14 ans.
- **Garçons** : Entre 12 et 16 ans.

**Transformations communes :**
- Croissance rapide (poussée de croissance).
- Apparition de poils (pubis, aisselles).
- Développement des glandes sudoripares (transpiration).
- Changements émotionnels et psychologiques.

**Transformations spécifiques :**

| Chez la fille | Chez le garçon |
|---------------|----------------|
| Développement des seins | Élargissement des épaules |
| Élargissement des hanches | Développement musculaire |
| Apparition des règles (menstruations) | Mue de la voix |
| | Apparition de la pilosité faciale (barbe) |

---

**2. L'appareil reproducteur**

**a) Appareil reproducteur masculin**

**Organes externes :**
- **Pénis** : Organe de copulation.
- **Scrotum** : Enveloppe contenant les testicules.

**Organes internes :**
- **Testicules** (2) : Production des spermatozoïdes et de la testostérone (hormone masculine).
- **Épididyme** : Stockage et maturation des spermatozoïdes.
- **Canal déférent** : Transport des spermatozoïdes.
- **Vésicules séminales et prostate** : Production du liquide séminal (sperme).

---

**b) Appareil reproducteur féminin**

**Organes externes :**
- **Vulve** : Ensemble des organes génitaux externes.

**Organes internes :**
- **Ovaires** (2) : Production des ovules et des hormones féminines (œstrogènes, progestérone).
- **Trompes de Fallope** (2) : Lieu de la fécondation.
- **Utérus** : Organe musculaire où se développe l'embryon puis le fœtus.
- **Vagin** : Conduit reliant l'utérus à l'extérieur.

---

**3. Le cycle menstruel**

**Définition :**
C'est l'ensemble des phénomènes se reproduisant régulièrement chez la femme en âge de procréer, préparant l'organisme à une éventuelle grossesse.

**Durée :** Environ 28 jours (variable selon les femmes).

**Phases principales :**
1. **Menstruation** (règles) : Jours 1-5, élimination de la muqueuse utérine.
2. **Phase folliculaire** : Jours 6-13, maturation d'un ovule dans l'ovaire.
3. **Ovulation** : Jour 14, libération de l'ovule.
4. **Phase lutéale** : Jours 15-28, épaississement de la muqueuse utérine.

> [!IMPORTANT]
> **Période de fécondité** : L'ovulation se produit généralement au milieu du cycle (autour du 14e jour). C'est la période où la femme est la plus fertile.

---

**4. La fécondation**

**Définition :**
La fécondation est la fusion du spermatozoïde (gamète mâle) avec l'ovule (gamète femelle) pour former une cellule-œuf appelée **zygote**.

**Lieu :** Trompe de Fallope.

**Processus :**
1. Rapport sexuel : Dépôt de millions de spermatozoïdes dans le vagin.
2. Migration des spermatozoïdes vers les trompes.
3. Rencontre avec l'ovule.
4. Pénétration d'un seul spermatozoïde dans l'ovule.
5. Formation du zygote (cellule-œuf).

---

**5. La grossesse**

**Nidation :**
- Le zygote se divise en descendant vers l'utérus.
- Au 7e jour, il s'implante dans la muqueuse utérine (nidation).

**Développement :**
- **Embryon** : De la nidation à 8 semaines.
- **Fœtus** : De 8 semaines à la naissance.

**Durée de la grossesse :** 9 mois (environ 40 semaines).

**Signes de grossesse :**
- Absence de règles.
- Nausées, fatigue.
- Augmentation du volume de l'utérus et des seins.

> [!TIP]
> **Suivi médical** : Les consultations prénatales sont essentielles pour surveiller la santé de la mère et du bébé.`,
                course: 306,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 136011,
                        title: "Transformations à la puberté",
                        description: "Identifier les changements",
                        question: "Citez deux transformations communes aux filles et aux garçons à la puberté.",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "Croissance rapide et apparition de poils",
                        explanation: "La croissance rapide et l'apparition de poils au niveau du pubis et des aisselles sont des transformations communes."
                    },
                    {
                        id: 136012,
                        title: "Organes reproducteurs",
                        description: "Connaître les fonctions",
                        question: "Quels organes produisent les spermatozoïdes chez l'homme ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "Testicules",
                        explanation: "Les testicules sont les glandes sexuelles qui produisent les spermatozoïdes et la testostérone."
                    },
                    {
                        id: 136013,
                        title: "La fécondation",
                        description: "Comprendre le processus",
                        question: "Où se produit la fécondation chez la femme ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "Trompe de Fallope",
                        explanation: "La fécondation (fusion du spermatozoïde et de l'ovule) a lieu dans la trompe de Fallope."
                    }
                ]
            },
            {
                id: 13602,
                order: 2,
                title: "Génétique et hérédité",
                description: "Les chromosomes, l'ADN et la transmission des caractères héréditaires.",
                content: `### Leçon : Génétique et hérédité

**1. Les chromosomes**

**Définition :**
Les chromosomes sont des structures filamenteuses situées dans le noyau de chaque cellule. Ils portent l'information génétique (hérédité).

**Nombre de chromosomes :**
- L'être humain possède **46 chromosomes** dans chaque cellule (23 paires).
- **22 paires d'autosomes** (chromosomes non sexuels).
- **1 paire de chromosomes sexuels** : XX chez la femme, XY chez l'homme.

**Gamètes (cellules reproductrices) :**
- Spermatozoïdes et ovules contiennent **23 chromosomes** (la moitié).
- À la fécondation, l'union des deux gamètes reconstitue 46 chromosomes.

---

**2. L'ADN (Acide DésoxyriboNucléique)**

**Définition :**
L'ADN est la molécule qui constitue les chromosomes. Elle contient toute l'information génétique nécessaire au développement et au fonctionnement de l'organisme.

**Structure :**
- Forme de **double hélice** (échelle torsadée).
- Composée de 4 bases : Adénine (A), Thymine (T), Guanine (G), Cytosine (C).

**Gènes :**
- Segments d'ADN qui codent pour un caractère précis (couleur des yeux, groupe sanguin, etc.).
- L'être humain possède environ 20 000 à 25 000 gènes.

---

**3. La transmission des caractères héréditaires**

**Hérédité :**
C'est la transmission des caractères des parents aux enfants par les gènes.

**Exemples de caractères héréditaires :**
- Couleur des yeux.
- Couleur de la peau.
- Type de cheveux (bouclés, raides).
- Groupe sanguin.
- Certaines maladies génétiques (drépanocytose, albinisme).

**Allèles :**
- Pour chaque caractère, il existe plusieurs versions du gène appelées **allèles**.
- Exemple : Pour la couleur des yeux, il y a des allèles pour les yeux marrons, bleus, verts, etc.

---

**4. Caractères dominants et récessifs**

**Allèle dominant :**
S'exprime même en une seule copie.
- Exemple : Yeux marrons (dominant) sur yeux bleus.

**Allèle récessif :**
Ne s'exprime que si l'individu possède deux copies de cet allèle.
- Exemple : Yeux bleus (récessif).

**Loi de Mendel (simplifiée) :**
Si un parent a deux allèles "yeux marrons" (AA) et l'autre deux allèles "yeux bleus" (aa), tous les enfants auront des yeux marrons (Aa) mais porteront l'allèle "yeux bleus".

---

**5. Le sexe de l'enfant**

**Détermination du sexe :**
- Le sexe dépend des chromosomes sexuels.
- **Fille** : XX (reçoit un X de la mère et un X du père).
- **Garçon** : XY (reçoit un X de la mère et un Y du père).

**Probabilité :**
À chaque conception, il y a 50% de chances d'avoir une fille et 50% de chances d'avoir un garçon.

> [!NOTE]
> **C'est le père qui détermine le sexe** : La mère transmet toujours un chromosome X, tandis que le père peut transmettre soit un X (fille), soit un Y (garçon).

---

**6. Maladies génétiques**

**Drépanocytose :**
- Maladie héréditaire du sang (globules rouges en forme de faucille).
- Courante en Afrique.
- Transmission récessive : les deux parents doivent transmettre l'allèle malade.

**Albinisme :**
- Absence de pigment mélanine (peau, cheveux et yeux très clairs).
- Transmission récessive.

> [!WARNING]
> **Prévention** : Le conseil génétique et le dépistage permettent de connaître les risques de transmission de certaines maladies héréditaires.`,
                course: 306,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 136021,
                        title: "Nombre de chromosomes",
                        description: "Connaître le patrimoine génétique",
                        question: "Combien de chromosomes possède une cellule humaine normale ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "46",
                        explanation: "L'être humain possède 46 chromosomes (23 paires) dans chaque cellule du corps."
                    },
                    {
                        id: 136022,
                        title: "Chromosomes sexuels",
                        description: "Détermination du sexe",
                        question: "Quelle est la paire de chromosomes sexuels chez un garçon ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "XY",
                        explanation: "Les garçons possèdent une paire de chromosomes sexuels XY, tandis que les filles ont XX."
                    },
                    {
                        id: 136023,
                        title: "Transmission héréditaire",
                        description: "Comprendre l'hérédité",
                        question: "Qui détermine le sexe de l'enfant : le père ou la mère ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "Le père",
                        explanation: "C'est le père qui détermine le sexe car il peut transmettre soit un chromosome X (fille) soit un Y (garçon)."
                    }
                ]
            },
            {
                id: 13603,
                order: 3,
                title: "Hygiène et santé sexuelle",
                description: "Prévention des IST, hygiène corporelle et système immunitaire.",
                content: `### Leçon : Hygiène et santé sexuelle

**1. Les Infections Sexuellement Transmissibles (IST)**

**Définition :**
Les IST sont des infections qui se transmettent principalement par les rapports sexuels non protégés.

**Principales IST :**

| IST | Agent | Symptômes | Traitement |
|-----|-------|-----------|------------|
| **Sida** | Virus VIH | Affaiblissement immunitaire | Antirétroviraux (ARV) |
| **Syphilis** | Bactérie | Chancre, éruptions cutanées | Antibiotiques |
| **Gonorrhée** | Bactérie | Écoulements, douleurs | Antibiotiques |
| **Hépatite B** | Virus | Jaunisse, fatigue | Vaccin disponible |
| **Papillomavirus (HPV)** | Virus | Verrues génitales, cancers | Vaccin disponible |

---

**2. Le VIH/Sida**

**VIH (Virus de l'Immunodéficience Humaine) :**
- Virus qui détruit progressivement les cellules du système immunitaire.
- **Sida** (Syndrome d'ImmunoDéficience Acquise) : Stade avancé de l'infection.

**Modes de transmission :**
1. **Rapport sexuel non protégé** (principal mode).
2. **Sang contaminé** (transfusion, seringues partagées).
3. **Transmission mère-enfant** (grossesse, accouchement, allaitement).

**Modes de NON transmission :**
- Poignée de main, câlin, baiser.
- Utilisation des toilettes, piscine.
- Piqûre de moustique.
- Partage de repas ou d'ustensiles.

> [!IMPORTANT]
> **Dépistage et traitement** : Le dépistage précoce permet de commencer le traitement ARV qui empêche l'évolution vers le Sida et réduit la transmission.

---

**3. Prévention des IST**

**Moyens de prévention :**

**a) L'abstinence**
- Ne pas avoir de rapports sexuels.
- Méthode 100% efficace contre les IST.

**b) La fidélité mutuelle**
- Avoir un seul partenaire fidèle et non infecté.

**c) Le préservatif**
- **Préservatif masculin** : Gaine en latex placée sur le pénis.
- **Préservatif féminin** : Gaine placée dans le vagin.
- Efficacité : environ 98% s'il est bien utilisé.
- Protège contre les IST ET les grossesses non désirées.

**d) La vaccination**
- Vaccins disponibles contre l'hépatite B et le HPV.

**e) Le dépistage régulier**
- Permet de détecter et traiter rapidement les IST.

> [!TIP]
> **ABC de la prévention** :  
> **A**bstinence - **B**e faithful (Fidélité) - **C**ondom (Préservatif)

---

**4. Le système immunitaire**

**Définition :**
Le système immunitaire est l'ensemble des mécanismes de défense de l'organisme contre les agents pathogènes (virus, bactéries, parasites).

**Acteurs principaux :**
- **Globules blancs** (leucocytes) : Cellules qui détruisent les microbes.
- **Anticorps** : Protéines produites pour neutraliser les agents pathogènes.
- **Lymphocytes** : Type de globules blancs essentiels à l'immunité.

**Réponse immunitaire :**
1. **Reconnaissance** de l'agent pathogène.
2. **Multiplication** des lymphocytes.
3. **Attaque et destruction** du pathogène.
4. **Mémoire immunitaire** : Protection future contre le même pathogène.

---

**5. Les vaccins**

**Définition :**
Un vaccin est une préparation contenant des agents pathogènes tués ou affaiblis, qui stimule le système immunitaire à produire des anticorps sans causer la maladie.

**Principe :**
- Introduction d'une forme atténuée du microbe.
- Le corps développe une mémoire immunitaire.
- En cas d'infection réelle, le corps réagit rapidement.

**Exemples de vaccins au Burkina Faso :**
- BCG (tuberculose).
- Polio.
- Rougeole.
- Hépatite B.
- Fièvre jaune.

---

**6. Hygiène corporelle et sexuelle**

**Hygiène quotidienne :**
- Douche régulière (au moins une fois par jour).
- Lavage des organes génitaux avec de l'eau propre (sans savon parfumé).
- Changement régulier de sous-vêtements.

**Hygiène menstruelle :**
- Utilisation de serviettes hygiéniques propres.
- Changement toutes les 4-6 heures.
- Lavage régulier pendant les règles.

> [!WARNING]
> **Mutilations génitales féminines (MGF)** : Pratique dangereuse et interdite par la loi au Burkina Faso. Elles causent des douleurs, infections, complications lors de l'accouchement et traumatismes psychologiques.`,
                course: 306,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 136031,
                        title: "Modes de transmission du VIH",
                        description: "Connaître les risques",
                        question: "Citez deux modes de transmission du VIH.",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "Rapports sexuels non protégés et sang contaminé",
                        explanation: "Le VIH se transmet principalement par rapports sexuels non protégés, sang contaminé et de la mère à l'enfant."
                    },
                    {
                        id: 136032,
                        title: "Prévention des IST",
                        description: "Moyens de protection",
                        question: "Quel moyen de protection protège à la fois contre les IST et les grossesses ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "Préservatif",
                        explanation: "Le préservatif (masculin ou féminin) est le seul moyen de protection qui protège contre les IST et les grossesses."
                    },
                    {
                        id: 136033,
                        title: "Rôle des vaccins",
                        description: "Comprendre la vaccination",
                        question: "Comment un vaccin protège-t-il contre les maladies ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "En stimulant le système immunitaire à produire des anticorps",
                        explanation: "Le vaccin contient des agents pathogènes affaiblis qui stimulent le système immunitaire à créer une mémoire immunitaire sans causer la maladie."
                    }
                ]
            },
            {
                id: 13604,
                order: 4,
                title: "L'électricité",
                description: "Circuits électriques, loi d'Ohm et sécurité électrique.",
                content: `### Leçon : L'électricité

**1. Le courant électrique**

**Définition :**
Le courant électrique est un déplacement ordonné de charges électriques (électrons) dans un conducteur.

**Sens du courant :**
- **Sens conventionnel** : Du pôle positif (+) vers le pôle négatif (-).
- **Sens réel des électrons** : Du pôle négatif vers le pôle positif (inverse).

**Unités :**
- **Intensité (I)** : Mesure la quantité de charges qui traverse un conducteur par seconde. Unité : **Ampère (A)**.
- **Tension (U)** : Mesure la différence de potentiel entre deux points. Unité : **Volt (V)**.
- **Résistance (R)** : Mesure l'opposition au passage du courant. Unité : **Ohm (Ω)**.

---

**2. Le circuit électrique simple**

**Composants de base :**
- **Générateur** : Source d'électricité (pile, batterie, dynamo).
- **Récepteur** : Appareil qui utilise l'électricité (lampe, moteur).
- **Conducteurs** : Fils électriques qui transportent le courant.
- **Interrupteur** : Permet d'ouvrir ou fermer le circuit.

**Circuit fermé :** Le courant circule (lampe allumée).  
**Circuit ouvert :** Le courant ne circule pas (lampe éteinte).

---

**3. Les types de circuits**

**a) Circuit en série**
- Les composants sont placés les uns à la suite des autres.
- Le courant a un seul chemin.
- **Conséquence** : Si un composant est retiré, le circuit est coupé.
- L'intensité est la même partout dans le circuit.

**b) Circuit en dérivation (parallèle)**
- Les composants sont branchés sur plusieurs branches.
- Le courant se divise entre les branches.
- **Conséquence** : Si un composant est retiré, les autres continuent de fonctionner.
- La tension est la même aux bornes de chaque branche.

---

**4. La loi d'Ohm**

**Énoncé :**
La tension U aux bornes d'un conducteur est égale au produit de la résistance R par l'intensité I du courant qui le traverse.

**Formule :**  
**U = R × I**

Où :
- U : Tension en Volts (V)
- R : Résistance en Ohms (Ω)
- I : Intensité en Ampères (A)

**Applications :**
- Calculer la tension : U = R × I
- Calculer l'intensité : I = U / R
- Calculer la résistance : R = U / I

**Exemple :**  
Si une lampe a une résistance de 10 Ω et est traversée par un courant de 2 A, quelle est la tension à ses bornes ?  
U = R × I = 10 × 2 = **20 V**

---

**5. Mesures électriques**

**a) L'ampèremètre**
- Mesure l'intensité du courant.
- Se branche **en série** dans le circuit.
- Symbole : (A)

**b) Le voltmètre**
- Mesure la tension entre deux points.
- Se branche **en dérivation** (parallèle) aux bornes du composant.
- Symbole : (V)

---

**6. Sécurité électrique**

**Dangers de l'électricité :**
- **Électrocution** : Passage du courant à travers le corps humain (peut être mortel).
- **Incendie** : Court-circuit ou surcharge peuvent provoquer un incendie.
- **Brûlures** : Contact avec des conducteurs sous tension.

**Règles de sécurité :**
1. Ne jamais toucher un appareil électrique avec les mains mouillées.
2. Ne pas manipuler les prises ou câbles électriques dénudés.
3. Débrancher les appareils avant de les réparer.
4. Utiliser des fusibles et disjoncteurs pour protéger les installations.
5. Ne pas surcharger les prises (trop d'appareils branchés).
6. En cas d'électrocution, couper le courant avant de toucher la victime.

> [!CAUTION]
> **Danger de mort** : Le courant domestique (220V au Burkina Faso) peut être mortel. Ne jamais manipuler une installation électrique sans compétence ou sans avoir coupé le courant.

---

**7. Production de l'électricité**

**Sources d'énergie :**
- **Centrale thermique** : Combustion de charbon, gaz, pétrole.
- **Centrale hydraulique** : Mouvement de l'eau (barrage).
- **Panneau solaire** : Conversion de la lumière du soleil.
- **Éolienne** : Force du vent.

**Au Burkina Faso :**
- Centrale thermique de Kossodo (Ouagadougou).
- Barrages hydroélectriques (Bagré, Kompienga).
- Développement des énergies renouvelables (solaire).`,
                course: 306,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 136041,
                        title: "Loi d'Ohm - Calcul",
                        description: "Appliquer la formule",
                        question: "Un appareil a une résistance de 5 Ω et est traversé par un courant de 3 A. Quelle est la tension à ses bornes ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "15",
                        explanation: "U = R × I = 5 × 3 = 15 V."
                    },
                    {
                        id: 136042,
                        title: "Circuit en série vs parallèle",
                        description: "Comprendre les circuits",
                        question: "Dans quel type de circuit les composants continuent-ils de fonctionner si l'un d'eux est retiré ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "Circuit en dérivation",
                        explanation: "Dans un circuit en dérivation (parallèle), chaque composant a son propre chemin, donc si l'un est retiré, les autres fonctionnent encore."
                    },
                    {
                        id: 136043,
                        title: "Sécurité électrique",
                        description: "Connaître les dangers",
                        question: "Pourquoi ne faut-il pas toucher un appareil électrique avec les mains mouillées ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "L'eau conduit l'électricité et risque l'électrocution",
                        explanation: "L'eau est conductrice d'électricité. Avec les mains mouillées, le risque d'électrocution est très élevé."
                    }
                ]
            },
            {
                id: 13605,
                order: 5,
                title: "Réactions chimiques",
                description: "Acides, bases, combustion et oxydation.",
                content: `### Leçon : Réactions chimiques

**1. Qu'est-ce qu'une réaction chimique ?**

**Définition :**
Une réaction chimique est une transformation au cours de laquelle des substances (réactifs) se transforment en nouvelles substances (produits) avec des propriétés différentes.

**Exemples :**
- Combustion du bois : Bois + Oxygène → Cendres + Fumée + Chaleur
- Rouille du fer : Fer + Oxygène + Eau → Oxyde de fer (rouille)
- Cuisson d'un œuf : Protéines liquides → Protéines solides

**Signes d'une réaction chimique :**
- Changement de couleur.
- Dégagement de gaz (bulles).
- Formation d'un précipité (solide).
- Dégagement ou absorption de chaleur.

---

**2. La combustion**

**Définition :**
La combustion est une réaction chimique entre un combustible et un comburant (généralement l'oxygène de l'air) qui produit de la chaleur et de la lumière.

**Triangle du feu :**
Pour qu'il y ait combustion, trois éléments sont nécessaires :
1. **Combustible** : Matière qui brûle (bois, essence, gaz).
2. **Comburant** : Oxygène de l'air.
3. **Source de chaleur** : Allumette, étincelle, etc.

**Produits de combustion :**
- Combustion complète : Produit du dioxyde de carbone (CO₂) et de l'eau (H₂O).
- Combustion incomplète : Produit du monoxyde de carbone (CO) - gaz toxique.

> [!CAUTION]
> **Danger du monoxyde de carbone (CO)** : Gaz inodore et invisible, très toxique. Peut causer des intoxications mortelles (cuisinières à charbon dans des pièces mal aérées).

**Prévention des incendies :**
- Supprimer l'un des trois éléments du triangle du feu.
- Eau : Refroidit et élimine la chaleur.
- Sable ou couverture : Étouffent le feu en coupant l'oxygène.
- Extincteur : Projette un produit qui coupe l'oxygène ou refroidit.

---

**3. Les acides et les bases**

**a) Les acides**

**Définition :**
Un acide est une substance qui a un goût aigre et qui peut corroder certains matériaux.

**Propriétés :**
- pH inférieur à 7.
- Rougit le papier tournesol bleu.
- Réagit avec les métaux pour dégager de l'hydrogène (H₂).

**Exemples :**
- Acide chlorhydrique (HCl) - Utilisé pour nettoyer.
- Acide sulfurique (H₂SO₄) - Dans les batteries de voiture.
- Acide citrique - Dans les agrumes (citron, orange).
- Vinaigre (acide acétique).

---

**b) Les bases**

**Définition :**
Une base est une substance qui a un goût amer et une texture glissante (savonneuse).

**Propriétés :**
- pH supérieur à 7.
- Bleuit le papier tournesol rouge.
- Neutralise les acides.

**Exemples :**
- Soude caustique (hydroxyde de sodium) - Débouche les canalisations.
- Savon, lessive.
- Ammoniaque (produit de nettoyage).

---

**c) Le pH (potentiel Hydrogène)**

**Échelle de pH :**
- **0 à 6** : Acide (plus c'est proche de 0, plus c'est acide).
- **7** : Neutre (eau pure).
- **8 à 14** : Basique (plus c'est proche de 14, plus c'est basique).

**Exemples de pH :**
- Acide de batterie : pH 1
- Jus de citron : pH 2
- Vinaigre : pH 3
- Eau pure : pH 7
- Savon : pH 9
- Eau de Javel : pH 12

---

**4. Neutralisation acide-base**

**Définition :**
Une réaction de neutralisation se produit lorsqu'un acide réagit avec une base pour former un sel et de l'eau.

**Formule générale :**  
**Acide + Base → Sel + Eau**

**Exemple :**  
Acide chlorhydrique + Hydroxyde de sodium → Chlorure de sodium + Eau  
HCl + NaOH → NaCl + H₂O

**Application :**
- Traitement des brûlures d'estomac (acidité) avec des médicaments basiques (antacides).
- Agriculture : Ajout de chaux (base) pour neutraliser l'acidité du sol.

---

**5. L'oxydation**

**Définition :**
L'oxydation est une réaction chimique dans laquelle une substance se combine avec l'oxygène.

**Exemples :**
- **Rouille du fer** : Fer + Oxygène + Eau → Oxyde de fer (Fe₂O₃).
- **Brunissement d'une pomme coupée** : Oxydation à l'air.
- **Respiration** : Glucose + Oxygène → Énergie + CO₂ + H₂O.

**Prévention de l'oxydation :**
- Peinture sur le fer (empêche le contact avec l'air et l'eau).
- Utilisation de métaux inoxydables (acier inoxydable).
- Conservation des aliments à l'abri de l'air.

> [!TIP]
> **Astuce** : Pour empêcher une pomme de brunir, arrosez-la de jus de citron (acide citrique ralentit l'oxydation).`,
                course: 306,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 136051,
                        title: "Triangle du feu",
                        description: "Comprendre la combustion",
                        question: "Citez les trois éléments nécessaires pour qu'il y ait combustion.",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "Combustible, comburant et source de chaleur",
                        explanation: "Le triangle du feu comprend : combustible (ce qui brûle), comburant (oxygène), source de chaleur (allumette, étincelle)."
                    },
                    {
                        id: 136052,
                        title: "Acides et bases",
                        description: "Connaître le pH",
                        question: "Une solution de pH 3 est-elle acide ou basique ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "Acide",
                        explanation: "Un pH inférieur à 7 indique une solution acide. Plus le pH est proche de 0, plus la solution est acide."
                    },
                    {
                        id: 136053,
                        title: "Réaction de neutralisation",
                        description: "Comprendre le principe",
                        question: "Que produit la réaction entre un acide et une base ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "Un sel et de l'eau",
                        explanation: "Une réaction de neutralisation entre un acide et une base produit un sel et de l'eau."
                    }
                ]
            }
        ] as any
    }
];
