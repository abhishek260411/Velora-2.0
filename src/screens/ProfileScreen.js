import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import {
    getUserDisplayName,
    getUserInitials,
    getFormattedAddress,
    isProfileComplete,
    getLastLoginFormatted,
    getUserStatsSummary
} from '../utils/userUtils';

const ProfileScreen = ({ navigation }) => {
    const { user, userData, logout } = useAuth();

    // Prevent tab bar from hiding on scroll
    useLayoutEffect(() => {
        navigation.setOptions({
            tabBarStyle: {
                position: 'absolute',
                backgroundColor: theme.colors.white,
                borderTopWidth: 1,
                borderTopColor: theme.colors.lightGray,
                height: 60,
                paddingBottom: 8,
            }
        });
    }, [navigation]);


    const handleLogout = async () => {
        try {
            await logout();
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const stats = getUserStatsSummary(userData);
    const displayName = getUserDisplayName(userData);
    const initials = getUserInitials(userData);
    const lastLogin = getLastLoginFormatted(userData);
    const profileComplete = isProfileComplete(userData);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                scrollEventThrottle={16}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>PROFILE</Text>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    {/* Avatar */}
                    <View style={styles.avatarContainer}>
                        {userData?.photoURL ? (
                            <Image source={{ uri: userData.photoURL }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>{initials}</Text>
                            </View>
                        )}
                    </View>

                    {/* User Info */}
                    <Text style={styles.userName}>{displayName}</Text>
                    <Text style={styles.userEmail}>{userData?.email}</Text>

                    {/* Profile Completion */}
                    {!profileComplete && (
                        <View style={styles.completionBadge}>
                            <MaterialCommunityIcons name="alert-circle" size={16} color={theme.colors.primary} />
                            <Text style={styles.completionText}>Complete your profile</Text>
                        </View>
                    )}
                </View>

                {/* Stats */}
                {stats && (
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.orders}</Text>
                            <Text style={styles.statLabel}>Orders</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.spent}</Text>
                            <Text style={styles.statLabel}>Spent</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.wishlist}</Text>
                            <Text style={styles.statLabel}>Wishlist</Text>
                        </View>
                    </View>
                )}

                {/* User Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ACCOUNT DETAILS</Text>

                    <InfoRow
                        icon="account"
                        label="Full Name"
                        value={userData?.displayName || 'Not set'}
                    />
                    <InfoRow
                        icon="email"
                        label="Email"
                        value={userData?.email}
                    />
                    <InfoRow
                        icon="phone"
                        label="Phone"
                        value={userData?.phone || 'Not set'}
                    />
                    <InfoRow
                        icon="map-marker"
                        label="Address"
                        value={getFormattedAddress(userData) || 'Not set'}
                    />
                </View>

                {/* Metadata */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ACCOUNT INFO</Text>

                    <InfoRow
                        icon="shield-account"
                        label="Role"
                        value={userData?.role?.toUpperCase() || 'CUSTOMER'}
                    />
                    <InfoRow
                        icon="login"
                        label="Last Login"
                        value={lastLogin}
                    />
                    <InfoRow
                        icon="counter"
                        label="Login Count"
                        value={`${userData?.metadata?.loginCount || 0} times`}
                    />
                    <InfoRow
                        icon="account-check"
                        label="Provider"
                        value={userData?.provider?.toUpperCase() || 'EMAIL'}
                    />
                </View>

                {/* Actions */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <MaterialCommunityIcons name="logout" size={20} color={theme.colors.white} />
                    <Text style={styles.logoutButtonText}>LOGOUT</Text>
                </TouchableOpacity>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
};

// Info Row Component
const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
        <View style={styles.infoLeft}>
            <MaterialCommunityIcons name={icon} size={20} color={theme.colors.black} />
            <Text style={styles.infoLabel}>{label}</Text>
        </View>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    scrollContent: {
        paddingBottom: 80, // Extra padding for tab bar
    },
    header: {
        padding: 24,
        paddingTop: 12,
    },
    headerTitle: {
        ...theme.typography.header,
        fontSize: 32,
    },
    profileCard: {
        alignItems: 'center',
        padding: 24,
        marginHorizontal: 24,
        marginBottom: 16,
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.black,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.black,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        ...theme.typography.header,
        fontSize: 32,
        color: theme.colors.white,
    },
    userName: {
        ...theme.typography.header,
        fontSize: 24,
        marginBottom: 4,
    },
    userEmail: {
        ...theme.typography.body,
        color: theme.colors.gray,
    },
    completionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: theme.colors.lightGray,
        borderRadius: 12,
    },
    completionText: {
        ...theme.typography.body,
        fontSize: 12,
        marginLeft: 4,
        color: theme.colors.primary,
    },
    statsContainer: {
        flexDirection: 'row',
        marginHorizontal: 24,
        marginBottom: 24,
        padding: 20,
        backgroundColor: theme.colors.black,
        borderRadius: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        ...theme.typography.header,
        fontSize: 20,
        color: theme.colors.white,
        marginBottom: 4,
    },
    statLabel: {
        ...theme.typography.body,
        fontSize: 12,
        color: theme.colors.white,
        opacity: 0.7,
    },
    statDivider: {
        width: 1,
        backgroundColor: theme.colors.white,
        opacity: 0.2,
    },
    section: {
        marginHorizontal: 24,
        marginBottom: 24,
    },
    sectionTitle: {
        ...theme.typography.header,
        fontSize: 14,
        marginBottom: 12,
        opacity: 0.6,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.lightGray,
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    infoLabel: {
        ...theme.typography.body,
        marginLeft: 12,
        flex: 1,
    },
    infoValue: {
        ...theme.typography.body,
        fontWeight: '600',
        textAlign: 'right',
        flex: 1,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 24,
        padding: 16,
        backgroundColor: theme.colors.black,
        borderRadius: 28,
    },
    logoutButtonText: {
        ...theme.typography.button,
        color: theme.colors.white,
        marginLeft: 8,
    },
    bottomSpacer: {
        height: 40,
    },
});

export default ProfileScreen;
