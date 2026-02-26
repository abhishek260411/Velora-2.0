import { Image } from 'expo-image';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRewards } from '../context/RewardsContext';
import { theme } from '../theme';

const RewardsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { points, totalSpent, unlockedCards, referralCode, getAllCards } = useRewards();

    const activeTier = getAllCards().filter(c => c.isUnlocked).slice(-1)[0] || { title: 'Bronze Member' };

    const handleShareReferral = async () => {
        try {
            await Share.share({
                message: `Shop on Velora using my code ${referralCode} to get 500 bonus coins! Download now: https://velora.shop`
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
                <Text style={styles.headerTitle}>Velora Rewards</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* Points Card */}
                <View style={styles.pointsCard}>
                    <View>
                        <Text style={styles.pointsLabel}>Velora Coins</Text>
                        <View style={styles.pointsRow}>
                            <MaterialCommunityIcons name="molecule" size={32} color="#FFD700" />
                            <Text style={styles.pointsValue}>{points}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('PointsHistory')} style={styles.historyBtn}>
                        <Text style={styles.historyText}>History</Text>
                        <Ionicons name="chevron-forward" size={16} color="#007BFF" />
                    </TouchableOpacity>
                </View>

                {/* Tier Overview */}
                <TouchableOpacity
                    style={styles.tierCard}
                    onPress={() => navigation.navigate('RewardCards')}
                >
                    <View style={styles.tierInfo}>
                        <Text style={styles.tierLabel}>Current Status</Text>
                        <Text style={styles.tierValue}>{activeTier.title}</Text>
                    </View>
                    <View style={styles.tierAction}>
                        <Text style={styles.tierActionText}>My Membership</Text>
                        <Ionicons name="card-outline" size={24} color="#000" />
                    </View>
                </TouchableOpacity>

                {/* Grid Menu */}
                <View style={styles.menuGrid}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Coupons')}>
                        <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                            <MaterialCommunityIcons name="ticket-percent-outline" size={28} color="#1976D2" />
                        </View>
                        <Text style={styles.menuLabel}>My Coupons</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Referral')}>
                        <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                            <MaterialCommunityIcons name="gift-outline" size={28} color="#2E7D32" />
                        </View>
                        <Text style={styles.menuLabel}>Refer & Earn</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Offers')}>
                        <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                            <MaterialCommunityIcons name="fire" size={28} color="#F57C00" />
                        </View>
                        <Text style={styles.menuLabel}>Special Offers</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MyOrders')}>
                        <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
                            <MaterialCommunityIcons name="package-variant" size={28} color="#7B1FA2" />
                        </View>
                        <Text style={styles.menuLabel}>Get Points</Text>
                    </TouchableOpacity>
                </View>

                {/* Refer Card */}
                <View style={styles.referCard}>
                    <View style={styles.referTextContainer}>
                        <Text style={styles.referTitle}>Refer a Friend</Text>
                        <Text style={styles.referSub}>Earn 500 coins for every friend who joins!</Text>
                        <TouchableOpacity style={styles.shareBtn} onPress={handleShareReferral}>
                            <Text style={styles.shareBtnText}>Invite Now</Text>
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=200' }}
                        style={styles.referImage}
                    />
                </View>

                {/* Quick Missions */}
                <Text style={styles.sectionTitle}>Quick Missions</Text>
                <View style={styles.missionCard}>
                    <View style={styles.missionInfo}>
                        <MaterialCommunityIcons name="star-circle" size={28} color="#007BFF" />
                        <View style={{ marginLeft: 12 }}>
                            <Text style={styles.missionTitle}>Complete Profile</Text>
                            <Text style={styles.missionPoints}>Earn 50 coins</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.missionBtn}>
                        <Text style={styles.missionBtnText}>Go</Text>
                    </TouchableOpacity>
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
    content: { padding: 20 },
    pointsCard: {
        backgroundColor: '#F8F9FF',
        borderRadius: 20,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E8EAF6'
    },
    pointsLabel: { fontSize: 14, color: '#666', fontWeight: '500' },
    pointsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    pointsValue: { fontSize: 36, fontWeight: '900', marginLeft: 8, color: '#000' },
    historyBtn: { flexDirection: 'row', alignItems: 'center' },
    historyText: { fontSize: 13, color: '#007BFF', fontWeight: '600', marginRight: 4 },
    tierCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#F2F2F7',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2
    },
    tierLabel: { fontSize: 12, color: '#8E8E93', fontWeight: '600', textTransform: 'uppercase' },
    tierValue: { fontSize: 18, fontWeight: '800', color: '#000', marginTop: 2 },
    tierAction: { alignItems: 'center' },
    tierActionText: { fontSize: 10, color: '#666', marginBottom: 4 },
    menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 25 },
    menuItem: { width: '23%', alignItems: 'center', marginBottom: 15 },
    iconBox: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    menuLabel: { fontSize: 11, color: '#333', fontWeight: '600', textAlign: 'center' },
    referCard: {
        backgroundColor: '#000',
        borderRadius: 20,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 30
    },
    referTextContainer: { flex: 1 },
    referTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
    referSub: { fontSize: 12, color: '#CCC', marginTop: 4, marginBottom: 16 },
    shareBtn: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, alignSelf: 'flex-start' },
    shareBtnText: { color: '#000', fontWeight: '700', fontSize: 12 },
    referImage: { width: 100, height: 100, borderRadius: 50, position: 'absolute', right: -20, opacity: 0.8 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#000', marginBottom: 15 },
    missionCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F2F2F7',
        marginBottom: 15
    },
    missionInfo: { flexDirection: 'row', alignItems: 'center' },
    missionTitle: { fontSize: 14, fontWeight: '700', color: '#000' },
    missionPoints: { fontSize: 12, color: '#666' },
    missionBtn: { backgroundColor: '#F2F2F7', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    missionBtnText: { fontSize: 12, fontWeight: '700', color: '#000' }
});

export default RewardsScreen;
