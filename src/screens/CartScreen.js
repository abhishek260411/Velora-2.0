
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
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
    const shipping = 499;

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

    const renderItem = (item) => (
        <View key={`${item.id}-${item.size}`} style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
                <View style={styles.itemHeader}>
                    <Text style={styles.itemBrand}>{item.brand || 'VELORA'}</Text>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.itemSize}>Size: {item.size}</Text>
                </View>
                <View style={styles.itemFooter}>
                    <Text style={styles.itemPrice}>₹{(item.priceNum * item.quantity).toLocaleString()}</Text>
                    <View style={styles.qtyControl}>
                        <TouchableOpacity onPress={() => updateQuantity(item.id, item.size, -1)} style={styles.qtyBtn}>
                            <Ionicons name="remove" size={16} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => updateQuantity(item.id, item.size, 1)} style={styles.qtyBtn}>
                            <Ionicons name="add" size={16} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeFromCart(item.id, item.size)}
            >
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Bag</Text>
                <Text style={styles.headerCount}>{items.length} items</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {items.length > 0 ? (
                    items.map(renderItem)
                ) : (
                    <View style={styles.emptyContainer}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="cart-outline" size={48} color="#D1D1D6" />
                        </View>
                        <Text style={styles.emptyText}>Your bag is empty</Text>
                        <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Home')}>
                            <Text style={styles.shopBtnText}>Start Shopping</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Promo Code & Rewards */}
                {items.length > 0 && (
                    <View style={styles.extrasContainer}>
                        <TouchableOpacity style={styles.promoRow}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="pricetag-outline" size={20} color="#000" />
                                <Text style={styles.promoText}>Enter Promo Code</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                        </TouchableOpacity>

                        {/* Reward Card Selection */}
                        <TouchableOpacity
                            style={styles.rewardRow}
                            onPress={() => navigation.navigate('Rewards')}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name={selectedCard ? "card" : "card-outline"} size={20} color={selectedCard ? "#34C759" : "#000"} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={styles.rewardTitle}>
                                        {selectedCard && REWARD_CARDS[selectedCard] ? REWARD_CARDS[selectedCard].title : "Apply Reward Card"}
                                    </Text>
                                    {selectedCard && REWARD_CARDS[selectedCard] && (
                                        <Text style={styles.rewardSubtitle}>{discountPercent}% saved</Text>
                                    )}
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Checkout Summary */}
            {items.length > 0 && (
                <View style={[styles.footer, { paddingBottom: insets.bottom + 80 }]}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>₹{subtotal.toLocaleString()}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Shipping</Text>
                        <Text style={styles.summaryValue}>₹{shipping}</Text>
                    </View>
                    {discount > 0 && (
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: '#34C759' }]}>Discount</Text>
                            <Text style={[styles.summaryValue, { color: '#34C759' }]}>-₹{discount.toLocaleString()}</Text>
                        </View>
                    )}
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.checkoutBtn, isCheckoutLoading && { opacity: 0.7 }]}
                        onPress={handleCheckout}
                        disabled={isCheckoutLoading}
                    >
                        <Text style={styles.checkoutText}>{isCheckoutLoading ? 'Processing...' : 'Proceed onto Checkout'}</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7', // Standard iOS background gray
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: '#F2F2F7',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#000',
    },
    headerCount: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 4,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 1, // Separator line effect
    },
    itemImage: {
        width: 80,
        height: 100,
        borderRadius: 8,
        backgroundColor: '#F2F2F7',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    itemBrand: {
        fontSize: 10,
        fontWeight: '600',
        color: '#8E8E93',
        textTransform: 'uppercase',
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    itemSize: {
        fontSize: 12,
        color: '#8E8E93',
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: '#000',
    },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    qtyBtn: {
        padding: 4,
    },
    qtyText: {
        fontSize: 14,
        fontWeight: '600',
        marginHorizontal: 10,
    },
    removeBtn: {
        justifyContent: 'center',
        paddingLeft: 10,
    },
    extrasContainer: {
        marginTop: 20,
        backgroundColor: '#fff',
    },
    promoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    promoText: {
        marginLeft: 10,
        fontSize: 15,
        fontWeight: '500',
    },
    rewardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    rewardTitle: {
        fontSize: 15,
        fontWeight: '500',
    },
    rewardSubtitle: {
        fontSize: 12,
        color: '#34C759',
        fontWeight: '600',
    },
    footer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#8E8E93',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    divider: {
        height: 1,
        backgroundColor: '#F2F2F7',
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '800',
        color: '#000',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#000',
    },
    checkoutBtn: {
        backgroundColor: '#000',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderRadius: 30,
    },
    checkoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginRight: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8E8E93',
        marginBottom: 20,
    },
    shopBtn: {
        backgroundColor: '#000',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
    },
    shopBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default CartScreen;
