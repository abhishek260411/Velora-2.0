import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import ProductCardHorizontal from '../components/ProductCardHorizontal';

const OffersScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const productsRef = collection(db, 'products');
            // Check for discount field or originalPrice > price
            // Firestore doesn't support 'where field1 > field2' directly easily without composite index gymnastics usually.
            // Simplified: where discount > 0 if field exists.

            // For now, let's fetch products that HAVE a 'originalPrice' field, assuming specific offers structure.
            // Or just fetch all and filter client side for better complex logic demo.
            const q = query(productsRef, limit(50));
            const querySnapshot = await getDocs(q);

            let items = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Client side filter for offers
                if (data.originalPrice && data.originalPrice > data.price) {
                    items.push({ id: doc.id, ...data });
                }
            });
            setProducts(items);
        } catch (error) {
            console.error("Error fetching offers:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Special Offers</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ProductCardHorizontal
                            product={item}
                            onPress={() => navigation.navigate('ProductDetail', { product: item })}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No active offers right now.</Text>
                        </View>
                    }
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 15,
        paddingTop: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 0.5,
        borderBottomColor: '#F2F2F7',
    },
    backBtn: {
        padding: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    listContent: {
        padding: 20,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#8E8E93',
        fontSize: 16,
    }
});

export default OffersScreen;
