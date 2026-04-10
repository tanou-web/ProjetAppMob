import { Course } from '../types';

export const allEnglish4eCourses: Partial<Course>[] = [
    {
        id: 403,
        title: "Anglais 4ème",
        description: "Official Program: Education, Health, Environment, Human Rights, and Language Mastery.",
        level: "4ème",
        subject: "Anglais",
        lessons: [
            // UNIT 1: EDUCATION
            {
                id: 14001,
                order: 1,
                title: "Unit 1: School Systems and Future Plans",
                description: "Comparing school systems and discussing career goals.",
                content: `### Lesson: My School and My Future

**1. School Vocabulary**
*   **Curriculum**: The subjects studied in a school.
*   **To enroll**: To officially join a school or a course.
*   **Boarding school**: A school where students live and study.
*   **Vocational training**: Learning skills for a specific job (e.g., mechanic, nurse).

**2. Grammar: Expressing Future Plans**
*   **Be going to**: Used for plans and intentions already decided. 
    *   *Example*: I am going to be a doctor.
*   **Will**: Used for sudden decisions or predictions.
    *   *Example*: I think I will pass the exam.

**3. Comparing Systems**
*   In Burkina Faso, the "Post-primaire" cycle includes 6ème, 5ème, 4ème, and 3ème. 
*   In the UK, secondary school starts at age 11.`,
                course: 403,
                created_at: new Date().toISOString(),
                exercises: [
                    {
                        id: 140001,
                        title: "Future Plans Quiz",
                        description: "Choose the correct form.",
                        question: "Complete: 'I have decided. I ___ (study) hard this year.'",
                        type: "short_answer",
                        difficulty: 1,
                        points: 10,
                        correct_answer: "am going to study",
                        explanation: "We use 'be going to' for intentions and decisions already made."
                    }
                ]
            },
            // UNIT 2: HEALTH
            {
                id: 14002,
                order: 2,
                title: "Unit 2: Health and Hygiene",
                description: "Common diseases and prevention methods.",
                content: `### Lesson: Staying Healthy

**1. Vocabulary: Diseases**
*   **Malaria**: A disease transmitted by mosquitoes.
*   **Symptoms**: Signs of a disease (fever, headache, cough).
*   **Prevention**: Steps taken to stop a disease from spreading.
*   **Vaccination**: An injection to protect against a disease.

**2. Grammar: Giving Advice**
*   **Should / Shouldn't**:
    *   *Example*: You should sleep under a mosquito net.
    *   *Example*: You shouldn't drink dirty water.

**3. Dialogue: At the Doctor's**
*   *Doctor*: What's the matter?
*   *Patient*: I have a headache and a fever.
*   *Doctor*: You should drink plenty of water and rest.`,
                course: 403,
                created_at: new Date().toISOString(),
                exercises: []
            },
            // UNIT 3: ENVIRONMENT
            {
                id: 14003,
                order: 3,
                title: "Unit 3: Protecting our Planet",
                description: "Environmental issues and sustainable solutions.",
                content: `### Lesson: Environmental Awareness

**1. Environmental Issues**
*   **Deforestation**: Cutting down too many trees.
*   **Pollution**: Making the air, water, or soil dirty (plastic, smoke).
*   **Global warming**: The increase in the Earth's temperature.

**2. Grammar: The Passive Voice (Present)**
*   *Active*: People cut down trees.
*   *Passive*: Trees **are cut down** by people.
*   Form: **Am/Is/Are + Past Participle**.

**3. Solutions**
*   **Planting trees**: Reforestation.
*   **Recycling**: Processing used materials (bottles, paper) to use them again.`,
                course: 403,
                created_at: new Date().toISOString(),
                exercises: []
            },
            // UNIT 4: HUMAN RIGHTS / WOMEN
            {
                id: 14004,
                order: 4,
                title: "Unit 4: Women in Society",
                description: "Gender equality and famous women's achievements.",
                content: `### Lesson: Rights and Equality

**1. Vocabulary**
*   **Equality**: Having the same rights and opportunities.
*   **Role model**: Someone whose success is an example for others.
*   **Literacy**: The ability to read and write.

**2. Grammar: The Present Perfect**
*   Used for actions that happened at an unspecified time in the past or continue to the present.
*   Form: **Have/Has + Past Participle**.
*   *Example*: Many women **have fought** for their rights.
*   *Example*: She **has become** a great scientist.

**3. Celebrated Figures**
*   Discussing women who have contributed to science, politics, and development in Africa and the world.`,
                course: 403,
                created_at: new Date().toISOString(),
                exercises: []
            },
            // CORE GRAMMAR RECAP
            {
                id: 14010,
                order: 10,
                title: "Grammar: Conditionals (Type 1)",
                description: "Expressing real possibilities in the future.",
                content: `### Lesson: The First Conditional

**1. Structure**
*   **If + Simple Present , Will + Verb**.
*   *Example*: If it rains, I will stay at home.
*   *Example*: If you study hard, you will pass your exam.

**2. Use**
*   To talk about things that are likely to happen in the future if a specific condition is met.

**3. Variations**
*   You can use **can** or **must** instead of **will**.
    *   *Example*: If you finish your homework, you can go out.`,
                course: 403,
                created_at: new Date().toISOString(),
                exercises: []
            },
            {
                id: 14011,
                order: 11,
                title: "Grammar: Relative Pronouns (Who, Which, That)",
                description: "Connecting sentences to describe people and things.",
                content: `### Lesson: Relative Clauses

**1. Relative Pronouns**
*   **Who**: Used for people.
    *   *Example*: The teacher **who** lives next door is very kind.
*   **Which**: Used for things and animals.
    *   *Example*: The book **which** I bought is interesting.
*   **That**: Used for both people and things.
    *   *Example*: The car **that** he drives is blue.

**2. Use**
*   Relative clauses give more information about a noun without starting a new sentence.`,
                course: 403,
                created_at: new Date().toISOString(),
                exercises: []
            }
        ] as any
    }
];
