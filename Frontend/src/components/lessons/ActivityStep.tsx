import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

interface ActivityStepProps {
    activities: string;
    color: string;
}

/**
 * Interactive activity steps with checkable items for CP1 students
 */
export default function ActivityStep({ activities, color }: ActivityStepProps) {
    // Split activities into steps (simple heuristic)
    const steps = activities
        .split(/\d+\s*[-.)]/)
        .map(s => s.trim())
        .filter(s => s.length > 10);

    const [completed, setCompleted] = useState<boolean[]>(new Array(steps.length).fill(false));

    const speakStep = (step: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Speech.speak(step, { language: 'fr-FR', rate: 0.9 });
    };

    const toggleStep = (index: number) => {
        const newCompleted = [...completed];
        newCompleted[index] = !newCompleted[index];
        setCompleted(newCompleted);
    };

    if (steps.length === 0) {
        return <Text style={styles.plainText}>{activities}</Text>;
    }

    return (
        <View style={styles.container}>
            {steps.map((step, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.stepRow, completed[index] && styles.completedRow]}
                    onPress={() => toggleStep(index)}
                    activeOpacity={0.7}
                >
                    <View style={styles.stepLeft}>
                        <TouchableOpacity
                            onPress={(e) => { e.stopPropagation(); speakStep(step); }}
                            style={[styles.vocalButton, { backgroundColor: color + '20' }]}
                        >
                            <Ionicons name="volume-medium" size={16} color={color} />
                        </TouchableOpacity>
                        <View style={[styles.checkCircle, { borderColor: color }, completed[index] && { backgroundColor: color }]}>
                            {completed[index] && <Ionicons name="checkmark" size={16} color="#FFF" />}
                        </View>
                    </View>
                    <Text style={[styles.stepText, completed[index] && styles.completedText]}>
                        {step}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    plainText: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    completedRow: {
        backgroundColor: '#F0FFF4',
        borderColor: '#C6F6D5',
    },
    stepLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginRight: 0,
    },
    vocalButton: {
        padding: 6,
        borderRadius: 15,
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepText: {
        fontSize: 15,
        color: '#333',
        flex: 1,
        lineHeight: 20,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
});
