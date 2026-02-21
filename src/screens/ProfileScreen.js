
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const MENU_SECTIONS = [
    {
        title: "SHOPPING",
        items: [
            { icon: 'bag-handle', label: 'My Orders', route: 'MyOrders', color: '#007AFF' },
            { icon: 'heart', label: 'Wishlist', route: 'Wishlist', color: '#FF2D55' },
            { icon: 'location', label: 'Addresses', route: 'AddressBook', color: '#34C759' },
            { icon: 'gift', label: 'My Rewards', route: 'Rewards', color: '#5856D6' },
            { icon: 'time', label: 'Recently Viewed', route: 'RecentlyViewed', color: '#8E8E93' },
        ]
    },

    {
        title: "SUPPORT",
        items: [
            { icon: 'help-circle', label: 'Help Center', route: 'HelpCenter', color: '#8E8E93' },
            { icon: 'chatbox-ellipses', label: 'Live Support', route: 'ChatSupport', color: '#007AFF' },
            { icon: 'bug', label: 'Report an Issue', route: 'ReportIssue', color: '#FF9500' },
        ]
    },
    {
        title: "APP",
        items: [
            { icon: 'settings', label: 'Settings', route: 'Settings', color: '#8E8E93' },
        ]
    }
];

const ProfileScreen = ({ navigation }) => {
    const { userData, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await logout();
                        navigation.replace('Login');
                    }
                }
            ]
        );
    };

    const renderMenuItem = (item, index, isLast) => (
        <TouchableOpacity
            key={index}
            style={[styles.row, !isLast && styles.separator]}
            onPress={() => item.route ? navigation.navigate(item.route) : null}
        >
            <View style={styles.leftContent}>
                <View style={[styles.iconBox, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon} size={18} color="#FFF" />
                </View>
                <Text style={styles.rowTitle}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: userData?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
                            <Ionicons name="pencil" size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.name}>{userData?.displayName || 'Guest User'}</Text>
                    <Text style={styles.email}>{userData?.email || ''}</Text>
                </View>

                {/* Menu Sections */}
                {MENU_SECTIONS.map((section, secIndex) => (
                    <View key={secIndex} style={styles.sectionContainer}>
                        {section.title && <Text style={styles.sectionHeader}>{section.title}</Text>}
                        <View style={styles.section}>
                            {section.items.map((item, index) =>
                                renderMenuItem(item, index, index === section.items.length - 1)
                            )}
                        </View>
                    </View>
                ))}

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Velora v2.0.1</Text>

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
        paddingTop: 60,
        paddingBottom: 12,
        backgroundColor: '#F2F2F7',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0,0,0,0)', // Invisible border for now
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 24,
        marginBottom: 10,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#E1E1E1',
    },
    editBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F2F2F7',
    },
    name: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#8E8E93',
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 13,
        color: '#6D6D72',
        fontWeight: '500',
        marginBottom: 8,
        marginLeft: 20,
    },
    section: {
        backgroundColor: '#FFF',
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
        width: 29,
        height: 29,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rowTitle: {
        fontSize: 16,
        color: '#000',
    },
    logoutBtn: {
        backgroundColor: '#FFF',
        paddingVertical: 14,
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#C6C6C8',
        marginBottom: 24,
        marginTop: 10,
    },
    logoutText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '500',
    },
    versionText: {
        color: '#C7C7CC',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default ProfileScreen;
