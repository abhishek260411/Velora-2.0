import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

const FAQS = [
    {
        q: "How can I track my order?",
        a: "You can track your order by going to 'My Orders' and tapping on 'Track Order' for any active shipment."
    },
    {
        q: "What is the return policy?",
        a: "We offer a 30-day return policy for most items. Items must be in original condition with tags."
    },
    {
        q: "How do I earn Velora coins?",
        a: "You earn 1 coin for every ₹100 spent. You also get bonus coins for referrals and completing your profile."
    },
    {
        q: "Is international shipping available?",
        a: "Currently, we only ship within India. We are working on expanding our reach soon!"
    }
];

const HelpCenterScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState(null);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help Center</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.searchSection}>
                    <Text style={styles.heroTitle}>How can we help?</Text>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#8E8E93" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for help..."
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                </View>

                <View style={styles.supportGrid}>
                    <TouchableOpacity style={styles.supportCard} onPress={() => navigation.navigate('ChatSupport')}>
                        <MaterialCommunityIcons name="chat-processing-outline" size={32} color="#007AFF" />
                        <Text style={styles.supportLabel}>Live Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.supportCard} onPress={() => navigation.navigate('ReportIssue')}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={32} color="#FF3B30" />
                        <Text style={styles.supportLabel}>Report Issue</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.supportCard} onPress={() => Alert.alert('Email sent', 'A support ticket has been created. We will get back to you in 24 hours.')}>
                        <MaterialCommunityIcons name="email-outline" size={32} color="#34C759" />
                        <Text style={styles.supportLabel}>Email Us</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                {FAQS.map((faq, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.faqItem}
                        onPress={() => setExpanded(expanded === index ? null : index)}
                    >
                        <View style={styles.faqHeader}>
                            <Text style={styles.faqQuestion}>{faq.q}</Text>
                            <Ionicons
                                name={expanded === index ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="#8E8E93"
                            />
                        </View>
                        {expanded === index && (
                            <Text style={styles.faqAnswer}>{faq.a}</Text>
                        )}
                    </TouchableOpacity>
                ))}

                <View style={styles.contactFooter}>
                    <Text style={styles.footerText}>Still need help?</Text>
                    <TouchableOpacity style={styles.contactBtn}>
                        <Text style={styles.contactBtnText}>Contact Us</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF'
    },
    backBtn: { width: 40 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
    content: { paddingBottom: 40 },
    searchSection: { backgroundColor: '#FFF', padding: 24, paddingBottom: 30 },
    heroTitle: { fontSize: 24, fontWeight: '800', color: '#000', marginBottom: 20 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        paddingHorizontal: 12,
        height: 50,
        borderRadius: 12
    },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
    supportGrid: {
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'space-between',
        marginTop: -10
    },
    supportCard: {
        backgroundColor: '#FFF',
        width: '31%',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2
    },
    supportLabel: { fontSize: 12, fontWeight: '700', marginTop: 8, color: '#000' },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#000', margin: 20, marginBottom: 12 },
    faqItem: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E8EAF6'
    },
    faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    faqQuestion: { fontSize: 15, fontWeight: '600', color: '#000', flex: 1, marginRight: 10 },
    faqAnswer: { fontSize: 13, color: '#666', marginTop: 12, lineHeight: 20 },
    contactFooter: { alignItems: 'center', marginTop: 30, paddingHorizontal: 40 },
    footerText: { fontSize: 14, color: '#8E8E93', marginBottom: 12 },
    contactBtn: {
        backgroundColor: '#000',
        width: '100%',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contactBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});

export default HelpCenterScreen;
