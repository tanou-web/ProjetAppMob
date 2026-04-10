import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    useWindowDimensions,
    TextInput,
    Alert,
} from 'react-native';
// @ts-ignore
import RenderHtml, { CustomBlockRenderer, HTMLContentModel, HTMLElementModel } from 'react-native-render-html';
import { Audio } from 'expo-av';
import { useCoursesStore } from '../store/coursesStore';
import { useRoute } from '@react-navigation/native';
import { exercisesAPI } from '../services/endpoints';
import VocalLessonViewer from '../components/lessons/CP1LessonViewer';

const MultiplicationTool = () => {
    const [numberInput, setNumberInput] = useState('');
    const [mode, setMode] = useState<'view' | 'quiz' | 'result' | null>(null);
    const [currentTable, setCurrentTable] = useState<number | null>(null);

    // Quiz state
    const [quizQuestion, setQuizQuestion] = useState(0); // 0 to 9
    const [quizScore, setQuizScore] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [quizRandomFactors, setQuizRandomFactors] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [quizResults, setQuizResults] = useState<any[]>([]);

    const route = useRoute<any>();
    const lessonId = route.params?.lessonId;

    const handleStart = (selectedMode: 'view' | 'quiz') => {
        const num = parseInt(numberInput);
        if (isNaN(num) || num < 1 || num > 12) {
            Alert.alert("Nombre invalide", "Entre un nombre entre 1 et 12.");
            return;
        }
        setCurrentTable(num);
        setMode(selectedMode);

        if (selectedMode === 'quiz') {
            // Generate 10 random factors
            const factors = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10) + 1);
            setQuizRandomFactors(factors);
            setQuizQuestion(0);
            setQuizScore(0);
            setUserAnswer('');
            setFeedback(null);
            setQuizResults([]);
        }
    };

    const syncResults = async (results: any[]) => {
        if (!lessonId) return;
        try {
            await exercisesAPI.submitInteractive(lessonId, 'multiplication_quiz', results);
            console.log("Results synced successfully");
        } catch (err) {
            console.error("Failed to sync results", err);
        }
    };

    const handleQuizSubmit = () => {
        if (!currentTable) return;
        const factor = quizRandomFactors[quizQuestion];
        const correct = currentTable * factor;
        const userMethod = parseInt(userAnswer);

        if (userMethod === correct) {
            setFeedback('correct');
            setQuizScore(s => s + 1);
        } else {
            setFeedback('incorrect');
        }

        const res = {
            question: `${currentTable} x ${factor}`,
            student_answer: userAnswer,
            correct_answer: (currentTable * factor).toString(),
            is_correct: userMethod === (currentTable * factor)
        };
        const updatedResults = [...quizResults, res];
        setQuizResults(updatedResults);

        // Auto advance after short delay
        setTimeout(() => {
            if (quizQuestion < 9) {
                setQuizQuestion(q => q + 1);
                setUserAnswer('');
                setFeedback(null);
            } else {
                setMode('result');
                syncResults(updatedResults);
            }
        }, 1500);
    };

    const reset = () => {
        setMode(null);
        setNumberInput('');
        setFeedback(null);
    };

    if (mode === 'result') {
        return (
            <View style={multStyles.container}>
                <Text style={multStyles.header}>Résultat du Quiz</Text>
                <Text style={multStyles.scoreText}>Ton score : {quizScore} / 10</Text>
                <View style={multStyles.resultMessage}>
                    {quizScore >= 8 ? <Text style={multStyles.goodJob}>Bravo ! 🎉</Text> : <Text style={multStyles.needsWork}>Continue de t'entraîner ! 💪</Text>}
                </View>
                <TouchableOpacity style={multStyles.button} onPress={reset}>
                    <Text style={multStyles.buttonText}>Choisir une autre table</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (mode === 'quiz' && currentTable) {
        const factor = quizRandomFactors[quizQuestion];
        return (
            <View style={multStyles.container}>
                <View style={multStyles.quizHeader}>
                    <Text style={multStyles.quizProgress}>Question {quizQuestion + 1} / 10</Text>
                    <TouchableOpacity onPress={reset}><Text style={multStyles.closeText}>Quitter</Text></TouchableOpacity>
                </View>

                <View style={multStyles.questionBox}>
                    <Text style={multStyles.questionText}>{currentTable} x {factor} = ?</Text>

                    <TextInput
                        style={[
                            multStyles.input,
                            feedback === 'correct' && multStyles.inputCorrect,
                            feedback === 'incorrect' && multStyles.inputIncorrect
                        ]}
                        keyboardType="numeric"
                        value={userAnswer}
                        onChangeText={setUserAnswer}
                        editable={feedback === null}
                        autoFocus
                    />

                    {feedback === 'correct' && <Text style={multStyles.feedbackGood}>Correct !</Text>}
                    {feedback === 'incorrect' && <Text style={multStyles.feedbackBad}>Faux ! La réponse était {currentTable * factor}</Text>}

                    {!feedback && (
                        <TouchableOpacity style={multStyles.checkButton} onPress={handleQuizSubmit}>
                            <Text style={multStyles.buttonText}>Valider</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }

    if (mode === 'view' && currentTable) {
        return (
            <View style={multStyles.container}>
                <View style={multStyles.quizHeader}>
                    <Text style={multStyles.header}>Table de {currentTable}</Text>
                    <TouchableOpacity onPress={reset}><Text style={multStyles.closeText}>Fermer</Text></TouchableOpacity>
                </View>
                <View style={multStyles.tableList}>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(factor => (
                        <View key={factor} style={multStyles.tableRow}>
                            <Text style={multStyles.tableRowText}>{currentTable} x {factor}</Text>
                            <Text style={multStyles.tableRowEqual}>=</Text>
                            <Text style={multStyles.tableRowResult}>{currentTable * factor}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    }

    return (
        <View style={multStyles.container}>
            <Text style={multStyles.label}>Quelle table veux-tu réviser ?</Text>
            <TextInput
                style={multStyles.mainInput}
                placeholder="Ex: 7"
                keyboardType="numeric"
                value={numberInput}
                onChangeText={setNumberInput}
                maxLength={2}
            />

            <View style={multStyles.actions}>
                <TouchableOpacity style={[multStyles.button, multStyles.viewBtn]} onPress={() => handleStart('view')}>
                    <Text style={multStyles.buttonText}>👀 Voir la Table</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[multStyles.button, multStyles.quizBtn]} onPress={() => handleStart('quiz')}>
                    <Text style={multStyles.buttonText}>📝 S'entraîner</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


const ArithmeticQuizTool = () => {
    const questions = [
        { text: "cinq cent quatre-vingt-douze", answer: "592" },
        { text: "sept cent trois", answer: "703" },
        { text: "neuf cent quatre-vingt-neuf", answer: "999" },
        { text: "six cent cinquante", answer: "650" },
        { text: "huit cent treize", answer: "813" }
    ];

    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [userAns, setUserAns] = useState("");
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [finished, setFinished] = useState(false);
    const [quizResults, setQuizResults] = useState<any[]>([]);

    const route = useRoute<any>();
    const lessonId = route.params?.lessonId;

    const syncResults = async (results: any[]) => {
        if (!lessonId) return;
        try {
            await exercisesAPI.submitInteractive(lessonId, 'arithmetic_quiz', results);
            console.log("Arithmetic results synced successfully");
        } catch (err) {
            console.error("Failed to sync arithmetic results", err);
        }
    };

    const handleSubmit = () => {
        if (userAns.trim() === questions[currentQ].answer) {
            setFeedback('correct');
            setScore(s => s + 1);
        } else {
            setFeedback('incorrect');
        }

        const res = {
            question: questions[currentQ].text,
            student_answer: userAns,
            correct_answer: questions[currentQ].answer,
            is_correct: userAns.trim() === questions[currentQ].answer
        };
        const updatedResults = [...quizResults, res];
        setQuizResults(updatedResults);

        setTimeout(() => {
            if (currentQ < questions.length - 1) {
                setCurrentQ(q => q + 1);
                setUserAns("");
                setFeedback(null);
            } else {
                setFinished(true);
                syncResults(updatedResults);
            }
        }, 1500);
    };

    const reset = () => {
        setFinished(false);
        setCurrentQ(0);
        setScore(0);
        setUserAns("");
        setFeedback(null);
    };

    if (finished) {
        return (
            <View style={multStyles.container}>
                <Text style={multStyles.header}>Résultat Final</Text>
                <Text style={multStyles.scoreText}>{score} / {questions.length}</Text>
                <View style={multStyles.resultMessage}>
                    {score >= 4 ? <Text style={multStyles.goodJob}>Excellent ! 🌟</Text> : <Text style={multStyles.needsWork}>Tu peux faire mieux ! 💪</Text>}
                </View>
                <TouchableOpacity style={[multStyles.button, multStyles.viewBtn]} onPress={reset}>
                    <Text style={multStyles.buttonText}>Recommencer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const question = questions[currentQ];

    return (
        <View style={multStyles.container}>
            <View style={multStyles.quizHeader}>
                <Text style={multStyles.quizProgress}>Question {currentQ + 1} / {questions.length}</Text>
            </View>

            <View style={multStyles.questionBox}>
                <Text style={multStyles.label}>Écris en chiffres :</Text>
                <Text style={multStyles.questionText}>{question.text}</Text>

                <TextInput
                    style={[
                        multStyles.input,
                        feedback === 'correct' && multStyles.inputCorrect,
                        feedback === 'incorrect' && multStyles.inputIncorrect
                    ]}
                    keyboardType="numeric"
                    value={userAns}
                    onChangeText={setUserAns}
                    editable={feedback === null}
                    placeholder="..."
                />

                {feedback === 'correct' && <Text style={multStyles.feedbackGood}>Correct !</Text>}
                {feedback === 'incorrect' && <Text style={multStyles.feedbackBad}>Faux ! C'était {question.answer}</Text>}

                {!feedback && (
                    <TouchableOpacity style={multStyles.checkButton} onPress={handleSubmit}>
                        <Text style={multStyles.buttonText}>Valider</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const GeometryQuizTool = (props: any) => {
    const { type, section } = props.tnode.attributes;
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [userAns, setUserAns] = useState("");
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [finished, setFinished] = useState(false);
    const [quizResults, setQuizResults] = useState<any[]>([]);

    const route = useRoute<any>();
    const lessonId = route.params?.lessonId;

    // Define question sets based on section/type
    const getQuestions = () => {
        const lowerSection = (section || "").toLowerCase();

        if (type === 'perimeter') {
            if (lowerSection.includes('carré')) {
                return [
                    { q: "Un carré a un côté de 4cm. Quel est son périmètre ?", a: "16", hint: "Périmètre = Côté x 4" },
                    { q: "Si le périmètre d'un carré est 20cm, quelle est la longueur de son côté ?", a: "5", hint: "Côté = Périmètre ÷ 4" },
                    { q: "Un jardin carré mesure 10m de côté. Combien de mètres de clôture faut-il pour en faire le tour ?", a: "40", hint: "Faire le tour = Calculer le périmètre" }
                ];
            } else if (lowerSection.includes('rectangle')) {
                return [
                    { q: "Un rectangle a une longueur de 8cm et une largeur de 3cm. Quel est son périmètre ?", a: "22", hint: "P=(L+l)x2 -> (8+3)x2" },
                    { q: "Le demi-périmètre d'un rectangle est 15cm. Quel est son périmètre total ?", a: "30", hint: "Périmètre = Demi-périmètre x 2" },
                    { q: "Un rectangle de 12cm de long et 8cm de large a un périmètre de ... cm ?", a: "40", hint: "(12+8)x2" }
                ];
            }
            return [
                { q: "Côté de 5cm, périmètre du carré ?", a: "20", hint: "5 x 4" },
                { q: "Longueur 10, largeur 5, périmètre du rectangle ?", a: "30", hint: "(10+5)x2" }
            ];
        } else {
            // Identification
            if (lowerSection.includes('carré')) {
                return [
                    { q: "Combien de côtés a un carré ?", a: "4", hint: "" },
                    { q: "Les côtés du carré sont-ils tous égaux ? (oui/non)", a: "oui", hint: "" },
                    { q: "Combien d'angles droits possède un carré ?", a: "4", hint: "" }
                ];
            } else if (lowerSection.includes('rectangle')) {
                return [
                    { q: "Combien de côtés a un rectangle ?", a: "4", hint: "" },
                    { q: "Un rectangle a-t-il tous ses côtés égaux ? (oui/non)", a: "non", hint: "Seuls les côtés opposés sont égaux." },
                    { q: "Combien d'angles droits possède un rectangle ?", a: "4", hint: "" }
                ];
            } else if (lowerSection.includes('triangle')) {
                return [
                    { q: "Combien de côtés a un triangle ?", a: "3", hint: "" },
                    { q: "Combien de sommets possède un triangle ?", a: "3", hint: "" },
                    { q: "Une figure à 3 côtés s'appelle un ...", a: "triangle", hint: "" }
                ];
            }
            return [
                { q: "Une figure à 4 côtés égaux et 4 angles droits est un ...", a: "carré", hint: "" },
                { q: "Une figure à 3 côtés est un ...", a: "triangle", hint: "" }
            ];
        }
    };

    const questions = getQuestions();

    const syncResults = async (results: any[]) => {
        if (!lessonId) return;
        try {
            await exercisesAPI.submitInteractive(lessonId, `geometry_${type}_${section}`, results);
            console.log("Geometry results synced successfully");
        } catch (err) {
            console.error("Failed to sync geometry results", err);
        }
    };

    const handleSubmit = () => {
        const correct = questions[currentQ].a.toLowerCase();
        const provided = userAns.trim().toLowerCase();

        const isCorrect = provided === correct;
        if (isCorrect) {
            setFeedback('correct');
            setScore(s => s + 1);
        } else {
            setFeedback('incorrect');
        }

        const res = {
            question: questions[currentQ].q,
            student_answer: userAns,
            correct_answer: questions[currentQ].a,
            is_correct: isCorrect
        };
        const updatedResults = [...quizResults, res];
        setQuizResults(updatedResults);

        setTimeout(() => {
            if (currentQ < questions.length - 1) {
                setCurrentQ(q => q + 1);
                setUserAns("");
                setFeedback(null);
            } else {
                setFinished(true);
                syncResults(updatedResults);
            }
        }, 1500);
    };

    if (finished) {
        return (
            <View style={[multStyles.container, { borderLeftWidth: 5, borderLeftColor: '#f39c12' }]}>
                <Text style={multStyles.header}>🎯 Quiz Terminé !</Text>
                <Text style={[multStyles.scoreText, { color: '#f39c12' }]}>{score} / {questions.length}</Text>
                <View style={multStyles.resultMessage}>
                    {score === questions.length ?
                        <Text style={multStyles.goodJob}>Parfait ! Tu maîtrises le {section} ! 🏆</Text> :
                        <Text style={multStyles.needsWork}>Bien essayé ! Relis bien la règle et recommence. 💪</Text>
                    }
                </View>
                <TouchableOpacity style={[multStyles.button, { backgroundColor: '#f39c12' }]} onPress={() => { setFinished(false); setCurrentQ(0); setScore(0); setUserAns(""); setFeedback(null); setQuizResults([]); }}>
                    <Text style={multStyles.buttonText}>Recommencer le quiz</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[multStyles.container, { borderLeftWidth: 5, borderLeftColor: type === 'perimeter' ? '#e67e22' : '#9b59b6' }]}>
            <View style={multStyles.quizHeader}>
                <Text style={[multStyles.quizProgress, { color: '#7f8c8d' }]}>Question {currentQ + 1} / {questions.length}</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: type === 'perimeter' ? '#e67e22' : '#9b59b6' }}>{section?.toUpperCase()}</Text>
            </View>
            <View style={multStyles.questionBox}>
                <Text style={[multStyles.questionText, { marginBottom: 15 }]}>{questions[currentQ].q}</Text>
                <TextInput
                    style={[
                        multStyles.input,
                        feedback === 'correct' && multStyles.inputCorrect,
                        feedback === 'incorrect' && multStyles.inputIncorrect
                    ]}
                    value={userAns}
                    onChangeText={setUserAns}
                    editable={feedback === null}
                    placeholder="Réponse ici..."
                    placeholderTextColor="#bdc3c7"
                />
                {feedback === 'correct' && <Text style={multStyles.feedbackGood}>🌟 Correct !</Text>}
                {feedback === 'incorrect' && (
                    <View>
                        <Text style={multStyles.feedbackBad}>❌ Faux. Réponse : {questions[currentQ].a}</Text>
                        {questions[currentQ].hint ? <Text style={{ fontStyle: 'italic', fontSize: 12, color: '#e67e22', marginTop: 5 }}>Aide : {questions[currentQ].hint}</Text> : null}
                    </View>
                )}
                {!feedback && (
                    <TouchableOpacity
                        style={[multStyles.checkButton, { backgroundColor: type === 'perimeter' ? '#e67e22' : '#9b59b6' }]}
                        onPress={handleSubmit}
                    >
                        <Text style={multStyles.buttonText}>Valider</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const GeographyQuizTool = (props: any) => {
    const { type, section } = props.tnode.attributes;
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [userAns, setUserAns] = useState("");
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [finished, setFinished] = useState(false);
    const [quizResults, setQuizResults] = useState<any[]>([]);

    const route = useRoute<any>();
    const lessonId = route.params?.lessonId;

    const getQuestions = () => {
        const lower = (section || "").toLowerCase();
        if (lower.includes('orientation')) {
            return [
                { q: "Le soleil se lève à l'est.", a: "vrai", type: "bool" },
                { q: "La [...] indique toujours le nord.", a: "boussole", type: "text" },
                { q: "Le soleil se couche à l'ouest.", a: "vrai", type: "bool" }
            ];
        } else if (lower.includes('plan')) {
            return [
                { q: "Un plan représente un espace vu du dessus.", a: "vrai", type: "bool" },
                { q: "Sur le plan de la classe, le bureau du maître est souvent à l'avant.", a: "vrai", type: "bool" },
                { q: "Le plan réduit la taille réelle des objets. (Vrai/Faux)", a: "vrai", type: "bool" }
            ];
        } else if (lower.includes('saison')) {
            return [
                { q: "Au Burkina, il y a deux grandes saisons.", a: "vrai", type: "bool" },
                { q: "La saison pluvieuse s'appelle aussi l'hivernage.", a: "vrai", type: "bool" },
                { q: "En saison sèche chaude, il fait très froid. (Vrai/Faux)", a: "faux", type: "bool" }
            ];
        } else if (lower.includes('végétation')) {
            return [
                { q: "La savane est faite d'herbes et d'arbres clairsemés.", a: "vrai", type: "bool" },
                { q: "Le désert est très humide. (Vrai/Faux)", a: "faux", type: "bool" },
                { q: "La forêt a des arbres très serrés.", a: "vrai", type: "bool" }
            ];
        }
        return [
            { q: "Le GPS utilise les satellites pour nous guider.", a: "vrai", type: "bool" },
            { q: "L'horizon est la ligne où le ciel semble toucher la terre.", a: "vrai", type: "bool" }
        ];
    };

    const questions = getQuestions();

    const syncResults = async (results: any[]) => {
        if (!lessonId) return;
        try {
            await exercisesAPI.submitInteractive(lessonId, `geography_${type}`, results);
            console.log("Geography results synced successfully");
        } catch (err) {
            console.error("Failed to sync geography results", err);
        }
    };

    const handleSubmit = () => {
        const correct = questions[currentQ].a.toLowerCase();
        const provided = userAns.trim().toLowerCase();

        const isCorrect = provided === correct;
        if (isCorrect) {
            setFeedback('correct');
            setScore(s => s + 1);
        } else {
            setFeedback('incorrect');
        }

        const res = {
            question: questions[currentQ].q,
            student_answer: userAns,
            correct_answer: questions[currentQ].a,
            is_correct: isCorrect
        };
        const updatedResults = [...quizResults, res];
        setQuizResults(updatedResults);

        setTimeout(() => {
            if (currentQ < questions.length - 1) {
                setCurrentQ(q => q + 1);
                setUserAns("");
                setFeedback(null);
            } else {
                setFinished(true);
                syncResults(updatedResults);
            }
        }, 1500);
    };

    if (finished) {
        return (
            <View style={[multStyles.container, { borderLeftWidth: 5, borderLeftColor: '#27ae60' }]}>
                <Text style={multStyles.header}>🌍 Quiz Géographie</Text>
                <Text style={[multStyles.scoreText, { color: '#27ae60' }]}>{score} / {questions.length}</Text>
                <TouchableOpacity style={[multStyles.button, { backgroundColor: '#27ae60' }]} onPress={() => { setFinished(false); setCurrentQ(0); setScore(0); setUserAns(""); setFeedback(null); setQuizResults([]); }}>
                    <Text style={multStyles.buttonText}>Recommencer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[multStyles.container, { borderLeftWidth: 5, borderLeftColor: '#3498db' }]}>
            <View style={multStyles.quizHeader}>
                <Text style={multStyles.quizProgress}>Question {currentQ + 1} / {questions.length}</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#3498db' }}>ORIENTATION</Text>
            </View>
            <View style={multStyles.questionBox}>
                <Text style={multStyles.questionText}>{questions[currentQ].q}</Text>
                <TextInput
                    style={[
                        multStyles.input,
                        feedback === 'correct' && multStyles.inputCorrect,
                        feedback === 'incorrect' && multStyles.inputIncorrect
                    ]}
                    value={userAns}
                    onChangeText={setUserAns}
                    editable={feedback === null}
                    placeholder="Ta réponse..."
                />
                <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-around' }}>
                    {questions[currentQ].type === 'bool' && !feedback && (
                        <>
                            <TouchableOpacity style={[multStyles.button, { flex: 0.45, backgroundColor: '#2ecc71' }]} onPress={() => { setUserAns("vrai"); setTimeout(handleSubmit, 100); }}>
                                <Text style={multStyles.buttonText}>Vrai</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[multStyles.button, { flex: 0.45, backgroundColor: '#e74c3c' }]} onPress={() => { setUserAns("faux"); setTimeout(handleSubmit, 100); }}>
                                <Text style={multStyles.buttonText}>Faux</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
                {feedback === 'correct' && <Text style={multStyles.feedbackGood}>Excellent !</Text>}
                {feedback === 'incorrect' && <Text style={multStyles.feedbackBad}>Oups ! C'était {questions[currentQ].a}</Text>}
                {!feedback && questions[currentQ].type === 'text' && (
                    <TouchableOpacity style={[multStyles.checkButton, { backgroundColor: '#3498db' }]} onPress={handleSubmit}>
                        <Text style={multStyles.buttonText}>Valider</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const TICQuizTool = (props: any) => {
    const { section } = props.tnode.attributes;
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [userAns, setUserAns] = useState("");
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [finished, setFinished] = useState(false);
    const [quizResults, setQuizResults] = useState<any[]>([]);

    const route = useRoute<any>();
    const lessonId = route.params?.lessonId;

    const getQuestions = () => {
        const lower = (section || "").toLowerCase();
        if (lower.includes('téléphone')) {
            return [
                { q: "Le téléphone portable permet de téléphoner sans fil.", a: "vrai", type: "bool" },
                { q: "On peut envoyer des messages textes avec un téléphone portable.", a: "vrai", type: "bool" },
                { q: "Le téléphone portable fonctionne uniquement avec des câbles.", a: "faux", type: "bool" }
            ];
        } else if (lower.includes('ordinateur')) {
            return [
                { q: "L'ordinateur de bureau a quatre parties principales : unité centrale, écran, clavier et ...", a: "souris", type: "text" },
                { q: "L'écran permet de voir ce qu'on fait sur l'ordinateur.", a: "vrai", type: "bool" },
                { q: "Le clavier sert uniquement à taper des chiffres.", a: "faux", type: "bool" }
            ];
        } else if (lower.includes('périphérique')) {
            return [
                { q: "Un périphérique d'entrée permet de donner des informations à l'ordinateur.", a: "vrai", type: "bool" },
                { q: "L'imprimante est un périphérique de sortie.", a: "vrai", type: "bool" },
                { q: "La clé USB sert à ... des fichiers.", a: "stocker", type: "text" }
            ];
        } else if (lower.includes('clavier')) {
            return [
                { q: "La barre d'espace est la plus grande touche du clavier.", a: "vrai", type: "bool" },
                { q: "La touche Entrée permet de passer à la ligne.", a: "vrai", type: "bool" },
                { q: "Le clavier a des touches de lettres et de ...", a: "chiffres", type: "text" }
            ];
        }
        // Default outils TIC
        return [
            { q: "Les TIC signifient Technologies de l'Information et de la Communication.", a: "vrai", type: "bool" },
            { q: "Un ordinateur est un outil TIC.", a: "vrai", type: "bool" },
            { q: "La tablette est un outil TIC moderne.", a: "vrai", type: "bool" }
        ];
    };

    const questions = getQuestions();

    const syncResults = async (results: any[]) => {
        if (!lessonId) return;
        try {
            await exercisesAPI.submitInteractive(lessonId, `tic_${section}`, results);
        } catch (err) {
            console.error("Failed to sync TIC results", err);
        }
    };

    const handleSubmit = () => {
        const correct = questions[currentQ].a.toLowerCase();
        const provided = userAns.trim().toLowerCase();

        const isCorrect = provided === correct;
        if (isCorrect) {
            setFeedback('correct');
            setScore(s => s + 1);
        } else {
            setFeedback('incorrect');
        }

        const res = {
            question: questions[currentQ].q,
            student_answer: userAns,
            correct_answer: questions[currentQ].a,
            is_correct: isCorrect
        };
        const updatedResults = [...quizResults, res];
        setQuizResults(updatedResults);

        setTimeout(() => {
            if (currentQ < questions.length - 1) {
                setCurrentQ(q => q + 1);
                setUserAns("");
                setFeedback(null);
            } else {
                setFinished(true);
                syncResults(updatedResults);
            }
        }, 1500);
    };

    if (finished) {
        return (
            <View style={[multStyles.container, { borderLeftWidth: 5, borderLeftColor: '#2980b9' }]}>
                <Text style={multStyles.header}>💻 Quiz TIC : {section}</Text>
                <Text style={[multStyles.scoreText, { color: '#2980b9' }]}>{score} / {questions.length}</Text>
                <TouchableOpacity style={[multStyles.button, { backgroundColor: '#2980b9' }]} onPress={() => { setFinished(false); setCurrentQ(0); setScore(0); setUserAns(""); setFeedback(null); setQuizResults([]); }}>
                    <Text style={multStyles.buttonText}>Recommencer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[multStyles.container, { borderLeftWidth: 5, borderLeftColor: '#3498db' }]}>
            <View style={multStyles.quizHeader}>
                <Text style={multStyles.quizProgress}>Question {currentQ + 1} / {questions.length}</Text>
            </View>
            <View style={multStyles.questionBox}>
                <Text style={multStyles.questionText}>{questions[currentQ].q}</Text>
                <TextInput
                    style={[
                        multStyles.input,
                        feedback === 'correct' && multStyles.inputCorrect,
                        feedback === 'incorrect' && multStyles.inputIncorrect
                    ]}
                    value={userAns}
                    onChangeText={setUserAns}
                    editable={feedback === null}
                    placeholder="Ta réponse..."
                />
                <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-around' }}>
                    {questions[currentQ].type === 'bool' && !feedback && (
                        <>
                            <TouchableOpacity style={[multStyles.button, { flex: 0.45, backgroundColor: '#2ecc71' }]} onPress={() => { setUserAns("vrai"); setTimeout(handleSubmit, 100); }}>
                                <Text style={multStyles.buttonText}>Vrai</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[multStyles.button, { flex: 0.45, backgroundColor: '#e74c3c' }]} onPress={() => { setUserAns("faux"); setTimeout(handleSubmit, 100); }}>
                                <Text style={multStyles.buttonText}>Faux</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
                {feedback === 'correct' && <Text style={multStyles.feedbackGood}>Bien joué ! 👍</Text>}
                {feedback === 'incorrect' && <Text style={multStyles.feedbackBad}>Pas tout à fait ! C'était : {questions[currentQ].a}</Text>}
                {!feedback && questions[currentQ].type === 'text' && (
                    <TouchableOpacity style={[multStyles.checkButton, { backgroundColor: '#3498db' }]} onPress={handleSubmit}>
                        <Text style={multStyles.buttonText}>Valider</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const HistoryQuizTool = (props: any) => {
    const { section } = props.tnode.attributes;
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [userAns, setUserAns] = useState("");
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [finished, setFinished] = useState(false);
    const [quizResults, setQuizResults] = useState<any[]>([]);

    const route = useRoute<any>();
    const lessonId = route.params?.lessonId;

    const getQuestions = () => {
        const lower = (section || "").toLowerCase();
        if (lower.includes('journée')) {
            return [
                { q: "Le temps qui s'écoule du matin au soir s'appelle la ...", a: "journée", hint: "" },
                { q: "La journée est faite pour dormir. (Vrai/Faux)", a: "faux", hint: "" },
                { q: "Qui travaille pendant la journée ?", a: "les hommes", hint: "" }
            ];
        } else if (lower.includes('nuit')) {
            return [
                { q: "La journée, il fait sombre. (Vrai/Faux)", a: "faux", hint: "" },
                { q: "La nuit, on voit le soleil. (Oui/Non)", a: "non", hint: "" },
                { q: "La ..., il fait sombre et on voit la lune.", a: "nuit", hint: "" }
            ];
        } else if (lower.includes('feu')) {
            return [
                { q: "L'homme a découvert le feu. (Vrai/Faux)", a: "vrai", hint: "" },
                { q: "Le feu sert à cuire les ...", a: "aliments", hint: "" },
                { q: "Le feu permet aussi de se ...", a: "chauffer", hint: "" }
            ];
        }
        return [
            { q: "L'histoire est l'étude du passé. (Vrai/Faux)", a: "vrai", hint: "" },
            { q: "Un siècle dure ... ans.", a: "100", hint: "" }
        ];
    };

    const questions = getQuestions();

    const syncResults = async (results: any[]) => {
        if (!lessonId) return;
        try {
            await exercisesAPI.submitInteractive(lessonId, `history_${section}`, results);
        } catch (err) {
            console.error("Failed to sync history results", err);
        }
    };

    const handleSubmit = () => {
        const correct = questions[currentQ].a.toLowerCase();
        const provided = userAns.trim().toLowerCase();

        const isCorrect = provided === correct;
        if (isCorrect) {
            setFeedback('correct');
            setScore(s => s + 1);
        } else {
            setFeedback('incorrect');
        }

        const res = {
            question: questions[currentQ].q,
            student_answer: userAns,
            correct_answer: questions[currentQ].a,
            is_correct: isCorrect
        };
        const updatedResults = [...quizResults, res];
        setQuizResults(updatedResults);

        setTimeout(() => {
            if (currentQ < questions.length - 1) {
                setCurrentQ(q => q + 1);
                setUserAns("");
                setFeedback(null);
            } else {
                setFinished(true);
                syncResults(updatedResults);
            }
        }, 1500);
    };

    if (finished) {
        return (
            <View style={[multStyles.container, { borderLeftWidth: 5, borderLeftColor: '#8e44ad' }]}>
                <Text style={multStyles.header}>📜 Quiz Histoire : {section}</Text>
                <Text style={[multStyles.scoreText, { color: '#8e44ad' }]}>{score} / {questions.length}</Text>
                <TouchableOpacity style={[multStyles.button, { backgroundColor: '#8e44ad' }]} onPress={() => { setFinished(false); setCurrentQ(0); setScore(0); setUserAns(""); setFeedback(null); setQuizResults([]); }}>
                    <Text style={multStyles.buttonText}>Recommencer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[multStyles.container, { borderLeftWidth: 5, borderLeftColor: '#8e44ad' }]}>
            <View style={multStyles.quizHeader}>
                <Text style={multStyles.quizProgress}>Question {currentQ + 1} / {questions.length}</Text>
            </View>
            <View style={multStyles.questionBox}>
                <Text style={multStyles.questionText}>{questions[currentQ].q}</Text>
                <TextInput
                    style={[
                        multStyles.input,
                        feedback === 'correct' && multStyles.inputCorrect,
                        feedback === 'incorrect' && multStyles.inputIncorrect
                    ]}
                    value={userAns}
                    onChangeText={setUserAns}
                    editable={feedback === null}
                    placeholder="Ta réponse..."
                />
                {feedback === 'correct' && <Text style={multStyles.feedbackGood}>C'est ça ! 👏</Text>}
                {feedback === 'incorrect' && <Text style={multStyles.feedbackBad}>Oups ! C'était {questions[currentQ].a}</Text>}
                {!feedback && (
                    <TouchableOpacity style={[multStyles.checkButton, { backgroundColor: '#8e44ad' }]} onPress={handleSubmit}>
                        <Text style={multStyles.buttonText}>Valider</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const renderers = {
    'multiplication-tool': MultiplicationTool,
    'arithmetic-quiz': ArithmeticQuizTool,
    'geometry-quiz': GeometryQuizTool,
    'geography-quiz': GeographyQuizTool,
    'history-quiz': HistoryQuizTool,
    'tic-quiz': TICQuizTool
};


const customHTMLElementModels = {
    'multiplication-tool': HTMLElementModel.fromCustomModel({
        tagName: 'multiplication-tool',
        mixedUAStyles: {
            width: '100%',
            height: 'auto'
        },
        contentModel: HTMLContentModel.block
    }),
    'arithmetic-quiz': HTMLElementModel.fromCustomModel({
        tagName: 'arithmetic-quiz',
        mixedUAStyles: {
            width: '100%',
            height: 'auto'
        },
        contentModel: HTMLContentModel.block
    }),
    'geometry-quiz': HTMLElementModel.fromCustomModel({
        tagName: 'geometry-quiz',
        mixedUAStyles: {
            width: '100%',
            height: 'auto'
        },
        contentModel: HTMLContentModel.block
    }),
    'geography-quiz': HTMLElementModel.fromCustomModel({
        tagName: 'geography-quiz',
        mixedUAStyles: {
            width: '100%',
            height: 'auto'
        },
        contentModel: HTMLContentModel.block
    }),
    'history-quiz': HTMLElementModel.fromCustomModel({
        tagName: 'history-quiz',
        mixedUAStyles: {
            width: '100%',
            height: 'auto'
        },
        contentModel: HTMLContentModel.block
    }),
    'tic-quiz': HTMLElementModel.fromCustomModel({
        tagName: 'tic-quiz',
        mixedUAStyles: {
            width: '100%',
            height: 'auto'
        },
        contentModel: HTMLContentModel.block
    })
};

export default function LessonDetailScreen({ route, navigation }: any) {
    const { lessonId, courseId } = route.params;
    const { selectedCourse, isLoading: storeLoading, selectCourse, fetchLesson } = useCoursesStore();
    const { width } = useWindowDimensions();
    const [lesson, setLesson] = useState<any>(null);
    const [isFetchingFull, setIsFetchingFull] = useState(false);
    const [contentPages, setContentPages] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [sound, setSound] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAudioLoading, setIsAudioLoading] = useState(false);

    const { generateLessonAudio } = useCoursesStore();

    useEffect(() => {
        if (!selectedCourse || selectedCourse.id !== courseId) {
            selectCourse(courseId);
        }
    }, [courseId, selectedCourse]);

    useEffect(() => {
        const loadLesson = async () => {
            // Check if we have the lesson in selectedCourse
            let found = selectedCourse?.lessons?.find((l: any) => l.id === lessonId);

            // If we already have the lesson in state AND it has content, and it matches the ID
            if (lesson && lesson.id === lessonId && lesson.content !== undefined) {
                return;
            }

            if (found && found.content === undefined) {
                // We have the partial version, set it while waiting for the full one
                setLesson(found);

                setIsFetchingFull(true);
                try {
                    const fullLesson = await fetchLesson(lessonId);
                    setLesson(fullLesson);
                } catch (err) {
                    console.error("Failed to fetch full lesson content", err);
                } finally {
                    setIsFetchingFull(false);
                }
            } else if (found) {
                setLesson(found);
            } else if (lessonId) {
                setIsFetchingFull(true);
                try {
                    const fullLesson = await fetchLesson(lessonId);
                    setLesson(fullLesson);
                } catch (err) {
                    console.error("Failed to fetch lesson", err);
                } finally {
                    setIsFetchingFull(false);
                }
            }
        };

        loadLesson();
    }, [selectedCourse, lessonId]);

    // Parse content into pages when lesson changes
    useEffect(() => {
        if (lesson && lesson.content) {
            // Split content by our custom scraper separator <hr/> or just <hr>
            // We use a regex that handles both self-closing and non-self-closing HRs
            const pages = lesson.content.split(/<hr\s*\/?>/i)
                .map((p: string) => p.trim())
                .filter((p: string) => p.length > 0);

            if (pages.length > 0) {
                setContentPages(pages);
                setCurrentPage(0);
            } else {
                setContentPages([lesson.content]); // Fallback to single page
            }
        }
    }, [lesson]);

    // Scroll to top when changing pages
    const scrollViewRef = React.useRef<ScrollView>(null);

    useEffect(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, [currentPage]);

    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const handlePlayAudio = async () => {
        if (sound && isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
            return;
        }

        if (sound && !isPlaying) {
            await sound.playAsync();
            setIsPlaying(false); // Wait, if it plays, set isPlaying to true
            setIsPlaying(true);
            return;
        }

        try {
            setIsAudioLoading(true);
            // Get current text content
            const textToRead = cleanContent(contentPages[currentPage]).replace(/<[^>]*>?/gm, ' ');
            const audioUrl = await generateLessonAudio(textToRead);

            if (!audioUrl) {
                Alert.alert("Erreur", "Impossible de générer l'audio pour le moment.");
                setIsAudioLoading(false);
                return;
            }

            // Backend returns absolute URL, but check if it's correct
            // The backend uses default_storage.url which might need prefix if localhost
            let finalUrl = audioUrl;
            if (audioUrl.startsWith('/')) {
                const { endpoints } = require('../services/endpoints');
                finalUrl = endpoints.base.replace('/api', '') + audioUrl;
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: finalUrl },
                { shouldPlay: true }
            );

            setSound(newSound);
            setIsPlaying(true);
            setIsAudioLoading(false);

            newSound.setOnPlaybackStatusUpdate((status: any) => {
                if (status.didJustFinish) {
                    setIsPlaying(false);
                }
            });

        } catch (error) {
            console.error("Audio playback error:", error);
            Alert.alert("Erreur", "Erreur lors de la lecture audio.");
            setIsAudioLoading(false);
        }
    };

    // Combined loading state: only block the ENTIRE screen if we don't even have a title/description
    const isInitialLoading = storeLoading || (isFetchingFull && !lesson);

    if (isInitialLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Chargement de la leçon...</Text>
            </View>
        );
    }

    if (!lesson) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Leçon introuvable.</Text>
            </View>
        );
    }

    const handleStartPractice = () => {
        if (lesson.exercises && lesson.exercises.length > 0) {
            navigation.navigate('Exercise', { exerciseId: lesson.exercises[0].id });
        } else if (isFetchingFull) {
            // If still fetching, wait a bit or could show a toast
            console.log("Still loading exercises...");
        } else {
            // Truly no exercises
            console.log("No exercises for this lesson.");
        }
    };

    const cleanContent = (html: string) => {
        if (!html) return '<p>Pas de contenu pour cette leçon.</p>';

        let processedHtml = html;

        // 1. Remove "Source FASO" link if content is long enough
        if (processedHtml.length > 500 && processedHtml.includes('Source FASO:')) {
            processedHtml = processedHtml.replace(/<p><a href="[^"]*">Source FASO:.*?<\/a><\/p>/g, '')
                .replace(/Source FASO:.*?<br\s*\/?>/g, '');
        }

        // 2. Remove "Javascript not supported" warning
        // Pattern matches <p id="noJsWarn">...</p>
        processedHtml = processedHtml.replace(/<p id="noJsWarn">.*?<\/p>/s, ''); // s flag for dotall
        // Just in case it's a bit different
        processedHtml = processedHtml.replace(/Attention, votre navigateur ne supporte pas le javascript.*?restreintes\./s, '');

        // 3. Remove script tags (they don't run anyway, but cleaner)
        processedHtml = processedHtml.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "");

        return processedHtml;
    };

    const handleNextPage = () => {
        if (currentPage < contentPages.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{lesson.title}</Text>
                    <TouchableOpacity
                        style={[styles.audioButton, isAudioLoading && styles.audioButtonDisabled]}
                        onPress={handlePlayAudio}
                        disabled={isAudioLoading}
                    >
                        {isAudioLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.audioButtonText}>
                                {isPlaying ? '⏸ Pause' : '🔊 Écouter'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Only show description on first page if multiple pages exist */}
                {(currentPage === 0 || contentPages.length <= 1) && (
                    <Text style={styles.description}>{lesson.description}</Text>
                )}

                <View style={styles.divider} />

                {/* Progress Indicator if multiple pages */}
                {contentPages.length > 1 && (
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            Étape {currentPage + 1} / {contentPages.length}
                        </Text>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${((currentPage + 1) / contentPages.length) * 100}%` }
                                ]}
                            />
                        </View>
                    </View>
                )}

                <View style={styles.contentContainer}>
                    {/* Use VocalLessonViewer for primary levels CP1 to CE2 */}
                    {['primary_cp1', 'primary_cp2', 'primary_ce1', 'primary_ce2', 'cp1', 'cp2', 'ce1', 'ce2'].includes((selectedCourse?.level || '').toLowerCase()) ? (
                        <VocalLessonViewer
                            content={lesson.content || ''}
                            lessonTitle={lesson.title}
                            onFinish={handleStartPractice}
                        />
                    ) : contentPages.length > 0 ? (
                        <View>
                            <RenderHtml
                                contentWidth={width - 40}
                                source={{ html: cleanContent(contentPages[currentPage]) }}
                                tagsStyles={{
                                    p: { color: '#2c3e50', fontSize: 16, lineHeight: 24, marginBottom: 15 },
                                    h1: { color: '#2c3e50', fontSize: 24, fontWeight: 'bold', marginBottom: 12, marginTop: 10 },
                                    h2: { color: '#34495e', fontSize: 20, fontWeight: '600', marginBottom: 10, marginTop: 15 },
                                    h3: { color: '#34495e', fontSize: 18, fontWeight: '600', marginBottom: 8 },
                                    ul: { marginBottom: 15 },
                                    li: { color: '#2c3e50', fontSize: 16, lineHeight: 22, marginBottom: 5 },
                                    hr: { marginVertical: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
                                }}
                                classesStyles={{
                                    'objBox': {
                                        backgroundColor: '#f0f7ff',
                                        padding: 15,
                                        borderRadius: 10,
                                        borderLeftWidth: 5,
                                        borderLeftColor: '#3498db',
                                        marginBottom: 20,
                                    },
                                    'objBox_ti': {
                                        color: '#2980b9',
                                        fontWeight: 'bold',
                                        fontSize: 18,
                                        marginBottom: 10,
                                    },
                                    'mainContent_ti': {
                                        fontSize: 22,
                                        color: '#2c3e50',
                                        fontWeight: 'bold',
                                        marginBottom: 15,
                                        borderBottomWidth: 2,
                                        borderBottomColor: '#27ae60',
                                        paddingBottom: 5,
                                    },
                                    'op_sTxt_p': {
                                        marginBottom: 12,
                                    },
                                    'op_sTxt_is_emp': {
                                        fontWeight: 'bold',
                                        color: '#e67e22',
                                    },
                                    'sw_child_navList': {
                                        backgroundColor: '#fdfcfe',
                                        padding: 10,
                                        borderRadius: 5,
                                        borderWidth: 1,
                                        borderColor: '#d1d8e0',
                                    },
                                    'table': {
                                        marginBottom: 15,
                                        width: '100%',
                                    }
                                }}
                                renderers={renderers}
                                customHTMLElementModels={customHTMLElementModels}
                            />

                            {/* Navigation Buttons for Content */}
                            {contentPages.length > 1 && (
                                <View style={styles.navigationContainer}>
                                    <TouchableOpacity
                                        style={[styles.navButton, currentPage === 0 && styles.navButtonDisabled]}
                                        onPress={handlePrevPage}
                                        disabled={currentPage === 0}
                                    >
                                        <Text style={[styles.navButtonText, currentPage === 0 && styles.navButtonTextDisabled]}>← Précédent</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.navButton, currentPage === contentPages.length - 1 && styles.navButtonDisabled]}
                                        onPress={handleNextPage}
                                        disabled={currentPage === contentPages.length - 1}
                                    >
                                        <Text style={[styles.navButtonText, currentPage === contentPages.length - 1 && styles.navButtonTextDisabled]}>Suivant →</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ) : (
                        <View style={styles.contentLoader}>
                            <ActivityIndicator size="small" color="#3498db" />
                            <Text style={styles.loadingText}>Chargement du contenu detaille...</Text>
                        </View>
                    )}
                </View>

                {/* Show Practice Button ONLY on the LAST page if paginated and NOT primary level */}
                {(!['primary_cp1', 'primary_cp2', 'primary_ce1', 'primary_ce2', 'cp1', 'cp2', 'ce1', 'ce2'].includes((selectedCourse?.level || '').toLowerCase())) && (!contentPages.length || currentPage === contentPages.length - 1) && (
                    ((lesson.exercises && lesson.exercises.length > 0) || (lesson.exercises_count > 0)) ? (
                        <TouchableOpacity style={styles.practiceButton} onPress={handleStartPractice}>
                            <Text style={styles.practiceButtonText}>Passer à la pratique (Exercices)</Text>
                            <Text style={styles.practiceButtonSubText}>{(lesson.exercises?.length || lesson.exercises_count)} exercice(s) disponible(s)</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.noExercisesBox}>
                            <Text style={styles.noExercisesText}>Pas d'exercices pour le moment pour cette leçon.</Text>
                        </View>
                    )
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        color: '#7f8c8d',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        flex: 1,
        marginRight: 10,
    },
    audioButton: {
        backgroundColor: '#3498db',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    audioButtonDisabled: {
        opacity: 0.6,
    },
    audioButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 20,
        fontStyle: 'italic',
    },
    divider: {
        height: 1,
        backgroundColor: '#ecf0f1',
        marginBottom: 20,
    },
    contentContainer: {
        marginBottom: 30,
    },
    practiceButton: {
        backgroundColor: '#2ecc71',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
    },
    practiceButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    practiceButtonSubText: {
        color: '#fff',
        fontSize: 13,
        opacity: 0.9,
        marginTop: 4,
    },
    noExercisesBox: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
        alignItems: 'center',
    },
    noExercisesText: {
        color: '#6c757d',
        fontSize: 14,
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 16,
        fontWeight: 'bold',
    },
    contentLoader: {
        padding: 40,
        alignItems: 'center',
    },
    progressContainer: {
        marginBottom: 20,
    },
    progressText: {
        textAlign: 'center',
        marginBottom: 8,
        color: '#7f8c8d',
        fontWeight: '600',
    },
    progressBar: {
        height: 6,
        backgroundColor: '#ecf0f1',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3498db',
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 20,
        gap: 15,
    },
    navButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#3498db',
        alignItems: 'center',
    },
    navButtonDisabled: {
        borderColor: '#bdc3c7',
        backgroundColor: '#f9f9f9',
    },
    navButtonText: {
        color: '#3498db',
        fontWeight: 'bold',
        fontSize: 16,
    },
    navButtonTextDisabled: {
        color: '#bdc3c7',
    },
});

const multStyles = StyleSheet.create({
    container: {
        backgroundColor: '#f8f9fa',
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#e9ecef',
        marginVertical: 20,
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 15,
    },
    mainInput: {
        backgroundColor: '#fff',
        width: 100,
        height: 60,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#3498db',
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
    },
    actions: {
        flexDirection: 'row',
        gap: 15,
        width: '100%',
        justifyContent: 'center',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        elevation: 2,
        minWidth: 120,
        alignItems: 'center',
    },
    viewBtn: {
        backgroundColor: '#3498db',
    },
    quizBtn: {
        backgroundColor: '#9b59b6',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

    // Quiz/Table View Styles
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 5,
    },
    closeText: {
        color: '#e74c3c',
        fontWeight: '600',
    },
    quizHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    quizProgress: {
        fontSize: 16,
        color: '#7f8c8d',
        fontWeight: '600',
    },
    tableList: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f2f6',
    },
    tableRowText: {
        fontSize: 18,
        color: '#2c3e50',
        width: 80,
        textAlign: 'right',
    },
    tableRowEqual: {
        fontSize: 18,
        color: '#7f8c8d',
        marginHorizontal: 15,
    },
    tableRowResult: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#27ae60',
        width: 50,
    },

    // Quiz specific
    questionBox: {
        alignItems: 'center',
        width: '100%',
    },
    questionText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        width: 120,
        height: 60,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#bdc3c7',
        textAlign: 'center',
        fontSize: 28,
        marginBottom: 20,
    },
    inputCorrect: {
        borderColor: '#2ecc71',
        backgroundColor: '#e8f8f5',
        color: '#27ae60',
    },
    inputIncorrect: {
        borderColor: '#e74c3c',
        backgroundColor: '#fdedea',
        color: '#c0392b',
    },
    checkButton: {
        backgroundColor: '#27ae60',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    feedbackGood: {
        color: '#27ae60',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    feedbackBad: {
        color: '#e74c3c',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    // Result
    scoreText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#3498db',
        marginVertical: 20,
    },
    resultMessage: {
        marginBottom: 30,
    },
    goodJob: {
        fontSize: 24,
        color: '#27ae60',
        fontWeight: 'bold',
    },
    needsWork: {
        fontSize: 24,
        color: '#f39c12',
        fontWeight: 'bold',
    }
});
