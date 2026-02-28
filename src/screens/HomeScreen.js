import { Image } from 'expo-image';

import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useRewards } from '../context/RewardsContext';
import { useNotifications } from '../context/NotificationContext';
import { db } from '../config/firebase';
import { collection, query, limit, getDocs, where } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const ProductCard = ({ id, title, price, image, isFav = false, onToggleFavorite, product }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetail', { product })}
            activeOpacity={0.8}
        >
            <View style={styles.productImageWrap}>
                <Image source={{ uri: image }} style={styles.productImage} contentFit="cover" cachePolicy="memory-disk" transition={300} placeholder={{ blurhash: 'L9AB*A%N00~q~q-;M{t700~q00Rj' }} />
                <TouchableOpacity
                    style={styles.favBtn}
                    onPress={() => onToggleFavorite?.(id)}
                >
                    <Ionicons
                        name={isFav ? "heart" : "heart-outline"}
                        size={20}
                        color={isFav ? "#FF3B30" : "#000"}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.productTitle} numberOfLines={1}>{title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={[styles.productPrice, { color: product?.originalPrice ? '#FF3B30' : '#8E8E93' }]}>{price}</Text>
                {!!product?.originalPrice && (
                    <Text style={{ fontSize: 12, color: '#C7C7CC', textDecorationLine: 'line-through', marginLeft: 6 }}>
                        {String(product.originalPrice).startsWith('₹') ? product.originalPrice : `₹${product.originalPrice}`}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const HomeScreen = ({ navigation }) => {
    const { userData } = useAuth();
    const { REWARD_CARDS, unlockedCards } = useRewards();
    const { unreadCount } = useNotifications();

    const [selectedCategory, setSelectedCategory] = useState('Men');
    const [favorites, setFavorites] = useState({});
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [loadingTrending, setLoadingTrending] = useState(true);
    const [trendingError, setTrendingError] = useState(null);

    const firstName = userData?.displayName?.split(' ')[0] || 'User';

    React.useEffect(() => {
        fetchTrending();
    }, []);

    const fetchTrending = async () => {
        try {
            const q = query(
                collection(db, 'products'),
                where('isTrending', '==', true),
                limit(10)
            );
            const snapshot = await getDocs(q);
            let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (items.length === 0) {
                const fallbackQ = query(
                    collection(db, 'products'),
                    where('trending', '==', true),
                    limit(10)
                );
                const fallbackSnapshot = await getDocs(fallbackQ);
                items = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                if (items.length === 0) {
                    console.warn('No trending docs found (neither isTrending nor trending=true)');
                }
            }

            setTrendingProducts(items);
        } catch (error) {
            console.error("Error fetching trending:", error);
            setTrendingProducts([]);
            setTrendingError(error);
        } finally {
            setLoadingTrending(false);
        }
    };

    // Sample Data
    const categories = ['Men', 'Women', 'Shoes', 'Accessories', 'Sale'];

    const handleToggleFavorite = (id) => {
        setFavorites(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const renderHeroCard = (title, subtitle, image, category) => (
        <TouchableOpacity style={styles.heroCard} activeOpacity={0.9} onPress={() => navigation.navigate('ProductListing', { category })}>
            <Image source={{ uri: image }} style={styles.heroImage} contentFit="cover" cachePolicy="memory-disk" transition={300} placeholder={{ blurhash: 'L9AB*A%N00~q~q-;M{t700~q00Rj' }} />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
                <Text style={styles.heroSubtitle}>{subtitle}</Text>
                <Text style={styles.heroTitle}>{title}</Text>
                <View style={[styles.shopNowBtn, { backgroundColor: '#000' }]}>
                    <Text style={[styles.shopNowText, { color: '#fff' }]}>Shop Now</Text>
                    <MaterialCommunityIcons name="arrow-right" size={16} color="#fff" />
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderProductCard = (product) => (
        <ProductCard
            key={product.id}
            id={product.id}
            title={product.name}
            price={`₹${product.price}`}
            displayPrice={`₹${product.price}`}
            image={product.image}
            isFav={!!favorites[product.id]}
            onToggleFavorite={handleToggleFavorite}
            product={product}
        />
    );

    const renderRewardCard = (tier) => {
        const card = REWARD_CARDS[tier];
        const isUnlocked = unlockedCards.includes(tier);

        return (
            <TouchableOpacity
                key={tier}
                style={styles.rewardCardContainer}
                onPress={() => navigation.navigate('Rewards')}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={card.gradientColors}
                    style={styles.rewardCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{card.title.toUpperCase()}</Text>
                        <MaterialCommunityIcons
                            name={isUnlocked ? "record-circle" : "lock-outline"}
                            size={20}
                            color="rgba(255,255,255,0.8)"
                        />
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={styles.cardNumber}>{card.cardNumber}</Text>
                    </View>
                    <View style={styles.cardFooter}>
                        <Text style={styles.discountText}>{card.discount}% OFF</Text>
                        <Text style={styles.statusText}>{isUnlocked ? 'UNLOCKED' : 'LOCKED'}</Text>
                    </View>
                    <View style={[styles.cardOrb, { backgroundColor: card.orbColor }]} />
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => navigation.navigate('ProfileTab')}
                    >
                        <Image
                            source={{ uri: userData?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' }}
                            style={{ width: 44, height: 44, borderRadius: 22, marginRight: 12, backgroundColor: '#E1E1E1' }}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                        />
                        <View>
                            <Text style={styles.username}>{firstName}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Ionicons name="notifications-outline" size={24} color="#000" />
                        {unreadCount > 0 && <View style={styles.badge} />}
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Hero Section */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.heroScroll}
                        decelerationRate="fast"
                        snapToInterval={width - 40}
                    >
                        {renderHeroCard("Men's Collection", "NEW ARRIVALS", "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800", "Men")}
                        {renderHeroCard("Women's Collection", "TRENDING NOW", "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800", "Women")}
                    </ScrollView>

                    {/* Categories Chips */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.catScroll}
                    >
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[styles.catChip, cat === selectedCategory && styles.activeCatChip]}
                                onPress={() => {
                                    setSelectedCategory(cat);
                                    navigation.navigate('ProductListing', { category: cat });
                                }}
                            >
                                <Text style={[styles.catText, cat === selectedCategory && styles.activeCatText]}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Section: Trending */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Trending Now</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Trending')}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsScroll}>
                        {loadingTrending ? (
                            <ActivityIndicator size="small" color="#000" style={{ marginLeft: 20 }} />
                        ) : trendingError ? (
                            <Text style={{ marginLeft: 20, color: '#FF3B30' }}>Failed to load trending products.</Text>
                        ) : trendingProducts.length > 0 ? (
                            trendingProducts.map(p => renderProductCard(p))
                        ) : (
                            <Text style={{ marginLeft: 20, color: '#8E8E93' }}>No products found</Text>
                        )}
                    </ScrollView>

                    {/* Section: Reward Cards */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>My Reward Cards</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Rewards')}>
                            <Text style={styles.seeAll}>Manage</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.rewardScroll}
                        decelerationRate="fast"
                        snapToInterval={width * 0.75 + 15}
                    >
                        {Object.keys(REWARD_CARDS).map(tier => renderRewardCard(tier))}
                    </ScrollView>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    safeArea: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff'
    },
    username: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000'
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center'
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF3B30',
        borderWidth: 1,
        borderColor: '#fff'
    },
    scrollContent: {
        paddingBottom: 100, // Important for TabBar
    },
    heroScroll: {
        paddingLeft: 20,
        paddingRight: 10,
        marginBottom: 30
    },
    heroCard: {
        width: width * 0.85,
        height: 220,
        marginRight: 15,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#000',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 5
    },
    heroImage: {
        width: '100%',
        height: '100%'
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.25)'
    },
    heroContent: {
        position: 'absolute',
        bottom: 25,
        left: 25
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.2,
        marginBottom: 8,
        textTransform: 'uppercase'
    },
    heroTitle: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 16,
        lineHeight: 36
    },
    shopNowBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 100,
        alignSelf: 'flex-start'
    },
    shopNowText: {
        color: '#000',
        fontSize: 13,
        fontWeight: '700',
        marginRight: 6
    },
    catScroll: {
        paddingLeft: 20,
        paddingRight: 10,
        marginBottom: 35
    },
    catChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 100,
        backgroundColor: '#F2F2F7',
        marginRight: 10
    },
    activeCatChip: {
        backgroundColor: '#000'
    },
    catText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000'
    },
    activeCatText: {
        color: '#fff'
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000'
    },
    seeAll: {
        fontSize: 14,
        color: '#007BFF',
        fontWeight: '600'
    },
    productsScroll: {
        paddingLeft: 20,
        paddingRight: 10,
        marginBottom: 35
    },
    productCard: {
        width: 160,
        marginRight: 20
    },
    productImageWrap: {
        width: 160,
        height: 200,
        borderRadius: 20,
        backgroundColor: '#F2F2F7',
        marginBottom: 12,
        overflow: 'hidden',
        position: 'relative'
    },
    productImage: {
        width: '100%',
        height: '100%'
    },
    favBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    productTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 4
    },
    productPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: '#8E8E93'
    },
    rewardScroll: {
        paddingLeft: 20,
        paddingRight: 10,
        marginBottom: 30
    },
    rewardCardContainer: {
        width: width * 0.75,
        height: 160,
        marginRight: 15,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12
    },
    rewardCard: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between'
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardTitle: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.5
    },
    cardBody: {
        marginTop: 10
    },
    cardNumber: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 16,
        letterSpacing: 2,
        fontWeight: '500'
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    discountText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '800'
    },
    statusText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1
    },
    cardOrb: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: 60,
        opacity: 0.2
    }
});

export default HomeScreen;
