import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import VeloraButton from '../components/VeloraButton';
import SwipeButton from '../components/SwipeButton';
import DynamicIslandAlert from '../components/DynamicIslandAlert';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

const CART_ITEMS = [
    {
        id: '1',
        name: 'Velocity 1.0 Sneakers',
        brand: 'VELORA ORIGINALS',
        price: '₹12,999',
        priceNum: 12999,
        size: 'UK 9',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    },
    {
        id: '2',
        name: 'Performance Running Tee',
        brand: 'VELORA TRAINING',
        price: '₹3,299',
        priceNum: 3299,
        size: 'L',
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600',
    }
];

const CartScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { cartItems, updateQuantity, removeFromCart } = useCart();

    // Safety check just in case
    const items = cartItems || [];

    // Helper to calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);
    const shipping = 499;
    const total = subtotal + shipping;

    const renderItem = (item) => (
        <View key={`${item.id}-${item.size}`} style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <View style={styles.itemHeader}>
                    <View>
                        <Text style={styles.itemBrand}>{item.brand || 'VELORA'}</Text>
                        <Text style={styles.itemName}>{item.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeFromCart(item.id, item.size)}>
                        <MaterialCommunityIcons name="close" size={20} color={theme.colors.darkGray} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.itemMeta}>Size: {item.size}</Text>
                <View style={styles.itemFooter}>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => updateQuantity(item.id, item.size, -1)}
                        >
                            <MaterialCommunityIcons name="minus" size={16} color={theme.colors.black} />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => updateQuantity(item.id, item.size, 1)}
                        >
                            <MaterialCommunityIcons name="plus" size={16} color={theme.colors.black} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.itemPrice}>₹{(item.priceNum * item.quantity).toLocaleString()}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color={theme.colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>YOUR BAG ({items.length})</Text>
                <View style={{ width: 26 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {items.length > 0 ? (
                    items.map(renderItem)
                ) : (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="shopping-outline" size={80} color={theme.colors.gray} />
                        <Text style={styles.emptyText}>YOUR BAG IS EMPTY</Text>
                        <VeloraButton
                            title="START SHOPPING"
                            onPress={() => navigation.navigate('Home')}
                            style={styles.emptyBtn}
                        />
                    </View>
                )}

                {items.length > 0 && (
                    <View style={styles.promoContainer}>
                        <TouchableOpacity style={styles.promoBtn}>
                            <Text style={styles.promoText}>ADD PROMO CODE</Text>
                            <MaterialCommunityIcons name="plus" size={20} color={theme.colors.black} />
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {items.length > 0 && (
                <View style={[styles.summaryContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                    <GlassCard style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal</Text>
                            <Text style={styles.summaryValue}>₹{subtotal.toLocaleString()}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Shipping</Text>
                            <Text style={styles.summaryValue}>₹{shipping.toLocaleString()}</Text>
                        </View>
                        <View style={[styles.summaryRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
                        </View>
                        <View style={{ marginTop: 24 }}>
                            <SwipeButton
                                title="SWIPE -> CHECKOUT"
                                onSwipeSuccess={() => navigation.navigate('Checkout')}
                            />
                        </View>
                    </GlassCard>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray,
    },
    headerTitle: {
        ...theme.typography.header,
        fontSize: 16,
        letterSpacing: 2,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 250,
    },
    cartItem: {
        flexDirection: 'row',
        marginBottom: 25,
        backgroundColor: theme.colors.white,
    },
    itemImage: {
        width: 100,
        height: 125,
        borderRadius: 4,
        backgroundColor: theme.colors.gray,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'space-between',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemBrand: {
        ...theme.typography.subHeader,
        fontSize: 9,
        color: theme.colors.darkGray,
    },
    itemName: {
        ...theme.typography.body,
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 2,
    },
    itemMeta: {
        ...theme.typography.body,
        fontSize: 12,
        color: theme.colors.darkGray,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.gray,
        borderRadius: 20,
        padding: 4,
    },
    qtyBtn: {
        padding: 6,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 15,
    },
    qtyText: {
        ...theme.typography.body,
        fontSize: 14,
        fontWeight: 'bold',
        paddingHorizontal: 12,
    },
    itemPrice: {
        ...theme.typography.body,
        fontSize: 14,
        fontWeight: '900',
    },
    summaryContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 20,
    },
    summaryCard: {
        padding: 24,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.98)',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        ...theme.typography.body,
        color: theme.colors.darkGray,
    },
    summaryValue: {
        ...theme.typography.body,
        fontWeight: '600',
    },
    totalRow: {
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray,
        marginBottom: 20,
    },
    totalLabel: {
        ...theme.typography.header,
        fontSize: 18,
    },
    totalValue: {
        ...theme.typography.header,
        fontSize: 18,
    },
    checkoutBtn: {
        height: 56,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        ...theme.typography.header,
        fontSize: 18,
        marginTop: 20,
        color: theme.colors.darkGray,
    },
    emptyBtn: {
        width: 200,
        marginTop: 30,
    },
    promoContainer: {
        marginTop: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: theme.colors.gray,
    },
    promoBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
    },
    promoText: {
        ...theme.typography.subHeader,
        fontSize: 12,
        letterSpacing: 1,
    }
});

export default CartScreen;
