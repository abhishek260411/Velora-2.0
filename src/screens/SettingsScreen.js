import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [notifications, setNotifications] = useState(true);
    const [location, setLocation] = useState(true);

    const SettingItem = ({ title, value, onValueChange, type = 'link', icon, color, isLast, onPress }) => (
        <TouchableOpacity
            style={[styles.row, !isLast && styles.separator]}
            onPress={onPress || (() => type === 'link' ? null : onValueChange(!value))}
            disabled={type === 'switch' && !onPress}
        >
            <View style={styles.leftContent}>
                <View style={[styles.iconBox, { backgroundColor: color }]}>
                    <Ionicons name={icon} size={18} color="#FFF" />
                </View>
                <Text style={styles.rowTitle}>{title}</Text>
            </View>

            {type === 'switch' ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                    thumbColor="#FFF"
                />
            ) : (
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <Text style={styles.sectionHeader}>PREFERENCES</Text>
                <View style={styles.section}>
                    <SettingItem
                        title="Notifications"
                        icon="notifications"
                        color="#FF3B30"
                        onPress={() => navigation.navigate('NotificationSettings')}
                    />
                    <SettingItem
                        title="Language"
                        icon="globe-outline"
                        color="#007BFF"
                        isLast
                    />
                </View>

                <Text style={styles.sectionHeader}>ACCOUNT</Text>
                <View style={styles.section}>
                    <SettingItem
                        title="Personal Information"
                        icon="person"
                        color="#AF52DE"
                        onPress={() => navigation.navigate('EditProfile')}
                    />
                    <SettingItem
                        title="Address Book"
                        icon="location"
                        color="#34C759"
                        onPress={() => navigation.navigate('AddressBook')}
                    />
                    <SettingItem
                        title="Privacy & Security"
                        icon="shield-checkmark"
                        color="#8E8E93"
                        isLast
                    />
                </View>

                <Text style={styles.sectionHeader}>SUPPORT & LEGAL</Text>
                <View style={styles.section}>
                    <SettingItem
                        title="Help Center"
                        icon="help-circle"
                        color="#5856D6"
                        onPress={() => navigation.navigate('HelpCenter')}
                    />
                    <SettingItem
                        title="Terms of Service"
                        icon="document-text"
                        color="#8E8E93"
                        onPress={() => Alert.alert("Terms of Service", "Our full Terms of Service can be found on our website.")}
                    />
                    <SettingItem
                        title="Privacy Policy"
                        icon="lock-closed"
                        color="#34C759"
                        isLast
                        onPress={() => Alert.alert("Privacy Policy", "We value your privacy. Read our detailed policy on our website.")}
                    />
                </View>

                <TouchableOpacity style={styles.deleteBtn}>
                    <Text style={styles.deleteText}>Delete Account</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Velora v2.0.1</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
    },
    backBtn: {
        width: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
    },
    scrollContent: {
        paddingVertical: 20,
    },
    sectionHeader: {
        fontSize: 13,
        color: '#6D6D72',
        fontWeight: '500',
        marginBottom: 8,
        marginLeft: 20,
        textTransform: 'uppercase',
    },
    section: {
        backgroundColor: '#FFF',
        marginBottom: 24,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#C6C6C8',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingRight: 16,
        marginLeft: 16,
    },
    separator: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#C6C6C8',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 28,
        height: 28,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rowTitle: {
        fontSize: 16,
        color: '#000',
    },
    deleteBtn: {
        backgroundColor: '#FFF',
        paddingVertical: 14,
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#C6C6C8',
        marginBottom: 20,
    },
    deleteText: {
        fontSize: 16,
        color: '#FF3B30',
        fontWeight: '500',
    },
    version: {
        textAlign: 'center',
        fontSize: 13,
        color: '#8E8E93',
        marginBottom: 40,
    },
});

export default SettingsScreen;
