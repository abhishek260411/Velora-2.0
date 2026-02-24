import { Image } from 'expo-image';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import ProductCardHorizontal from '../components/ProductCardHorizontal';

const BrandCollectionScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { brandName, brandLogo } = route.params || {};

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, [brandName]);

    const fetchProducts = async () => {
        if (!brandName) return;
        setLoading(true);
        try {
            const productsRef = collection(db, 'products');
            // Case-sensitive in Firestore, usually need exact match or normalized field
            const q = query(productsRef, where('brand', '==', brandName), limit(20));

            const querySnapshot = await getDocs(q);
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });
            setProducts(items);
        } catch (error) {
            console.error("Error fetching brand products:", error);
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
                <Text style={styles.title}>{brandName || 'Brand Collection'}</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    ListHeaderComponent={
                        brandLogo ? (
                            <View style={styles.brandHeader}>
                                <Image source={{ uri: brandLogo }} style={styles.brandLogo} contentFit="contain" />
                                <Text style={styles.brandDesc}>Explore the latest collection from {brandName}.</Text>
                            </View>
                        ) : null
                    }
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
                            <Text style={styles.emptyText}>No products found for {brandName}.</Text>
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
        backgroundColor: '#FFFFFF'
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
        borderBottomColor: '#F2F2F7'
    },
    backBtn: {
        padding: 5
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000'
    },
    listContent: {
        padding: 20
    },
    brandHeader: {
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7'
    },
    brandLogo: {
        width: 100,
        height: 60,
        marginBottom: 10
    },
    brandDesc: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center'
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50
    },
    emptyText: {
        color: '#8E8E93',
        fontSize: 16
    }
});

export default BrandCollectionScreen;
