import { Course } from '../types';

export const allEnglish3eCourses: Partial<Course>[] = [
    {
        id: 302,
        title: "Anglais 3ème",
        description: "Official Curriculum: Relationships, Food & Health, Migrations, and Social Issues.",
        level: "3ème",
        subject: "Anglais",
        lessons: [
            {
                id: 13101,
                order: 1,
                title: "Unit 1: Relationships (The Ideal Partner)",
                description: "Vocabulary of relationships and Grammar (Reported Speech & Adverbs).",
                content: `### Lesson 1: Vocabulary - Describing People and Relationships

In this unit, we learn how to describe personality and physical traits, and discuss what makes a good relationship.

**1. Physical Traits**
*   **Slim / Thin**: Mince / Maigre.
*   **Tall / Short**: Grand / Petit.
*   **Light / Dark complexion**: Teint clair / foncé.

**2. Personality Traits**
*   **Honest**: Someone who tells the truth.
*   **Faithful**: Someone who is loyal to their partner.
*   **Respectful**: Someone who shows respect to others.
*   **Kind**: Gentil.

**3. Relationship Components**
*   **Honesty**: L'honnêteté.
*   **Trust**: La confiance.
*   **Understanding**: La compréhension.
*   **Love**: L'amour.

---

### Lesson 2: Grammar - Indirect Speech (Reported Speech)

Reported speech is used to tell someone what another person said.

**1. Statements (Declarative sentences)**
When the reporting verb is in the present (e.g., "says"), the tense of the inside verb does not change.
*   *Direct*: Moussa says, "My partner is slim."
*   *Indirect*: Moussa says **that** his partner is slim.

**2. Questions**
For "Yes/No" questions, use **if** or **whether**.
*   *Direct*: Aminata asks, "Is honesty important?"
*   *Indirect*: Aminata asks **if** honesty is important.

---

### Lesson 3: Grammar - Adverbs

Adverbs describe how an action is performed.

**1. Formation**
Most adverbs are formed by adding **-ly** to an adjective.
*   *Adjective*: Honest → *Adverb*: Honest**ly**.
*   *Adjective*: Respectful → *Adverb*: Respectful**ly**.

**2. Usage**
Adverbs usually come after the verb or at the end of the sentence.
*   *Example*: They communicate **honestly** in their relationship.`,
                course: 302,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 131011,
                        title: "Indirect Speech Transformation",
                        description: "Turn the sentence into indirect speech.",
                        question: "Moussa says: 'I love my partner.'",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "Moussa says that he loves his partner.",
                        explanation: "We add 'that' and change the pronoun 'I' to 'he'."
                    },
                    {
                        id: 131012,
                        title: "Vocabulary Check",
                        description: "Identify the trait.",
                        question: "A person who always tells the truth is...",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "honest",
                        explanation: "Honesty is the quality of being truthful."
                    },
                    {
                        id: 131013,
                        title: "Adverb Formation",
                        description: "Turn the adjective into an adverb.",
                        question: "What is the adverb of 'faithful'?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "faithfully",
                        explanation: "We add '-ly' to the adjective 'faithful'."
                    }
                ]
            },
            {
                id: 13102,
                order: 2,
                title: "Unit 2: Food and Health",
                description: "Vocabulary of food, nutrition, and health problems.",
                content: `### Lesson 1: Vocabulary - Food and Healthy Eating

In this unit, we learn about different types of food and how to maintain a healthy lifestyle.

**1. Food Groups**
- **Proteins**: Meat, fish, eggs, beans.
- **Carbohydrates**: Rice, bread, potatoes, millet.
- **Vitamins & Minerals**: Fruits and vegetables.
- **Fats**: Oil, butter.

**2. Health Problems**
- **Malaria**: A common disease in tropical regions caused by mosquitoes.
- **Malnutrition**: When you don't eat enough healthy food.
- **Diabetes**: A condition involving high blood sugar.

**3. Grammar: Should / Shouldn't**
We use "should" to give advice.
- You **should** eat fruits and vegetables every day.
- You **shouldn't** eat too much sugar.`,
                course: 302,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 131021,
                        title: "Giving Advice",
                        description: "Use should or shouldn't.",
                        question: "Complete: 'You ______ wash your hands before eating.'",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "should",
                        explanation: "Washing hands is a good health habit, so we use 'should'."
                    }
                ]
            },
            {
                id: 13103,
                order: 3,
                title: "Unit 3: Migrations and Movement",
                description: "Vocabulary of migration and Grammar (Past Continuous).",
                content: `### Lesson 1: Vocabulary - Migration and Movement

Migration is the movement of people from one place to another, often in search of better opportunities or safety.

**1. Key Vocabulary**
- **Immigration**: Entering a new country to live permanently.
- **Emigration**: Leaving one's country to live elsewhere.
- **Refugee**: A person forced to leave their country due to war or persecution.
- **Border**: The line separating two countries.
- **Settlement**: A place where people establish a community.
- **Asylum**: Protection given by a country to refugees.

**2. Reasons for Migration**
- **Economic**: Searching for jobs and better living conditions.
- **Political**: Fleeing conflict, war, or persecution.
- **Environmental**: Escaping natural disasters or climate change.
- **Social**: Joining family members or seeking education.

---

### Lesson 2: Grammar - Past Continuous

The **Past Continuous** describes an action that was in progress at a specific time in the past.

**1. Formation**
**Subject + was/were + verb-ing**

- *Singular*: I/He/She/It **was** working.
- *Plural*: We/You/They **were** working.

**2. Usage**
- To describe an action in progress in the past:
  - "They **were traveling** to the border when it started raining."
  
- To describe two simultaneous actions:
  - "While I **was studying**, my brother **was playing** football."

**3. Past Simple vs Past Continuous**
- **Past Simple**: Completed action → "I arrived at 5pm."
- **Past Continuous**: Action in progress → "I was arriving when you called."

> [!TIP]
> **Time markers**: while, when, at that moment, at 8pm yesterday`,
                course: 302,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 131031,
                        title: "Vocabulary Check",
                        description: "Identify the correct term",
                        question: "A person who leaves their country to escape war is called a...",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "refugee",
                        explanation: "A refugee is someone forced to flee their country due to conflict or persecution."
                    },
                    {
                        id: 131032,
                        title: "Past Continuous Formation",
                        description: "Complete the sentence",
                        question: "Complete: 'They _____ (travel) to Ouagadougou yesterday at 3pm.' (Use past continuous)",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "were traveling",
                        explanation: "Past continuous for 'they' = were + verb-ing = were traveling."
                    },
                    {
                        id: 131033,
                        title: "Past Simple vs Continuous",
                        description: "Choose the correct tense",
                        question: "Which is correct: 'I was reading when he arrived' or 'I read when he arrived'?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "I was reading when he arrived",
                        explanation: "Use past continuous for the action in progress (reading) and past simple for the interrupting action (arrived)."
                    }
                ]
            },
            {
                id: 13104,
                order: 4,
                title: "Unit 4: Social Issues and Citizenship",
                description: "Vocabulary of civic life and Grammar (Modal Verbs).",
                content: `### Lesson 1: Vocabulary - Rights, Duties, and Citizenship

Being a good citizen means understanding your **rights** and **duties** in society.

**1. Rights (Droits)**
- **Freedom of speech**: The right to express your opinion.
- **Right to education**: Every child should go to school.
- **Right to vote**: Citizens can choose their leaders.
- **Equality**: Everyone should be treated fairly regardless of gender, religion, or ethnicity.

**2. Duties (Devoirs)**
- **Respect the law**: Obey the rules of your country.
- **Pay taxes**: Contribute to public services.
- **Protect the environment**: Keep your community clean.
- **Vote**: Participate in elections (when old enough).

**3. Social Issues**
- **Poverty**: Lack of money and basic needs.
- **Inequality**: Unfair treatment of different groups.
- **Corruption**: Dishonest behavior by people in power.
- **Justice**: Fair treatment under the law.

---

### Lesson 2: Grammar - Modal Verbs (Must, Should, Can)

Modal verbs express **obligation, advice, permission, or ability**.

**1. Must** (Obligation forte)
- Expresses strong obligation or necessity.
- "You **must** respect the law."
- "Students **must** wear uniforms."

**2. Should** (Conseil)
- Gives advice or recommendation.
- "You **should** study hard for the exam."
- "We **should** protect the environment."

**3. Can** (Capacité / Permission)
- Expresses ability or permission.
- "I **can** speak French and English." (ability)
- "You **can** go home now." (permission)

**4. Negative Forms**
- Must not (mustn't) = interdiction
- Should not (shouldn't) = déconseillé
- Cannot (can't) = incapacité / interdiction

> [!IMPORTANT]
> **Note**: Modal verbs are followed by the **base form** of the verb (without 'to').`,
                course: 302,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 131041,
                        title: "Rights and Duties",
                        description: "Identify a civic duty",
                        question: "Which is a duty of citizens: voting, freedom of speech, or right to education?",
                        type: "short_answer",
                        difficulty: 1,
                        points: 5,
                        correct_answer: "voting",
                        explanation: "Voting is a duty (and right) of citizens. Freedom of speech and education are rights, not duties."
                    },
                    {
                        id: 131042,
                        title: "Using Must",
                        description: "Express strong obligation",
                        question: "Complete: 'Students _____ arrive on time.' (must/should/can)",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "must",
                        explanation: "'Must' expresses a strong obligation or rule that students are required to follow."
                    },
                    {
                        id: 131043,
                        title: "Modal Verb Choice",
                        description: "Choose the appropriate modal",
                        question: "To give advice about protecting the environment, which modal verb should you use?",
                        type: "short_answer",
                        difficulty: 2,
                        points: 10,
                        correct_answer: "should",
                        explanation: "'Should' is used to give advice or recommendations, not strong obligations."
                    }
                ]
            }
        ] as any
    }
];
