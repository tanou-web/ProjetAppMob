import { Course } from '../types';

export const allEnglishCourses: Partial<Course>[] = [
    {
        id: 506,
        title: "Anglais 5ème",
        description: "Communication, grammaire et découverte du monde anglophone.",
        level: "5ème",
        subject: "Anglais",
        lessons: [
            // MODULE: Maîtrise de la langue
            {
                id: 11001,
                order: 1,
                title: "Les nombres (Numbers)",
                description: "Apprendre à compter de 1 à 1000 et au-delà.",
                content: `### Leçon : Numbers in English

**1. Cardinal Numbers**
*   **0-12** : zero, one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve.
*   **13-19 (-teen)** : thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen.
*   **Dizaines (-ty)** : twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety.
*   **Centaines** : one hundred, two hundred...
*   **Milliers** : one thousand.

**2. Ordinal Numbers (Dates)**
*   **1st** (first), **2nd** (second), **3rd** (third).
*   À partir de 4, on ajoute **-th** : 4th (fourth), 10th (tenth).

**3. Points de vigilance**
*   On met un trait d'union entre la dizaine et l'unité : *twenty-five* (25).
*   En anglais britannique, on ajoute "and" après hundred : *one hundred and twenty* (120).`,
                course: 506,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 110001,
                        title: "Quiz Numbers",
                        description: "Écriture des nombres",
                        question: "Comment écrit-on 42 en anglais ?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 10,
                        correct_answer: "forty-two",
                        explanation: "Quarante s'écrit 'forty' (attention, pas de 'u') et on ajoute l'unité avec un trait d'union."
                    }
                ]
            },
            {
                id: 11013,
                order: 13,
                title: "La conjugaison de « be »",
                description: "L'auxiliaire être au présent.",
                content: `### Leçon : The verb "To Be"

C'est le verbe le plus important en anglais. Il sert à se présenter, décrire ou donner un état.

**1. Forme affirmative**
*   I **am** (I'm)
*   You **are** (You're)
*   He / She / It **is** (He's / She's / It's)
*   We **are** (We're)
*   You **are** (You're)
*   They **are** (They're)

**2. Forme négative**
On ajoute **not** après l'auxiliaire.
*   I am not.
*   You are not (aren't).
*   He is not (isn't).

**3. Forme interrogative**
On inverse le sujet et le verbe.
*   **Are you** happy?
*   **Is he** English?`,
                course: 506,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 11015,
                order: 15,
                title: "Le présent simple",
                description: "Exprimer des vérités générales et des habitudes.",
                content: `### Leçon : Present Simple

Le présent simple s'utilise principalement pour parler de ce qui est vrai ou habituel.

**1. Formation**
À toutes les personnes, c'est la base verbale. À la **3ème personne du singulier** (he, she, it), on ajoute un **-s**.
*   I play.
*   She play**s**.

**2. La forme interrogative et négative**
On utilise l'auxiliaire **DO** (ou **DOES** à la 3ème personne).
*   **Do** you speak English?
*   He **doesn't** (does not) like apples.

**3. Valeurs**
*   Habitude : *I play football every Saturday.*
*   Vérité générale : *The sun rises in the east.*`,
                course: 506,
                created_at: new Date().toISOString(),
                exercises: []
            },
            // MODULE: Civilisation
            {
                id: 11030,
                order: 30,
                title: "Le Royaume-Uni (The United Kingdom)",
                description: "Géographie et symboles des pays britanniques.",
                content: `### Leçon : The UK

**1. Les 4 pays du Royaume-Uni**
*   **England** (Angleterre) - Capital: London.
*   **Scotland** (Écosse) - Capital: Edinburgh.
*   **Wales** (Pays de Galles) - Capital: Cardiff.
*   **Northern Ireland** (Irlande du Nord) - Capital: Belfast.

**2. Le drapeau**
*   On l'appelle le **Union Jack**. C'est la fusion des croix des différents pays (sauf le Pays de Galles).

**3. Symboles et traditions**
*   **London** : Big Ben, Buckingham Palace, red buses.
*   **The Queen/King** : Le souverain réside officiellement à Buckingham Palace.
*   **Tea time** : Une tradition importante l'après-midi.`,
                course: 506,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 11032,
                order: 32,
                title: "L'Amérique du Nord (North America)",
                description: "Découverte des USA et du Canada.",
                content: `### Leçon : North America

**1. The USA (United States of America)**
*   **Capital** : Washington D.C.
*   C'est un pays de 50 États.
*   **Symbols** : The Statue of Liberty (NY), The White House, the "Stars and Stripes" (drapeau).

**2. Canada**
*   Un pays immense au Nord des USA.
*   On y parle anglais et français (au Québec).
*   **Symbol** : The maple leaf (la feuille d'érable).

**3. Les grandes villes**
*   New York (The Big Apple), Los Angeles (Hollywood), Chicago, Toronto.`,
                course: 506,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 11035,
                order: 35,
                title: "L'Afrique anglophone (English-speaking Africa)",
                description: "Les pays africains où l'anglais est langue officielle.",
                content: `### Leçon : English in Africa

L'anglais est parlé dans de nombreux pays d'Afrique, suite à l'histoire coloniale britannique.

**1. Pays majeurs**
*   **Nigeria** : Le pays le plus peuplé d'Afrique. Capital: Abuja. Lagos est une ville immense.
*   **South Africa** : Connue pour Nelson Mandela et ses 11 langues officielles (dont l'anglais).
*   **Kenya** : Célèbre pour ses safaris et la culture Massaï. Capital: Nairobi.
*   **Ghana** : Premier pays d'Afrique subsaharienne à avoir obtenu son indépendance.

**2. Rôle de l'anglais**
*   Il sert de langue de communication entre les différentes ethnies et langues locales.
*   C'est la langue de l'école, de la télévision et des affaires.`,
                course: 506,
                created_at: new Date().toISOString(),
                exercises: []
            }
        ] as any
    }
];
