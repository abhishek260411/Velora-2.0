import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useRewards } from '../context/RewardsContext';

const CartScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    const { calculateDiscount, selectedCard, REWARD_CARDS } = useRewards();
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

    const items = cartItems || [];
    const subtotal = items.reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);
    const shipping = subtotal > 0 ? (subtotal > 4999 ? 0 : 499) : 0;

    // Reward Logic
    const { discount, discountPercent } = calculateDiscount(subtotal);
    const total = subtotal + shipping - discount;

    const handleCheckout = () => {
        if (isCheckoutLoading) return;
        setIsCheckoutLoading(true);
        setTimeout(() => {
            setIsCheckoutLoading(false);
            navigation.navigate('Checkout');
        }, 1000);
    };

    const renderItem = (item, index) => {
        const isLast = index === items.length - 1;
        return (
            <View key={`${item.id}-${item.size}`} style={styles.cartItemContainer}>
                <View style={styles.cartItemRow}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} contentFit="cover" />
                    <View style={styles.itemInfo}>
                        <View style={styles.itemHeader}>
                            <View style={styles.itemMeta}>
                                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                                <Text style={styles.itemDetails}>
                                    {item.brand || 'VELORA'} • Size {item.size}
                                </Text>
                            </View>
                            <Text style={styles.itemPrice}>₹{(item.priceNum * item.quantity).toLocaleString('en-IN')}</Text>
                        </View>

                        <View style={styles.itemActions}>
                            <View style={styles.stepperControl}>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.id, item.size, -1)}
                                    style={styles.stepperButton}
                                >
                                    <Ionicons name={item.quantity > 1 ? "remove" : "trash-outline"} size={18} color="#007AFF" />
                                </TouchableOpacity>
                                <Text style={styles.stepperText}>{item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.id, item.size, 1)}
                                    style={styles.stepperButton}
                                >
                                    <Ionicons name="add" size={18} color="#007AFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                {!isLast && <View style={styles.listSeparator} />}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'ios' ? 10 : 20) }]}>
                <Text style={styles.headerTitle}>Shopping Bag</Text>
            </View>

            {items.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={64} color="#C7C7CC" style={styles.emptyIcon} />
                    <Text style={styles.emptyTitle}>Your bag is empty.</Text>
                    <Text style={styles.emptyDesc}>Add items to start building your wardrobe.</Text>
                    <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('HomeTab')}>
                        <Text style={styles.shopBtnText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
                    showsVerticalScrollIndicator={true}
                >
                    <View style={styles.iosGroup}>
                        {items.map((item, index) => renderItem(item, index))}
                    </View>

                    {/* Promos & Rewards - iOS Group Style */}
                    <Text style={styles.sectionFooterText}>PROMOS & REWARDS</Text>
                    <View style={styles.iosGroup}>
                        <TouchableOpacity style={styles.iosCellRow}>
                            <View style={styles.iosCellLeft}>
                                <Ionicons name="pricetag-outline" size={22} color="#007AFF" />
                                <Text style={styles.iosCellText}>Promo Code</Text>
                            </View>
                            <View style={styles.iosCellRight}>
                                <Text style={styles.iosCellDetailText}>None</Text>
                                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.listSeparator} />
                        <TouchableOpacity
                            style={styles.iosCellRow}
                            onPress={() => navigation.navigate('Rewards')}
                        >
                            <View style={styles.iosCellLeft}>
                                <Ionicons name={selectedCard ? "card" : "card-outline"} size={22} color={selectedCard ? "#34C759" : "#007AFF"} />
                                <Text style={styles.iosCellText}>Reward Card</Text>
                            </View>
                            <View style={styles.iosCellRight}>
                                <Text style={[styles.iosCellDetailText, selectedCard && { color: '#34C759' }]}>
                                    {selectedCard && REWARD_CARDS[selectedCard] ? `-${discountPercent}%` : "Apply"}
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Order Summary - iOS Group Style */}
                    <Text style={styles.sectionFooterText}>ORDER SUMMARY</Text>
                    <View style={styles.iosGroup}>
                        <View style={styles.iosCellRowStatic}>
                            <Text style={styles.iosCellLabel}>Subtotal</Text>
                            <Text style={styles.iosCellValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
                        </View>
                        <View style={styles.listSeparator} />
                        <View style={styles.iosCellRowStatic}>
                            <Text style={styles.iosCellLabel}>Shipping</Text>
                            <Text style={styles.iosCellValue}>{shipping === 0 ? "FREE" : `₹${shipping}`}</Text>
                        </View>
                        {discount > 0 && (
                            <>
                                <View style={styles.listSeparator} />
                                <View style={styles.iosCellRowStatic}>
                                    <Text style={styles.iosCellLabel}>Discount ({discountPercent}%)</Text>
                                    <Text style={[styles.iosCellValue, { color: '#34C759' }]}>-₹{discount.toLocaleString('en-IN')}</Text>
                                </View>
                            </>
                        )}
                        <View style={styles.listSeparator} />
                        <View style={styles.iosCellRowStatic}>
                            <Text style={styles.iosTotalLabel}>Total</Text>
                            <Text style={styles.iosTotalValue}>₹{total.toLocaleString('en-IN')}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.iosPrimaryBtn, isCheckoutLoading && { opacity: 0.7 }]}
                        onPress={handleCheckout}
                        disabled={isCheckoutLoading}
                    >
                        {isCheckoutLoading ? (
                            <Text style={styles.iosPrimaryBtnText}>Processing...</Text>
                        ) : (
                            <>
                                <Ionicons name="lock-closed" size={16} color="#FFF" style={{ marginRight: 6 }} />
                                <Text style={styles.iosPrimaryBtnText}>Checkout</Text>
                            </>
                        )}
                    </TouchableOpacity>
                    <Text style={styles.secureText}>Secure Payment via Razorpay</Text>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7', // Standard iOS grouped background color
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 8,
        backgroundColor: '#F2F2F7',
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: '700',
        color: '#000',
        letterSpacing: 0.4,
    },
    scrollContent: {
        paddingTop: 16,
    },
    iosGroup: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginHorizontal: 16,
        overflow: 'hidden',
    },
    cartItemContainer: {
        backgroundColor: '#FFF',
    },
    cartItemRow: {
        flexDirection: 'row',
        padding: 16,
    },
    listSeparator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#C6C6C8',
        marginLeft: 16, // iOS standard inset
    },
    itemImage: {
        width: 70,
        height: 85,
        borderRadius: 8,
        backgroundColor: '#F2F2F7',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemMeta: {
        flex: 1,
        paddingRight: 12,
    },
    itemName: {
        fontSize: 17,
        fontWeight: '400',
        color: '#000',
        lineHeight: 22,
        letterSpacing: -0.4,
    },
    itemDetails: {
        fontSize: 13,
        color: '#8A8A8E',
        marginTop: 4,
    },
    itemPrice: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
        letterSpacing: -0.4,
    },
    itemActions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 8,
    },
    stepperControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    stepperButton: {
        padding: 4,
    },
    stepperText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000',
        minWidth: 24,
        textAlign: 'center',
        marginHorizontal: 8,
    },
    sectionFooterText: {
        fontSize: 13,
        color: '#6D6D72',
        textTransform: 'uppercase',
        marginTop: 24,
        marginBottom: 8,
        marginHorizontal: 32,
    },
    iosCellRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        minHeight: 44,
    },
    iosCellRowStatic: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        minHeight: 44,
    },
    iosCellLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iosCellText: {
        fontSize: 17,
        color: '#000',
        marginLeft: 12,
        letterSpacing: -0.4,
    },
    iosCellRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    iosCellDetailText: {
        fontSize: 17,
        color: '#8A8A8E',
        letterSpacing: -0.4,
    },
    iosCellLabel: {
        fontSize: 17,
        color: '#000',
        letterSpacing: -0.4,
    },
    iosCellValue: {
        fontSize: 17,
        color: '#8A8A8E',
        letterSpacing: -0.4,
    },
    iosTotalLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
        letterSpacing: -0.4,
    },
    iosTotalValue: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
        letterSpacing: -0.4,
    },
    iosPrimaryBtn: {
        backgroundColor: '#007AFF', // iOS standard blue
        marginHorizontal: 16,
        marginTop: 32,
        borderRadius: 14,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iosPrimaryBtnText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '600',
        letterSpacing: -0.4,
    },
    secureText: {
        textAlign: 'center',
        fontSize: 13,
        color: '#8A8A8E',
        marginTop: 16,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    emptyIcon: {
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
        letterSpacing: -0.4,
    },
    emptyDesc: {
        fontSize: 15,
        color: '#8A8A8E',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    shopBtn: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    shopBtnText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '600',
        letterSpacing: -0.4,
    }
});

export default CartScreen;
