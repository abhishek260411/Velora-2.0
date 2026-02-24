import { Image } from 'expo-image';
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import FilterModal from '../components/FilterModal';
import SortModal from '../components/SortModal';
import ProductCardHorizontal from '../components/ProductCardHorizontal';
import _ from 'lodash';

const { width } = Dimensions.get('window');


const SearchScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState(['Nike Air Max', 'Black Hoodie', 'Sunglasses', 'Denim']);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const [sortVisible, setSortVisible] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    const [sortBy, setSortBy] = useState('popular');

    // Debounce search to avoid too many reads
    const debouncedSearch = useCallback(
        _.debounce((text) => performSearch(text), 500),
        []
    );

    useEffect(() => {
        if (searchQuery.length > 2) {
            debouncedSearch(searchQuery);
        } else {
            setResults([]);
        }
    }, [searchQuery, activeFilters, sortBy]);

    const performSearch = async (text) => {
        if (!text) return;
        setLoading(true);
        try {
            // Basic search strategy: 
            // In a real app with Algolia/Typesense, this is much better.
            // With Firestore, we rely on 'name' >= text strategy or client-side filtering.
            // Here doing a simple query and client-side filter for demonstration.

            const productsRef = collection(db, 'products');
            const q = query(productsRef, limit(50)); // Limit to 50 for client-side filtering
            const querySnapshot = await getDocs(q);

            let items = [];
            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });

            // Client-side filtering for keywords
            const lowerText = text.toLowerCase();
            items = items.filter(item =>
                item.name.toLowerCase().includes(lowerText) ||
                item.brand?.toLowerCase().includes(lowerText) ||
                item.description?.toLowerCase().includes(lowerText)
            );

            // Apply Filters
            if (activeFilters.price) {
                const [min, max] = activeFilters.price.split('-').map(Number);
                if (activeFilters.price.includes('+')) {
                    items = items.filter(item => item.price >= 200);
                } else {
                    items = items.filter(item => item.price >= min && item.price <= max);
                }
            }
            if (activeFilters.size && activeFilters.size.length > 0) {
                // Assuming item.sizes is an array
                items = items.filter(item => item.sizes?.some(s => activeFilters.size.includes(s)));
            }
            if (activeFilters.color && activeFilters.color.length > 0) {
                // Assuming item.colors is an array of hex codes or names
                items = items.filter(item => item.colors?.some(c => activeFilters.color.includes(c)));
            }

            // Sort
            if (sortBy === 'price_asc') items.sort((a, b) => a.price - b.price);
            else if (sortBy === 'price_desc') items.sort((a, b) => b.price - a.price);
            else if (sortBy === 'newest') items.sort((a, b) => b.createdAt - a.createdAt);
            // 'popular' would need a popularity field, default order for others.

            setResults(items);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header / Search Bar */}
            <View style={styles.header}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#8E8E93" />
                    <TextInput
                        placeholder="Search products, brands..."
                        placeholderTextColor="#8E8E93"
                        style={styles.input}
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            if (text.length === 0) setResults([]);
                        }}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color="#8E8E93" />
                        </TouchableOpacity>
                    )}
                </View>
                {searchQuery.length > 0 && (
                    <View style={styles.filterReqions}>
                        <TouchableOpacity style={styles.filterBtn} onPress={() => setSortVisible(true)}>
                            <Ionicons name="swap-vertical" size={20} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
                            <Ionicons name="options" size={20} color="#000" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {searchQuery.length > 0 ? (
                // Search Results
                <View style={{ flex: 1 }}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 50 }} />
                    ) : results.length > 0 ? (
                        <FlatList
                            data={results}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <ProductCardHorizontal
                                    product={item}
                                    onPress={() => navigation.navigate('ProductDetail', { product: item })}
                                />
                            )}
                            contentContainerStyle={styles.listContent}
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No results found for "{searchQuery}"</Text>
                        </View>
                    )}
                </View>
            ) : (
                // Default View (Recent + Categories)
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                    {recentSearches.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Recent Searches</Text>
                                <TouchableOpacity onPress={() => setRecentSearches([])}>
                                    <Text style={styles.clearBtn}>Clear</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.tagContainer}>
                                {recentSearches.map((tag, index) => (
                                    <TouchableOpacity key={index} style={styles.tag} onPress={() => setSearchQuery(tag)}>
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}


                </ScrollView>
            )}

            <FilterModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApply={setActiveFilters}
                initialFilters={activeFilters}
            />

            <SortModal
                visible={sortVisible}
                onClose={() => setSortVisible(false)}
                onApply={setSortBy}
                currentSort={sortBy}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        paddingTop: 10,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#000',
        fontWeight: '500'
    },
    filterReqions: {
        flexDirection: 'row',
        gap: 10
    },
    filterBtn: {
        padding: 10,
        backgroundColor: '#F2F2F7',
        borderRadius: 12
    },
    content: {
        paddingBottom: 100
    },
    listContent: {
        padding: 20,
        paddingBottom: 100
    },
    section: {
        marginTop: 25,
        paddingHorizontal: 20
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000'
    },
    clearBtn: {
        fontSize: 14,
        color: '#007BFF',
        fontWeight: '500'
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    },
    tag: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#F2F2F7',
        borderRadius: 20
    },
    tagText: {
        fontSize: 14,
        color: '#1C1C1E',
        fontWeight: '500'
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    },
    emptyText: {
        fontSize: 16,
        color: '#8E8E93'
    }
});

export default SearchScreen;
