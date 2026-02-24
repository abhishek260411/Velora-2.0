import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase'; // Ensure this path is correct
import ProductCardHorizontal from '../components/ProductCardHorizontal';



const WishlistScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let timeout;
        const fetchWishlist = async () => {
            setLoading(true);
            try {
                timeout = setTimeout(() => {
                    setWishlist([]);
                    setLoading(false);
                }, 500);
            } catch (error) {
                console.error("Error fetching wishlist:", error);
                setLoading(false);
            }
        };

        fetchWishlist();
        return () => clearTimeout(timeout);
    }, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Wishlist</Text>
                <Text style={styles.headerCount}>{wishlist.length} items</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 50 }} />
            ) : wishlist.length > 0 ? (
                <FlatList
                    data={wishlist}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ProductCardHorizontal
                            product={item}
                            onPress={() => navigation.navigate('ProductDetail', { product: item })}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="heart-outline" size={48} color="#D1D1D6" />
                    </View>
                    <Text style={styles.emptyText}>Your wishlist is empty</Text>
                    <Text style={styles.emptySub}>Save items you want to buy later</Text>
                    <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('HomeTab')}>
                        <Text style={styles.shopBtnText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
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
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline'
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#000',
    },
    headerCount: {
        fontSize: 14,
        color: '#8E8E93',
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    emptySub: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        marginBottom: 20,
    },
    shopBtn: {
        paddingHorizontal: 25,
        paddingVertical: 12,
        backgroundColor: '#007BFF',
        borderRadius: 25,
    },
    shopBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default WishlistScreen;
