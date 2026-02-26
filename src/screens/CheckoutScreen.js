import { Image } from 'expo-image';
import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../theme';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import { useCart } from '../context/CartContext';
import { useRewards } from '../context/RewardsContext';
import { useAuth } from '../context/AuthContext';
import VeloraButton from '../components/VeloraButton';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp, query, getDocs } from 'firebase/firestore';

const CheckoutScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { cartItems, clearCart } = useCart();
    const { calculateDiscount, REWARD_CARDS, selectedCard, addSpending } = useRewards();
    const { user, userData } = useAuth();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        if (route.params?.selectedAddressId) {
            setSelectedAddress(route.params.selectedAddressId);
        }
    }, [route.params?.selectedAddressId]);

    useFocusEffect(
        useCallback(() => {
            const fetchAddresses = async () => {
                if (!user?.uid) return;
                try {
                    const q = query(collection(db, 'users', user.uid, 'addresses'));
                    const querySnapshot = await getDocs(q);
                    const addrList = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    // Sort: default address first
                    addrList.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
                    setAddresses(addrList);

                    // Set default selectedAddress if none is selected, or if the current one was deleted
                    setSelectedAddress(currentSelected => {
                        if (!currentSelected || !addrList.find(a => a.id === currentSelected)) {
                            return addrList.length > 0 ? addrList[0].id : null;
                        }
                        return currentSelected;
                    });
                } catch (error) {
                    console.error('Error fetching addresses:', error);
                }
            };
            fetchAddresses();
        }, [user?.uid])
    );

    const [selectedPayment, setSelectedPayment] = useState('upi');

    // Payment Form States
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');

    const subtotal = cartItems.reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);
    const shipping = 499;

    // Calculate reward card discount
    const { discount, discountPercent } = calculateDiscount(subtotal);
    const total = subtotal + shipping - discount;

    const handlePlaceOrder = async () => {
        // Validation
        if (!cartItems || cartItems.length === 0) {
            Alert.alert('Error', 'Your bag is empty');
            return;
        }

        if (!selectedAddress) {
            Alert.alert('Error', 'Please select a shipping address');
            return;
        }

        if (selectedPayment === 'upi') {
            const upiRegex = /^[A-Za-z0-9]+([._-][A-Za-z0-9]+)*@[A-Za-z0-9]+([.-][A-Za-z0-9]+)*$/;
            if (!upiRegex.test(upiId)) {
                Alert.alert('Error', 'Please enter a valid UPI ID');
                return;
            }
        } else if (selectedPayment === 'card') {
            // Card Name Validation
            if (!cardName.trim()) {
                Alert.alert('Error', 'Please enter the name on card');
                return;
            }

            // Card Number Validation (16 digits or 15 for Amex)
            const cleanCardNumber = cardNumber.replace(/\s?/g, '');
            const isAmex = cleanCardNumber.startsWith('34') || cleanCardNumber.startsWith('37');
            const expectedLength = isAmex ? 15 : 16;

            if (!/^\d+$/.test(cleanCardNumber) || cleanCardNumber.length !== expectedLength) {
                Alert.alert('Error', `Please enter a valid ${expectedLength}-digit card number${isAmex ? ' (Amex)' : ''}`);
                return;
            }

            // Expiry Validation (MM/YY)
            const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!expiryRegex.test(expiry)) {
                Alert.alert('Error', 'Please enter a valid expiry date (MM/YY)');
                return;
            }

            const [expMonth, expYear] = expiry.split('/').map(n => parseInt(n, 10));
            const now = new Date();
            const currentYear = parseInt(now.getFullYear().toString().slice(-2), 10);
            const currentMonth = now.getMonth() + 1;

            if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
                Alert.alert('Error', 'Card has expired');
                return;
            }

            // CVV Validation (3 digits or 4 for Amex)
            const expectedCvvLength = isAmex ? 4 : 3;
            if (!/^\d+$/.test(cvv) || cvv.length !== expectedCvvLength) {
                Alert.alert('Error', `Please enter a valid ${expectedCvvLength}-digit CVV`);
                return;
            }
        }

        if (selectedPayment !== 'cod') {
            // TODO: implement payment gateway integration here, referencing selectedPayment, newOrder, and addDoc
            // e.g. await processPayment(paymentPayload);
            Alert.alert('Payment Not Supported', 'Only Cash on Delivery is currently supported. Please select COD.');
            return;
        }

        try {
            // Find selected address obj
            const selectedAddressObj = addresses.find(a => a.id === selectedAddress);
            if (!selectedAddressObj) {
                Alert.alert('Error', 'Invalid selected address');
                return;
            }

            const addrParts = [
                selectedAddressObj?.street,
                selectedAddressObj?.city,
                selectedAddressObj?.state
            ].filter(Boolean).join(', ');
            const zipPart = selectedAddressObj?.zipCode ? ` - ${selectedAddressObj.zipCode}` : '';
            const namePart = selectedAddressObj?.name || '';
            const fullAddress = namePart ? `${namePart}\n${addrParts}${zipPart}` : `${addrParts}${zipPart}`;

            // Build order items
            const orderItems = cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.priceNum,
                quantity: item.quantity,
                image: item.image,
                brand: item.brand || 'Velora',
                size: item.size
            }));

            // Create Order Document
            // TODO: Move price validation/computation to a server-side Cloud Function or Firestore security rules.
            // Do not persist client-sent total/subtotal/shipping/discount directly without validation so tampered clients cannot write inconsistent totals.
            const newOrder = {
                userId: user?.uid || userData?.uid || 'guest',
                customerName: user?.displayName || userData?.displayName || 'guest',
                shippingName: selectedAddressObj.name,
                customerEmail: userData?.email || '',
                customerPhone: selectedAddressObj.phone,
                shippingAddress: fullAddress,
                address: fullAddress,
                items: orderItems,
                itemsCount: orderItems.reduce((sum, i) => sum + i.quantity, 0),
                total,
                subtotal,
                shipping,
                discount,
                paymentMethod: selectedPayment,
                status: 'pending',
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'orders'), newOrder);

            try {
                // Add spending to rewards
                await addSpending(total);
            } catch (err) {
                console.warn('Failed to add spending:', err);
            }

            // Clear the cart
            clearCart();

            navigation.navigate('OrderSuccess');
        } catch (error) {
            console.error('Order creation error:', error);
            Alert.alert('Payment Failed', error.message || 'Something went wrong while processing your order.');
        }
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Checkout</Text>
            <View style={{ width: 40 }} />
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {renderHeader()}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Shipping Address Section */}
                <Text style={styles.sectionHeader}>SHIPPING ADDRESS</Text>
                <View style={styles.groupContainer}>
                    {addresses.length === 0 ? (
                        <View style={[styles.rowItem, styles.separator]}>
                            <Text style={styles.addrText}>No addresses found.</Text>
                        </View>
                    ) : (
                        addresses.map((addr, index) => (
                            <TouchableOpacity
                                key={addr.id}
                                style={[
                                    styles.rowItem,
                                    index !== addresses.length - 1 && styles.separator
                                ]}
                                onPress={() => setSelectedAddress(addr.id)}
                            >
                                <View style={{ flex: 1 }}>
                                    <View style={styles.addrHeader}>
                                        <Text style={styles.addrName}>{addr.name}</Text>
                                        <View style={styles.tag}>
                                            <Text style={styles.tagText}>{addr.type || 'Home'}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.addrText}>{addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</Text>
                                    <Text style={styles.addrText}>{addr.phone}</Text>
                                </View>
                                {selectedAddress === addr.id && (
                                    <Ionicons name="checkmark-circle" size={22} color="#007BFF" />
                                )}
                            </TouchableOpacity>
                        ))
                    )}
                    <TouchableOpacity
                        style={[styles.rowItem, styles.separator, { justifyContent: 'center' }]}
                        onPress={() => navigation.navigate('AddressBook', {
                            isSelectionMode: true
                        })}
                    >
                        <Text style={styles.actionText}>Select / Add Address</Text>
                    </TouchableOpacity>
                </View>

                {/* Payment Section */}
                <Text style={styles.sectionHeader}>PAYMENT METHOD</Text>
                <View style={styles.groupContainer}>
                    <TouchableOpacity
                        style={[styles.rowItem, styles.separator]}
                        onPress={() => setSelectedPayment('upi')}
                    >
                        <View style={styles.paymentRow}>
                            <MaterialCommunityIcons name="lightning-bolt" size={22} color="#FD7E14" />
                            <Text style={styles.paymentText}>UPI / Apps</Text>
                        </View>
                        {selectedPayment === 'upi' ? <Ionicons name="checkmark-circle" size={22} color="#007BFF" /> : <View style={styles.radioCircle} />}
                    </TouchableOpacity>

                    {selectedPayment === 'upi' && (
                        <View style={styles.expandedInput}>
                            <TextInput
                                style={styles.inputField}
                                placeholder="Enter UPI ID (e.g. name@okhdfc)"
                                value={upiId}
                                onChangeText={setUpiId}
                            />
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.rowItem, styles.separator]}
                        onPress={() => setSelectedPayment('card')}
                    >
                        <View style={styles.paymentRow}>
                            <MaterialCommunityIcons name="credit-card" size={22} color="#007BFF" />
                            <Text style={styles.paymentText}>Credit / Debit Card</Text>
                        </View>
                        {selectedPayment === 'card' ? <Ionicons name="checkmark-circle" size={22} color="#007BFF" /> : <View style={styles.radioCircle} />}
                    </TouchableOpacity>

                    {selectedPayment === 'card' && (
                        <View style={styles.expandedInput}>
                            <TextInput
                                style={[styles.inputField, { marginBottom: 10 }]}
                                placeholder="Name on Card"
                                value={cardName}
                                onChangeText={setCardName}
                                autoCapitalize="words"
                            />
                            <TextInput
                                style={styles.inputField}
                                placeholder="Card Number"
                                value={cardNumber}
                                onChangeText={setCardNumber}
                                keyboardType="numeric"
                            />
                            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                                <TextInput
                                    style={[styles.inputField, { flex: 1 }]}
                                    placeholder="MM/YY"
                                    value={expiry}
                                    onChangeText={setExpiry}
                                />
                                <TextInput
                                    style={[styles.inputField, { flex: 1 }]}
                                    placeholder="CVV"
                                    value={cvv}
                                    onChangeText={setCvv}
                                    keyboardType="numeric"
                                    secureTextEntry
                                />
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.rowItem}
                        onPress={() => setSelectedPayment('cod')}
                    >
                        <View style={styles.paymentRow}>
                            <MaterialCommunityIcons name="cash" size={22} color="#28A745" />
                            <Text style={styles.paymentText}>Cash on Delivery</Text>
                        </View>
                        {selectedPayment === 'cod' ? <Ionicons name="checkmark-circle" size={22} color="#007BFF" /> : <View style={styles.radioCircle} />}
                    </TouchableOpacity>
                </View>

                {/* Reward Applied */}
                {selectedCard && REWARD_CARDS[selectedCard] && (
                    <View style={styles.rewardBanner}>
                        <MaterialCommunityIcons name="star-circle" size={24} color="#FFF" />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.rewardTitle}>{REWARD_CARDS[selectedCard].title} Applied</Text>
                            <Text style={styles.rewardSubtitle}>You saved ₹{discount.toLocaleString()} with {discountPercent}% off</Text>
                        </View>
                    </View>
                )}

                {/* Summary */}
                <Text style={styles.sectionHeader}>ORDER SUMMARY</Text>
                <View style={styles.groupContainer}>
                    <View style={[styles.rowItem, styles.separator]}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>₹{subtotal.toLocaleString()}</Text>
                    </View>
                    <View style={[styles.rowItem, styles.separator]}>
                        <Text style={styles.summaryLabel}>Shipping</Text>
                        <Text style={styles.summaryValue}>₹{shipping.toLocaleString()}</Text>
                    </View>
                    {discount > 0 && (
                        <View style={[styles.rowItem, styles.separator]}>
                            <Text style={[styles.summaryLabel, { color: '#28A745' }]}>Discount</Text>
                            <Text style={[styles.summaryValue, { color: '#28A745' }]}>-₹{discount.toLocaleString()}</Text>
                        </View>
                    )}
                    <View style={styles.rowItem}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Sticky Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
                <VeloraButton
                    title={`PAY ₹${total.toLocaleString()}`}
                    onPress={handlePlaceOrder}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7', // iOS grouped background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF'
    },
    backBtn: {
        width: 40,
        justifyContent: 'center'
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000'
    },
    scrollContent: {
        paddingTop: 20,
        paddingBottom: 120, // space for footer
    },
    sectionHeader: {
        fontSize: 13,
        color: '#6D6D72',
        fontWeight: '500',
        marginLeft: 16,
        marginBottom: 8,
        textTransform: 'uppercase'
    },
    groupContainer: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginHorizontal: 16,
        marginBottom: 24,
        overflow: 'hidden'
    },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFF'
    },
    separator: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#C6C6C8'
    },
    addrHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
    addrName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginRight: 8
    },
    tag: {
        backgroundColor: '#E5E5EA',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4
    },
    tagText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#000'
    },
    addrText: {
        fontSize: 14,
        color: '#3C3C43',
        marginTop: 2
    },
    actionText: {
        fontSize: 16,
        color: '#007BFF'
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    paymentText: {
        fontSize: 16,
        marginLeft: 12,
        color: '#000'
    },
    radioCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: '#C6C6C8'
    },
    expandedInput: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#FFF'
    },
    inputField: {
        backgroundColor: '#F2F2F7',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: '#000'
    },
    summaryLabel: {
        fontSize: 16,
        color: '#3C3C43'
    },
    summaryValue: {
        fontSize: 16,
        color: '#000'
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000'
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000'
    },
    rewardBanner: {
        marginHorizontal: 16,
        marginBottom: 24,
        backgroundColor: '#000',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4
    },
    rewardTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    rewardSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        paddingTop: 16,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#C6C6C8'
    }
});

export default CheckoutScreen;
