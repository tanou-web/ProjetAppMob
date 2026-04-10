import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { aiService, ChatMessage } from '../src/services/aiService';
import { useAuthStore } from '../src/store/authStore';

export default function ChatbotScreen() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [subject, setSubject] = useState<string | undefined>();
    const scrollViewRef = useRef<ScrollView>(null);
    const user = useAuthStore((state) => state.user);

    // Welcome message
    useEffect(() => {
        const welcomeMessage: ChatMessage = {
            role: 'assistant',
            content: `Bonjour ${user?.first_name || 'élève'} ! 👋\n\nJe suis ton assistant IA. Pose-moi des questions sur tes cours, demande-moi d'expliquer un concept, ou demande de l'aide pour un exercice.\n\nExemples:\n• Comment calculer une fraction ?\n• Explique-moi le théorème de Pythagore\n• Aide-moi avec les conjugaisons`,
            timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
    }, [user]);

    const sendMessage = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'student',
            content: inputText.trim(),
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await aiService.sendChatMessage(
                userMessage.content,
                subject,
                undefined,
                messages
            );

            setMessages((prev) => [...prev, response]);

            // Scroll to bottom
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error: any) {
            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: `Désolé, une erreur s'est produite: ${error.message}`,
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessage = (message: ChatMessage, index: number) => {
        const isStudent = message.role === 'student';

        return (
            <View
                key={index}
                style={[
                    styles.messageBubble,
                    isStudent ? styles.studentBubble : styles.assistantBubble,
                ]}
            >
                <View style={styles.messageHeader}>
                    <Ionicons
                        name={isStudent ? 'person-circle' : 'sparkles'}
                        size={20}
                        color={isStudent ? '#3498db' : '#9b59b6'}
                    />
                    <Text style={styles.messageRole}>
                        {isStudent ? 'Toi' : 'Assistant IA'}
                    </Text>
                </View>
                <Text style={styles.messageText}>{message.content}</Text>
                {message.timestamp && (
                    <Text style={styles.messageTime}>
                        {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Ionicons name="sparkles" size={24} color="#9b59b6" />
                    <Text style={styles.headerTitle}>Assistant IA</Text>
                </View>
                <TouchableOpacity style={styles.statusButton}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>En ligne</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={styles.chatContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}
            >
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.map((message, index) => renderMessage(message, index))}

                    {isLoading && (
                        <View style={[styles.messageBubble, styles.assistantBubble]}>
                            <View style={styles.typingIndicator}>
                                <ActivityIndicator size="small" color="#9b59b6" />
                                <Text style={styles.typingText}>L'IA réfléchit...</Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Pose ta question..."
                        placeholderTextColor="#95a5a6"
                        multiline
                        maxLength={500}
                        editable={!isLoading}
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
                        ]}
                        onPress={sendMessage}
                        disabled={!inputText.trim() || isLoading}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color={!inputText.trim() || isLoading ? '#95a5a6' : '#fff'}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginLeft: 10,
    },
    statusButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d5f4e6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#27ae60',
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        color: '#27ae60',
        fontWeight: '600',
    },
    chatContainer: {
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 15,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
    },
    studentBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#3498db',
    },
    assistantBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ecf0f1',
    },
    messageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    messageRole: {
        fontSize: 12,
        fontWeight: '600',
        color: '#7f8c8d',
        marginLeft: 6,
    },
    messageText: {
        fontSize: 15,
        color: '#2c3e50',
        lineHeight: 22,
    },
    messageTime: {
        fontSize: 10,
        color: '#95a5a6',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typingText: {
        fontSize: 14,
        color: '#7f8c8d',
        marginLeft: 10,
        fontStyle: 'italic',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ecf0f1',
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        maxHeight: 100,
        marginRight: 10,
        color: '#2c3e50',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#9b59b6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#ecf0f1',
    },
});
