import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRewards } from '../context/RewardsContext';
import { theme } from '../theme';

const PointsHistoryScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { pointsHistory, points } = useRewards();

    const renderItem = ({ item }) => (
        <View style={styles.historyItem}>
            <View style={[styles.iconContainer, { backgroundColor: item.type === 'earn' ? '#E8F5E9' : '#FFEBEE' }]}>
                <MaterialCommunityIcons
                    name={item.type === 'earn' ? 'plus-circle-outline' : 'minus-circle-outline'}
                    size={24}
                    color={item.type === 'earn' ? '#2E7D32' : '#C62828'}
                />
            </View>
            <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDate}>{new Date(item.date?.seconds * 1000 || item.date).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.itemAmount, { color: item.type === 'earn' ? '#2E7D32' : '#C62828' }]}>
                {item.type === 'earn' ? '+' : '-'}{item.amount}
            </Text>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Points History</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <View style={styles.balanceValueRow}>
                    <MaterialCommunityIcons name="molecule" size={28} color="#FFD700" />
                    <Text style={styles.balanceValue}>{points}</Text>
                </View>
            </View>

            <FlatList
                data={pointsHistory}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="history" size={64} color="#CCC" />
                        <Text style={styles.emptyText}>No points history yet</Text>
                    </View>
                }
            />
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
        borderBottomColor: '#F2F2F7',
    },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
    balanceCard: {
        backgroundColor: '#000',
        margin: 20,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center'
    },
    balanceLabel: { color: '#AAA', fontSize: 14, fontWeight: '600' },
    balanceValueRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    balanceValue: { color: '#FFF', fontSize: 32, fontWeight: '900', marginLeft: 10 },
    listContent: { paddingHorizontal: 20, paddingBottom: 40 },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7'
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    itemInfo: { flex: 1 },
    itemTitle: { fontSize: 15, fontWeight: '600', color: '#000' },
    itemDate: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
    itemAmount: { fontSize: 16, fontWeight: '700' },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 16, fontSize: 16, color: '#8E8E93', fontWeight: '500' }
});

export default PointsHistoryScreen;
