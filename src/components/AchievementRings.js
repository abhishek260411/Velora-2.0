import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

/**
 * Design 1: The "Hero Ring"
 * A large, central progress ring intended for the main user Level/Status.
 * Uses a border-trick for the visual style (simplified for no-dependency).
 */
export const HeroRing = ({ level = "5", progress = 75, label = "Velora Elite" }) => {
    return (
        <View style={styles.heroContainer}>
            <View style={styles.heroRingOuter}>
                <View style={styles.heroRingInner}>
                    <Text style={styles.heroLevel}>{level}</Text>
                    <Text style={styles.heroLabel}>Lvl</Text>
                </View>
                {/* Simulated Progress Indicator (Visual only for mock) */}
                <View style={[styles.progressDot, { top: 5, right: 15 }]} />
            </View>
            <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>{label}</Text>
                <Text style={styles.heroSubtitle}>250 points to next tier</Text>
            </View>
        </View>
    );
};

/**
 * Design 2: "Activity Row"
 * Three smaller rings for specific daily/weekly goals.
 */
export const ActivityRow = () => {
    const activities = [
        { id: 1, icon: 'shopping-outline', color: '#FF6B6B', label: 'Orders' },
        { id: 2, icon: 'star-outline', color: '#4ECDC4', label: 'Reviews' },
        { id: 3, icon: 'fire', color: '#FFE66D', label: 'Streak' },
    ];

    return (
        <View style={styles.rowContainer}>
            {activities.map((act) => (
                <View key={act.id} style={styles.statItem}>
                    <View style={[styles.miniRing, { borderColor: act.color }]}>
                        <MaterialCommunityIcons name={act.icon} size={20} color={theme.colors.black} />
                    </View>
                    <Text style={styles.miniLabel}>{act.label}</Text>
                </View>
            ))}
        </View>
    );
};

/**
 * Design 3: "Compact Floating Card"
 * A sleek, horizontal card that fits nicely between sections.
 */
export const AchievementCard = () => {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardIconBox}>
                <MaterialCommunityIcons name="trophy-variant-outline" size={24} color="#D4AF37" />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Achievement Unlocked</Text>
                <Text style={styles.cardDesc}>Trendsetter: Bought 3 items from New Arrivals</Text>
            </View>
            <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>+50</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // Hero Styles
    heroContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginVertical: 10,
        marginHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    heroRingOuter: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 8,
        borderColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderTopColor: theme.colors.primary || 'black', // Simulated progress
        borderRightColor: theme.colors.primary || 'black',
    },
    heroRingInner: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: '#fafafa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroLevel: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.black,
    },
    heroLabel: {
        fontSize: 10,
        color: '#666',
        textTransform: 'uppercase',
    },
    progressDot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.primary || 'black',
    },
    heroTextContainer: {
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.black,
    },
    heroSubtitle: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },

    // Row Styles
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 16,
        marginVertical: 10,
    },
    statItem: {
        alignItems: 'center',
    },
    miniRing: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    miniLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#444',
    },

    // Card Styles
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A', // Dark premium
        padding: 16,
        marginHorizontal: 20,
        borderRadius: 16,
        marginVertical: 10,
    },
    cardIconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    cardDesc: {
        color: '#aaa',
        fontSize: 11,
    },
    cardBadge: {
        backgroundColor: '#D4AF37',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    cardBadgeText: {
        color: 'black',
        fontSize: 11,
        fontWeight: 'bold',
    },
});
