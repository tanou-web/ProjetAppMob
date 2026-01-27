import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useCoursesStore } from '../store/coursesStore';
import { useFocusEffect } from '@react-navigation/native';

export default function CoursesScreen({ navigation }: any) {
  const { courses, isLoading, fetchCourses, fetchAllCourses, enrollInCourse } = useCoursesStore();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'my' | 'all'>('my');

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [filter])
  );

  const loadData = async () => {
    if (filter === 'my') {
      await fetchCourses();
    } else {
      await fetchAllCourses();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCoursePress = (courseId: number) => {
    if (filter === 'my') {
      navigation.navigate('CourseDetail', { courseId });
    }
  };

  const handleEnroll = async (id: number) => {
    await enrollInCourse(id);
    setFilter('my'); // Basculer vers mes cours après inscription
  };

  const renderCourse = ({ item }: any) => {
    // Si c'est un objet d'inscription (mes cours), les données sont dans item.course
    const courseData = filter === 'my' ? item.course : item;

    if (!courseData) return null;

    const subjectName = typeof courseData.subject === 'object'
      ? courseData.subject.name
      : (courseData.subject || 'Général');

    return (
      <View style={styles.courseCard}>
        <TouchableOpacity
          style={styles.courseContent}
          onPress={() => handleCoursePress(courseData.id)}
          activeOpacity={filter === 'my' ? 0.7 : 1}
        >
          <Text style={styles.courseTitle}>{courseData.title}</Text>
          <Text style={styles.courseDescription} numberOfLines={2}>
            {courseData.description}
          </Text>
          <View style={styles.courseMeta}>
            <Text style={styles.courseSubject}>📚 {subjectName}</Text>
            <Text style={styles.courseLevel}>📊 Niveau {courseData.level}</Text>
          </View>
        </TouchableOpacity>

        {filter === 'my' ? (
          <Text style={styles.arrow}>→</Text>
        ) : (
          <TouchableOpacity
            style={styles.enrollButton}
            onPress={() => handleEnroll(courseData.id)}
          >
            <Text style={styles.enrollButtonText}>S'inscrire</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (isLoading && courses.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Chargement des cours...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Cours</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, filter === 'my' && styles.toggleBtnActive]}
            onPress={() => setFilter('my')}
          >
            <Text style={[styles.toggleText, filter === 'my' && styles.toggleTextActive]}>Mes Cours</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, filter === 'all' && styles.toggleBtnActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.toggleText, filter === 'all' && styles.toggleTextActive]}>Catalogue</Text>
          </TouchableOpacity>
        </View>
      </View>

      {courses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun cours trouvé</Text>
          <Text style={styles.emptySubtext}>
            {filter === 'my' ? "Inscrivez-vous à des cours dans le catalogue" : "Le catalogue est vide pour le moment"}
          </Text>
          {filter === 'my' && (
            <TouchableOpacity style={styles.primaryButton} onPress={() => setFilter('all')}>
              <Text style={styles.primaryButtonText}>Voir le catalogue</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={courses}
          renderItem={renderCourse}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#7f8c8d',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
    color: '#2c3e50',
  },
  toggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
  },
  toggleBtnActive: {
    backgroundColor: '#3498db',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  toggleTextActive: {
    color: '#fff',
  },
  list: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 20,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 6,
  },
  courseDescription: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 12,
    lineHeight: 18,
  },
  courseMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  courseSubject: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3498db',
    backgroundColor: '#eaf4fb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  courseLevel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e67e22',
    backgroundColor: '#fef5e7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  arrow: {
    fontSize: 22,
    color: '#bdc3c7',
    marginLeft: 10,
  },
  enrollButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#95a5a6',
    textAlign: 'center',
    marginBottom: 25,
  },
  primaryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
