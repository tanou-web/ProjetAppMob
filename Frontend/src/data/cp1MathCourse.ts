import { Course } from '../types';

export const cp1MathCourse: Partial<Course> = {
    id: 101, // ID temporaire pour le catalogue simulé
    title: "Mathématiques CP1 - Vocabulaire Mathématique",
    description: "Découvrez les bases du vocabulaire mathématique à travers l'identification d'objets et les concepts de comparaison (plus que, moins que, autant que).",
    level: "CP1",
    subject: "Mathématiques",
    lessons: [
        {
            id: 1001,
            course: 101,
            order: 1,
            title: "Présentation des cailloux",
            description: "Apprendre à identifier, nommer et dessiner des cailloux.",
            content: `### Objectif
Identifier et nommer des cailloux ; utiliser le singulier et le pluriel (C'est un caillou / Ce sont des cailloux).

### Situation d'apprentissage
Maman prépare la sauce. Elle a besoin de cailloux pour caler son foyer. Elle demande à son enfant d'aller en chercher.

### Activités
1. **Observation** : Regarder les objets apportés.
2. **Identification** : "Qu'est-ce que c'est ?" -> "C'est un caillou".
3. **Pluriel** : "Et là ?" -> "Ce sont des cailloux".
4. **Dessin** : Dessiner un caillou sur l'ardoise.

### Évaluation
- Nommer l'objet présenté par le maître.
- Dessiner deux cailloux sur l'ardoise.`,
            exercises: [],
            created_at: new Date().toISOString()
        },
        {
            id: 1002,
            course: 101,
            order: 2,
            title: "Présentation des bâtonnets",
            description: "Identifier et nommer des bâtonnets pour le comptage.",
            content: `### Objectif
Identifier et nommer des bâtonnets.

### Situation d'apprentissage
Les élèves veulent jouer au jeu de 'nim' ou compter des points. Ils ramassent des petits morceaux de bois.

### Activités
1. Manipulation des bâtonnets.
2. Nommer l'objet : "C'est un bâtonnet", "Ce sont des bâtonnets".
3. Utilisation pour représenter des quantités simples.

### Évaluation
- Identifier un bâtonnet parmi d'autres objets.`,
            exercises: [],
            created_at: new Date().toISOString()
        },
        {
            id: 1003,
            course: 101,
            order: 3,
            title: "Présentation des ronds/cercles",
            description: "Reconnaître et nommer les formes circulaires dans l'environnement.",
            content: `### Objectif
Identifier et nommer des objets de forme circulaire (ronds).

### Activités
1. Rechercher des 'ronds' dans la classe (fond de boîte, bouchon).
2. Tracer des ronds dans le sable ou sur l'ardoise.
3. Différencier le 'rond' d'autres formes.

### Évaluation
- Dessiner trois ronds sur l'ardoise.`,
            exercises: [],
            created_at: new Date().toISOString()
        },
        {
            id: 1004,
            course: 101,
            order: 4,
            title: "Plus que...",
            description: "Comparer deux collections d'objets en utilisant l'expression 'plus que'.",
            content: `### Objectif
Comparer deux collections et utiliser l'expression : "Il y a plus de ... que de ...".

### Situation d'apprentissage
On a deux tas d'objets sur la table (par exemple des cailloux et des bâtonnets). On veut savoir quel groupe est le plus nombreux.

### Manipulation
- Placer 5 cailloux et 3 bâtonnets.
- Constater : "Il y a plus de cailloux que de bâtonnets".

### Synthèse
Pour dire qu'une quantité est plus grande, on utilise "plus que".

### Évaluation
- Sur l'ardoise, dessine plus de ronds que de bâtonnets.`,
            exercises: [],
            created_at: new Date().toISOString()
        },
        {
            id: 1005,
            course: 101,
            order: 5,
            title: "Moins que...",
            description: "Comparer deux collections d'objets en utilisant l'expression 'moins que'.",
            content: `### Objectif
Comparer deux collections et utiliser l'expression : "Il y a moins de ... que de ...".

### Activités
- Inverser l'observation précédente : "Il y a moins de bâtonnets que de cailloux".
- Manipuler avec des graines et des bouchons.

### Évaluation
- "Regarde ces deux groupes. Lequel en a moins ?"`,
            exercises: [],
            created_at: new Date().toISOString()
        }
    ],
    created_at: new Date().toISOString()
};
