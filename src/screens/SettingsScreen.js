import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [location, setLocation] = useState(true);

    const SettingRow = ({ title, value, onValueChange, type = 'switch', icon }) => (
        <View style={styles.settingRow}>
            <View style={styles.leftRow}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name={icon} size={22} color={theme.colors.black} />
                </View>
                <Text style={styles.settingTitle}>{title}</Text>
            </View>
            {type === 'switch' ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: theme.colors.gray, true: theme.colors.black }}
                    thumbColor={theme.colors.white}
                />
            ) : (
                <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.lightGray} />
            )}
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color={theme.colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SETTINGS</Text>
                <View style={{ width: 26 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <Text style={styles.sectionHeader}>PREFERENCES</Text>
                <SettingRow
                    title="Push Notifications"
                    value={notifications}
                    onValueChange={setNotifications}
                    icon="bell-outline"
                />
                <SettingRow
                    title="Dark Mode"
                    value={darkMode}
                    onValueChange={setDarkMode}
                    icon="theme-light-dark"
                />
                <SettingRow
                    title="Location Access"
                    value={location}
                    onValueChange={setLocation}
                    icon="map-marker-radius-outline"
                />

                <Text style={[styles.sectionHeader, { marginTop: 30 }]}>ACCOUNT</Text>
                <SettingRow title="Personal Information" type="link" icon="account-circle-outline" />
                <SettingRow title="Payment Methods" type="link" icon="credit-card-outline" />
                <SettingRow title="Privacy & Security" type="link" icon="shield-check-outline" />

                <Text style={[styles.sectionHeader, { marginTop: 30 }]}>SUPPORT</Text>
                <SettingRow title="Help Center" type="link" icon="help-circle-outline" />
                <SettingRow title="Terms of Service" type="link" icon="file-document-outline" />
                <SettingRow title="About VELORA" type="link" icon="information-outline" />

                <TouchableOpacity style={styles.deleteBtn}>
                    <Text style={styles.deleteText}>Delete Account</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Version 2.0.1 (Experimental)</Text>
            </ScrollView>

        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray,
    },
    headerTitle: {
        ...theme.typography.header,
        fontSize: 16,
        letterSpacing: 2,
    },
    content: {
        padding: 24,
    },
    sectionHeader: {
        ...theme.typography.subHeader,
        fontSize: 12,
        letterSpacing: 1.5,
        color: theme.colors.darkGray,
        marginBottom: 15,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
    },
    leftRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.gray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    settingTitle: {
        ...theme.typography.body,
        fontSize: 15,
        fontWeight: '500',
    },
    deleteBtn: {
        marginTop: 40,
        alignItems: 'center',
        paddingVertical: 15,
    },
    deleteText: {
        ...theme.typography.body,
        color: '#FF3B30',
        fontWeight: 'bold',
    },
    version: {
        ...theme.typography.body,
        fontSize: 12,
        color: theme.colors.lightGray,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 40,
    }
});

export default SettingsScreen;
