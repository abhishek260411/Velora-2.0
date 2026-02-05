import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView
} from 'react-native';
import { theme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';

const ProfileScreen = ({ navigation, isTab = false }) => {
    const MENU_ITEMS = [
        { id: 'orders', title: 'My Orders', icon: 'package-variant-closed', route: 'MyOrders' },
        { id: 'wishlist', title: 'Wishlist', icon: 'heart-outline', route: 'Wishlist' },
        { id: 'addresses', title: 'Addresses', icon: 'map-marker-outline', route: 'Checkout' }, // Reuse
        { id: 'settings', title: 'Settings', icon: 'cog-outline', route: 'Settings' },
        { id: 'logout', title: 'Logout', icon: 'logout', route: 'Login', color: '#FF3B30' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={isTab && { paddingBottom: 100 }}>
                {/* User Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200' }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.editBtn}>
                            <MaterialCommunityIcons name="pencil" size={16} color={theme.colors.white} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>SNEHAL PINJARI</Text>
                    <Text style={styles.userEmail}>snehal.p@example.com</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>ELITE MEMBER</Text>
                    </View>
                </View>

                {/* Account Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </View>
                    <View style={[styles.statBox, styles.statBorder]}>
                        <Text style={styles.statValue}>4</Text>
                        <Text style={styles.statLabel}>Wishlist</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>2.4k</Text>
                        <Text style={styles.statLabel}>Points</Text>
                    </View>
                </View>

                {/* Menu List */}
                <View style={styles.menuContainer}>
                    {MENU_ITEMS.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            onPress={() => navigation.navigate(item.route)}
                        >
                            <View style={styles.menuLeft}>
                                <View style={styles.iconBox}>
                                    <MaterialCommunityIcons name={item.icon} size={22} color={item.color || theme.colors.black} />
                                </View>
                                <Text style={[styles.menuTitle, item.color && { color: item.color }]}>{item.title}</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.lightGray} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Promo Card */}
                <GlassCard style={styles.promoCard}>
                    <View style={styles.promoContent}>
                        <View>
                            <Text style={styles.promoTitle}>SHARE THE STYLE</Text>
                            <Text style={styles.promoSub}>Get ₹500 for every friend you refer.</Text>
                        </View>
                        <MaterialCommunityIcons name="gift-outline" size={32} color={theme.colors.black} />
                    </View>
                </GlassCard>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: theme.colors.gray,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: theme.colors.white,
    },
    editBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        backgroundColor: theme.colors.black,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.white,
    },
    userName: {
        ...theme.typography.header,
        fontSize: 22,
        letterSpacing: 2,
    },
    userEmail: {
        ...theme.typography.body,
        color: theme.colors.darkGray,
        marginTop: 4,
    },
    badge: {
        marginTop: 15,
        backgroundColor: theme.colors.black,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        ...theme.typography.subHeader,
        fontSize: 10,
        color: theme.colors.white,
        fontWeight: '900',
    },
    statsRow: {
        flexDirection: 'row',
        paddingVertical: 30,
        marginHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statBorder: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: theme.colors.gray,
    },
    statValue: {
        ...theme.typography.header,
        fontSize: 18,
    },
    statLabel: {
        ...theme.typography.body,
        fontSize: 12,
        color: theme.colors.darkGray,
        marginTop: 4,
    },
    menuContainer: {
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.03)',
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.03)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuTitle: {
        ...theme.typography.body,
        fontSize: 15,
        fontWeight: '600',
    },
    promoCard: {
        margin: 24,
        padding: 24,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.03)',
    },
    promoContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    promoTitle: {
        ...theme.typography.header,
        fontSize: 16,
        letterSpacing: 1,
    },
    promoSub: {
        ...theme.typography.body,
        fontSize: 12,
        color: theme.colors.darkGray,
        marginTop: 4,
    }
});

export default ProfileScreen;
