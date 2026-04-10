import { Course } from '../types';

export const allMath4eCourses: Partial<Course>[] = [
    {
        id: 401,
        title: "Mathématiques 4ème",
        description: "Programme officiel : Calcul littéral, équations, vecteurs, Pythagore et Thalès.",
        level: "4ème",
        subject: "Mathématiques",
        lessons: [
            {
                id: 12001,
                order: 1,
                title: "Calculs numériques et priorités",
                description: "Enchaînement d'opérations avec et sans parenthèses.",
                content: `### Leçon : Priorités opératoires

**1. Calculs sans parenthèses**
*   On effectue d'abord les **multiplications** et les **divisions**.
*   Ensuite, on effectue les additions et les soustractions de gauche à droite.

**2. Calculs avec parenthèses**
*   On effectue d'abord les calculs situés à l'intérieur des parenthèses les plus internes.
*   *Exemple* : (5 + 3) x 2 = 8 x 2 = 16.

**3. Convention d'écriture**
*   Le trait de fraction joue le rôle de parenthèses pour le numérateur et le dénominateur.`,
                course: 401,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 120001,
                        title: "Quiz Priorités",
                        description: "Calculer A = 10 + 5 x 2",
                        question: "Quelle est la valeur de 10 + 5 x 2 ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 10,
                        correct_answer: "20",
                        explanation: "La multiplication est prioritaire : 5 x 2 = 10. Puis 10 + 10 = 20."
                    }
                ]
            },
            {
                id: 12002,
                order: 2,
                title: "Nombres rationnels (Quotients)",
                description: "Opérations sur les fractions et quotients de décimaux.",
                content: `### Leçon : Les nombres rationnels

**1. Addition et soustraction**
*   Il faut d'abord mettre les fractions au **même dénominateur**.
*   Une fois au même dénominateur, on ajoute ou soustrait les numérateurs.

**2. Multiplication**
*   On multiplie les numérateurs entre eux et les dénominateurs entre eux.
*   *(a/b) x (c/d) = (ac)/(bd)*.

**3. Division**
*   Diviser par un nombre revient à multiplier par son **inverse**.
*   *(a/b) ÷ (c/d) = (a/b) x (d/c)*.`,
                course: 401,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 12003,
                order: 3,
                title: "Les puissances",
                description: "Puissances d'un nombre et puissances de 10.",
                content: `### Leçon : Puissances et notation scientifique

**1. Définition**
*   *a^n* (a puissance n) est le produit de a par lui-même n fois.
*   *10^3 = 10 x 10 x 10 = 1000*.

**2. Règles de calcul**
*   *a^n x a^m = a^(n+m)*
*   *(a^n)^m = a^(nm)*
*   *(ab)^n = a^n x b^n*

**3. Notation scientifique**
*   S'écrit sous la forme *a x 10^n* où 1 <= a < 10.
*   *Exemple* : 53 000 = 5,3 x 10^4.`,
                course: 401,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 12004,
                order: 4,
                title: "Calcul littéral",
                description: "Développer et réduire des expressions algébriques.",
                content: `### Leçon : Algèbre et développement

**1. Réduction**
*   Regrouper les termes de "même famille" (ex: les x ensemble, les nombres ensemble).
*   *2x + 3 + 5x - 1 = 7x + 2*.

**2. Développement (Distributivité)**
*   *k(a + b) = ka + kb*
*   *(a + b)(c + d) = ac + ad + bc + bd* (Double distributivité).

**3. Suppression de parenthèses**
*   Si un "+" précède : on garde les signes.
*   Si un "-" précède : on **inverse** tous les signes à l'intérieur.`,
                course: 401,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 12005,
                order: 5,
                title: "Équations du premier degré",
                description: "Résoudre des équations de type ax + b = c.",
                content: `### Leçon : Les Équations

**1. Définition**
*   Une équation est une égalité comportant une inconnue (souvent notée *x*).
*   Résoudre, c'est trouver la valeur de *x* qui rend l'égalité vraie.

**2. Méthode de résolution**
*   Isoler les termes en *x* d'un côté et les nombres de l'autre.
*   On peut ajouter, soustraire, multiplier ou diviser par un même nombre non nul des deux côtés.
*   *2x + 4 = 10* => *2x = 6* => *x = 3*.

**3. Mise en équation**
*   Traduire un problème en une expression mathématique pour le résoudre.`,
                course: 401,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 12006,
                order: 6,
                title: "Proportionnalité et vitesse",
                description: "Mouvements uniformes, pourcentages et échelles.",
                content: `### Leçon : Proportionnalité

**1. Vitesse moyenne**
*   *v = d / t* (Vitesse = distance divisée par le temps).
*   Unités courantes : km/h ou m/s.

**2. Pourcentages**
*   Calculer une augmentation ou une réduction.
*   Prendre x% d'un nombre revient à multiplier par x/100.

**3. Échelles**
*   L'échelle d'une carte est le rapport entre la distance sur la carte et la distance réelle.`,
                course: 401,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 12007,
                order: 7,
                title: "Statistiques",
                description: "Fréquences, moyennes et représentations graphiques.",
                content: `### Leçon : Analyse de données

**1. Vocabulaire**
*   **Population** : groupe étudié.
*   **Caractère** : ce qu'on mesure (couleur, taille, note).
*   **Effectif** : nombre de fois qu'une valeur apparait.

**2. Moyenne**
*   Somme de toutes les valeurs divisée par l'effectif total.
*   **Moyenne pondérée** : quand chaque valeur a un coefficient (un poids).

**3. Fréquence**
*   *Effectif de la valeur / Effectif total*. Souvent exprimé en pourcentage.`,
                course: 401,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 12008,
                order: 8,
                title: "Théorème de Pythagore",
                description: "Calculer des longueurs dans un triangle rectangle.",
                content: `### Leçon : Propriété de Pythagore

**1. Énoncé**
*   Dans un triangle **rectangle**, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés.
*   *AB² + AC² = BC²* (si le triangle est rectangle en A).

**2. Calculer une longueur**
*   On connaît deux côtés, on trouve le troisième.
*   *BC = √(AB² + AC²)*.

**3. Réciproque de Pythagore**
*   Si l'égalité *AB² + AC² = BC²* est vraie, alors le triangle est rectangle.`,
                course: 401,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 12009,
                order: 9,
                title: "Théorème de Thalès",
                description: "Configurations de Thalès et agrandissement/réduction.",
                content: `### Leçon : Théorème de Thalès

**1. Configuration**
*   Deux droites sécantes coupées par deux droites **parallèles**.
*   Les longueurs des côtés des deux triangles formés sont proportionnelles.

**2. Énoncé**
*   *AM/AB = AN/AC = MN/BC* (si (MN) // (BC)).

**3. Agrandissement et réduction**
*   Toutes les longueurs sont multipliées par un rapport *k*.
*   Les angles sont conservés.`,
                course: 401,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 12010,
                order: 10,
                title: "Cosinus d'un angle",
                description: "Trigonométrie dans le triangle rectangle.",
                content: `### Leçon : Le Cosinus

**1. Définition**
*   Dans un triangle rectangle, le cosinus d'un angle aigu est le rapport :
*   *Cos(angle) = Côté Adjacent / Hypoténuse*.

**2. Utilisation**
*   Calculer une longueur si on connaît l'angle et un côté.
*   Calculer un angle si on connaît les longueurs (utilisation de Arccos/Cos⁻¹).

**3. Valeurs**
*   Le cosinus d'un angle est toujours compris entre 0 et 1.`,
                course: 401,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 12011,
                order: 11,
                title: "Translations et Symmetries",
                description: "Glissement et transformations géoémtriques.",
                content: `### Leçon : Transformations

**1. Translation**
*   Faire glisser une figure sans la faire tourner, selon une direction, un sens et une longueur (un **vecteur**).

**2. Symétrie centrale**
*   Demi-tour autour d'un point (le centre).

**3. Propriétés**
*   Ces transformations conservent : les longueurs, les alignements, les angles et les aires.`,
                course: 401,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 12012,
                order: 12,
                title: "Introduction aux vecteurs",
                description: "Notion de vecteur et égalité de vecteurs.",
                content: `### Leçon : Les Vecteurs

**1. Définition**
*   Un vecteur **AB** est défini par : sa direction (droite (AB)), son sens (de A vers B) et sa norme (la longueur AB).

**2. Vecteurs égaux**
*   Deux vecteurs sont égaux s'ils ont même direction, même sens et même norme.
*   *AB = CD* si et seulement si ABDC est un **parallélogramme**.

**3. Somme de vecteurs (Relation de Chasles)**
*   **AB + BC = AC**.`,
                course: 401,
                created_at: new Date().toISOString(),
                exercises: []
            }
        ] as any
    }
];
