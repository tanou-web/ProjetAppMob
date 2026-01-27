import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { useCoursesStore } from '../store/coursesStore';

export default function CourseDetailScreen({ route, navigation }: any) {
    const { courseId } = route.params;
    const { selectedCourse, isLoading, selectCourse, reset, error } = useCoursesStore();

    useEffect(() => {
        console.log('Fetching details for course ID:', courseId);
        selectCourse(courseId);
        return () => reset();
    }, [courseId]);

    // Log pour le débug
    useEffect(() => {
        if (selectedCourse) {
            console.log('Course details received:', selectedCourse.title, 'Lessons:', selectedCourse.lessons?.length);
        }
    }, [selectedCourse]);

    if (isLoading && !selectedCourse) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Chargement du contenu...</Text>
            </View>
        );
    }

    if (!selectedCourse && !isLoading) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Impossible de charger ce cours.</Text>
                {error && <Text style={styles.errorSubtext}>{error}</Text>}
            </View>
        );
    }

    const course = selectedCourse!;
    const subjectName = typeof course.subject === 'object'
        ? (course.subject as any).name
        : (course.subject || 'Général');

    const handleLessonPress = (lesson: any) => {
        navigation.navigate('LessonDetail', {
            lessonId: lesson.id,
            courseId: course.id
        });
    };

    const renderLesson = ({ item }: any) => (
        <TouchableOpacity
            style={styles.lessonCard}
            onPress={() => handleLessonPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{item.title}</Text>
                <Text style={styles.lessonDesc} numberOfLines={1}>
                    {item.description || "Consulter le contenu de la leçon"}
                </Text>
                {item.exercises && item.exercises.length > 0 && (
                    <Text style={styles.exerciseBadge}>📖 Contenu + 📝 {item.exercises.length} exercice(s)</Text>
                )}
            </View>
            <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{course.title}</Text>
                <View style={styles.badgeContainer}>
                    <Text style={styles.subjectBadge}>📚 {subjectName}</Text>
                    <Text style={styles.levelBadge}>📊 {course.level}</Text>
                </View>
                <Text style={styles.description}>{course.description}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Programme du cours</Text>
                {course.lessons && course.lessons.length > 0 ? (
                    course.lessons.map((lesson: any) => (
                        <View key={lesson.id.toString()}>
                            {renderLesson({ item: lesson })}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyLessons}>
                        <Text style={styles.emptyText}>✨ Ce cours ne contient pas encore de leçons.</Text>
                        <Text style={styles.emptySubtext}>Revenez bientôt !</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 15,
        color: '#7f8c8d',
        fontSize: 16,
    },
    header: {
        backgroundColor: '#fff',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 12,
    },
    badgeContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    subjectBadge: {
        fontSize: 13,
        color: '#3498db',
        fontWeight: '600',
        backgroundColor: '#eaf4fb',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    levelBadge: {
        fontSize: 13,
        color: '#e67e22',
        fontWeight: '600',
        backgroundColor: '#fef5e7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    description: {
        fontSize: 16,
        color: '#5d6d7e',
        lineHeight: 24,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 15,
    },
    lessonCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 18,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
    },
    lessonInfo: {
        flex: 1,
    },
    lessonTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 4,
    },
    lessonDesc: {
        fontSize: 14,
        color: '#95a5a6',
        marginBottom: 4,
    },
    exerciseBadge: {
        fontSize: 12,
        color: '#27ae60',
        fontWeight: 'bold',
    },
    arrow: {
        fontSize: 20,
        color: '#bdc3c7',
        marginLeft: 10,
    },
    emptyLessons: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#7f8c8d',
        fontWeight: '600',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#bdc3c7',
    },
    errorText: {
        fontSize: 18,
        color: '#e74c3c',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    errorSubtext: {
        fontSize: 14,
        color: '#95a5a6',
        textAlign: 'center',
    },
});
