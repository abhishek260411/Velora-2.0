import { Image } from 'expo-image';
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

const ChatSupportScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userData } = useAuth();
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: "Hi there! I'm Velora's support assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef();

    const handleSend = () => {
        if (!inputText.trim()) return;

        const userMsg = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        // Simulate bot response
        setTimeout(() => {
            const botMsg = {
                id: (Date.now() + 1).toString(),
                text: "Thank you for reaching out. An agent will be with you shortly. In the meantime, feel free to describe your issue in more detail.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        }, 1500);
    };

    const renderMessage = ({ item }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[styles.messageRow, isUser ? styles.userRow : styles.botRow]}>
                {!isUser && (
                    <View style={styles.botAvatar}>
                        <MaterialCommunityIcons name="robot" size={18} color="#FFF" />
                    </View>
                )}
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
                    <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>{item.text}</Text>
                    <Text style={[styles.timeText, isUser ? styles.userTime : styles.botTime]}>
                        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Velora Support</Text>
                    <View style={styles.statusRow}>
                        <View style={styles.onlineDot} />
                        <Text style={styles.statusText}>Online</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.headerAction}>
                    <Ionicons name="ellipsis-vertical" size={20} color="#000" />
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderMessage}
                contentContainerStyle={[styles.listContent, { paddingBottom: 20 }]}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <View style={[styles.inputArea, { paddingBottom: Math.max(insets.bottom, 12) }]}>
                    <TouchableOpacity style={styles.attachBtn}>
                        <Ionicons name="add" size={24} color="#8E8E93" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <Ionicons name="send" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#F2F2F7' },
    backBtn: { width: 40 },
    headerInfo: { flex: 1, marginLeft: 8 },
    headerTitle: { fontSize: 16, fontWeight: '700', color: '#000' },
    statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#34C759', marginRight: 4 },
    statusText: { fontSize: 11, color: '#8E8E93', fontWeight: '500' },
    headerAction: { width: 40, alignItems: 'center' },
    listContent: { padding: 16 },
    messageRow: { flexDirection: 'row', marginBottom: 16, maxWidth: '80%' },
    userRow: { alignSelf: 'flex-end' },
    botRow: { alignSelf: 'flex-start' },
    botAvatar: {
        width: 32, height: 32, borderRadius: 16, backgroundColor: '#000',
        justifyContent: 'center', alignItems: 'center', marginRight: 8, alignSelf: 'flex-end'
    },
    bubble: { padding: 12, borderRadius: 20 },
    userBubble: { backgroundColor: '#000', borderBottomRightRadius: 4 },
    botBubble: { backgroundColor: '#F2F2F7', borderBottomLeftRadius: 4 },
    messageText: { fontSize: 15, lineHeight: 20 },
    userText: { color: '#FFF' },
    botText: { color: '#000' },
    timeText: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
    userTime: { color: 'rgba(255,255,255,0.6)' },
    botTime: { color: '#8E8E93' },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        backgroundColor: '#FFF',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#F2F2F7' },
    attachBtn: {
        width: 36, height: 36, borderRadius: 18, backgroundColor: '#F2F2F7',
        justifyContent: 'center', alignItems: 'center', marginRight: 12
    },
    input: {
        flex: 1,
        backgroundColor: '#F2F2F7',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        maxHeight: 100,
        fontSize: 15,
        color: '#000'
    },
    sendBtn: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#007AFF',
        justifyContent: 'center', alignItems: 'center', marginLeft: 12
    },
    sendBtnDisabled: { backgroundColor: '#E5E5EA' }
});

export default ChatSupportScreen;
