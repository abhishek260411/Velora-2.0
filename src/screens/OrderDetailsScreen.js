import { Image } from 'expo-image';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

const OrderDetailsScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { order } = route.params || {};

    if (!order) {
        return (
            <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
                <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#C7C7CC" />
                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>ORDER NOT FOUND</Text>
                <TouchableOpacity
                    style={[styles.returnBtn, { marginTop: 20, paddingHorizontal: 30 }]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.returnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Formatting
    const formatCurrency = (amount) => {
        const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.-]+/g, '')) || 0;
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
    };

    const total = formatCurrency(order.total || order.billing?.total || 0);
    const subtotal = formatCurrency(order.subtotal || order.billing?.subtotal || order.total || 0);
    const shipping = formatCurrency(order.shipping || order.billing?.shipping || 0);
    const discount = order.discount > 0 ? formatCurrency(order.discount) : null;
    const address = order.shippingAddress || order.address || 'No address provided';
    const items = order.items || [];
    const status = (order.status || 'Processing').charAt(0).toUpperCase() + (order.status || 'Processing').slice(1);
    const id = order.id;
    if (!id) {
        return (
            <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
                <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#C7C7CC" />
                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>INVALID ORDER DATA</Text>
                <TouchableOpacity
                    style={[styles.returnBtn, { marginTop: 20, paddingHorizontal: 30 }]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.returnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const getStatusColor = (statusVal) => {
        const s = statusVal?.toLowerCase() || '';
        if (s.includes('delivered')) return '#2E7D32';
        if (s.includes('cancel')) return '#C62828';
        if (s.includes('process')) return '#E65100';
        if (s.includes('ship')) return '#1976D2';
        if (s.includes('transit')) return '#512DA8';
        return '#757575';
    };

    const getStatusBg = (statusVal) => {
        const s = statusVal?.toLowerCase() || '';
        if (s.includes('delivered')) return '#E8F5E9';
        if (s.includes('cancel')) return '#FFEBEE';
        if (s.includes('process')) return '#FFF3E0';
        if (s.includes('ship')) return '#E3F2FD';
        if (s.includes('transit')) return '#EDE7F6';
        return '#EEEEEE';
    };

    const handleCancelOrder = () => {
        Alert.alert(
            "Cancel Order",
            "Are you sure you want to cancel this order?",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes, Cancel",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const orderRef = doc(db, 'orders', id);
                            await updateDoc(orderRef, { status: 'Cancelled' });
                            navigation.goBack();
                        } catch (e) {
                            Alert.alert("Error", "Could not cancel order.");
                        }
                    }
                }
            ]
        );
    };

    const handleDownloadInvoice = () => {
        Alert.alert("Invoice Download", "Invoice has been sent to your registered email.");
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color={theme.colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ORDER #{id.slice(0, 8).toUpperCase()}</Text>
                <View style={[
                    styles.statusPill,
                    { backgroundColor: getStatusBg(status) }
                ]}>
                    <View style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(status) }
                    ]} />
                    <Text style={[
                        styles.statusText,
                        { color: getStatusColor(status) }
                    ]}>{status}</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Actions Bar */}
                <View style={styles.actionsBar}>
                    {(status === 'Processing' || status === 'Placed' || status === 'Shipped') && (
                        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('TrackOrder', { order })}>
                            <MaterialCommunityIcons name="map-marker-path" size={20} color="#007BFF" />
                            <Text style={styles.actionText}>Track</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.actionBtn} onPress={handleDownloadInvoice}>
                        <MaterialCommunityIcons name="file-document-outline" size={20} color="#007BFF" />
                        <Text style={styles.actionText}>Invoice</Text>
                    </TouchableOpacity>
                </View>

                {/* Items List */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ITEMS ({items.length})</Text>
                    {items.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <Image source={{ uri: item.image }} style={styles.itemImg} contentFit="cover" />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemBrand}>{item.brand}</Text>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemMeta}>Size: {item.size || 'N/A'} | Qty: {item.quantity || item.qty || 1}</Text>
                                <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Shipping Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SHIPPING TO</Text>
                    <View style={styles.card}>
                        <Text style={styles.cardText}>{address}</Text>
                    </View>
                </View>

                {/* Payment Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PAYMENT SUMMARY</Text>
                    <View style={styles.billBox}>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Subtotal</Text>
                            <Text style={styles.billValue}>{subtotal}</Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Shipping</Text>
                            <Text style={styles.billValue}>{shipping}</Text>
                        </View>
                        {discount && (
                            <View style={styles.billRow}>
                                <Text style={[styles.billLabel, { color: '#28A745' }]}>Discount</Text>
                                <Text style={[styles.billValue, { color: '#28A745' }]}>-{discount}</Text>
                            </View>
                        )}
                        <View style={[styles.billRow, styles.grandTotalRow]}>
                            <Text style={styles.grandTotalLabel}>Grand Total</Text>
                            <Text style={styles.grandTotalValue}>{total}</Text>
                        </View>
                    </View>
                </View>

                {/* Footer Actions: Cancel or Return */}
                <View style={styles.footerActions}>
                    {(status === 'Processing' || status === 'Placed') && (
                        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelOrder}>
                            <Text style={styles.cancelText}>Cancel Order</Text>
                        </TouchableOpacity>
                    )}

                    {status === 'Delivered' && (
                        <TouchableOpacity
                            style={styles.returnBtn}
                            onPress={() => navigation.navigate('ReturnRefund', { order })}
                        >
                            <Text style={styles.returnText}>Return / Exchange</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity style={styles.helpBtn}>
                    <MaterialCommunityIcons name="help-circle-outline" size={20} color={theme.colors.black} />
                    <Text style={styles.helpText}>NEED HELP WITH THIS ORDER?</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray
    },
    headerTitle: {
        ...theme.typography.header,
        fontSize: 16,
        letterSpacing: 2
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 50
    },
    actionsBar: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 25
    },
    statusPill: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 100
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600'
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0F8FF',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007BFF'
    },
    section: {
        marginBottom: 30
    },
    sectionTitle: {
        ...theme.typography.subHeader,
        fontSize: 12,
        letterSpacing: 1.5,
        color: theme.colors.darkGray,
        marginBottom: 15
    },
    itemRow: {
        flexDirection: 'row',
        marginBottom: 20
    },
    itemImg: {
        width: 80,
        height: 100,
        borderRadius: 8,
        backgroundColor: theme.colors.gray,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center'
    },
    itemBrand: {
        ...theme.typography.subHeader,
        fontSize: 9,
        color: theme.colors.darkGray
    },
    itemName: {
        ...theme.typography.body,
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 2
    },
    itemMeta: {
        ...theme.typography.body,
        fontSize: 12,
        color: theme.colors.darkGray,
        marginTop: 4
    },
    itemPrice: {
        ...theme.typography.body,
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8
    },
    card: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: theme.colors.gray
    },
    cardText: {
        ...theme.typography.body,
        fontSize: 13,
        lineHeight: 20
    },
    billBox: {
        paddingTop: 10
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    billLabel: {
        ...theme.typography.body,
        color: theme.colors.darkGray
    },
    billValue: {
        ...theme.typography.body,
        fontWeight: '600'
    },
    grandTotalRow: {
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray
    },
    grandTotalLabel: {
        ...theme.typography.body,
        fontSize: 16,
        fontWeight: 'bold'
    },
    grandTotalValue: {
        ...theme.typography.body,
        fontSize: 18,
        fontWeight: '900'
    },
    footerActions: {
        marginTop: 0,
        marginBottom: 30
    },
    cancelBtn: {
        backgroundColor: '#FFEBEE',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFCDD2'
    },
    cancelText: {
        color: '#D32F2F',
        fontWeight: 'bold',
        fontSize: 14
    },
    returnBtn: {
        backgroundColor: '#000',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center'
    },
    returnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14
    },
    helpBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: theme.colors.gray,
        borderRadius: 12,
        marginBottom: 30
    },
    helpText: {
        ...theme.typography.subHeader,
        fontSize: 12,
        marginLeft: 10
    }
});

export default OrderDetailsScreen;
