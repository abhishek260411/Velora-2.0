import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { theme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import VeloraButton from '../components/VeloraButton';
import SwipeButton from '../components/SwipeButton';
import DynamicIslandAlert from '../components/DynamicIslandAlert';
import { useCart } from '../context/CartContext';

const { width, height } = Dimensions.get('window');

const ProductDetailScreen = ({ navigation, route }) => {
    const { product } = route.params || {};
    console.log('ProductDetailScreen received product:', JSON.stringify(product, null, 2));

    // Default fallback data if no product is passed
    const activeProduct = product || {
        name: 'VELOCITY 1.0 SNEAKERS',
        price: '₹12,999',
        tag: 'NEW RELEASE',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000',
        description: 'The Velocity 1.0 merges futuristic design with unparalleled athletic performance. Built for the modern nomad who refuses to compromise on style or comfort.'
    };

    const [selectedSize, setSelectedSize] = useState('9');
    const [alertVisible, setAlertVisible] = useState(false);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(activeProduct, selectedSize);
        setAlertVisible(true);
        // Navigate or update context after a short delay if needed
        setTimeout(() => {
            // navigation.navigate('Cart'); // Optional: don't auto-nav if we want user to see the island
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Image Section */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: activeProduct.image }}
                        style={styles.heroImage}
                    />
                    <SafeAreaView style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.black} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.backButton}>
                            <MaterialCommunityIcons name="heart-outline" size={24} color={theme.colors.black} />
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

                {/* Product Info */}
                <View style={styles.infoContainer}>
                    <Text style={styles.tag}>{activeProduct.tag || 'NEW ARRIVAL'}</Text>
                    <Text style={styles.title}>{activeProduct.name.toUpperCase()}</Text>
                    <Text style={styles.price}>{activeProduct.price}</Text>

                    <Text style={styles.description}>
                        {activeProduct.description || 'Experience the perfect blend of style and comfort with this premium piece from the Velora collection. Crafted with attention to detail for the modern trendsetter.'}
                    </Text>

                    {/* Size Selector Shell */}
                    <Text style={styles.sectionLabel}>SELECT SIZE (UK)</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sizeScroll}>
                        {['7', '8', '9', '10', '11'].map((size) => (
                            <TouchableOpacity
                                key={size}
                                style={[styles.sizeBox, selectedSize === size && styles.activeSizeBox]}
                                onPress={() => setSelectedSize(size)}
                            >
                                <Text style={[styles.sizeText, selectedSize === size && styles.activeSizeText]}>{size}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Rating & Reviews Section */}
                    <View style={styles.ratingSection}>
                        <Text style={styles.sectionLabel}>RATINGS & REVIEWS</Text>
                        <View style={styles.ratingHeader}>
                            <View>
                                <Text style={styles.ratingScore}>4.8</Text>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <MaterialCommunityIcons key={i} name="star" size={16} color={theme.colors.black} />
                                    ))}
                                </View>
                                <Text style={styles.ratingCount}>Based on 128 reviews</Text>
                            </View>
                            <TouchableOpacity style={styles.writeReviewBtn}>
                                <Text style={styles.writeReviewText}>WRITE A REVIEW</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Sample Review */}
                        <View style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <Text style={styles.reviewerName}>Alex M.</Text>
                                <Text style={styles.reviewDate}>2 days ago</Text>
                            </View>
                            <View style={styles.starsRow}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <MaterialCommunityIcons key={i} name="star" size={12} color={theme.colors.black} />
                                ))}
                            </View>
                            <Text style={styles.reviewText}>
                                Absolutely love the design! Fits perfectly and very comfortable for long walks.
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Floating Bottom Action Bar */}
            <View style={styles.bottomBarContainer}>
                <GlassCard style={styles.bottomBar}>
                    <View style={styles.actionRow}>
                        <View>
                            <Text style={styles.totalPrice}>TOTAL</Text>
                            <Text style={styles.priceValue}>{activeProduct.price}</Text>
                        </View>
                        <View style={{ width: width * 0.5 }}>
                            <SwipeButton
                                title="SWIPE TO BAG"
                                onSwipeSuccess={handleAddToCart}
                            />
                        </View>
                    </View>
                </GlassCard>
            </View>

            <DynamicIslandAlert
                visible={alertVisible}
                message={activeProduct.name}
                image={activeProduct.image}
                onClose={() => setAlertVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    imageContainer: {
        width: width,
        height: height * 0.6,
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    header: {
        position: 'absolute',
        top: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    backButton: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        padding: 24,
    },
    tag: {
        ...theme.typography.subHeader,
        fontSize: 10,
        color: '#FF3B30',
        marginBottom: 8,
        fontWeight: '900',
    },
    title: {
        ...theme.typography.header,
        fontSize: 28,
        marginBottom: 8,
    },
    price: {
        ...theme.typography.body,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    description: {
        ...theme.typography.body,
        color: theme.colors.darkGray,
        lineHeight: 22,
        marginBottom: 32,
    },
    sectionLabel: {
        ...theme.typography.subHeader,
        fontSize: 12,
        marginBottom: 16,
    },
    sizeScroll: {
        marginBottom: 20,
    },
    sizeBox: {
        width: 60,
        height: 48,
        borderWidth: 1,
        borderColor: theme.colors.lightGray,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sizeText: {
        ...theme.typography.body,
        fontWeight: 'bold',
    },
    activeSizeBox: {
        backgroundColor: theme.colors.black,
        borderColor: theme.colors.black,
    },
    activeSizeText: {
        color: theme.colors.white,
    },
    bottomBarContainer: {
        position: 'absolute',
        bottom: 25,
        width: '100%',
        paddingHorizontal: 20,
    },
    bottomBar: {
        width: '100%',
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 30,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalPrice: {
        ...theme.typography.subHeader,
        fontSize: 10,
        color: theme.colors.lightGray,
    },
    priceValue: {
        ...theme.typography.body,
        fontSize: 18,
        fontWeight: '900',
    },
    ratingSection: {
        marginTop: 10,
        marginBottom: 20,
    },
    ratingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    ratingScore: {
        ...theme.typography.header,
        fontSize: 32,
        lineHeight: 32,
    },
    starsRow: {
        flexDirection: 'row',
        marginVertical: 4,
    },
    ratingCount: {
        ...theme.typography.body,
        fontSize: 12,
        color: theme.colors.darkGray,
    },
    writeReviewBtn: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.black,
        paddingBottom: 2,
    },
    writeReviewText: {
        ...theme.typography.subHeader,
        fontSize: 10,
    },
    reviewCard: {
        backgroundColor: theme.colors.gray,
        padding: 16,
        borderRadius: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    reviewerName: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    reviewDate: {
        fontSize: 10,
        color: theme.colors.darkGray,
    },
    reviewText: {
        ...theme.typography.body,
        marginTop: 8,
        fontSize: 13,
        lineHeight: 20,
    },
});

export default ProductDetailScreen;
