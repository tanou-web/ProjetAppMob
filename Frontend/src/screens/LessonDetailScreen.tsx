import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    useWindowDimensions,
} from 'react-native';
// @ts-ignore
import RenderHtml from 'react-native-render-html';
import { useCoursesStore } from '../store/coursesStore';

export default function LessonDetailScreen({ route, navigation }: any) {
    const { lessonId, courseId } = route.params;
    const { selectedCourse, isLoading, selectCourse } = useCoursesStore();
    const { width } = useWindowDimensions();
    const [lesson, setLesson] = useState<any>(null);

    useEffect(() => {
        if (!selectedCourse || selectedCourse.id !== courseId) {
            selectCourse(courseId);
        }
    }, [courseId]);

    useEffect(() => {
        if (selectedCourse && selectedCourse.lessons) {
            const found = selectedCourse.lessons.find((l: any) => l.id === lessonId);
            setLesson(found);
        }
    }, [selectedCourse, lessonId]);

    if (isLoading || !lesson) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Chargement de la leçon...</Text>
            </View>
        );
    }

    const handleStartPractice = () => {
        if (lesson.exercises && lesson.exercises.length > 0) {
            navigation.navigate('Exercise', { exerciseId: lesson.exercises[0].id });
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

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>{lesson.title}</Text>
                <Text style={styles.description}>{lesson.description}</Text>

                <View style={styles.divider} />

                <View style={styles.contentContainer}>
                    <RenderHtml
                        contentWidth={width - 40}
                        source={{ html: cleanContent(lesson.content) }}
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
                            }
                        }}
                    />
                </View>

                {lesson.exercises && lesson.exercises.length > 0 ? (
                    <TouchableOpacity style={styles.practiceButton} onPress={handleStartPractice}>
                        <Text style={styles.practiceButtonText}>Passer à la pratique (Exercices)</Text>
                        <Text style={styles.practiceButtonSubText}>{lesson.exercises.length} exercice(s) disponible(s)</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.noExercisesBox}>
                        <Text style={styles.noExercisesText}>Pas d'exercices pour le moment pour cette leçon.</Text>
                    </View>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
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
});
