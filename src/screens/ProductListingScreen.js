import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../config/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2;

const CATEGORY_DATA = {
    "Shoes": [
        "Men's Sneakers", "Men's Running", "Men's Formal", "Men's Casual",
        "Women's Sneakers", "Women's Heels", "Women's Flats", "Women's Casual",
        "Unisex Sneakers", "Unisex Slides"
    ],
    "Men": ["Tops", "Bottoms", "Shirts", "Winter Wear"],
    "Women": ["Dresses", "Tops", "Bottoms", "Winter Wear", "Ethnic Wear"],
    "Accessories": [
        "Men's Wallets", "Men's Belts", "Men's Sunglasses", "Men's Watches",
        "Women's Handbags", "Women's Jewellery", "Women's Sunglasses", "Women's Watches"
    ]
};

const ProductListingScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [allProducts, setAllProducts] = useState([]); // Store all fetched products
    const [displayedProducts, setDisplayedProducts] = useState([]); // Store filtered/sorted products
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [sortByPrice, setSortByPrice] = useState(null); // null, 'asc', 'desc'
    const categoryName = route?.params?.category || 'DISCOVER';

    // Determine chips based on category
    const chips = CATEGORY_DATA[categoryName]
        ? ['ALL', ...CATEGORY_DATA[categoryName]]
        : ['ALL', 'SNEAKERS', 'APPAREL', 'ACCESSORIES', 'LIMITED'];

    // Initial fetch
    useEffect(() => {
        const q = query(collection(db, "products"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsList = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate().toISOString(),
                    updatedAt: data.updatedAt?.toDate().toISOString(),
                };
            });
            setAllProducts(productsList);
        });

        return () => unsubscribe();
    }, []);

    // Handle initial category from navigation params or default
    useEffect(() => {
        // Reset selected category when switching views
        setSelectedCategory('ALL');
    }, [categoryName]);

    // Filter & Sort Logic
    useEffect(() => {
        let result = [...allProducts];

        // 1. Context Filter (Navigation Params - Strict Base Filter)
        if (categoryName && categoryName !== 'DISCOVER') {
            if (categoryName === 'Men') {
                result = result.filter(p => p.category === 'Men' || (p.subCategory && (p.subCategory.includes('Men') || p.subCategory.includes('Unisex'))));
            } else if (categoryName === 'Women') {
                result = result.filter(p => p.category === 'Women' || (p.subCategory && (p.subCategory.includes('Women') || p.subCategory.includes('Unisex'))));
            } else if (categoryName === 'Accessories') {
                result = result.filter(p => p.category === 'Accessories');
            } else if (categoryName === 'Shoes') {
                result = result.filter(p => p.category === 'Shoes' || (p.subCategory && (p.subCategory.includes('Men\'s') || p.subCategory.includes('Women\'s'))));
            } else if (categoryName === 'New Arrivals') {
                result = result.filter(p => p.isNewArrival === true);
            }
        }

        // 2. Chip Filter (Sub-filter within the context)
        if (selectedCategory !== 'ALL') {
            // Check if it's a dynamic sub-category
            if (CATEGORY_DATA[categoryName] && CATEGORY_DATA[categoryName].includes(selectedCategory)) {
                result = result.filter(p => p.subCategory === selectedCategory);
            } else {
                // Fallback for DISCOVER / Generic chips
                switch (selectedCategory) {
                    case 'SNEAKERS':
                        result = result.filter(p => p.category === 'Shoes');
                        break;
                    case 'APPAREL':
                        result = result.filter(p => p.category === 'Men' || p.category === 'Women');
                        break;
                    case 'ACCESSORIES':
                        result = result.filter(p => p.category === 'Accessories');
                        break;
                    case 'LIMITED':
                        result = result.filter(p => p.stock < 10 || p.tag === 'LIMITED');
                        break;
                    default:
                        break;
                }
            }
        }

        // 2. Sort by Price
        if (sortByPrice) {
            result.sort((a, b) => {
                const priceA = parseFloat(a.price);
                const priceB = parseFloat(b.price);
                return sortByPrice === 'asc' ? priceA - priceB : priceB - priceA;
            });
        }

        setDisplayedProducts(result);
    }, [allProducts, selectedCategory, sortByPrice]);

    const toggleSort = () => {
        setSortByPrice(prev => {
            if (prev === null) return 'asc';
            if (prev === 'asc') return 'desc';
            return null; // Reset
        });
    };

    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
        >
            <View style={styles.imageWrapper}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                {item.tag && (
                    <View style={styles.tagBox}>
                        <Text style={styles.tagText}>{item.tag}</Text>
                    </View>
                )}
                <TouchableOpacity style={styles.wishlistBtn}>
                    <MaterialCommunityIcons name="heart-outline" size={20} color={theme.colors.black} />
                </TouchableOpacity>
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productBrand}>{item.brand}</Text>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productPrice}>₹{item.price}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color={theme.colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{categoryName.toUpperCase()}</Text>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="magnify" size={26} color={theme.colors.black} />
                </TouchableOpacity>
            </View>

            {/* Filter & Sort Bar */}
            <View style={styles.filterBar}>
                <TouchableOpacity style={styles.filterBtn}>
                    <MaterialCommunityIcons name="tune-vertical" size={20} color={theme.colors.black} />
                    <Text style={styles.filterText}>FILTER</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.filterBtn} onPress={toggleSort}>
                    <MaterialCommunityIcons
                        name={sortByPrice === 'asc' ? "sort-ascending" : sortByPrice === 'desc' ? "sort-descending" : "sort-variant"}
                        size={20}
                        color={theme.colors.black}
                    />
                    <Text style={styles.filterText}>
                        SORT {sortByPrice ? (sortByPrice === 'asc' ? '(LOW-HIGH)' : '(HIGH-LOW)') : ''}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Categories */}
            <View style={styles.categoryContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                    {chips.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.catChip, selectedCategory === cat && styles.activeCatChip]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[styles.catText, selectedCategory === cat && styles.activeCatText]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={displayedProducts}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No products found in this category.</Text>
                    </View>
                }
            />
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
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray,
    },
    headerTitle: {
        ...theme.typography.header,
        fontSize: 16,
        letterSpacing: 2,
    },
    filterBar: {
        flexDirection: 'row',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray,
    },
    filterBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterText: {
        ...theme.typography.subHeader,
        fontSize: 12,
        marginLeft: 8,
        letterSpacing: 1,
    },
    divider: {
        width: 1,
        height: '60%',
        backgroundColor: theme.colors.gray,
        alignSelf: 'center',
    },
    categoryContainer: {
        paddingVertical: 15,
    },
    categoryScroll: {
        paddingHorizontal: 15,
    },
    catChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: theme.colors.gray,
    },
    activeCatChip: {
        backgroundColor: theme.colors.black,
    },
    catText: {
        ...theme.typography.body,
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.darkGray,
    },
    activeCatText: {
        color: theme.colors.white,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    productCard: {
        width: COLUMN_WIDTH,
    },
    imageWrapper: {
        width: COLUMN_WIDTH,
        height: COLUMN_WIDTH * 1.3,
        backgroundColor: theme.colors.gray,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 10,
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
        fontSize: 9,
        fontWeight: '900',
    },
    wishlistBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productInfo: {
        paddingHorizontal: 4,
    },
    productBrand: {
        ...theme.typography.subHeader,
        fontSize: 9,
        color: theme.colors.darkGray,
        marginBottom: 2,
    },
    productName: {
        ...theme.typography.body,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    productPrice: {
        ...theme.typography.body,
        fontSize: 12,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        ...theme.typography.body,
        color: theme.colors.lightGray,
    }
});

export default ProductListingScreen;
