import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { useAuthStore } from '../store/authStore';

const LEVELS = [
  { label: 'Primaire 1 (CP1)', value: 'primary_1' },
  { label: 'Primaire 2 (CP2)', value: 'primary_2' },
  { label: 'Primaire 3 (CE1)', value: 'primary_3' },
  { label: 'Primaire 4 (CE2)', value: 'primary_4' },
  { label: 'Primaire 5 (CM1)', value: 'primary_5' },
  { label: 'Primaire 6 (CM2)', value: 'primary_6' },
  { label: 'Secondaire 1 (6ème)', value: 'secondary_1' },
  { label: 'Secondaire 2 (5ème)', value: 'secondary_2' },
  { label: 'Secondaire 3 (4ème)', value: 'secondary_3' },
  { label: 'Secondaire 4 (3ème)', value: 'secondary_4' },
  { label: 'Lycée (Seconde)', value: 'lycee_2nde' },
  { label: 'Lycée (Première)', value: 'lycee_1ere' },
  { label: 'Lycée (Terminale)', value: 'lycee_tles' },
];

export default function RegisterScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [level, setLevel] = useState('');
  const [showLevelModal, setShowLevelModal] = useState(false);
  const { signup, isLoading } = useAuthStore();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword || !level || !phone) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs, y compris votre téléphone et niveau');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
      return;
    }

    try {
      await signup(email, password, firstName, lastName, level, phone);
      Alert.alert('Succès', 'Compte créé avec succès !', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error: any) {
      const data = error.response?.data;
      let errorMessage = 'Une erreur est survenue lors de l\'inscription.';

      if (data && typeof data === 'object') {
        // Formater les erreurs de champs (ex: {email: ["..."]})
        errorMessage = Object.keys(data)
          .map(key => {
            const fieldName = key === 'email' ? 'Email' :
              key === 'password' ? 'Mot de passe' :
                key === 'phone' ? 'Téléphone' :
                  key === 'level' ? 'Niveau' : key;
            return `${fieldName}: ${data[key]}`;
          })
          .join('\n');
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Erreur d\'inscription', errorMessage);
    }
  };

  const getLevelLabel = (value: string) => {
    const found = LEVELS.find(l => l.value === value);
    return found ? found.label : 'Sélectionnez votre niveau';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Intelligent Tutor</Text>
      <Text style={styles.subtitle}>Créer un compte</Text>

      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
        editable={!isLoading}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
        editable={!isLoading}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!isLoading}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        value={phone}
        onChangeText={setPhone}
        editable={!isLoading}
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        style={styles.levelSelector}
        onPress={() => !isLoading && setShowLevelModal(true)}
      >
        <Text style={[styles.levelSelectorText, !level && styles.placeholderText]}>
          {getLevelLabel(level)}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!isLoading}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>S'inscrire</Text>
        )}
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Vous avez déjà un compte ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Se connecter</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showLevelModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLevelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir votre niveau scolaire</Text>
            <FlatList
              data={LEVELS}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.levelItem}
                  onPress={() => {
                    setLevel(item.value);
                    setShowLevelModal(false);
                  }}
                >
                  <Text style={styles.levelItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowLevelModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  loginLink: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
  },
  levelSelector: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  levelSelectorText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  placeholderText: {
    color: '#bdc3c7',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  levelItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  levelItemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '600',
  },
});
