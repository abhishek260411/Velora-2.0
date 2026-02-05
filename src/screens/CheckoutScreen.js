import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import { TextInput } from 'react-native';
import { useCart } from '../context/CartContext';
import VeloraButton from '../components/VeloraButton';

const ADDRESSES = [
    {
        id: '1',
        type: 'Home',
        name: 'Snehal Pinjari',
        phone: '+91 98765 43210',
        address: '123, Luxury Heights, Palm Beach Road, Vashi, Navi Mumbai - 400703',
        selected: true
    },
    {
        id: '2',
        type: 'Work',
        name: 'Snehal Pinjari',
        phone: '+91 98765 43210',
        address: 'Velora HQ, Tech Park, Powai, Mumbai - 400076',
        selected: false
    }
];

const PAYMENT_METHODS = [
    { id: 'upi', name: 'UPI / GPay / PhonePe', icon: 'lightning-bolt' },
    { id: 'card', name: 'Credit / Debit Card', icon: 'credit-card-outline' },
    { id: 'cod', name: 'Cash on Delivery', icon: 'cash' },
];

const CheckoutScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { cartItems } = useCart();

    const [selectedAddress, setSelectedAddress] = useState('1');
    const [selectedPayment, setSelectedPayment] = useState('upi');

    // Payment Form States
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');

    const subtotal = cartItems.reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);
    const shipping = 499;
    const total = subtotal + shipping;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color={theme.colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>CHECKOUT</Text>
                <View style={{ width: 26 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Delivery Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>DELIVERY ADDRESS</Text>
                        <TouchableOpacity><Text style={styles.addText}>ADD NEW</Text></TouchableOpacity>
                    </View>
                    {ADDRESSES.map((addr) => (
                        <TouchableOpacity
                            key={addr.id}
                            style={[styles.addressItem, selectedAddress === addr.id && styles.activeItem]}
                            onPress={() => setSelectedAddress(addr.id)}
                        >
                            <View style={styles.addrLabelRow}>
                                <Text style={styles.addrType}>{addr.type.toUpperCase()}</Text>
                                <MaterialCommunityIcons
                                    name={selectedAddress === addr.id ? "radiobox-marked" : "radiobox-blank"}
                                    size={20}
                                    color={selectedAddress === addr.id ? theme.colors.black : theme.colors.lightGray}
                                />
                            </View>
                            <Text style={styles.addrName}>{addr.name}</Text>
                            <Text style={styles.addrDetail}>{addr.address}</Text>
                            <Text style={styles.addrPhone}>Phone: {addr.phone}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Payment Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>
                    {PAYMENT_METHODS.map((method) => {
                        const isSelected = selectedPayment === method.id;
                        return (
                            <View key={method.id} style={[styles.paymentContainer, isSelected && styles.activePaymentContainer]}>
                                <TouchableOpacity
                                    style={styles.paymentHeader}
                                    onPress={() => setSelectedPayment(method.id)}
                                >
                                    <View style={styles.paymentIconLabel}>
                                        <View style={[styles.iconCircle, isSelected && styles.activeIconCircle]}>
                                            <MaterialCommunityIcons
                                                name={method.icon}
                                                size={20}
                                                color={isSelected ? theme.colors.white : theme.colors.black}
                                            />
                                        </View>
                                        <Text style={styles.paymentName}>{method.name}</Text>
                                    </View>
                                    <MaterialCommunityIcons
                                        name={isSelected ? "radiobox-marked" : "radiobox-blank"}
                                        size={22}
                                        color={isSelected ? theme.colors.black : theme.colors.lightGray}
                                    />
                                </TouchableOpacity>

                                {/* Expanded Details */}
                                {isSelected && method.id === 'upi' && (
                                    <View style={styles.paymentDetails}>
                                        <Text style={styles.inputLabel}>ENTER UPI ID</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="e.g. name@upi"
                                            value={upiId}
                                            onChangeText={setUpiId}
                                            autoCapitalize="none"
                                        />
                                        <Text style={styles.helperText}>Securely pay via your preferred UPI app.</Text>
                                    </View>
                                )}

                                {isSelected && method.id === 'card' && (
                                    <View style={styles.paymentDetails}>
                                        <Text style={styles.inputLabel}>CARD NUMBER</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="0000 0000 0000 0000"
                                            keyboardType="numeric"
                                            value={cardNumber}
                                            onChangeText={setCardNumber}
                                            maxLength={19}
                                        />
                                        <View style={styles.rowInputs}>
                                            <View style={{ flex: 1, marginRight: 10 }}>
                                                <Text style={styles.inputLabel}>EXPIRY</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="MM/YY"
                                                    value={expiry}
                                                    onChangeText={setExpiry}
                                                    maxLength={5}
                                                />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.inputLabel}>CVV</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="123"
                                                    keyboardType="numeric"
                                                    secureTextEntry
                                                    value={cvv}
                                                    onChangeText={setCvv}
                                                    maxLength={4}
                                                />
                                            </View>
                                        </View>
                                        <Text style={styles.inputLabel}>NAME ON CARD</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Name as on card"
                                            value={cardName}
                                            onChangeText={setCardName}
                                        />
                                    </View>
                                )}

                                {isSelected && method.id === 'cod' && (
                                    <View style={styles.paymentDetails}>
                                        <Text style={styles.codText}>Pay digitally or with cash upon delivery.</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Order Review Snippet */}
                <View style={[styles.section, styles.lastSection]}>
                    <Text style={styles.sectionTitle}>ORDER SUMMARY</Text>
                    <View style={styles.summaryBox}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Amount ({cartItems.length} items)</Text>
                            <Text style={styles.summaryAmount}>₹{subtotal.toLocaleString()}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Shipping Charges</Text>
                            <Text style={styles.summaryAmount}>₹{shipping.toLocaleString()}</Text>
                        </View>
                        <View style={[styles.summaryRow, styles.totalRow]}>
                            <Text style={styles.totalText}>Total Payable</Text>
                            <Text style={styles.totalAmount}>₹{total.toLocaleString()}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action */}
            <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                <GlassCard style={styles.checkoutCard}>
                    <VeloraButton
                        title="PLACE ORDER"
                        onPress={() => navigation.navigate('OrderSuccess')}
                        style={styles.payBtn}
                    />
                </GlassCard>
            </View>
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
        paddingBottom: 150,
    },
    section: {
        marginBottom: 35,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        ...theme.typography.subHeader,
        fontSize: 12,
        letterSpacing: 1.5,
        color: theme.colors.darkGray,
        marginBottom: 15,
    },
    addText: {
        ...theme.typography.body,
        fontSize: 12,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    addressItem: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.gray,
        marginBottom: 12,
    },
    activeItem: {
        borderColor: theme.colors.black,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    addrLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    addrType: {
        ...theme.typography.subHeader,
        fontSize: 10,
        backgroundColor: theme.colors.gray,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    addrName: {
        ...theme.typography.body,
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    addrDetail: {
        ...theme.typography.body,
        fontSize: 13,
        color: theme.colors.darkGray,
        lineHeight: 18,
    },
    addrPhone: {
        ...theme.typography.body,
        fontSize: 12,
        marginTop: 4,
    },
    paymentName: {
        ...theme.typography.body,
        fontSize: 14,
        fontWeight: '600',
    },
    paymentIconLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.gray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    paymentContainer: {
        backgroundColor: theme.colors.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.gray,
        marginBottom: 12,
        overflow: 'hidden',
    },
    activePaymentContainer: {
        borderColor: theme.colors.black,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    paymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    paymentDetails: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 0,
    },
    activeIconCircle: {
        backgroundColor: theme.colors.black,
    },
    inputLabel: {
        ...theme.typography.subHeader,
        fontSize: 10,
        color: theme.colors.darkGray,
        marginBottom: 6,
        marginTop: 10,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray,
        paddingVertical: 8,
        fontSize: 16,
        fontFamily: theme.typography.body.fontFamily,
        color: theme.colors.black,
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    helperText: {
        ...theme.typography.body,
        fontSize: 11,
        color: theme.colors.darkGray,
        marginTop: 8,
    },
    codText: {
        ...theme.typography.body,
        fontSize: 13,
        color: theme.colors.darkGray,
    },
    summaryBox: {
        padding: 16,
        backgroundColor: theme.colors.gray,
        borderRadius: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryText: {
        ...theme.typography.body,
        fontSize: 13,
        color: theme.colors.darkGray,
    },
    summaryAmount: {
        ...theme.typography.body,
        fontSize: 13,
    },
    totalRow: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: theme.colors.lightGray,
        marginBottom: 0,
    },
    totalText: {
        ...theme.typography.body,
        fontSize: 15,
        fontWeight: 'bold',
    },
    totalAmount: {
        ...theme.typography.body,
        fontSize: 16,
        fontWeight: '900',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 20,
    },
    checkoutCard: {
        padding: 24,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.98)',
    },
    payBtn: {
        height: 56,
    }
});

export default CheckoutScreen;
