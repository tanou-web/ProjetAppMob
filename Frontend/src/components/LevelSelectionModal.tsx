import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';

const LEVELS = [
    { id: 'primary_cp1', label: 'CP1 (Primaire)' },
    { id: 'primary_cp2', label: 'CP2 (Primaire)' },
    { id: 'primary_ce1', label: 'CE1 (Primaire)' },
    { id: 'primary_ce2', label: 'CE2 (Primaire)' },
    { id: 'primary_cm1', label: 'CM1 (Primaire)' },
    { id: 'primary_cm2', label: 'CM2 (Primaire)' },
    { id: 'secondary_6eme', label: '6ème (Collège)' },
    { id: 'secondary_5eme', label: '5ème (Collège)' },
    { id: 'secondary_4eme', label: '4ème (Collège)' },
    { id: 'secondary_3eme', label: '3ème (Collège)' },
    { id: 'lycee_2nde', label: 'Seconde (Lycée)' },
    { id: 'lycee_1ere', label: 'Première (Lycée)' },
    { id: 'lycee_tles', label: 'Terminale (Lycée)' },
];

interface Props {
    visible: boolean;
    onClose: () => void;
    currentLevel: string;
    onSelectLevel: (levelId: string) => void;
    isLoading?: boolean;
}

export default function LevelSelectionModal({
    visible,
    onClose,
    currentLevel,
    onSelectLevel,
    isLoading,
}: Props) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Choisir mon niveau</Text>
                    <Text style={styles.modalSubtitle}>
                        Sélectionnez votre classe actuelle pour adapter le contenu.
                    </Text>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        {LEVELS.map((level) => (
                            <TouchableOpacity
                                key={level.id}
                                style={[
                                    styles.optionButton,
                                    currentLevel === level.id && styles.selectedOption,
                                ]}
                                onPress={() => onSelectLevel(level.id)}
                                disabled={isLoading}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        currentLevel === level.id && styles.selectedOptionText,
                                    ]}
                                >
                                    {level.label}
                                </Text>
                                {currentLevel === level.id && (
                                    <Text style={styles.checkIcon}>✅</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: height * 0.7, // Take up 70% of screen height
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        color: '#2c3e50',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#7f8c8d',
        textAlign: 'center',
        marginBottom: 20,
    },
    scrollView: {
        width: '100%',
    },
    optionButton: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#f8f9fa',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    selectedOption: {
        backgroundColor: '#ebf5fb',
        borderColor: '#3498db',
    },
    optionText: {
        fontSize: 16,
        color: '#2c3e50',
        fontWeight: '500',
    },
    selectedOptionText: {
        color: '#3498db',
        fontWeight: 'bold',
    },
    checkIcon: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 15,
        padding: 15,
        backgroundColor: '#ecf0f1',
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#7f8c8d',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
