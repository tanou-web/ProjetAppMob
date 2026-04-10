import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

interface VocalLessonViewerProps {
    content: string;
    lessonTitle: string;
    onFinish: () => void;
}

interface LessonSection {
    id: 'objectives' | 'vocabulary' | 'theme' | 'activities' | 'observation' | 'counting' | 'quiz' | 'sensory' | 'oral' | 'default';
    title: string;
    icon: string;
    content: string;
    color: string;
    image?: string;
    metadata?: any; // For storing range [1, 12] or quiz questions
}

import VocabularyCard from './VocabularyCard';
import ActivityStep from './ActivityStep';

/**
 * Interactive lesson viewer for CP1 (young students)
 * Presents content as a series of slides with automated vocal support.
 */
export default function VocalLessonViewer({ content, lessonTitle, onFinish }: VocalLessonViewerProps) {
    const sections = useMemo(() => parseTeacherGuide(content, lessonTitle), [content, lessonTitle]);
    const [currentStep, setCurrentStep] = useState(0);

    // Auto-play TTS when step changes
    useEffect(() => {
        if (sections[currentStep]) {
            speakCurrentStep();
        }
        return () => {
            Speech.stop();
        };
    }, [currentStep, sections]);

    const speakCurrentStep = () => {
        Speech.stop();
        const section = sections[currentStep];
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Introductory text on first step
        if (currentStep === 0) {
            Speech.speak(`Bonjour ! Aujourd'hui nous allons étudier : ${lessonTitle}`, {
                language: 'fr-FR',
                rate: 0.9,
                onDone: () => speakText(section.title, 1.0)
            });
        } else {
            speakText(section.title, 1.0);
        }

        // Add a slight delay before the body to separate it clearly
        setTimeout(() => {
            speakText(section.content, 0.85);
        }, currentStep === 0 ? 3000 : 1000);
    };

    /**
     * Chunks text to avoid expo-speech failures on long strings
     */
    const speakText = (text: string, rate: number) => {
        // Remove markdown or special characters that sound weird
        const cleanText = text.replace(/[#*•\-_]/g, ' ').replace(/\s+/g, ' ').trim();

        // Split by sentences or chunks of ~200 chars
        const chunks = cleanText.match(/.{1,200}(?:\.|\?|!|\s|$)/g) || [cleanText];

        chunks.forEach(chunk => {
            if (chunk.trim()) {
                Speech.speak(chunk.trim(), { language: 'fr-FR', rate });
            }
        });
    };

    const nextStep = () => {
        if (currentStep < sections.length - 1) {
            setCurrentStep(currentStep + 1);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (onFinish) {
            onFinish();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (sections.length === 0) return null;

    const currentSection = sections[currentStep];

    return (
        <View style={styles.container}>
            {/* Progress indicator */}
            <View style={styles.topProgress}>
                {sections.map((_, idx) => (
                    <View
                        key={idx}
                        style={[
                            styles.progressDot,
                            idx === currentStep && styles.progressDotActive,
                            idx < currentStep && styles.progressDotDone
                        ]}
                    />
                ))}
            </View>

            <View style={styles.slideCard}>
                <View style={[styles.slideHeader, { backgroundColor: currentSection.color }]}>
                    <Text style={styles.slideIcon}>{currentSection.icon}</Text>
                    <Text style={styles.slideTitle}>{currentSection.title}</Text>
                </View>

                <ScrollView style={styles.slideBody} contentContainerStyle={styles.bodyContent}>
                    {renderSectionContent(currentSection)}
                </ScrollView>

                <TouchableOpacity onPress={speakCurrentStep} style={styles.replayButton}>
                    <Ionicons name="volume-high" size={32} color={currentSection.color} />
                    <Text style={[styles.replayText, { color: currentSection.color }]}>Réécouter</Text>
                </TouchableOpacity>
            </View>

            {/* Giant Navigation Buttons */}
            <View style={styles.navBar}>
                <TouchableOpacity
                    onPress={prevStep}
                    style={[styles.bigNavButton, styles.prevButton, currentStep === 0 && styles.hidden]}
                    disabled={currentStep === 0}
                >
                    <Ionicons name="arrow-back" size={30} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={nextStep}
                    style={[
                        styles.bigNavButton,
                        styles.nextButton,
                        currentStep === sections.length - 1 && styles.finishButton
                    ]}
                >
                    {currentStep === sections.length - 1 ? (
                        <Text style={styles.finishButtonText}>J'ai fini ! 🌟</Text>
                    ) : (
                        <View style={styles.nextIconContainer}>
                            <Text style={styles.nextText}>Suivant</Text>
                            <Ionicons name="arrow-forward" size={30} color="#FFF" />
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

function renderSectionContent(section: LessonSection) {
    if (section.id === 'counting') {
        return <CountingSlide range={section.metadata?.range || [1, 10]} color={section.color} />;
    }

    if (section.id === 'quiz') {
        const quizType = section.metadata?.type || 'counting';
        if (['colors', 'shapes', 'space'].includes(quizType)) {
            return <SensoryQuiz type={quizType as any} color={section.color} />;
        }
        if (quizType === 'oral') {
            return <OralQuiz text={section.content} color={section.color} />;
        }
        if (quizType === 'thematic') {
            return <ThematicQuiz vocabulary={section.metadata?.vocabulary || []} theme={section.metadata?.theme} color={section.color} />;
        }
        return <DynamicMathQuiz type={quizType as any} range={section.metadata?.range || [1, 10]} color={section.color} />;
    }

    if (section.id === 'sensory') {
        return <SensoryLab type={section.metadata?.type} color={section.color} />;
    }

    if (section.id === 'oral') {
        return <OralLab text={section.content} color={section.color} />;
    }

    return (
        <View>
            {section.image && (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: section.image }}
                        style={styles.sectionImage}
                        resizeMode="contain"
                    />
                </View>
            )}
            {section.id === 'vocabulary' ? (
                <VocabularyCard words={section.content.split(/[,\n]/).map(w => w.trim()).filter(w => w.length > 0)} color={section.color} />
            ) : section.id === 'activities' || section.id === 'observation' ? (
                <ActivityStep activities={section.content} color={section.color} />
            ) : (
                <Text style={styles.sectionText}>{section.content}</Text>
            )}
        </View>
    );
}

/**
 * Visual counting slide with manual interactive mode
 */
function CountingSlide({ range, color }: { range: [number, number], color: string }) {
    const [current, setCurrent] = useState(range[0] - 1);

    // Reset if range changes
    useEffect(() => {
        setCurrent(range[0] - 1);
    }, [range]);

    const countNext = () => {
        const nextVal = current + 1;
        if (nextVal <= range[1]) {
            setCurrent(nextVal);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Speech.stop();
            Speech.speak(nextVal.toString(), { language: 'fr-FR', rate: 0.9 });
        }
    };

    const reset = () => {
        setCurrent(range[0] - 1);
    };

    const isFinished = current >= range[1];

    return (
        <View style={styles.countingContainer}>
            <View style={styles.countingDisplay}>
                <Text style={[styles.countingMain, { color }]}>
                    {current >= range[0] ? current : '?'}
                </Text>
            </View>

            <TouchableOpacity
                style={[
                    styles.countButton,
                    { backgroundColor: isFinished ? '#95A5A6' : color, transform: [{ scale: isFinished ? 0.9 : 1.1 }] }
                ]}
                onPress={isFinished ? reset : countNext}
            >
                <Ionicons name={isFinished ? "refresh" : "finger-print"} size={32} color="#FFF" />
                <Text style={styles.countButtonText}>
                    {isFinished ? "Recommencer" : "Appuie pour compter !"}
                </Text>
            </TouchableOpacity>

            <View style={styles.numberGrid}>
                {Array.from({ length: range[1] - range[0] + 1 }, (_, i) => range[0] + i).map(num => (
                    <TouchableOpacity
                        key={num}
                        onPress={() => {
                            setCurrent(num);
                            Speech.speak(num.toString(), { language: 'fr-FR' });
                        }}
                        style={[
                            styles.numberBox,
                            num === current && { borderColor: color, borderWidth: 3, backgroundColor: color + '20', transform: [{ scale: 1.2 }] },
                            num < current && { opacity: 0.5 }
                        ]}
                    >
                        <Text style={[styles.numberBoxText, num === current && { color, fontWeight: 'bold' }]}>{num}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

/**
 * Simple dynamic quiz for CP1 Math
 */
function DynamicMathQuiz({ type, range, color }: { type: 'counting' | 'comparison', range: [number, number], color: string }) {
    const [question, setQuestion] = useState<{ q: string, a: number | string } | null>(null);
    const [userAns, setUserAns] = useState<number | string | null>(null);
    const [feedback, setFeedback] = useState<'good' | 'bad' | null>(null);

    const generateQuestion = () => {
        const n1 = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
        const r = Math.random();

        if (r < 0.4) {
            setQuestion({ q: `Quel nombre vient juste APRES ${n1} ?`, a: n1 + 1 });
        } else if (r < 0.7 && n1 > 1) {
            setQuestion({ q: `Quel nombre vient juste AVANT ${n1} ?`, a: n1 - 1 });
        } else {
            const n2 = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
            if (n1 === n2) {
                setQuestion({ q: `Est-ce que ${n1} est égal à ${n2} ?`, a: 'OUI' });
            } else {
                setQuestion({ q: `Lequel est le PLUS GRAND : ${n1} ou ${n2} ?`, a: Math.max(n1, n2) });
            }
        }
        setUserAns(null);
        setFeedback(null);
    };

    useEffect(() => {
        generateQuestion();
    }, []);

    const checkAnswer = (val: number | string) => {
        setUserAns(val);
        if (val == question?.a) {
            setFeedback('good');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Speech.speak("Bravo ! C'est la bonne réponse !", { language: 'fr-FR' });
        } else {
            setFeedback('bad');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Speech.speak("Oups ! Ce n'est pas tout à fait ça. Regarde bien !", { language: 'fr-FR' });
        }
    };

    const options = useMemo(() => {
        if (!question) return [];
        const opts: (number | string)[] = [question.a];
        if (typeof question.a === 'number') {
            const others = new Set<number>();
            while (others.size < 2) {
                const rand = Math.floor(Math.random() * (range[1] - range[0] + 3)) + range[0] - 1;
                if (rand > 0 && rand !== question.a) others.add(rand);
            }
            opts.push(...Array.from(others));
        } else {
            if (question.a === 'OUI') opts.push('NON');
            else opts.push('OUI');
        }
        return opts.sort(() => Math.random() - 0.5);
    }, [question, range]);

    if (!question) return null;

    return (
        <View style={styles.quizContainer}>
            <Text style={styles.quizQuestion}>{question.q}</Text>
            <View style={styles.quizOptions}>
                {options.map((opt, idx) => (
                    <TouchableOpacity
                        key={idx}
                        style={[
                            styles.quizOption,
                            userAns === opt && feedback === 'good' && styles.quizOptionGood,
                            userAns === opt && feedback === 'bad' && styles.quizOptionBad
                        ]}
                        onPress={() => checkAnswer(opt)}
                        disabled={feedback !== null}
                    >
                        <Text style={styles.quizOptionText}>{opt}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {feedback === 'good' && (
                <TouchableOpacity style={[styles.countButton, { backgroundColor: '#2ECC71', marginTop: 20 }]} onPress={generateQuestion}>
                    <Text style={styles.countButtonText}>Une autre ! 🌟</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

/**
 * Interactive Lab for Sensory Exercises (Colors, Shapes, Space)
 */
function SensoryLab({ type, color }: { type: 'colors' | 'shapes' | 'space', color: string }) {
    const [activeItem, setActiveItem] = useState<string | null>(null);

    const items = useMemo(() => {
        if (type === 'colors') {
            return [
                { id: 'rouge', label: 'Rouge', value: '#E74C3C' },
                { id: 'bleu', label: 'Bleu', value: '#3498DB' },
                { id: 'jaune', label: 'Jaune', value: '#F1C40F' },
                { id: 'vert', label: 'Vert', value: '#2ECC71' },
                { id: 'orange', label: 'Orange', value: '#E67E22' },
                { id: 'noir', label: 'Noir', value: '#2C3E50' },
            ];
        }
        if (type === 'shapes') {
            return [
                { id: 'carre', label: 'Carré', icon: 'square' },
                { id: 'cercle', label: 'Cercle', icon: 'ellipse' },
                { id: 'triangle', label: 'Triangle', icon: 'triangle' },
                { id: 'rectangle', label: 'Rectangle', icon: 'square' },
            ];
        }
        if (type === 'space') {
            return [
                { id: 'dessus', label: 'Dessus', icon: 'arrow-up' },
                { id: 'dessous', label: 'Dessous', icon: 'arrow-down' },
                { id: 'devant', label: 'Devant', icon: 'arrow-forward' },
                { id: 'derriere', label: 'Derrière', icon: 'arrow-back' },
            ];
        }
        return [];
    }, [type]);

    const handlePress = (item: any) => {
        setActiveItem(item.id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Speech.speak(item.label, { language: 'fr-FR' });
    };

    return (
        <View style={styles.labContainer}>
            <Text style={styles.labTitle}>
                {type === 'colors' ? "Touche une couleur !" :
                    type === 'shapes' ? "Découvre les formes !" :
                        "Apprenons les positions !"}
            </Text>
            <View style={styles.labGrid}>
                {items.map((item: any) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.labItem,
                            type === 'colors' && { backgroundColor: item.value },
                            activeItem === item.id && styles.labItemActive
                        ]}
                        onPress={() => handlePress(item)}
                    >
                        {type !== 'colors' && <Ionicons name={item.icon as any} size={40} color={activeItem === item.id ? '#FFF' : color} />}
                        <Text style={[
                            styles.labItemLabel,
                            type === 'colors' && { color: '#FFF', textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 2 },
                            activeItem === item.id && type !== 'colors' && { color: '#FFF' }
                        ]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

/**
 * Interactive Lab for Oral Expression
 */
function OralLab({ text, color }: { text: string, color: string }) {
    const [isListening, setIsListening] = useState(false);

    const handleSpeak = () => {
        setIsListening(true);
        Speech.speak(text, {
            language: 'fr-FR',
            onDone: () => {
                setTimeout(() => {
                    Speech.speak("À toi maintenant ! Répète après moi.", { language: 'fr-FR' });
                    setIsListening(false);
                }, 500);
            }
        });
    };

    return (
        <View style={styles.oralContainer}>
            <Ionicons name="mic-circle" size={80} color={color} />
            <Text style={styles.oralInstruction}>Écoute et répète :</Text>
            <View style={styles.oralQuoteBox}>
                <Text style={styles.oralText}>"{text}"</Text>
            </View>
            <TouchableOpacity
                style={[styles.countButton, { backgroundColor: color, marginTop: 30 }]}
                onPress={handleSpeak}
                disabled={isListening}
            >
                <Ionicons name="play" size={24} color="#FFF" />
                <Text style={styles.countButtonText}>{isListening ? "Écoute bien..." : "Écouter & Répéter"}</Text>
            </TouchableOpacity>
        </View>
    );
}

/**
 * Interactive Quiz for Sensory Topics (Colors, Shapes, Space)
 */
function SensoryQuiz({ type, color }: { type: 'colors' | 'shapes' | 'space', color: string }) {
    const [question, setQuestion] = useState<{ q: string, a: string, options: any[] } | null>(null);
    const [userAns, setUserAns] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<'good' | 'bad' | null>(null);

    const generateQuestion = () => {
        let q = "";
        let a = "";
        let options: any[] = [];

        if (type === 'colors') {
            const colors = [
                { id: 'rouge', label: 'Rouge', value: '#E74C3C' },
                { id: 'bleu', label: 'Bleu', value: '#3498DB' },
                { id: 'jaune', label: 'Jaune', value: '#F1C40F' },
                { id: 'vert', label: 'Vert', value: '#2ECC71' },
                { id: 'orange', label: 'Orange', value: '#E67E22' },
            ];
            const target = colors[Math.floor(Math.random() * colors.length)];
            q = `Quelle est cette couleur ? 🎨`;
            a = target.id;
            options = colors.sort(() => Math.random() - 0.5);
        } else if (type === 'shapes') {
            const shapes = [
                { id: 'carre', label: 'Le Carré', icon: 'square' },
                { id: 'cercle', label: 'Le Cercle', icon: 'ellipse' },
                { id: 'triangle', label: 'Le Triangle', icon: 'triangle' },
            ];
            const target = shapes[Math.floor(Math.random() * shapes.length)];
            q = `Où est ${target.label} ? 📐`;
            a = target.id;
            options = shapes.sort(() => Math.random() - 0.5);
        } else {
            const positions = [
                { id: 'dessus', label: 'Dessus', icon: 'arrow-up' },
                { id: 'dessous', label: 'Dessous', icon: 'arrow-down' },
            ];
            const target = positions[Math.floor(Math.random() * positions.length)];
            q = `Lequel montre le sens : ${target.label} ? 🚀`;
            a = target.id;
            options = positions.sort(() => Math.random() - 0.5);
        }

        setQuestion({ q, a, options });
        setUserAns(null);
        setFeedback(null);
        Speech.speak(q, { language: 'fr-FR' });
    };

    useEffect(() => {
        generateQuestion();
    }, [type]);

    const checkAnswer = (val: string) => {
        setUserAns(val);
        if (val === question?.a) {
            setFeedback('good');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Speech.speak("Bravo ! C'est exactement ça !", { language: 'fr-FR' });
        } else {
            setFeedback('bad');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Speech.speak("Oups, essaye encore !", { language: 'fr-FR' });
        }
    };

    if (!question) return null;

    return (
        <View style={styles.quizContainer}>
            <Text style={styles.quizQuestion}>{question.q}</Text>
            {type === 'colors' && feedback === null && (
                <View style={[styles.quizColorPreview, { backgroundColor: (question.options.find(o => o.id === question.a) as any).value }]} />
            )}
            <View style={styles.quizOptions}>
                {question.options.map((opt) => (
                    <TouchableOpacity
                        key={opt.id}
                        style={[
                            styles.quizOption,
                            userAns === opt.id && feedback === 'good' && styles.quizOptionGood,
                            userAns === opt.id && feedback === 'bad' && styles.quizOptionBad
                        ]}
                        onPress={() => checkAnswer(opt.id)}
                        disabled={feedback !== null}
                    >
                        {opt.icon ? (
                            <Ionicons name={opt.icon} size={40} color={userAns === opt.id ? '#FFF' : color} />
                        ) : (
                            <View style={[styles.quizOptionColor, { backgroundColor: opt.value }]} />
                        )}
                        <Text style={styles.quizOptionTextSmall}>{opt.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {feedback === 'good' && (
                <TouchableOpacity style={[styles.countButton, { backgroundColor: '#2ECC71', marginTop: 30 }]} onPress={generateQuestion}>
                    <Text style={styles.countButtonText}>Un autre défi ! 🌟</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

/**
 * Interactive Quiz for Oral Expression
 */
function OralQuiz({ text, color }: { text: string, color: string }) {
    const [status, setStatus] = useState<'idle' | 'playing' | 'waiting' | 'done'>('idle');

    const handleStart = () => {
        setStatus('playing');
        Speech.speak(text, {
            language: 'fr-FR',
            onDone: () => setStatus('waiting')
        });
    };

    const handleDone = () => {
        setStatus('done');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Speech.speak("Excellent ! Tu as une voix magnifique.", { language: 'fr-FR' });
    };

    return (
        <View style={styles.oralContainer}>
            <Ionicons name="mic-circle" size={100} color={status === 'waiting' ? '#2ECC71' : color} />
            <Text style={styles.oralInstruction}>
                {status === 'idle' ? "Prêt pour le défi ?" :
                    status === 'playing' ? "Écoute bien..." :
                        status === 'waiting' ? "C'est à toi ! Parle fort !" : "Bravo !"}
            </Text>
            <View style={styles.oralQuoteBox}>
                <Text style={styles.oralText}>"{text}"</Text>
            </View>
            {status === 'idle' && (
                <TouchableOpacity style={[styles.countButton, { backgroundColor: color, marginTop: 30 }]} onPress={handleStart}>
                    <Ionicons name="play" size={24} color="#FFF" />
                    <Text style={styles.countButtonText}>Commencer</Text>
                </TouchableOpacity>
            )}
            {status === 'waiting' && (
                <TouchableOpacity style={[styles.countButton, { backgroundColor: '#2ECC71', marginTop: 30 }]} onPress={handleDone}>
                    <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                    <Text style={styles.countButtonText}>J'ai fini de parler !</Text>
                </TouchableOpacity>
            )}
            {status === 'done' && (
                <TouchableOpacity style={[styles.countButton, { backgroundColor: color, marginTop: 30 }]} onPress={handleStart}>
                    <Text style={styles.countButtonText}>Recommencer 🌟</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

/**
 * Generic Interactive Quiz for Thematic lessons
 */
function ThematicQuiz({ vocabulary, theme, color }: { vocabulary: string[], theme: string, color: string }) {
    const [question, setQuestion] = useState<{ q: string, a: string, opts: string[] } | null>(null);
    const [feedback, setFeedback] = useState<'good' | 'bad' | null>(null);

    const generateQuestion = () => {
        if (vocabulary.length < 2) {
            setQuestion({
                q: `Est-ce qu'on a bien appris des choses sur ${theme} ?`,
                a: "OUI",
                opts: ["OUI", "NON"]
            });
            return;
        }

        const target = vocabulary[Math.floor(Math.random() * vocabulary.length)];
        const others = vocabulary.filter(v => v !== target);
        const opts = [target, others[0] || "Autre chose"].sort(() => Math.random() - 0.5);

        setQuestion({
            q: `Lequel de ces mots avons-nous appris aujourd'hui ?`,
            a: target,
            opts
        });
        setFeedback(null);
    };

    useEffect(() => {
        generateQuestion();
    }, [vocabulary]);

    const check = (val: string) => {
        if (val === question?.a) {
            setFeedback('good');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Speech.speak("Exactement ! Tu as une excellente mémoire !", { language: 'fr-FR' });
        } else {
            setFeedback('bad');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Speech.speak("Regarde encore une fois...", { language: 'fr-FR' });
        }
    };

    if (!question) return null;

    return (
        <View style={styles.quizContainer}>
            <Text style={styles.quizQuestion}>{question.q}</Text>
            <View style={styles.quizOptions}>
                {question.opts.map((opt, idx) => (
                    <TouchableOpacity
                        key={idx}
                        style={[
                            styles.quizOption,
                            feedback === 'good' && opt === question.a && styles.quizOptionGood,
                            feedback === 'bad' && opt === question.a && { borderColor: '#CCC' } // highlight right one silently
                        ]}
                        onPress={() => check(opt)}
                        disabled={feedback === 'good'}
                    >
                        <Text style={[styles.quizOptionText, { fontSize: 18 }]}>{opt}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {feedback === 'good' && (
                <TouchableOpacity style={[styles.countButton, { backgroundColor: '#2ECC71', marginTop: 30 }]} onPress={generateQuestion}>
                    <Text style={styles.countButtonText}>Un autre ! 🌟</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

/**
 * Transforms teacher guide instructions into student-facing directions with storytelling
 */
function pedagogicalTransform(text: string, type: 'observation' | 'sound' | 'action' | 'intro'): string {
    // Only clean technical markers, don't delete too much content
    let clean = text
        .replace(/Le maître demande aux apprenants de/gi, "Je te demande de")
        .replace(/Le maître fait observer/gi, "Regardons ensemble")
        .replace(/Le maître fait manipuler/gi, "Amuse-toi à manipuler")
        .replace(/Le maître dit/gi, "Écoute bien")
        .replace(/L'élève doit/gi, "Tu vas")
        .replace(/L'apprenant doit/gi, "Tu vas")
        .replace(/Phase d'observation/gi, "Regardons attentivement")
        .replace(/Phase de manipulation/gi, "C'est l'heure de manipuler")
        .replace(/Phase d'exécution/gi, "C'est à toi de jouer")
        .replace(/Activités de l'apprenant/gi, "Ton activité")
        .replace(/Résultat attendu/gi, "Ce que nous allons réussir")
        .replace(/Étapes\s*Rôle\s*du.*?Observations/gi, '')
        .replace(/PHASE DE (?:PRÉSENTATION|DÉVELOPPEMENT|ÉVALUATION|CONSOLIDATION|INTÉGRATION)/gi, '')
        .replace(/\(\s*\d+\s*min\s*\)/gi, "")
        // Math specific transforms - Unified Narrative
        .replace(/Le maître demande de compter/gi, "Comptons ensemble")
        .replace(/Le maître demande de comparer/gi, "Comparons ensemble")
        .replace(/Le maître fait découvrir/gi, "Découvrons ensemble")
        .replace(/Combien y a-t-il/gi, "Combien tu en vois")
        .replace(/bâtonnets?|cailloux?/gi, (match) => `tes petits ${match} magiques`)
        .trim();

    // Specific polish for student-facing language
    if (type === 'observation') {
        const mathContext = /plus que|moins que|autant que|compter|nombre/.test(clean.toLowerCase());
        return clean.length > 20 ? clean : (mathContext ? "Regardons bien ces objets. On va découvrir quel groupe a le plus de choses !" : "Regardons bien tout ce qu'il y a ici. C'est le moment d'être très attentif !");
    }
    if (type === 'sound') {
        return clean.length > 10 ? clean : `Écoute bien ce petit secret. C'est très important pour devenir un champion !`;
    }
    if (type === 'action') {
        return clean.length > 20 ? clean : "À ton tour d'essayer ! Amuse-toi bien avec cet exercice.";
    }

    return clean;
}

/**
 * Parse teacher guide HTML/text into structured sections
 */
function parseTeacherGuide(content: string, lessonTitle: string): LessonSection[] {
    const sections: LessonSection[] = [];
    const lowerTitle = lessonTitle.toLowerCase();

    // 1. PRE-CLEANING: Remove CSS/JS and very early noise
    const cleanHtml = content
        .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "");

    let textContent = cleanHtml.replace(/<[^>]*>/g, '\n').replace(/\s+/g, ' ').trim();

    // Global Noise cleaning
    textContent = textContent
        .replace(/Page\s+\d+\s+sur\s+\d+/gi, "")
        .replace(/[a-zA-Z0-9_\-\/]+\.(?:pdf|jpg|png|pptx)/gi, "")
        .replace(/fiches_api[a-zA-Z0-9_\-\/]*/gi, "")
        .replace(/MINISTÈRE DE L'ENSEIGNEMENT.*?Août 2024/gi, "")
        .replace(/PROJET À FORT IMPACT.*?INCLUSION \(PISGI\)/gi, "")
        .replace(/REPUBLIQUE DU BURKINA FASO.*?Justice/gi, "")
        .replace(/SECRÉTARIAT GÉNÉRAL/gi, "")
        .replace(/DIRECTION GÉNÉRALE.*?QUALITÉ DE L'EDUCATION/gi, "")
        .replace(/Unité – Progrès – Justice/gi, "")
        .replace(/EN PARTENARIAT AVEC.*?1re ÉDITION/gi, "")
        .replace(/NB\s*:\s*Dans les CTIS.*?activités/gi, "")
        .replace(/\(\s*(?:Ressource Enseignant|Fiche Enseignant|Fiches)\s*\)/gi, "")
        .replace(/\s+/g, ' ').trim();

    // 2. CATEGORY DETECTION
    const isVowelGroup = lowerTitle.includes('voyelle');
    const isConsonantGroup = lowerTitle.includes('consonne');
    const isMath = lowerTitle.includes('math') || lowerTitle.includes('calcul');

    // 3. FRAGMENT EXTRACTION
    let fragments: string[] = [];

    if (isVowelGroup || isConsonantGroup) {
        // Collect all lessons matching the category (Vowels or Consonants)
        const categoryKey = isVowelGroup ? 'voyelle' : 'consonne';
        // Regex to find lesson headers containing the category keyword
        const headerMatches = Array.from(textContent.matchAll(new RegExp(`(?:Fiche|Titre|Leçon|Classe|PHASE|DÉROULEMENT)\\s*[^:\\n]{0,100}${categoryKey}`, 'gi')));

        if (headerMatches.length > 0) {
            headerMatches.forEach((match, idx) => {
                const startPos = match.index || 0;
                let endPos = textContent.length;

                // Termination: Look for the NEXT major header
                const nextHeaderRegex = /(?:Fiche|Titre|Leçon|Source|Bibliographie|PHASE DE PRÉSENTATION|PHASE DE DÉVELOPPEMENT)/gi;
                nextHeaderRegex.lastIndex = startPos + 20; // Skip current
                const nextMatch = nextHeaderRegex.exec(textContent);
                if (nextMatch) {
                    endPos = nextMatch.index;
                }

                const fragment = textContent.substring(startPos, endPos);
                // Only add if it contains significant teaching content
                if (fragment.length > 800) {
                    fragments.push(fragment);
                }
            });
        }
    }

    if (fragments.length === 0) {
        // Broad detection for thematic and general lessons
        const thematicKeywords = [
            'politess', 'famille', 'école', 'relation', 'corps', 'santé', 'hygièn',
            'communauté', 'village', 'quartier', 'sécurité', 'route', 'environnement',
            'eau', 'aliment', 'vêtement', 'maison', 'jeu', 'sport', 'fête', 'travail',
            'plus que', 'moins que', 'autant que', 'nombre', 'chiffre', 'compter', 'géométrie',
            'caillou', 'bâtonnet', 'jeton', 'tableau'
        ];
        const isThematic = thematicKeywords.some(w => lowerTitle.includes(w)) || lowerTitle.includes('expression orale') || isMath;

        const titleWords = lowerTitle.split(/\s+/).filter(w => w.length > 2 && !['fiches', 'expression', 'orale', 'ressource', 'enseignant', 'classe'].includes(w));
        const allHeaders = Array.from(textContent.matchAll(/(?:Fiche|Titre|Leçon|Expression orale|Mathématiques|Calcul|Classe|Thème|PHASE|DÉROULEMENT|PRÉSENTATION)\s*[^:\n]{0,100}/gi));

        // Collect ALL fragments that look like lessons for Math/Thematic
        allHeaders.forEach((header, idx) => {
            const hText = header[0].toLowerCase();
            const quality = titleWords.filter(w => hText.includes(w)).length;

            // For Math, we are more generous: take any header that looks like a new fiche
            if (quality > 0 || isMath || (isThematic && idx === 0)) {
                const startPos = header.index || 0;
                let endPos = textContent.length;

                const nextHeader = allHeaders[idx + 1];
                if (nextHeader) {
                    endPos = nextHeader.index;
                } else {
                    // Fallback termination
                    const rest = textContent.substring(startPos + 50);
                    const stopMatch = /(?:Documentation|BIBLIOGRAPHIE|Source)/gi.exec(rest);
                    if (stopMatch) endPos = startPos + 50 + stopMatch.index;
                }

                const frag = textContent.substring(startPos, endPos);
                if (frag.length > 150) {
                    // Avoid pushing generic headers as full fragments if they have no body
                    if (frag.length < 300 && !frag.toLowerCase().includes('caillou') && !frag.toLowerCase().includes('nombre')) return;
                    fragments.push(frag);
                }
            }
        });

        // Final fallback if still nothing: use the whole text but clean it
        if (fragments.length === 0 && textContent.length > 100) {
            fragments.push(textContent.substring(0, 8000));
        }

        // Safety: Limit number of fragments for math to avoid infinite scrolling
        if (isMath && fragments.length > 4) fragments = fragments.slice(0, 4);
    }

    // Aggregator for unified narrative
    const aggregated = {
        observation: [] as string[],
        action: [] as string[],
        vocabulary: new Set<string>(),
        resources: [] as string[],
        ranges: [] as [number, number][],
    };

    // 3. FRAGMENT PROCESSING & CLEANING
    fragments.forEach((fragment) => {
        // Strict Cleaning of Teacher Jargon
        const cleanFrag = fragment
            .replace(/(?:Matériel|Supports?|Effectif|Durée|Outils?|Prérequis|Vigilance|Consigne)\s*:.*?(?=\s[A-Z][a-z]|\n|[A-Z]{2,}|$)/gi, '')
            .replace(/NB\s*:.*?(?=\n|[A-Z]{2,}|$)/gi, '')
            .trim();

        const obsMatch = cleanFrag.match(/(?:Phase d'observation|PHASE\s*DE\s*(?:DÉVELOPPEMENT|PRÉSENTATION)|PHASE\s*1)\s*:?\s*(.*?)(?=PHASE|DÉROULEMENT|$)/is);
        if (obsMatch) aggregated.observation.push(obsMatch[1].trim());

        const actMatch = cleanFrag.match(/(?:DÉROULEMENT|PHASE\s*DE\s*(?:DÉVELOPPEMENT|PRÉSENTATION|APPLICATION|EXÉCUTION)|Phase d'exécution|PHASE\s*2)\s*:?\s*(.*?)(?=PHASE|DÉROULEMENT|ÉVALUATION|$)/is);
        if (actMatch) aggregated.action.push(actMatch[1].trim());

        const resourcesMatch = cleanFrag.match(/(?:Ressources|Mots clés|Mots|Vocabulaire|Notions)\s*[:]\s*(.*?)(?=Matériel|Supports|PHASE|$)/is);
        if (resourcesMatch) aggregated.resources.push(resourcesMatch[1].trim());

        const wordMatch = cleanFrag.match(/(?:mot-repère|mot clé|exemple|Ressources|nommer|éléments|vocabulaire)\s*[:«]?\s*([a-z\s,]{2,100})(?:[»\n]|$)/i);
        if (wordMatch) wordMatch[1].split(/[,\n]/).forEach(w => aggregated.vocabulary.add(w.trim()));

        const rangeMatch = cleanFrag.match(/nombres?\s*(?:de|du)?\s*(\d+)\s*(?:à|et)\s*(\d+)/i);
        if (rangeMatch) {
            const start = parseInt(rangeMatch[1]);
            const end = parseInt(rangeMatch[2]);
            if (!isNaN(start) && !isNaN(end)) aggregated.ranges.push([start, end]);
        }
    });

    // SPECIAL SENSORY/ORAL DETECTION
    const isColors = lowerTitle.includes('couleur');
    const isShapes = lowerTitle.includes('forme');
    const isSpace = lowerTitle.includes('espace');
    const isOral = lowerTitle.includes('expression orale') || lowerTitle.includes('parole');
    const isReading = lowerTitle.includes('lecture') || lowerTitle.includes('son') || lowerTitle.includes('lire');
    const isGrammar = lowerTitle.includes('grammaire') || lowerTitle.includes('phrase') || lowerTitle.includes('verbe') || lowerTitle.includes('nom');

    // 4. GENERATE UNIFIED 5-STEP JOURNEY
    const thematicName = lessonTitle
        .replace(/Fiches (?:d'|de) mathématiques CP1\s*:?/gi, '')
        .replace(/Ressource Enseignant|Fiche Enseignant/gi, '')
        .replace(/\(.*\)/g, '')
        .trim();

    let name = thematicName;
    if (name.includes(':')) name = name.split(':').pop()?.trim() || name;

    // Smart Title Rewriting
    if (isMath) {
        name = name
            .replace(/étude des nombres de (\d+) à (\d+)/gi, "Jouons avec les nombres de $1 à $2")
            .replace(/étude du nombre (\d+)/gi, "Découvrons le nombre $1")
            .replace(/plus que.*?moins que.*?autant que/gi, "Le jeu du 'plus' et du 'moins'")
            .replace(/identification d'objets/gi, "Détectives d'objets");
        if (name.length < 3) name = "Le jeu des nombres";
    }

    // Slide 1: BIENVENUE (Single)
    sections.push({
        id: 'default',
        title: isMath ? "Labo de Mathématiques" : (isReading ? "Coin Lecture" : (isGrammar ? "Atelier des Mots" : "Découvrons ensemble")),
        icon: isReading ? '📖' : (isGrammar ? '✍️' : '👋'),
        content: isMath
            ? `Salut petit génie ! Aujourd'hui, nous allons travailler sur : ${name}. On va s'amuser !`
            : (isReading
                ? `Bienvenue au Coin Lecture ! Aujourd'hui, nous allons découvrir le son et les mots de : ${name}. Ouvre grand tes oreilles !`
                : (isGrammar
                    ? `Bienvenue à l'Atelier des Mots ! Aujourd'hui, nous allons apprendre à construire des phrases avec : ${name}.`
                    : `Salut ! Aujourd'hui, nous allons apprendre quelque chose de très important : ${name}. Tu vas voir, c'est super !`)),
        color: isReading ? '#E67E22' : (isGrammar ? '#9B59B6' : '#2ECC71'),
    });

    // Slide 2: OBSERVATION (Merged)
    if (aggregated.observation.length > 0) {
        sections.push({
            id: 'observation',
            title: "Regardons bien",
            icon: '👁️',
            content: pedagogicalTransform(aggregated.observation.join(' ').substring(0, 1000), 'observation'),
            color: '#3498DB'
        });
    }

    // Slide 3: LE SECRET / LES RESSOURCES
    if (aggregated.resources.length > 0 || isMath) {
        sections.push({
            id: 'default',
            title: isMath ? "La règle d'or" : "Le petit secret",
            icon: isMath ? '🔢' : '💡',
            content: pedagogicalTransform(
                aggregated.resources.length > 0
                    ? `Aujourd'hui, nous allons apprendre : ${aggregated.resources.join(', ')}.`
                    : `C'est un secret magique pour bien comprendre ${name} !`,
                'intro'
            ),
            color: '#9B59B6'
        });
    }

    // SPECIAL MATH: Counting Slide
    if (isMath && aggregated.ranges.length > 0) {
        const start = Math.min(...aggregated.ranges.map(r => r[0]));
        const end = Math.max(...aggregated.ranges.map(r => r[1]));
        if (end > start) {
            sections.push({
                id: 'counting',
                title: `Comptons de ${start} à ${end}`,
                icon: '�',
                content: `Appuie sur le bouton pour compter avec moi !`,
                color: '#8E44AD',
                metadata: { range: [start, end] }
            });
        }
    }

    // Slide 4: VOCABULAIRE (Single)
    if (aggregated.vocabulary.size > 0) {
        sections.push({
            id: 'vocabulary',
            title: isMath ? "Les mots des maths" : "Les mots à retenir",
            icon: '🔑',
            content: Array.from(aggregated.vocabulary).filter(w => w.length > 2).join(', '),
            color: '#F1C40F'
        });
    }

    // Slide 5: ACTION / JEU (Merged)
    if (aggregated.action.length > 0) {
        sections.push({
            id: 'activities',
            title: "À toi d'essayer",
            icon: isMath ? '🧮' : '🎮',
            content: pedagogicalTransform(aggregated.action.join(' ').substring(0, 1000), 'action'),
            color: '#E67E22'
        });
    }

    // SPECIAL MATH: Final Quiz
    if (isMath) {
        const allNumbers = textContent.match(/\d+/g)?.map(Number) || [];
        const start = Math.min(...allNumbers.filter(n => n > 0)) || 1;
        const end = Math.max(...allNumbers.filter(n => n <= 20)) || 10;
        if (end > start) {
            sections.push({
                id: 'quiz',
                title: "🏆 Le Grand Défi des Nombres",
                icon: '🎯',
                content: `C'est l'heure de montrer ce que tu as appris sur les nombres de ${start} à ${end} !`,
                color: '#D35400',
                metadata: { range: [start, end], type: 'counting' }
            });
        }
    }

    // SPECIAL SENSORY: Lab injection
    if (isColors || isShapes || isSpace) {
        sections.push({
            id: 'sensory',
            title: isColors ? "Labo des Couleurs" : isShapes ? "Labo des Formes" : "Labo de l'Espace",
            icon: isColors ? '🎨' : isShapes ? '📐' : '🚀',
            content: "C'est l'heure de s'entraîner !",
            color: '#FF5722',
            metadata: { type: isColors ? 'colors' : isShapes ? 'shapes' : 'space' }
        });

        // Add a dedicated quiz after the lab
        sections.push({
            id: 'quiz',
            title: isColors ? "Défi des Couleurs" : isShapes ? "Défi des Formes" : "Défi des Positions",
            icon: '🎯',
            content: "Montre-moi ce que tu as appris !",
            color: '#E67E22',
            metadata: { type: isColors ? 'colors' : isShapes ? 'shapes' : 'space' }
        });
    }

    // SPECIAL ORAL: Lab injection
    if (isOral && aggregated.action.length > 0) {
        sections.push({
            id: 'oral',
            title: "Le Coin de la Parole",
            icon: '🗣️',
            content: aggregated.action[0].substring(0, 150),
            color: '#00BCD4'
        });

        // Add Oral Quiz (Parrot Challenge)
        sections.push({
            id: 'quiz',
            title: "Le Défi du Perroquet",
            icon: '🦜',
            content: aggregated.action[0].substring(0, 100),
            color: '#009688',
            metadata: { type: 'oral' }
        });
    }

    // GENERAL THEMATIC QUIZ (for non-math, non-sensory lessons)
    if (!isMath && !isColors && !isShapes && !isSpace && !isOral) {
        sections.push({
            id: 'quiz',
            title: "Le Petit Défi",
            icon: '🎯',
            content: "Vérifions ce que tu as retenu !",
            color: '#FF9800',
            metadata: {
                type: 'thematic',
                vocabulary: Array.from(aggregated.vocabulary).slice(0, 4),
                theme: name
            }
        });
    }

    // Slide 4: VOCABULAIRE (Single)

    // Final slide: BRAVO
    if (sections.length > 0) {
        sections.push({
            id: 'default',
            title: "Félicitations ! 🌟",
            icon: '🏆',
            content: `Tu as fini cette leçon sur ${lessonTitle.includes(':') ? lessonTitle.split(':')[1].trim() : lessonTitle} ! Tu as été super attentif. Bravo pour tes efforts !`,
            color: '#2ECC71'
        });
    }

    // Add high-level objectives
    if (fragments[0]) {
        const objMatch = fragments[0].match(/(?:Objectifs?\s*d'apprentissage|L'apprenant.*?doit.*?capable.*?de)\s*:?\s*(.*?)(?=Matériel|Méthodes|Ressources|Personnages|PHASE|DÉROULEMENT|$)/is);
        if (objMatch && objMatch[1].length > 10) {
            sections.unshift({
                id: 'objectives',
                title: 'Notre but aujourd\'hui :',
                icon: '🎯',
                content: pedagogicalTransform('• ' + objMatch[1].split(/[-•;\n]\s*/).map(o => o.trim()).filter(o => o.length > 5).slice(0, 5).join('\n• '), 'intro'),
                color: '#4CAF50',
            });
        }
    }

    if (sections.length === 0) {
        sections.push({
            id: 'default',
            title: 'Contenu de ta leçon',
            icon: '📚',
            content: textContent.substring(0, 2000),
            color: '#607D8B',
        });
    }

    return sections;
}

const styles = StyleSheet.create({
    container: {
        height: 600, // Fixed height for lesson area
        backgroundColor: '#F7F9FC',
    },
    topProgress: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 15,
        gap: 8,
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#D1D9E6',
    },
    progressDotActive: {
        width: 30,
        backgroundColor: '#3498DB',
    },
    progressDotDone: {
        backgroundColor: '#2ECC71',
    },
    slideCard: {
        flex: 1,
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    slideHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 12,
    },
    slideIcon: {
        fontSize: 32,
    },
    slideTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        flex: 1,
    },
    slideBody: {
        flex: 1,
    },
    bodyContent: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionText: {
        fontSize: 20,
        lineHeight: 32,
        color: '#2C3E50',
        textAlign: 'center',
        fontWeight: '500',
    },
    replayButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#F0F3F7',
        gap: 10,
    },
    replayText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    navBar: {
        flexDirection: 'row',
        padding: 20,
        gap: 15,
        alignItems: 'center',
    },
    bigNavButton: {
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    prevButton: {
        width: 70,
        backgroundColor: '#95A5A6',
    },
    nextButton: {
        flex: 1,
        backgroundColor: '#3498DB',
    },
    nextIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    nextText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    finishButton: {
        backgroundColor: '#2ECC71',
    },
    finishButtonText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    hidden: {
        opacity: 0,
    },
    imageContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#F0F3F7',
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionImage: {
        width: '100%',
        height: '100%',
    },
    // Math Specific Styles
    countingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    countingDisplay: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countingMain: {
        fontSize: 120,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    countButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 30,
        gap: 10,
        elevation: 3,
    },
    countButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    numberGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginTop: 40,
    },
    numberBox: {
        width: 45,
        height: 45,
        borderRadius: 10,
        backgroundColor: '#F0F3F7',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E6ED',
    },
    numberBoxText: {
        fontSize: 18,
        color: '#7F8C8D',
    },
    quizContainer: {
        padding: 10,
        alignItems: 'center',
    },
    quizQuestion: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2C3E50',
        textAlign: 'center',
        marginBottom: 30,
    },
    quizOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 20,
    },
    quizOption: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F0F3F7',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E0E6ED',
    },
    quizOptionText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    quizOptionGood: {
        backgroundColor: '#2ECC7120',
        borderColor: '#2ECC71',
    },
    quizOptionBad: {
        backgroundColor: '#E74C3C20',
        borderColor: '#E74C3C',
    },
    // Sensory Lab styles
    labContainer: {
        alignItems: 'center',
        padding: 10,
    },
    labTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7F8C8D',
        marginBottom: 20,
    },
    labGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
    },
    labItem: {
        width: 100,
        height: 100,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F3F7',
        borderWidth: 2,
        borderColor: 'transparent',
        elevation: 2,
    },
    labItemActive: {
        borderColor: '#3498DB',
        backgroundColor: '#3498DB',
        transform: [{ scale: 1.05 }],
    },
    labItemLabel: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    // Oral Lab styles
    oralContainer: {
        alignItems: 'center',
        padding: 20,
    },
    oralInstruction: {
        fontSize: 18,
        color: '#7F8C8D',
        marginTop: 10,
        marginBottom: 20,
        fontStyle: 'italic',
    },
    oralQuoteBox: {
        backgroundColor: '#F9F9F9',
        padding: 25,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EEE',
        width: '100%',
    },
    oralText: {
        fontSize: 22,
        color: '#2C3E50',
        lineHeight: 32,
        textAlign: 'center',
        fontWeight: '600',
    },
    // Quiz Sensory Styles
    quizColorPreview: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 30,
        borderWidth: 4,
        borderColor: '#FFF',
        elevation: 5,
    },
    quizOptionColor: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginBottom: 10,
    },
    quizOptionTextSmall: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#7F8C8D',
    },
});
