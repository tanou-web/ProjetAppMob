import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

interface VocabularyCardProps {
    words: string[];
    color: string;
}

/**
 * Interactive vocabulary flashcards for CP1 students
 */
export default function VocabularyCard({ words, color }: VocabularyCardProps) {
    const speak = (word: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Speech.speak(word, {
            language: 'fr-FR',
            pitch: 1.1,
            rate: 0.9,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>Découvre les mots :</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {words.map((word, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.card, { borderColor: color }]}
                        activeOpacity={0.8}
                        onPress={() => speak(word)}
                    >
                        <View style={styles.cardHeader}>
                            <Ionicons name="volume-medium-outline" size={24} color={color} />
                            <Text style={styles.cardNumber}>{index + 1}</Text>
                        </View>
                        <Text style={styles.wordText}>{word}</Text>
                        <View style={styles.cardFooter}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
        fontStyle: 'italic',
    },
    scrollContent: {
        paddingRight: 20,
    },
    card: {
        backgroundColor: '#FFF',
        width: 160,
        height: 120,
        borderRadius: 16,
        borderWidth: 2,
        marginRight: 12,
        padding: 12,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardNumber: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999',
    },
    wordText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
    },
    cardFooter: {
        alignItems: 'flex-end',
    },
});
