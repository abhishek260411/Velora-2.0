import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRewards } from '../context/RewardsContext';
import * as Clipboard from 'expo-clipboard';
import { theme } from '../theme';

const CouponsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { coupons } = useRewards();

    const handleCopy = async (code) => {
        await Clipboard.setStringAsync(code);
        alert(`Coupon ${code} copied!`);
    };

    const renderItem = ({ item }) => (
        <View style={styles.couponCard}>
            <View style={styles.couponLeft}>
                <Text style={styles.discountText}>{item.discount}%</Text>
                <Text style={styles.offLabel}>OFF</Text>
            </View>
            <View style={styles.couponRight}>
                <Text style={styles.couponTitle}>{item.title}</Text>
                <Text style={styles.couponDesc}>{item.description}</Text>
                <View style={styles.expiryRow}>
                    <Ionicons name="time-outline" size={14} color="#8E8E93" />
                    <Text style={styles.expiryText}>Expires: {item.expiryDate}</Text>
                </View>
                <View style={styles.codeContainer}>
                    <Text style={styles.codeLabel}>{item.code}</Text>
                    <TouchableOpacity onPress={() => handleCopy(item.code)} style={styles.copyBtn}>
                        <Text style={styles.copyBtnText}>COPY</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {item.used && (
                <View style={styles.usedOverlay}>
                    <Text style={styles.usedText}>USED</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Coupons</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={coupons}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="ticket-percent-outline" size={64} color="#CCC" />
                        <Text style={styles.emptyText}>No coupons available</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
    listContent: { padding: 20 },
    couponCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 20,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E8EAF6',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10
    },
    couponLeft: {
        backgroundColor: '#000',
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    discountText: { color: '#FFD700', fontSize: 24, fontWeight: '900' },
    offLabel: { color: '#FFF', fontSize: 12, fontWeight: '700', marginTop: 2 },
    couponRight: { flex: 1, padding: 16 },
    couponTitle: { fontSize: 16, fontWeight: '800', color: '#000' },
    couponDesc: { fontSize: 13, color: '#666', marginTop: 4 },
    expiryRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    expiryText: { fontSize: 11, color: '#8E8E93', marginLeft: 4 },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F2F2F7',
        padding: 8,
        borderRadius: 8,
        marginTop: 12,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#000'
    },
    codeLabel: { fontSize: 14, fontWeight: '900', color: '#000', letterSpacing: 1 },
    copyBtn: { backgroundColor: '#000', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
    copyBtnText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
    usedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    usedText: {
        fontSize: 32,
        fontWeight: '900',
        color: 'rgba(0,0,0,0.3)',
        transform: [{ rotate: '-15deg' }],
        borderWidth: 4,
        borderColor: 'rgba(0,0,0,0.3)',
        padding: 10,
        borderRadius: 10
    },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 16, fontSize: 16, color: '#8E8E93', fontWeight: '500' }
});

export default CouponsScreen;
