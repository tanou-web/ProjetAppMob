import { Course } from '../types';

export const allHistory4eCourses: Partial<Course>[] = [
    {
        id: 404,
        title: "Histoire 4ème",
        description: "Programme APC : Traites négrières, Révolutions et États précoloniaux du Burkina.",
        level: "4ème",
        subject: "Histoire",
        lessons: [
            // MODULE: LES TRAITES NÉGRIÈRES
            {
                id: 16101,
                order: 1,
                title: "L'esclavage et la traite des humains dans l'histoire",
                description: "Origines et différentes formes de traites à travers les âges.",
                content: `### Leçon : La Traite Négrière

**1. Définition**
*   La traite est le commerce d'êtres humains considérés comme des marchandises.
*   L'esclavage a existé depuis l'Antiquité, mais la traite atlantique a pris une dimension industrielle.

**2. Les différentes traites**
*   **La traite orientale** (transsaharienne) : Vers le monde arabo-musulman.
*   **La traite atlantique** : Vers les Amériques (Commerce triangulaire).
*   **La traite interne** : À l'intérieur du continent africain.

**3. Le commerce triangulaire**
*   Europe -> Afrique (marchandises contre captifs).
*   Afrique -> Amérique (captifs contre produits tropicaux).
*   Amérique -> Europe (sucre, café, coton).`,
                course: 404,
                created_at: new Date().toISOString(),
                exercises: []
            },
            // MODULE: LES RÉVOLUTIONS
            {
                id: 16201,
                order: 2,
                title: "L'Indépendance des États-Unis et la Révolution Française",
                description: "Les grands changements politiques en Occident au XVIIIe siècle.",
                content: `### Leçon : Le temps des Révolutions

**1. L'indépendance américaine (1776)**
*   Les 13 colonies rejettent la domination britannique.
*   Naissance d'une démocratie basée sur la Constitution.

**2. La Révolution Française (1789)**
*   Fin de la monarchie absolue et des privilèges.
*   **Déclaration des Droits de l'Homme et du Citoyen**.
*   Impact mondial des idées de "Liberté, Égalité, Fraternité".

**3. Lien entre les révolutions**
*   Les idées des Lumières (Voltaire, Rousseau) circulent et inspirent les peuples à travers l'Atlantique.`,
                course: 404,
                created_at: new Date().toISOString(),
                exercises: []
            },
            // MODULE: ÉTATS DU BURKINA FASO
            {
                id: 16301,
                order: 3,
                title: "Les États précoloniaux du Burkina Faso",
                description: "Étude des royaumes et empires avant la colonisation.",
                content: `### Leçon : Les Puissances Locales

**1. Les Royaumes Moosé**
*   Le Yatenga, l'Oubritenga (Ouagadougou), le Tenkodogo.
*   Une organisation politique solide autour du **Moogho Naaba**.

**2. Les empires de l'Ouest**
*   **Le Royaume du Gwiriko** : Fondé par les Dioula de Bobo-Dioulasso.
*   **Le Royaume du Kénédougou** : Capitale Sikasso (Liens avec le Mali actuel).

**3. Les autres peuples**
*   Les Gourmantché au Sud-Sud-Est.
*   L'influence des Peuls et des Touaregs au Nord (Djelgodji, Liptako).

**4. Organisation sociale**
*   Sociétés basées sur la tradition orale, la religion traditionnelle ou l'Islam, et la hiérarchie sociale.`,
                course: 404,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 163001,
                        title: "Quiz Histoire",
                        description: "Empire Moosé",
                        question: "Comment appelle-t-on le chef suprême de l'Oubritenga (Ouagadougou) ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 10,
                        correct_answer: "Le Moogho Naaba",
                        explanation: "Le Moogho Naaba est l'autorité centrale de l'empire Mossi de Ouagadougou."
                    }
                ]
            }
        ] as any
    }
];
