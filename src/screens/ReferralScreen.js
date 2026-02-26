import { Image } from 'expo-image';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRewards } from '../context/RewardsContext';
import * as Clipboard from 'expo-clipboard';
import { theme } from '../theme';

const ReferralScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { referralCode } = useRewards();

    const handleCopy = async () => {
        await Clipboard.setStringAsync(referralCode);
        alert('Referral code copied to clipboard!');
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Hey! Use my referral code ${referralCode} to get 500 Velora Coins on your first purchase! Download Velora now: https://velora.shop`
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Refer & Earn</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=800' }}
                    style={styles.heroImage}
                />

                <Text style={styles.title}>Invite Friends, Get Rewards</Text>
                <Text style={styles.subtitle}>
                    Share your code with friends. When they sign up and make their first purchase, you both get 500 Velora Coins!
                </Text>

                <View style={styles.codeCard}>
                    <Text style={styles.codeLabel}>Your Referral Code</Text>
                    <View style={styles.codeRow}>
                        <Text style={styles.codeText}>{referralCode}</Text>
                        <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
                            <MaterialCommunityIcons name="content-copy" size={20} color="#007BFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                    <Text style={styles.shareBtnText}>Share Invitation</Text>
                    <Ionicons name="share-social-outline" size={20} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.howItWorks}>
                    <Text style={styles.sectionTitle}>How it works</Text>

                    <View style={styles.step}>
                        <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
                        <View style={styles.stepText}>
                            <Text style={styles.stepTitle}>Send Invitation</Text>
                            <Text style={styles.stepSub}>Share your code with friends via any app.</Text>
                        </View>
                    </View>

                    <View style={styles.step}>
                        <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
                        <View style={styles.stepText}>
                            <Text style={styles.stepTitle}>Friend Signs Up</Text>
                            <Text style={styles.stepSub}>They use your code during signup or checkout.</Text>
                        </View>
                    </View>

                    <View style={styles.step}>
                        <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
                        <View style={styles.stepText}>
                            <Text style={styles.stepTitle}>Both Get Coins</Text>
                            <Text style={styles.stepSub}>You'll receive 500 coins once their first order is delivered.</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7'
    },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
    content: { padding: 24, alignItems: 'center' },
    heroImage: { width: '100%', height: 200, borderRadius: 20, marginBottom: 30 },
    title: { fontSize: 24, fontWeight: '800', color: '#000', textAlign: 'center' },
    subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 10, lineHeight: 22 },
    codeCard: {
        backgroundColor: '#F8F9FF',
        width: '100%',
        padding: 24,
        borderRadius: 20,
        marginTop: 30,
        borderWidth: 1,
        borderColor: '#E8EAF6',
        alignItems: 'center'
    },
    codeLabel: { fontSize: 12, fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 1 },
    codeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    codeText: { fontSize: 32, fontWeight: '900', color: '#000', letterSpacing: 2 },
    copyBtn: { marginLeft: 16, padding: 8 },
    shareBtn: {
        backgroundColor: '#000',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        marginTop: 20
    },
    shareBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', marginRight: 10 },
    howItWorks: { width: '100%', marginTop: 40 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#000', marginBottom: 20 },
    step: { flexDirection: 'row', marginBottom: 24 },
    stepNum: {
        width: 32, height: 32, borderRadius: 16, backgroundColor: '#F2F2F7',
        justifyContent: 'center', alignItems: 'center', marginRight: 16
    },
    stepNumText: { fontSize: 14, fontWeight: '800', color: '#000' },
    stepText: { flex: 1 },
    stepTitle: { fontSize: 16, fontWeight: '700', color: '#000' },
    stepSub: { fontSize: 13, color: '#666', marginTop: 4 }
});

export default ReferralScreen;
