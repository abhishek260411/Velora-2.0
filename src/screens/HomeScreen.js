import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Dimensions,
    Platform,
    Animated
} from 'react-native';
import { theme } from '../theme';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchScreen from './SearchScreen';
import WishlistScreen from './WishlistScreen';
import ProfileScreen from './ProfileScreen';

const { width } = Dimensions.get('window');

// NEW_ARRIVALS removed in favor of dynamic fetching

const HomeScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [newArrivals, setNewArrivals] = useState([]);
    const [activeTab, setActiveTab] = useState('Home');

    React.useEffect(() => {
        const q = query(
            collection(db, "products"),
            where("isNewArrival", "==", true)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const products = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Serialize timestamps to avoid navigation warnings/errors
                    createdAt: data.createdAt?.toDate().toISOString(),
                    updatedAt: data.updatedAt?.toDate().toISOString(),
                    tag: 'NEW'
                };
            });
            setNewArrivals(products);
        });

        return () => unsubscribe();
    }, []);

    const NAV_ITEMS = [
        { id: 'Home', icon: 'home-variant', label: 'Home' },
        { id: 'Discover', icon: 'magnify', label: 'Discover' },
        { id: 'Saved', icon: 'heart-outline', label: 'Saved' },
        { id: 'Profile', icon: 'account-outline', label: 'Profile' },
    ];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Premium Header */}
            {/* Premium Header - Only show on Home tab */}
            {activeTab === 'Home' && (
                <View style={styles.header}>
                    <TouchableOpacity>
                        <MaterialCommunityIcons name="menu" size={26} color={theme.colors.black} />
                    </TouchableOpacity>
                    <Text style={styles.brand}>VELORA</Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity
                            style={styles.iconBtn}
                            onPress={() => setActiveTab('Discover')}
                        >
                            <MaterialCommunityIcons name="magnify" size={26} color={theme.colors.black} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconBtn}
                            onPress={() => navigation.navigate('Cart')}
                        >
                            <MaterialCommunityIcons name="shopping-outline" size={26} color={theme.colors.black} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {activeTab === 'Home' && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
                >
                    {/* Editorial Hero Banner */}
                    <View style={styles.heroContainer}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200' }}
                            style={styles.heroImage}
                        />
                        <View style={styles.heroOverlay}>
                            <Text style={styles.heroTitle}>S/S 2026</Text>
                            <Text style={styles.heroSubtitle}>THE NEW PERFORMANCE LINE</Text>
                        </View>
                    </View>


                    {/* New Arrivals Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>NEW ARRIVALS</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('ProductListing', { category: 'New Arrivals' })}>
                                <Text style={styles.viewAll}>VIEW ALL</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalScroll}
                        >
                            {newArrivals.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.productCard}
                                    onPress={() => {
                                        console.log('Navigating to ProductDetail with item:', JSON.stringify(item, null, 2));
                                        try {
                                            navigation.navigate('ProductDetail', { product: item });
                                        } catch (e) {
                                            console.error('Navigation error:', e);
                                        }
                                    }}
                                >
                                    <View style={styles.imageWrapper}>
                                        <Image source={{ uri: item.image }} style={styles.productImage} />
                                        <View style={styles.tagBox}>
                                            <Text style={styles.tagText}>{item.tag}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <Text style={styles.productPrice}>{item.price}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Category Modular Grid */}
                    <View style={styles.gridContainer}>
                        <Text style={styles.sectionTitle}>CATEGORIES</Text>
                        <View style={styles.gridRow}>
                            <TouchableOpacity
                                style={styles.categoryBox}
                                onPress={() => navigation.navigate('ProductListing', { category: 'Men' })}
                            >
                                <Image source={{ uri: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=400' }} style={styles.catBg} />
                                <View style={styles.catOverlay}>
                                    <Text style={styles.categoryText}>MEN</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.categoryBox}
                                onPress={() => navigation.navigate('ProductListing', { category: 'Women' })}
                            >
                                <Image source={{ uri: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400' }} style={styles.catBg} />
                                <View style={styles.catOverlay}>
                                    <Text style={styles.categoryText}>WOMEN</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.gridRow}>
                            <TouchableOpacity
                                style={styles.categoryBox}
                                onPress={() => navigation.navigate('ProductListing', { category: 'Shoes' })}
                            >
                                <Image source={{ uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' }} style={styles.catBg} />
                                <View style={styles.catOverlay}>
                                    <Text style={styles.categoryText}>SHOES</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.categoryBox}
                                onPress={() => navigation.navigate('ProductListing', { category: 'Accessories' })}
                            >
                                <Image source={{ uri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400' }} style={styles.catBg} />
                                <View style={styles.catOverlay}>
                                    <Text style={styles.categoryText}>ACCESSORIES</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            )}

            {activeTab === 'Discover' && <SearchScreen navigation={navigation} isTab={true} />}
            {activeTab === 'Saved' && <WishlistScreen navigation={navigation} isTab={true} />}
            {activeTab === 'Profile' && <ProfileScreen navigation={navigation} isTab={true} />}

            {/* Floating Modern Tab Bar */}
            <View style={[styles.bottomNavContainer, { bottom: Math.max(insets.bottom, 15) }]}>
                <View style={styles.bottomNavOuter}>
                    <View style={styles.bottomNav}>
                        <View style={styles.navRow}>
                            {NAV_ITEMS.map((item) => {
                                const isActive = activeTab === item.id;
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[styles.navItem, isActive && styles.navItemActive]}
                                        onPress={() => {
                                            // Simple LayoutAnimation could be added here if needed, 
                                            // but state change triggers re-render which is enough for now.
                                            setActiveTab(item.id);
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <View style={[styles.iconContainer, isActive && styles.iconBubble]}>
                                            <MaterialCommunityIcons
                                                name={isActive ? item.icon.replace('-outline', '') : item.icon}
                                                size={24}
                                                color={isActive ? theme.colors.white : theme.colors.black}
                                            />
                                            {isActive && (
                                                <Text style={styles.navLabel}>{item.label}</Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </View>
            </View>
        </View>
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
        backgroundColor: theme.colors.white,
    },
    brand: {
        ...theme.typography.header,
        fontSize: 22,
        letterSpacing: 4,
    },
    headerIcons: {
        flexDirection: 'row',
    },
    iconBtn: {
        marginLeft: 15,
    },
    heroContainer: {
        width: '100%',
        height: 300,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        position: 'absolute',
        bottom: 30,
        left: 20,
    },
    heroTitle: {
        ...theme.typography.header,
        color: theme.colors.white,
        fontSize: 40,
        lineHeight: 40,
    },
    heroSubtitle: {
        ...theme.typography.subHeader,
        color: theme.colors.white,
        fontSize: 12,
        letterSpacing: 2,
    },
    searchWrapper: {
        padding: 15,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    searchBar: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.gray,
        borderRadius: 8,
        paddingHorizontal: 15,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: theme.colors.black,
    },
    section: {
        marginTop: 30,
        paddingLeft: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        ...theme.typography.subHeader,
        fontSize: 14,
        letterSpacing: 1.5,
    },
    viewAll: {
        ...theme.typography.body,
        fontSize: 12,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    horizontalScroll: {
        paddingRight: 20,
    },
    productCard: {
        width: width * 0.45,
        marginRight: 15,
    },
    imageWrapper: {
        width: '100%',
        height: 240,
        backgroundColor: theme.colors.gray,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 12,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    tagBox: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: theme.colors.black,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    tagText: {
        color: theme.colors.white,
        fontSize: 10,
        fontWeight: '900',
    },
    productName: {
        ...theme.typography.body,
        fontWeight: '600',
        color: theme.colors.black,
        fontSize: 13,
    },
    productPrice: {
        ...theme.typography.body,
        fontSize: 12,
        marginTop: 4,
    },
    gridContainer: {
        marginTop: 40,
        paddingHorizontal: 20,
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    categoryBox: {
        width: '48%',
        height: 200,
        backgroundColor: theme.colors.black,
        borderRadius: 8,
        overflow: 'hidden',
    },
    catBg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        opacity: 0.8,
    },
    catOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    categoryText: {
        ...theme.typography.header,
        fontSize: 22,
        color: theme.colors.white,
        letterSpacing: 2,
    },
    scrollContent: {
        // paddingBottom handled dynamically
    },
    bottomNavContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 100,
    },
    bottomNavOuter: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 40,
        backgroundColor: theme.colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    bottomNav: {
        width: '100%',
        height: 70,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
    },
    navItem: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navItemActive: {
        flex: 1.5, // Grow active item slightly
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50, // Updated to standard pill radius
        overflow: 'hidden', // Ensure background doesn't bleed
    },
    iconBubble: {
        backgroundColor: theme.colors.black,
    },
    navLabel: {
        color: theme.colors.white,
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 8,
    }
});

export default HomeScreen;
