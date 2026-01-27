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
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { coursesAPI, exercisesAPI, authAPI } from '../services/endpoints';
import { useNavigation } from '@react-navigation/native';

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
    const navigation = useNavigation<any>();

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

        // Simulate AI Processing
        setTimeout(async () => {
            processCommand(userText);
        }, 1000);
    };

    const processCommand = async (text: string) => {
        const query = text.toLowerCase();
        setIsTyping(false);

        // 1. Logic for Exercise
        if (query.includes('exercice') || query.includes('pratiquer')) {
            addMessage(
                "Bien sûr ! Voici quelques exercices adaptés à ton niveau. Lesquels voudrais-tu essayer ?",
                'ai',
                [
                    { label: 'Voir mes cours', action: () => navigation.navigate('CoursesTab') },
                    { label: 'Révisions urgentes', action: () => navigation.navigate('RevisionTab') },
                ]
            );
            return;
        }

        // 2. Logic for Course
        if (query.includes('cours') || query.includes('apprendre')) {
            addMessage(
                "Je peux t'aider à trouver le bon cours. Veux-tu voir la liste des matières disponibles ?",
                'ai',
                [
                    { label: 'Liste des cours', action: () => navigation.navigate('CoursesTab') },
                ]
            );
            return;
        }

        // 3. Logic for Account/Level Update
        if (query.includes('niveau') || query.includes('classe') || query.includes('modifier mon compte')) {
            const currentLevelLabel = user?.level || 'non défini';
            addMessage(
                `Ton niveau actuel est : ${currentLevelLabel}. Veux-tu passer à la classe supérieure ?`,
                'ai',
                [
                    { label: 'Passer en 3ème (CM2+)', action: () => updateLevel('secondary_4') },
                    { label: 'Autre niveau', action: () => addMessage("Dis-moi simplement quelle classe tu souhaites rejoindre.", 'ai') },
                ]
            );
            return;
        }

        // 4. Fallback
        addMessage(
            "Je n'ai pas bien compris. Tu peux me demander :\n• 'Je veux faire un exercice'\n• 'Montre-moi mes cours'\n• 'Changer mon niveau scolaire'",
            'ai'
        );
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
                <Text style={styles.headerTitle}>Tuteur AI</Text>
                <Text style={styles.headerSubtitle}>Toujours là pour t'aider</Text>
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
                <TextInput
                    style={styles.input}
                    placeholder="Pose-moi une question..."
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                <TouchableOpacity
                    style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!inputText.trim()}
                >
                    <Text style={styles.sendButtonText}>Envoyer</Text>
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
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
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
        alignItems: 'flex-end',
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
