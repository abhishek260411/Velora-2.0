import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

const CATEGORIES = [
    "Order Delay",
    "Damaged Product",
    "Wrong Item Received",
    "Refund Issue",
    "App Technical Glitch",
    "Other"
];

const ReportIssueScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const orderId = route.params?.orderId || '';

    const [category, setCategory] = useState('');
    const [subject, setSubject] = useState(orderId ? `Issue with Order #${orderId}` : '');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (!category || !subject || !description) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            Alert.alert(
                'Submitted',
                'Your issue has been reported. A support ticket #VS-' + Math.floor(Math.random() * 90000 + 10000) + ' has been created.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        }, 1500);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Report an Issue</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.categoryGrid}>
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.catBtn, category === cat && styles.catBtnActive]}
                            onPress={() => setCategory(cat)}
                        >
                            <Text style={[styles.catBtnText, category === cat && styles.catBtnTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Subject</Text>
                <TextInput
                    style={styles.input}
                    value={subject}
                    onChangeText={setSubject}
                    placeholder="Briefly describe the issue"
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Provide details about what happened..."
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                />

                <TouchableOpacity style={styles.uploadBtn}>
                    <Ionicons name="camera-outline" size={20} color="#666" />
                    <Text style={styles.uploadText}>Upload Photos (Optional)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.submitBtn, loading && { opacity: 0.7 }]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.submitBtnText}>{loading ? 'Submitting...' : 'Submit Report'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#F2F2F7',
    },
    backBtn: { width: 40 },
    headerTitle: { fontSize: 17, fontWeight: '700', color: '#000' },
    content: { padding: 20 },
    label: { fontSize: 13, fontWeight: '600', color: '#8E8E93', marginBottom: 10, textTransform: 'uppercase', marginTop: 20 },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
    catBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F2F2F7',
        marginRight: 8,
        marginBottom: 8
    },
    catBtnActive: { backgroundColor: '#000' },
    catBtnText: { fontSize: 13, color: '#666', fontWeight: '500' },
    catBtnTextActive: { color: '#FFF' },
    input: {
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#000',
        marginTop: 4
    },
    textArea: { height: 150, paddingTop: 16 },
    uploadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5EA',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        justifyContent: 'center'
    },
    uploadText: { fontSize: 14, color: '#666', marginLeft: 8, fontWeight: '500' },
    submitBtn: {
        backgroundColor: '#000',
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20
    },
    submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});

export default ReportIssueScreen;
