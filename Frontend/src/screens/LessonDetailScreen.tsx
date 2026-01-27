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

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>{lesson.title}</Text>
                <Text style={styles.description}>{lesson.description}</Text>

                <View style={styles.divider} />

                <View style={styles.contentContainer}>
                    <RenderHtml
                        contentWidth={width - 40}
                        source={{ html: lesson.content || '<p>Pas de contenu pour cette leçon.</p>' }}
                        tagsStyles={{
                            p: { color: '#2c3e50', fontSize: 16, lineHeight: 24, marginBottom: 15 },
                            h1: { color: '#2c3e50', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
                            h2: { color: '#2c3e50', fontSize: 20, fontWeight: '600', marginBottom: 10 },
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
