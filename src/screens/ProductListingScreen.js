import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    FlatList,
    ActivityIndicator,
    Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { db } from '../config/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2; // 24px padding on sides, 16px gap = (W - 48 - 15) / 2 roughly? Let's use flex gap.

const CATEGORY_DATA = {
    "Shoes": ["Sneakers", "Running", "Formal", "Sandals"],
    "Men": ["T-Shirts", "Shirts", "Bottoms", "Jackets"],
    "Women": ["Dresses", "Tops", "Skirts", "Activewear"],
    "Accessories": ["Watches", "Bags", "Jewellery", "Eyewear"]
};

const ProductListingScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [allProducts, setAllProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const categoryName = route?.params?.category || 'Collection';

    // Derived chips
    const chips = ['All', ...(CATEGORY_DATA[categoryName] || ['New', 'Trending', 'Sale'])];

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "products"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllProducts(list);
            setDisplayedProducts(list); // simplified for demo
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Simple Filter Logic (Client Side for demo smoothness)
    useEffect(() => {
        let result = allProducts;
        if (selectedCategory !== 'All') {
            const searchLower = selectedCategory.toLowerCase();
            result = result.filter(p =>
                (p.category && p.category.toLowerCase() === searchLower) ||
                (p.tags && p.tags.some(t => t.toLowerCase() === searchLower)) ||
                (p.name && p.name.toLowerCase().includes(searchLower)) ||
                (p.brand && p.brand.toLowerCase().includes(searchLower))
            );
        }
        setDisplayedProducts(result);
    }, [selectedCategory, allProducts]);

    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <TouchableOpacity style={styles.favButton}>
                    <Ionicons name="heart-outline" size={18} color="#000" />
                </TouchableOpacity>
                {item.tag && (
                    <BlurView intensity={80} tint="light" style={styles.tagBadge}>
                        <Text style={styles.tagText}>{item.tag}</Text>
                    </BlurView>
                )}
            </View>
            <View style={styles.productMeta}>
                <Text style={styles.brand}>{item.brand}</Text>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.price}>{item.price}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <BlurView intensity={90} tint="light" style={[styles.header, { paddingTop: insets.top }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{categoryName.toUpperCase()}</Text>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="search" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Filter Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                >
                    {chips.map((chip) => (
                        <TouchableOpacity
                            key={chip}
                            style={[styles.chip, selectedCategory === chip && styles.activeChip]}
                            onPress={() => setSelectedCategory(chip)}
                        >
                            <Text style={[styles.chipText, selectedCategory === chip && styles.activeChipText]}>
                                {chip}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </BlurView>

            {/* List */}
            {isLoading ? (
                <ActivityIndicator style={styles.loader} size="large" color="#000" />
            ) : (
                <FlatList
                    data={displayedProducts}
                    renderItem={renderProduct}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    contentContainerStyle={[
                        styles.listContent,
                        { paddingTop: insets.top + 100 } // Header height
                    ]}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 50,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1,
        color: '#000',
    },
    iconBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterScroll: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        paddingTop: 4,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 100,
        backgroundColor: '#F2F2F7',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeChip: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000',
    },
    activeChipText: {
        color: '#FFF',
    },
    loader: {
        marginTop: 200,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    productCard: {
        width: COLUMN_WIDTH,
    },
    imageContainer: {
        width: '100%',
        height: COLUMN_WIDTH * 1.4,
        borderRadius: 12,
        backgroundColor: '#F2F2F7',
        overflow: 'hidden',
        marginBottom: 12,
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    favButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tagBadge: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        overflow: 'hidden',
    },
    tagText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#000',
        textTransform: 'uppercase',
    },
    productMeta: {
        paddingHorizontal: 4,
    },
    brand: {
        fontSize: 11,
        color: '#8E8E93',
        fontWeight: '600',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    name: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    price: {
        fontSize: 13,
        fontWeight: '700',
        color: '#000',
    },
});

export default ProductListingScreen;
