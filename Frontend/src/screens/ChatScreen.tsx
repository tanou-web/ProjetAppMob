import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Animated,
    Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { useAuthStore } from '../store/authStore';
import { coursesAPI, exercisesAPI, authAPI, recommendationsAPI, aiAPI, endpoints } from '../services/endpoints';
import { useNavigation } from '@react-navigation/native';
import { useCoursesStore } from '../store/coursesStore';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    actions?: { label: string; action: () => void }[];
}

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Bonjour ! Je suis ton tuteur intelligent. Comment puis-je t\'aider aujourd\'hui ?',
            sender: 'ai',
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const { user, updateUser } = useAuthStore();
    const { fetchRecommendations, recommendations, selectExercise, correctExerciseByVision, generateLessonAudio } = useCoursesStore();
    const navigation = useNavigation<any>();
    const [isScanning, setIsScanning] = useState(false);
    const [sound, setSound] = useState<any>(null);
    const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

    useEffect(() => {
        fetchRecommendations();
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    const scrollToBottom = () => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const addMessage = (text: string, sender: 'user' | 'ai', actions?: any) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            text,
            sender,
            timestamp: new Date(),
            actions,
        };
        setMessages((prev) => [...prev, newMessage]);
        scrollToBottom();
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userText = inputText.trim();
        setInputText('');
        addMessage(userText, 'user');
        setIsTyping(true);

        setTimeout(async () => {
            processCommand(userText);
        }, 1000);
    };

    const processCommand = async (text: string) => {
        const query = text.toLowerCase();

        try {
            const conversationHistory = messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

            const aiResponse = await aiAPI.chat(text, undefined, undefined, conversationHistory);

            let responseMessage = aiResponse.message || aiResponse.response || "";
            let responseActions = aiResponse.actions || [];

            if (typeof responseMessage === 'string' && responseMessage.trim().startsWith('{')) {
                try {
                    const parsed = JSON.parse(responseMessage.trim());
                    if (parsed.message) {
                        responseMessage = parsed.message;
                        if (parsed.actions) responseActions = parsed.actions;
                    }
                } catch (e) {
                    console.log('Not a valid JSON message string');
                }
            }

            if (responseMessage.includes("n'est pas disponible") || responseMessage.includes("pas disponible") || responseMessage.toLowerCase().includes("not available")) {
                throw new Error("AI Service Unavailable");
            }

            if (responseActions && Array.isArray(responseActions) && responseActions.length > 0) {
                addMessage(responseMessage, 'ai', responseActions.map((action: any) => ({
                    label: action.label,
                    action: () => {
                        if (action.navigate) {
                            navigation.navigate(action.navigate.screen, action.navigate.params);
                        } else if (action.updateLevel) {
                            updateLevel(action.updateLevel);
                        }
                    }
                })));
                setIsTyping(false);
                return;
            }

            addMessage(responseMessage || "Je suis désolé, je n'ai pas pu comprendre. Peux-tu reformuler ?", 'ai');
        } catch (error) {
            console.error('AI Chat Error:', error);
            if (query.match(/\b(bonjour|salut|hello|hi|hey|bonsoir|coucou)\b/)) {
                addMessage("Bonjour ! Comment puis-je t'aider aujourd'hui ? 😊", 'ai', [
                    { label: 'Faire un exercice', action: () => navigation.navigate('RevisionTab') },
                    { label: 'Voir mes cours', action: () => navigation.navigate('CoursesTab') },
                ]);
            } else {
                addMessage("Je suis là pour t'aider. Tu veux faire un exercice ou voir tes cours ?", 'ai', [
                    { label: '📚 Voir les cours', action: () => navigation.navigate('CoursesTab') },
                    { label: '✏️ Faire un exercice', action: () => navigation.navigate('RevisionTab') },
                ]);
            }
        }
        setIsTyping(false);
    };

    const speakMessage = async (messageId: string, text: string) => {
        console.log('speakMessage triggered for:', messageId);

        // STOP LOGIC: If clicking the same message that's already playing
        if (playingMessageId === messageId && sound) {
            try {
                await sound.unloadAsync();
            } catch (e) {
                console.log('Error unloading sound:', e);
            }
            setPlayingMessageId(null);
            setSound(null);
            return;
        }

        try {
            // Cleanup any existing sound before playing new one
            if (sound) {
                try {
                    await sound.unloadAsync();
                } catch (e) { }
            }

            setPlayingMessageId(messageId);
            const audioUrl = await generateLessonAudio(text);

            if (!audioUrl) {
                setPlayingMessageId(null);
                Alert.alert("Erreur", "Le service vocal est momentanément indisponible.");
                return;
            }

            let finalUrl = audioUrl;
            if (audioUrl.startsWith('/')) {
                finalUrl = endpoints.base.replace('/api', '') + audioUrl;
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: finalUrl },
                { shouldPlay: true }
            );

            setSound(newSound);

            newSound.setOnPlaybackStatusUpdate((status: any) => {
                if (status.didJustFinish) {
                    setPlayingMessageId(null);
                    setSound(null);
                }
            });
        } catch (error) {
            console.error("Chat TTS Error:", error);
            Alert.alert("Erreur Audio", "Impossible de lire le message.");
            setPlayingMessageId(null);
            setSound(null);
        }
    };

    const handleCamera = async () => {
        console.log('handleCamera triggered');
        try {
            const ImagePicker = require('expo-image-picker');
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert('Permission requise', 'L\'accès à la caméra est nécessaire pour scanner ton cahier.');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled && result.assets && result.assets[0].base64) {
                setIsScanning(true);
                addMessage("🔍 Je lis ce que tu as écrit sur ton cahier...", 'ai');

                try {
                    const visionResult = await correctExerciseByVision(0, result.assets[0].base64);
                    if (visionResult.extracted_text) {
                        setInputText(visionResult.extracted_text);
                        addMessage(`J'ai lu : "${visionResult.extracted_text}". Tu n'as plus qu'à cliquer sur Envoyer !`, 'ai');
                    } else {
                        Alert.alert("Scan", "Désolé, je n'ai pas pu lire ton écriture. Essaie d'écrire plus gros ou avec plus de lumière.");
                    }
                } catch (err) {
                    Alert.alert("Erreur Scan", "Le service de lecture photo ne répond pas. Réessaie plus tard.");
                }
                setIsScanning(false);
            }
        } catch (error) {
            console.error('Camera error:', error);
            Alert.alert("Erreur", "Une erreur est survenue lors de l'utilisation de la caméra.");
            setIsScanning(false);
        }
    };

    const updateLevel = async (newLevel: string) => {
        setIsTyping(true);
        try {
            const updatedUser = await authAPI.updateProfile({ level: newLevel });
            updateUser(updatedUser);
            addMessage(`Félicitations ! Ton compte a été mis à jour. Tu es maintenant en : ${newLevel}.`, 'ai');
        } catch (error) {
            addMessage("Désolé, je n'ai pas pu mettre à jour ton niveau. Réessaie plus tard.", 'ai');
        }
        setIsTyping(false);
    };

    const handleQuickExercise = async () => {
        setIsTyping(true);
        addMessage("🚀 Je cherche un exercice adapté pour toi...", 'ai');

        try {
            const recs = await fetchRecommendations();
            if (recs && recs.length > 0) {
                const bestRec = recs[0];
                if (bestRec.content_type === 'exercise') {
                    addMessage(`J'ai trouvé cet exercice pour toi : ${bestRec.content_title}. C'est parti !`, 'ai');
                    setTimeout(() => {
                        navigation.navigate('CoursesTab', {
                            screen: 'Exercise',
                            params: { exerciseId: bestRec.content_id }
                        });
                        setIsTyping(false);
                    }, 1500);
                    return;
                }
            }
            addMessage("Je n'ai pas trouvé d'exercice spécifique. Tu peux explorer le catalogue.", 'ai', [
                { label: 'Voir les cours', action: () => navigation.navigate('CoursesTab') }
            ]);
        } catch (error) {
            addMessage("Désolé, une erreur est survenue.", 'ai');
        }
        setIsTyping(false);
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={[
            styles.messageContainer,
            item.sender === 'user' ? styles.userMessage : styles.aiMessage
        ]}>
            <Text style={[
                styles.messageText,
                item.sender === 'user' ? styles.userMessageText : styles.aiMessageText
            ]}>
                {item.text}
            </Text>
            {item.sender === 'ai' && (
                <TouchableOpacity
                    style={styles.speakerButton}
                    onPress={() => speakMessage(item.id, item.text)}
                >
                    <Text style={styles.speakerIcon}>
                        {playingMessageId === item.id ? '🛑' : '🔊'}
                    </Text>
                </TouchableOpacity>
            )}
            {item.actions && (
                <View style={styles.actionsContainer}>
                    {item.actions.map((act, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.actionButton}
                            onPress={act.action}
                        >
                            <Text style={styles.actionButtonText}>{act.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            <Text style={styles.timestamp}>
                {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.headerTitle}>Tuteur AI</Text>
                        <Text style={styles.headerSubtitle}>Toujours là pour t'aider</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity
                            style={styles.quickExerciseButton}
                            onPress={handleQuickExercise}
                        >
                            <Text style={styles.quickExerciseText}>🚀 Exercice</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.headerLogoutButton}
                            onPress={() => useAuthStore.getState().logout()}
                        >
                            <Text style={styles.headerLogoutText}>Quitter</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={scrollToBottom}
            />

            {isTyping && (
                <View style={styles.typingContainer}>
                    <ActivityIndicator size="small" color="#3498db" />
                    <Text style={styles.typingText}>L'IA réfléchit...</Text>
                </View>
            )}

            <View style={styles.inputContainer}>
                <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={handleCamera}
                    disabled={isScanning || isTyping}
                >
                    <Text style={styles.cameraButtonText}>📸</Text>
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Pose-moi une question..."
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                <TouchableOpacity
                    style={[styles.sendButton, (!inputText.trim() || isScanning || isTyping) && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!inputText.trim() || isScanning || isTyping}
                >
                    {isTyping || isScanning ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.sendButtonText}>Envoyer</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#27ae60',
        fontWeight: '600',
    },
    headerLogoutButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: '#fee2e2',
    },
    headerLogoutText: {
        color: '#ef4444',
        fontSize: 12,
        fontWeight: 'bold',
    },
    quickExerciseButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: '#e0f2fe',
        borderWidth: 1,
        borderColor: '#3498db',
    },
    quickExerciseText: {
        color: '#0284c7',
        fontSize: 12,
        fontWeight: 'bold',
    },
    messagesList: {
        padding: 15,
        paddingBottom: 20,
    },
    messageContainer: {
        maxWidth: '85%',
        padding: 12,
        borderRadius: 20,
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#3498db',
        borderBottomRightRadius: 4,
    },
    aiMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    userMessageText: {
        color: '#fff',
    },
    aiMessageText: {
        color: '#2c3e50',
    },
    timestamp: {
        fontSize: 10,
        color: 'rgba(0,0,0,0.3)',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    speakerButton: {
        position: 'absolute',
        right: 8,
        top: 8,
        padding: 4,
        zIndex: 10,
    },
    speakerIcon: {
        fontSize: 16,
    },
    actionsContainer: {
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    actionButton: {
        backgroundColor: '#ecf0f1',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#3498db',
    },
    actionButtonText: {
        color: '#3498db',
        fontSize: 13,
        fontWeight: '600',
    },
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    typingText: {
        marginLeft: 8,
        fontSize: 12,
        color: '#7f8c8d',
        fontStyle: 'italic',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
    },
    cameraButton: {
        backgroundColor: '#f8f0ff',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#9b59b6',
    },
    cameraButtonText: {
        fontSize: 20,
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        maxHeight: 100,
        fontSize: 15,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#3498db',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
    },
    sendButtonDisabled: {
        backgroundColor: '#bdc3c7',
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
