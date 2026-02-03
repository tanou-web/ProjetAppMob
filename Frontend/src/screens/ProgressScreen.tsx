import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LevelSelectionModal from '../components/LevelSelectionModal';
import { progressAPI } from '../services/endpoints';
import { ProgressData } from '../types';
import { useCoursesStore } from '../store/coursesStore';
import { useAuthStore } from '../store/authStore';

export default function ProgressScreen() {
  const { user, updateLevel, logout } = useAuthStore();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLevelModalVisible, setLevelModalVisible] = useState(false);
  const [isUpdatingLevel, setIsUpdatingLevel] = useState(false);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      const data = await progressAPI.get();
      setProgress(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLevelUpdate = async (levelId: string) => {
    try {
      console.log('[LEVEL_UPDATE] Starting level update to:', levelId);
      setIsUpdatingLevel(true);

      await updateLevel(levelId);
      console.log('[LEVEL_UPDATE] Update completed successfully');

      setLevelModalVisible(false);

      // Logout the user so they reconnect with their new level
      alert('Niveau mis à jour ! Vous allez être déconnecté. Reconnectez-vous pour voir vos nouveaux cours.');

      console.log('[LEVEL_UPDATE] Initiating logout in 1.5 seconds...');
      // Logout after a short delay to let the user see the message
      setTimeout(async () => {
        console.log('[LEVEL_UPDATE] Logging out now...');
        await useAuthStore.getState().logout();
      }, 1500);
    } catch (error) {
      console.error('[LEVEL_UPDATE] Error during update:', error);
      alert('Erreur lors de la mise à jour du niveau.');
    } finally {
      setIsUpdatingLevel(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Chargement de votre progrès...</Text>
      </View>
    );
  }

  if (!progress) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Progrès</Text>
        <Text style={styles.error}>Impossible de charger votre progrès</Text>
      </View>
    );
  }

  const successRatePercentage = Math.round(progress.success_rate * 100);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Mon Progrès</Text>

        {/* Change Level Button */}
        <TouchableOpacity
          style={[styles.changeLevelButton, { marginHorizontal: 15, marginTop: 10 }]}
          onPress={() => setLevelModalVisible(true)}
        >
          <Text style={styles.changeLevelButtonText}>🏫 Changer de niveau (Classe)</Text>
        </TouchableOpacity>

        {/* Card principale */}
        <View style={styles.mainCard}>
          <View style={styles.mainCardContent}>
            <Text style={styles.mainCardLabel}>Score Global</Text>
            <Text style={styles.mainCardScore}>{Math.round(progress.average_score)}%</Text>
            <Text style={styles.mainCardSubtext}>basé sur {progress.completed_exercises} exercices</Text>
          </View>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{successRatePercentage}%</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, styles.statBox1]}>
            <Text style={styles.statIcon}>📝</Text>
            <Text style={styles.statNumber}>{progress.total_exercises}</Text>
            <Text style={styles.statName}>Exercices total</Text>
          </View>

          <View style={[styles.statBox, styles.statBox2]}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statNumber}>{progress.completed_exercises}</Text>
            <Text style={styles.statName}>Complétés</Text>
          </View>

          <View style={[styles.statBox, styles.statBox3]}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statNumber}>{progress.total_points}</Text>
            <Text style={styles.statName}>Points totaux</Text>
          </View>

          <View style={[styles.statBox, styles.statBox4]}>
            <Text style={styles.statIcon}>📚</Text>
            <Text style={styles.statNumber}>{progress.courses_enrolled}</Text>
            <Text style={styles.statName}>Cours inscrits</Text>
          </View>
        </View>

        {/* Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>

          <View style={styles.performanceItem}>
            <View style={styles.performanceContent}>
              <Text style={styles.performanceLabel}>Taux de réussite</Text>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${successRatePercentage}%` }]}
                />
              </View>
            </View>
            <Text style={styles.performanceValue}>{successRatePercentage}%</Text>
          </View>

          <View style={styles.performanceItem}>
            <View style={styles.performanceContent}>
              <Text style={styles.performanceLabel}>Score moyen par exercice</Text>
              <Text style={styles.performanceSmall}>
                {progress.total_exercises > 0
                  ? (progress.total_points / progress.total_exercises).toFixed(1)
                  : '0'}
                pts/exercice
              </Text>
            </View>
            <Text style={styles.performanceValue}>
              {Math.round(progress.average_score)}%
            </Text>
          </View>
        </View>

        {/* Dernière activité */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activité</Text>
          <View style={styles.activityBox}>
            <Text style={styles.activityIcon}>🕐</Text>
            <View>
              <Text style={styles.activityLabel}>Dernière activité</Text>
              <Text style={styles.activityTime}>
                {new Date(progress.last_activity).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Motivational Message */}
        <View style={styles.motivationBox}>
          <Text style={styles.motivationEmoji}>🎯</Text>
          <Text style={styles.motivationText}>
            {successRatePercentage >= 80
              ? 'Excellent travail! Continuez comme ça! 🚀'
              : successRatePercentage >= 60
                ? 'Bon progrès! Continuez vos efforts! 💪'
                : 'Continuez votre travail, vous allez réussir! 💪'}
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => useAuthStore.getState().logout()}
        >
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>

        {/* Padding for better scrolling */}
        <View style={{ height: 40 }} />
      </ScrollView>

      <LevelSelectionModal
        visible={isLevelModalVisible}
        onClose={() => setLevelModalVisible(false)}
        currentLevel={user?.level || ''}
        onSelectLevel={handleLevelUpdate}
        isLoading={isUpdatingLevel}
      />
    </View>
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
  error: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 20,
  },
  mainCard: {
    marginHorizontal: 15,
    marginBottom: 25,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainCardContent: {
    flex: 1,
  },
  mainCardLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  mainCardScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  mainCardSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 25,
  },
  statBox: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 15,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBox1: {
    backgroundColor: '#e8f4f8',
  },
  statBox2: {
    backgroundColor: '#e8f8f0',
  },
  statBox3: {
    backgroundColor: '#fef5e7',
  },
  statBox4: {
    backgroundColor: '#f4ecf7',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  statName: {
    fontSize: 11,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 15,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  performanceItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  performanceContent: {
    flex: 1,
  },
  performanceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  performanceSmall: {
    fontSize: 12,
    color: '#7f8c8d',
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
  performanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    marginLeft: 15,
  },
  activityBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  activityLabel: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  motivationBox: {
    marginHorizontal: 15,
    marginBottom: 30,
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  motivationEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  motivationText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 20,
  },
  actionButtonsContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  changeLevelButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3498db',
    marginBottom: 15,
  },
  changeLevelButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  logoutButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
