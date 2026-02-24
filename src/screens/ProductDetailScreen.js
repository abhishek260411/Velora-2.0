import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput, Alert } from 'react-native';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import SwipeButton from '../components/SwipeButton';
import VeloraImage from '../components/VeloraImage';
import DynamicIslandAlert from '../components/DynamicIslandAlert';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

const { width, height } = Dimensions.get('window');

const ProductDetailScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { product } = route.params || {};

    if (!product) {
        return (
            <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="alert-circle-outline" size={64} color="#C7C7CC" />
                <Text style={{ marginTop: 16, fontSize: 16, fontWeight: 'bold' }}>PRODUCT NOT FOUND</Text>
                <TouchableOpacity
                    style={{ marginTop: 20, paddingHorizontal: 30, paddingVertical: 12, backgroundColor: '#000', borderRadius: 8 }}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const activeProduct = product;

    const availableSizes = (activeProduct.sizes && Array.isArray(activeProduct.sizes) && activeProduct.sizes.length > 0)
        ? activeProduct.sizes
        : (activeProduct.category === 'Shoes' ? ['7', '8', '9', '10', '11', '12']
            : activeProduct.category === 'Accessories' ? ['One Size']
                : ['S', 'M', 'L', 'XL', 'XXL']);
    const [selectedSize, setSelectedSize] = useState(availableSizes[0]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isFavorite, setIsFavorite] = useState(activeProduct.isFavorite || false);

    // Review State
    const [reviews, setReviews] = useState([]);
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(5);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const { addToCart } = useCart();
    const { user, userData } = useAuth();

    useEffect(() => {
        let timeout;
        if (isAddingToCart) {
            timeout = setTimeout(() => {
                addToCart(activeProduct, selectedSize);
                setAlertVisible(true);
                setIsAddingToCart(false);
            }, 1000);
        }
        return () => clearTimeout(timeout);
    }, [isAddingToCart, addToCart, activeProduct, selectedSize]);

    // Fetch reviews from Firestore
    useEffect(() => {
        const fetchReviews = async () => {
            if (!activeProduct.id) return;
            try {
                const q = query(
                    collection(db, 'reviews'),
                    where('productId', '==', activeProduct.id),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const fetchedReviews = [];
                querySnapshot.forEach((doc) => {
                    fetchedReviews.push({ id: doc.id, ...doc.data() });
                });
                setReviews(fetchedReviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                // The index might not exist, but no error is surfaced to UI, just console log.
            }
        };
        fetchReviews();
    }, [activeProduct.id]);

    const handleAddToCart = () => {
        setIsAddingToCart(true);
    };

    const handleSubmitReview = async () => {
        if (!activeProduct.id) {
            Alert.alert("Error", "Product ID not found.");
            return;
        }
        if (!newReviewText.trim()) {
            Alert.alert("Error", "Please enter a review.");
            return;
        }
        setIsSubmittingReview(true);
        try {
            const newReview = {
                productId: activeProduct.id,
                userId: user?.uid || 'anonymous',
                userName: userData?.displayName || userData?.firstName || (user?.email ? user.email.split('@')[0] : 'Customer'),
                rating: newReviewRating,
                text: newReviewText,
                createdAt: serverTimestamp()
            };
            const docRef = await addDoc(collection(db, 'reviews'), newReview);
            setReviews([{ ...newReview, id: docRef.id, createdAt: { toDate: () => new Date() } }, ...reviews]);
            setNewReviewText('');
            setNewReviewRating(5);
            Alert.alert("Success", "Review added successfully!");
        } catch (error) {
            console.error("Error adding review: ", error);
            Alert.alert("Error", "Failed to add review.");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Hero Image */}
                <View style={styles.imageContainer}>
                    <VeloraImage
                        source={{ uri: activeProduct.image }}
                        style={styles.heroImage}
                    />
                    {/* Floating Header Actions */}
                    <View style={[styles.headerActions, { top: insets.top + 10 }]}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconBtn}
                            onPress={() => setIsFavorite(!isFavorite)}
                        >
                            <Ionicons
                                name={isFavorite ? "heart" : "heart-outline"}
                                size={24}
                                color={isFavorite ? "#FF3B30" : "#000"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content Sheet */}
                <View style={styles.contentSheet}>
                    <View style={styles.indicator} />

                    <View style={styles.titleRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.tag}>{activeProduct.tag || 'BESTSELLER'}</Text>
                            <Text style={styles.title}>{activeProduct.name}</Text>
                        </View>
                        <Text style={styles.price}>{activeProduct.price}</Text>
                    </View>

                    <Text style={styles.description}>
                        {activeProduct.description || 'Experience the perfect blend of style and comfort with this premium piece from the Velora collection.'}
                    </Text>

                    {/* Size Selector */}
                    {activeProduct.category === 'Accessories' ? (
                        <Text style={styles.sectionTitle}>SIZE</Text>
                    ) : (
                        <Text style={styles.sectionTitle}>SELECT SIZE {activeProduct.category === 'Shoes' ? '(UK)' : ''}</Text>
                    )}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sizeScroll}>
                        {availableSizes.map((size) => (
                            <TouchableOpacity
                                key={size}
                                style={[styles.sizeBox, selectedSize === size && styles.activeSizeBox]}
                                onPress={() => setSelectedSize(size)}
                            >
                                <Text style={[styles.sizeText, selectedSize === size && styles.activeSizeText]}>{size}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Add Review Form */}
                    <View style={styles.addReviewSection}>
                        <Text style={styles.sectionTitle}>WRITE A REVIEW</Text>
                        <View style={styles.ratingSelector}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setNewReviewRating(star)}>
                                    <Ionicons
                                        name={star <= newReviewRating ? "star" : "star-outline"}
                                        size={28}
                                        color={star <= newReviewRating ? "#FFD700" : "#E5E5EA"}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TextInput
                            style={styles.reviewInput}
                            placeholder="What do you think about this product?"
                            value={newReviewText}
                            onChangeText={setNewReviewText}
                            multiline
                            numberOfLines={3}
                        />
                        <TouchableOpacity
                            style={styles.submitReviewBtn}
                            onPress={handleSubmitReview}
                            disabled={isSubmittingReview}
                        >
                            <Text style={styles.submitReviewText}>
                                {isSubmittingReview ? 'Submitting...' : 'SUBMIT REVIEW'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Reviews Preview */}
                    <View style={styles.reviewSection}>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.sectionTitle}>REVIEWS ({reviews.length})</Text>
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={12} color="#FFF" />
                                <Text style={styles.ratingText}>
                                    {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1) : "0.0"}
                                </Text>
                            </View>
                        </View>

                        {reviews.length === 0 ? (
                            <Text style={styles.noReviewsText}>No reviews yet. Be the first to review!</Text>
                        ) : (
                            reviews.map(review => (
                                <View key={review.id || Math.random().toString()} style={styles.reviewCard}>
                                    <View style={styles.reviewUser}>
                                        <View style={styles.avatarPlaceholder}>
                                            <Text style={styles.avatarText}>{(review.userName || 'C').charAt(0).toUpperCase()}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.reviewerName}>{review.userName || 'Customer'}</Text>
                                            <View style={{ flexDirection: 'row', marginTop: 2 }}>
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Ionicons key={i} name={i <= review.rating ? "star" : "star-outline"} size={12} color="#FFD700" />
                                                ))}
                                            </View>
                                        </View>
                                        <Text style={styles.reviewDate}>
                                            {review.createdAt && review.createdAt.toDate ? review.createdAt.toDate().toLocaleDateString() : 'Just now'}
                                        </Text>
                                    </View>
                                    <Text style={styles.reviewText}>{review.text}</Text>
                                </View>
                            ))
                        )}
                    </View>

                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>

            {/* Sticky Bottom Bar */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>TOTAL</Text>
                    <Text style={styles.totalPrice}>{activeProduct.price}</Text>
                </View>
                <View style={styles.swipeContainer}>
                    <SwipeButton
                        title="SWIPE TO BAG"
                        onSwipeSuccess={handleAddToCart}
                        isLoading={isAddingToCart}
                    />
                </View>
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
        backgroundColor: '#FFF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 100,
    },
    imageContainer: {
        width: width,
        height: height * 0.55,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    headerActions: {
        position: 'absolute',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    contentSheet: {
        flex: 1,
        marginTop: -40,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    indicator: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E5EA',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 24,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    tag: {
        fontSize: 10,
        fontWeight: '800',
        color: '#007AFF',
        marginBottom: 4,
        letterSpacing: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        lineHeight: 28,
        marginRight: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
        color: '#666',
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8E8E93',
        marginBottom: 12,
        letterSpacing: 1,
    },
    sizeScroll: {
        marginBottom: 32,
    },
    sizeBox: {
        minWidth: 50,
        height: 50,
        paddingHorizontal: 15,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activeSizeBox: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    sizeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    activeSizeText: {
        color: '#FFF',
    },
    addReviewSection: {
        marginBottom: 32,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
    },
    ratingSelector: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 12,
    },
    reviewInput: {
        backgroundColor: '#F2F2F7',
        borderRadius: 16,
        padding: 16,
        fontSize: 14,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 16,
    },
    submitReviewBtn: {
        backgroundColor: '#000',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    submitReviewText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
        letterSpacing: 1,
    },
    noReviewsText: {
        color: '#8E8E93',
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 20,
    },
    reviewSection: {
        marginBottom: 20,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 12,
        marginLeft: 4,
    },
    reviewCard: {
        backgroundColor: '#F2F2F7',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    reviewUser: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E5E5EA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontWeight: '600',
        fontSize: 14,
    },
    reviewerName: {
        fontWeight: '600',
        fontSize: 14,
    },
    reviewDate: {
        marginLeft: 'auto',
        fontSize: 12,
        color: '#8E8E93',
    },
    reviewText: {
        fontSize: 13,
        color: '#333',
        lineHeight: 18,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    totalContainer: {
        marginRight: 20,
    },
    totalLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#8E8E93',
        letterSpacing: 0.5,
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    swipeContainer: {
        flex: 1,
        height: 50,
    },
});

export default ProductDetailScreen;
