import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useCoursesStore } from '../store/coursesStore';

export default function ExerciseScreen({ route, navigation }: any) {
  const { exerciseId } = route.params;
  const { currentExercise, currentAttempt, isLoading, selectExercise, submitAnswer } =
    useCoursesStore();
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    selectExercise(exerciseId);
  }, [exerciseId]);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      Alert.alert('Erreur', 'Veuillez fournir une réponse');
      return;
    }

    await submitAnswer(exerciseId, answer);
    setSubmitted(true);
  };

  if (isLoading && !currentExercise) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!currentExercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Exercice non trouvé</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Exercice Header */}
        <View style={styles.header}>
          <Text style={styles.difficulty}>
            Difficulté: {Array(currentExercise.difficulty).fill('⭐').join('')}
          </Text>
          <Text style={styles.points}>{currentExercise.points} points</Text>
        </View>

        {/* Enoncé */}
        <Text style={styles.title}>{currentExercise.title}</Text>
        <Text style={styles.description}>{currentExercise.description}</Text>

        {/* Contenu de l'exercice */}
        <View style={styles.contentBox}>
          <Text style={styles.contentText}>{currentExercise.content}</Text>
        </View>

        {/* Zone de réponse */}
        {!submitted ? (
          <>
            <Text style={styles.label}>Votre réponse:</Text>
            <TextInput
              style={styles.answerInput}
              placeholder="Entrez votre réponse ici..."
              value={answer}
              onChangeText={setAnswer}
              editable={!isLoading}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Soumettre</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.resultContainer}>
            <View
              style={[
                styles.resultBox,
                currentAttempt?.is_correct ? styles.correctBox : styles.incorrectBox,
              ]}
            >
              <Text style={styles.resultEmoji}>
                {currentAttempt?.is_correct ? '✅' : '❌'}
              </Text>
              <Text style={styles.resultTitle}>
                {currentAttempt?.is_correct ? 'Correct!' : 'Incorrect'}
              </Text>
              <Text style={styles.resultScore}>Score: {currentAttempt?.score}/100</Text>

              {currentAttempt?.feedback && (
                <View style={styles.feedbackBox}>
                  <Text style={styles.feedbackLabel}>Retour:</Text>
                  <Text style={styles.feedbackText}>{currentAttempt.feedback}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setAnswer('');
                setSubmitted(false);
              }}
            >
              <Text style={styles.buttonText}>Réessayer</Text>
            </TouchableOpacity>
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
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  difficulty: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '500',
  },
  points: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
    lineHeight: 20,
  },
  contentBox: {
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    padding: 15,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  contentText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  answerInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    padding: 12,
    marginBottom: 20,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 20,
  },
  resultBox: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  correctBox: {
    backgroundColor: '#d5f4e6',
    borderLeftWidth: 5,
    borderLeftColor: '#27ae60',
  },
  incorrectBox: {
    backgroundColor: '#fadbd8',
    borderLeftWidth: 5,
    borderLeftColor: '#e74c3c',
  },
  resultEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  resultScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  feedbackBox: {
    marginTop: 15,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 6,
    padding: 12,
    width: '100%',
  },
  feedbackLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 5,
  },
  feedbackText: {
    fontSize: 13,
    color: '#2c3e50',
    lineHeight: 18,
  },
  error: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 20,
  },
});
