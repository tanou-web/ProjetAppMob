import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from 'react-native';
import { revisionAPI } from '../services/endpoints';
import { RevisionPlan } from '../types';

export default function RevisionScreen() {
  const [revisionPlan, setRevisionPlan] = useState<RevisionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRevisionPlan();
  }, []);

  const fetchRevisionPlan = async () => {
    try {
      setIsLoading(true);
      const plan = await revisionAPI.revisionPlan();
      setRevisionPlan(plan);
    } catch (error) {
      console.error('Error fetching revision plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Chargement du plan de révision...</Text>
      </View>
    );
  }

  if (!revisionPlan || revisionPlan.total_items === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Plan de Révision</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>✨ Aucune révision nécessaire</Text>
          <Text style={styles.emptySubtext}>Continuez vos exercices!</Text>
        </View>
      </View>
    );
  }

  const completionPercentage = Math.round(
    (revisionPlan.completed_items / revisionPlan.total_items) * 100
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Plan de Révision</Text>

      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{revisionPlan.total_items}</Text>
          <Text style={styles.statLabel}>Total à réviser</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{revisionPlan.completed_items}</Text>
          <Text style={styles.statLabel}>Complétées</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{revisionPlan.pending_items}</Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>
      </View>

      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <View style={styles.progressLabel}>
          <Text style={styles.progressText}>Progression générale</Text>
          <Text style={styles.progressPercent}>{completionPercentage}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${completionPercentage}%` }]}
          />
        </View>
      </View>

      {/* Priorités haute */}
      {revisionPlan.high_priority_items > 0 && (
        <View style={styles.priorityContainer}>
          <Text style={styles.priorityTitle}>⚠️ Priorité Haute</Text>
          <Text style={styles.priorityCount}>
            {revisionPlan.high_priority_items} concept(s) à revoir d'urgence
          </Text>
          <Text style={styles.priorityText}>
            Concentrez-vous sur ces domaines pour une meilleure compréhension
          </Text>
        </View>
      )}

      {/* Liste des items */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Items à réviser</Text>
        <FlatList
          scrollEnabled={false}
          data={revisionPlan.items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.revisionItem,
                item.status === 'completed' && styles.revisionItemCompleted,
              ]}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.itemStatus}>
                  {item.status === 'completed' ? '✅' : '⏳'}
                </Text>
                <Text style={styles.itemTitle}>Item {item.id}</Text>
                <Text
                  style={[
                    styles.itemPriority,
                    item.priority > 7 && styles.priorityHigh,
                  ]}
                >
                  Priorité: {item.priority}/10
                </Text>
              </View>
              <View style={styles.itemMastery}>
                <Text style={styles.masteryLabel}>Maîtrise:</Text>
                <View style={styles.masteryBar}>
                  <View
                    style={[styles.masteryFill, { width: `${item.mastery_score}%` }]}
                  />
                </View>
                <Text style={styles.masteryPercent}>{item.mastery_score}%</Text>
              </View>
              <Text style={styles.nextReview}>
                Prochaine révision: {new Date(item.next_review_date).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          )}
        />
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  progressContainer: {
    marginHorizontal: 15,
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
  },
  priorityContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fef5e7',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  priorityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f39c12',
    marginBottom: 5,
  },
  priorityCount: {
    fontSize: 13,
    color: '#2c3e50',
    fontWeight: '600',
    marginBottom: 5,
  },
  priorityText: {
    fontSize: 12,
    color: '#7f8c8d',
    lineHeight: 16,
  },
  listContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  revisionItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  revisionItemCompleted: {
    borderLeftColor: '#27ae60',
    opacity: 0.7,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemStatus: {
    fontSize: 18,
    marginRight: 10,
  },
  itemTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  itemPriority: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  priorityHigh: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  itemMastery: {
    marginBottom: 10,
  },
  masteryLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  masteryBar: {
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  masteryFill: {
    height: '100%',
    backgroundColor: '#3498db',
  },
  masteryPercent: {
    fontSize: 11,
    color: '#3498db',
    fontWeight: 'bold',
  },
  nextReview: {
    fontSize: 11,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95a5a6',
  },
});
