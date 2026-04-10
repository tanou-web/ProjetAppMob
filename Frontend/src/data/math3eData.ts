import { Course } from '../types';

export const allMath3eCourses: Partial<Course>[] = [
    {
        id: 301,
        title: "Mathématiques 3ème",
        description: "Programme officiel du Burkina Faso : Nombres réels, racines carrées, identités remarquables et géométrie.",
        level: "3ème",
        subject: "Mathématiques",
        lessons: [
            {
                id: 13001,
                order: 1,
                title: "Les nombres réels",
                description: "Ensemble IR, intervalles et calcul avec les réels.",
                content: `### Leçon : Les nombres réels (IR)

**1. Définition de l'ensemble IR**
*   L'ensemble des **nombres réels** est composé de tous les nombres rationnels (décimaux, périodiques) et irrationnels (comme √2 ou π).
*   On le note **IR**.

**2. Les intervalles**
*   **Intervalle fermé [a ; b]** : L'ensemble des réels x tels que *a ≤ x ≤ b*. Les bornes sont incluses.
*   **Intervalle ouvert ]a ; b[** : L'ensemble des réels x tels que *a < x < b*. Les bornes sont exclues.
*   **Intervalles illimités** : Par exemple, *x > a* s'écrit *x ∈ ]a ; +∞[*.

**3. Valeur Absolue**
*   La valeur absolue de x, notée **|x|**, est sa distance à zéro. Elle est toujours positive.
*   *|x| = x* si x ≥ 0 ; *|x| = -x* si x < 0.

**4. Opérations et encadrements**
*   **Somme** : Si *a < x < b* et *a' < y < b'*, alors *a + a' < x + y < b + b'*.
*   **Différence** : Pour encadrer *x - y*, on calcule *x + (-y)*.
    > [!WARNING]
    > **Erreur fréquente** : Ne jamais soustraire les bornes directement ! Il faut d'abord encadrer *-y* (en inversant les bornes), puis additionner.`,
                course: 301,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 130011,
                        title: "Encadrement d'une somme",
                        description: "Calculer l'intervalle de x + y",
                        question: "Si x ∈ [-11 ; -9] et y ∈ [16 ; 19], quel est l'intervalle de x + y ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "[5 ; 10]",
                        explanation: "On additionne les bornes : -11 + 16 = 5 et -9 + 19 = 10. Donc x + y ∈ [5 ; 10]."
                    },
                    {
                        id: 130012,
                        title: "Encadrement d'une différence",
                        description: "Calculer l'intervalle de z - t",
                        question: "Si 2 ≤ z ≤ 7 et -5 ≤ t ≤ -3, quel est l'encadrement de z - t ?",
                        type: "short_answer",
                        difficulty: 3,
                        points: 15,
                        correct_answer: "[5 ; 12]",
                        explanation: "On encadre d'abord -t : 3 ≤ -t ≤ 5. Puis on ajoute à z : 2 + 3 ≤ z - t ≤ 7 + 5, donc 5 ≤ z - t ≤ 12."
                    }
                ]
            },
            {
                id: 13003,
                order: 2,
                title: "Identités remarquables",
                description: "Les trois formules essentielles pour développer et factoriser.",
                content: `### Leçon : Les identités remarquables

En mathématiques, il existe trois égalités à connaître par cœur pour simplifier les calculs de développement et de factorisation.

**1. Carré d'une somme**
(a + b)² = **a² + 2ab + b²**

**2. Carré d'une différence**
(a - b)² = **a² - 2ab + b²**

**3. Produit de la somme par la différence**
(a + b)(a - b) = **a² - b²**

---

### Exemples d'application
- **Développer** (x + 3)² : x² + 2(x)(3) + 3² = x² + 6x + 9
- **Factoriser** x² - 16 : (x + 4)(x - 4)`,
                course: 301,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 130031,
                        title: "Développement",
                        description: "Appliquer la première identité",
                        question: "Développer (x + 5)²",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "x² + 10x + 25",
                        explanation: "(x + 5)² = x² + 2*x*5 + 5² = x² + 10x + 25."
                    },
                    {
                        id: 130032,
                        title: "Factorisation",
                        description: "Appliquer la troisième identité",
                        question: "Factoriser x² - 49",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "(x-7)(x+7)",
                        explanation: "x² - 49 = x² - 7² = (x - 7)(x + 7)."
                    }
                ]
            },
            {
                id: 13004,
                order: 3,
                title: "La racine carrée",
                description: "Définition, propriétés et calculs avec les radicaux.",
                content: `### Leçon : La racine carrée

**1. Définition**
*   Pour tout nombre réel positif *a*, la **racine carrée** de *a* (notée **√a**) est le nombre positif dont le carré est égal à *a*.
*   Le symbole **√** est appelé le radical.
*   *(√a)² = a*.

**2. Propriétés de calcul**
*   **Produit** : *√(a × b) = √a × √b* (pour a, b ≥ 0).
*   **Quotient** : *√(a / b) = √a / √b* (pour a ≥ 0, b > 0).

> [!CAUTION]
> **Attention** : En général, *√(a + b)* **n'est pas égal** à *√a + √b*.
> *Exemple* : √(16 + 9) = √25 = 5, alors que √16 + √9 = 4 + 3 = 7.

**3. Rendre rationnel un dénominateur**
*   Pour supprimer la racine carrée au dénominateur de *a / √b*, on multiplie le numérateur et le dénominateur par *√b* : *(a × √b) / b*.
*   Si le dénominateur est de la forme *a + √b*, on utilise l'expression conjuguée *a - √b*.`,
                course: 301,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 130041,
                        title: "Comparaison de racines",
                        description: "Comparer deux nombres avec radicaux",
                        question: "Comparer 2√7 et √21. Lequel est le plus grand ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "2√7",
                        explanation: "(2√7)² = 4 × 7 = 28 et (√21)² = 21. Comme 28 > 21, alors 2√7 > √21."
                    },
                    {
                        id: 130042,
                        title: "Rendre rationnel",
                        description: "Supprimer le radical du dénominateur",
                        question: "Rendre rationnel le dénominateur de 5 / √7.",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "5√7/7",
                        explanation: "On multiplie par √7 en haut et en bas : (5 × √7) / (√7 × √7) = 5√7/7."
                    }
                ]
            },
            {
                id: 13005,
                order: 4,
                title: "Théorème de Thalès",
                description: "Proportionnalité des segments dans des triangles imbriqués.",
                content: `### Leçon : Théorème de Thalès

Le théorème de Thalès permet de calculer des longueurs dans des figures géométriques comportant des droites parallèles.

**1. Énoncé du théorème**
Soient deux droites (d) et (d') sécantes en A.
Si B et M sont deux points de (d) et C et N sont deux points de (d'), tels que les droites (BC) et (MN) soient parallèles, alors :
**AM/AB = AN/AC = MN/BC**

**2. Réciproque du théorème**
La réciproque sert à prouver que deux droites sont **parallèles**.
Si AM/AB = AN/AC et si les points A, M, B d'une part et A, N, C d'autre part sont alignés dans le même ordre, alors les droites (MN) et (BC) sont parallèles.`,
                course: 301,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 130051,
                        title: "Calcul de longueur",
                        description: "Appliquer Thalès",
                        question: "Dans une configuration de Thalès avec (BC) // (MN), si AB=5, AM=2 et BC=10, quelle est la longueur de MN ?",
                        type: "short_answer",
                        difficulty: 3,
                        points: 10,
                        correct_answer: "4",
                        explanation: "AM/AB = MN/BC => 2/5 = MN/10 => MN = (2 * 10) / 5 = 4."
                    }
                ]
            },
            {
                id: 13006,
                order: 5,
                title: "Statistiques",
                description: "Moyenne, médiane, mode et représentation graphique des données.",
                content: `### Leçon : Statistiques

Les statistiques permettent de **collecter, organiser et analyser** des données pour en tirer des informations utiles.

---

**1. Vocabulaire de base**

- **Population** : Ensemble des individus ou objets étudiés.
- **Caractère** : Propriété étudiée (âge, taille, note, etc.).
- **Effectif** : Nombre de fois qu'une valeur apparaît.
- **Fréquence** : Proportion d'une valeur par rapport au total (en % ou en fraction).

---

**2. Les indicateurs de tendance centrale**

**a) La moyenne (x̄)**  
C'est la somme de toutes les valeurs divisée par le nombre de valeurs.

**Formule :** x̄ = (somme des valeurs) / (nombre de valeurs)

*Exemple* : Les notes d'un élève sont 12, 14, 16. La moyenne est (12+14+16)/3 = 14.

**b) La médiane**  
C'est la valeur qui partage la série en deux parties égales (50% en dessous, 50% au-dessus).

*Méthode* : Ordonner les valeurs puis prendre celle du milieu.

*Exemple* : Pour 8, 10, 12, 15, 18 → la médiane est **12**.

**c) Le mode**  
C'est la valeur qui apparaît le plus souvent dans la série.

*Exemple* : Dans 5, 7, 7, 9, 12, 7 → le mode est **7**.

---

**3. Représentations graphiques**

- **Diagramme en bâtons** : Pour des données discrètes (notes, nombre d'élèves).
- **Histogramme** : Pour des données regroupées en classes.
- **Diagramme circulaire** : Pour montrer les proportions.

> [!TIP]
> **Astuce** : Pour trouver la médiane d'une série paire (ex: 4 valeurs), on fait la moyenne des deux valeurs centrales.`,
                course: 301,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 130061,
                        title: "Calcul de moyenne",
                        description: "Calculer la moyenne d'une série",
                        question: "Calculer la moyenne des notes suivantes : 10, 12, 14, 16, 18",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "14",
                        explanation: "Moyenne = (10+12+14+16+18)/5 = 70/5 = 14."
                    },
                    {
                        id: 130062,
                        title: "Identifier la médiane",
                        description: "Trouver la valeur centrale",
                        question: "Quelle est la médiane de la série : 3, 7, 9, 11, 15 ?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "9",
                        explanation: "La série est déjà ordonnée. La valeur centrale (3ème position sur 5) est 9."
                    },
                    {
                        id: 130063,
                        title: "Identifier le mode",
                        description: "Trouver la valeur la plus fréquente",
                        question: "Quel est le mode de la série : 5, 8, 8, 10, 12, 8, 15 ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "8",
                        explanation: "Le nombre 8 apparaît 3 fois, plus que toute autre valeur."
                    }
                ]
            },
            {
                id: 13007,
                order: 6,
                title: "Équations du premier degré",
                description: "Résoudre des équations de la forme ax + b = c.",
                content: `### Leçon : Équations du premier degré

Une **équation du premier degré** est une égalité contenant une inconnue (généralement x) à la puissance 1.

---

**1. Forme générale**

**ax + b = c**

où a, b, c sont des nombres connus et x est l'inconnue à trouver.

---

**2. Méthode de résolution**

**Principe** : Isoler x d'un côté de l'égalité.

**Étapes :**
1. **Regrouper** les termes avec x d'un côté, les nombres de l'autre.
2. **Simplifier** en effectuant les opérations inverses.
3. **Diviser** par le coefficient de x.

**Exemple 1 :** Résoudre 3x + 5 = 14
- Soustraire 5 des deux côtés : 3x = 14 - 5 = 9
- Diviser par 3 : x = 9/3 = 3

**Exemple 2 :** Résoudre 2x - 7 = 3
- Ajouter 7 des deux côtés : 2x = 3 + 7 = 10
- Diviser par 2 : x = 10/2 = 5

---

**3. Vérification**

Toujours **vérifier** la solution en la remplaçant dans l'équation initiale.

*Exemple* : Pour x = 3 dans 3x + 5 = 14 :  
3(3) + 5 = 9 + 5 = 14 ✓

---

**4. Problèmes concrets**

Les équations permettent de résoudre des problèmes de la vie courante.

*Exemple* : "J'ai acheté 5 cahiers identiques et payé 2500 FCFA. Quel est le prix d'un cahier ?"
- Équation : 5x = 2500
- Solution : x = 2500/5 = 500 FCFA

> [!WARNING]
> **Attention** : Ne jamais diviser par zéro ! Si le coefficient de x est 0, l'équation n'a pas de solution unique.`,
                course: 301,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 130071,
                        title: "Équation simple",
                        description: "Résoudre une équation de base",
                        question: "Résoudre : 2x + 6 = 14",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "4",
                        explanation: "2x = 14 - 6 = 8, donc x = 8/2 = 4."
                    },
                    {
                        id: 130072,
                        title: "Équation avec soustraction",
                        description: "Résoudre une équation",
                        question: "Résoudre : 5x - 10 = 15",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "5",
                        explanation: "5x = 15 + 10 = 25, donc x = 25/5 = 5."
                    },
                    {
                        id: 130073,
                        title: "Problème concret",
                        description: "Traduire et résoudre",
                        question: "Un stylo coûte x FCFA. Si 3 stylos coûtent 900 FCFA, combien coûte un stylo ?",
                        type: "short_answer",
                        difficulty: 3,
                        points: 15,
                        correct_answer: "300",
                        explanation: "Équation : 3x = 900, donc x = 900/3 = 300 FCFA."
                    }
                ]
            }
        ] as any
    }
];
