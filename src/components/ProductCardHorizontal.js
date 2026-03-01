import { Image } from 'expo-image';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductCardHorizontal = ({ product, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" cachePolicy="memory-disk" transition={300} placeholder={{ blurhash: 'L9AB*A%N00~q~q-;M{t700~q00Rj' }} />
            <View style={styles.infoContainer}>
                <Text style={styles.brand} numberOfLines={1}>{product.brand}</Text>
                <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.price}>₹{product.price}</Text>
                    {product.originalPrice && (
                        <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                    )}
                </View>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>{product.rating} ({product.reviews})</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        alignItems: 'center'
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f0f0f0'
    },
    infoContainer: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center'
    },
    brand: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 2
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000'
    },
    originalPrice: {
        fontSize: 12,
        color: '#8E8E93',
        textDecorationLine: 'line-through'
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4
    },
    ratingText: {
        fontSize: 12,
        color: '#8E8E93'
    }
});

export default React.memo(ProductCardHorizontal);
