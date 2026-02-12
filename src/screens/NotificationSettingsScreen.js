import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const NotificationSettingsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userData, updateUserProfile } = useAuth();

    const [settings, setSettings] = useState({
        orderUpdates: true,
        promotions: true,
        newsletter: true,
        priceAlerts: false,
        newArrivals: true,
        deliveryStatus: true
    });

    useEffect(() => {
        if (userData?.preferences?.notificationSettings) {
            setSettings(userData.preferences.notificationSettings);
        }
    }, [userData]);

    const handleToggle = async (key, val) => {
        const newSettings = { ...settings, [key]: val };
        setSettings(newSettings);

        // Save to Firestore
        const result = await updateUserProfile({
            'preferences.notificationSettings': newSettings
        });

        if (result.error) {
            Alert.alert('Error', 'Failed to update preferences');
            setSettings(settings); // Rollback
        }
    };

    const SettingRow = ({ title, sub, icon, value, onToggle, isLast }) => (
        <View style={[styles.row, !isLast && styles.separator]}>
            <View style={styles.left}>
                <View style={styles.iconBox}>
                    <MaterialCommunityIcons name={icon} size={22} color="#000" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.sub}>{sub}</Text>
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: '#E5E5EA', true: '#34C759' }}
            />
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Transactional</Text>
                    <Text style={styles.sectionSub}>Stay updated with your orders and shipments.</Text>
                </View>

                <View style={styles.section}>
                    <SettingRow
                        title="Order Updates"
                        sub="Confirmations and status changes"
                        icon="package-variant"
                        value={settings.orderUpdates}
                        onToggle={(v) => handleToggle('orderUpdates', v)}
                    />
                    <SettingRow
                        title="Delivery Status"
                        sub="Real-time tracking notifications"
                        icon="truck-delivery-outline"
                        value={settings.deliveryStatus}
                        onToggle={(v) => handleToggle('deliveryStatus', v)}
                        isLast
                    />
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Marketing & Discovery</Text>
                    <Text style={styles.sectionSub}>Get the best deals and see what's new.</Text>
                </View>

                <View style={styles.section}>
                    <SettingRow
                        title="Promotions"
                        sub="Offers, flash sales, and discounts"
                        icon="tag-outline"
                        value={settings.promotions}
                        onToggle={(v) => handleToggle('promotions', v)}
                    />
                    <SettingRow
                        title="New Arrivals"
                        sub="Be the first to see new collections"
                        icon="sparkles"
                        value={settings.newArrivals}
                        onToggle={(v) => handleToggle('newArrivals', v)}
                    />
                    <SettingRow
                        title="Price Alerts"
                        sub="Notifications when your wishlist items go on sale"
                        icon="bell-ring-outline"
                        value={settings.priceAlerts}
                        onToggle={(v) => handleToggle('priceAlerts', v)}
                    />
                    <SettingRow
                        title="Newsletter"
                        sub="Monthly digest of fashion trends"
                        icon="email-outline"
                        value={settings.newsletter}
                        onToggle={(v) => handleToggle('newsletter', v)}
                        isLast
                    />
                </View>

                <View style={styles.footer}>
                    <MaterialCommunityIcons name="information-outline" size={16} color="#8E8E93" />
                    <Text style={styles.footerText}>
                        You can also manage system-level notifications in your phone's settings.
                    </Text>
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
        backgroundColor: '#FFF',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#C6C6C8',
    },
    backBtn: { width: 40 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
    content: { paddingVertical: 20 },
    sectionHeader: { paddingHorizontal: 20, marginBottom: 12 },
    sectionTitle: { fontSize: 13, color: '#6D6D72', fontWeight: '600', textTransform: 'uppercase' },
    sectionSub: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
    section: { backgroundColor: '#FFF', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#C6C6C8', marginBottom: 25 },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingRight: 16, marginLeft: 20 },
    separator: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#C6C6C8' },
    left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconBox: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#F8F9FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    textContainer: { flex: 1 },
    title: { fontSize: 16, fontWeight: '600', color: '#000' },
    sub: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
    footer: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 10, alignItems: 'center' },
    footerText: { fontSize: 12, color: '#8E8E93', marginLeft: 6, flex: 1 }
});

export default NotificationSettingsScreen;
