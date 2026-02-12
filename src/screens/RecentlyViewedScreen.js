import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCardHorizontal from '../components/ProductCardHorizontal';

const RecentlyViewedScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecentlyViewed();
    }, []);

    const loadRecentlyViewed = async () => {
        setLoading(true);
        try {
            const jsonValue = await AsyncStorage.getItem('@recently_viewed');
            const items = jsonValue != null ? JSON.parse(jsonValue) : [];
            setProducts(items);
        } catch (e) {
            console.error("Error loading recently viewed:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async () => {
        try {
            await AsyncStorage.removeItem('@recently_viewed');
            setProducts([]);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Recently Viewed</Text>
                <TouchableOpacity onPress={handleClear}>
                    <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
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
                            <Text style={styles.emptyText}>No recently viewed items.</Text>
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
    clearText: {
        color: '#FF3B30',
        fontSize: 14
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

export default RecentlyViewedScreen;
