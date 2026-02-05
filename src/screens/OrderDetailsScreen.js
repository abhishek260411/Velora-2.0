import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ORDER_DATA = {
    id: 'VL-2026-001',
    date: 'Jan 23, 2026',
    status: 'In Transit',
    timeline: [
        { status: 'Order Placed', date: 'Jan 23, 10:30 AM', completed: true },
        { status: 'Order Confirmed', date: 'Jan 23, 11:15 AM', completed: true },
        { status: 'Shipped', date: 'Jan 24, 09:00 AM', completed: false },
        { status: 'Delivered', date: 'Jan 26, 05:00 PM', completed: false },
    ],
    items: [
        {
            id: '1',
            name: 'Velocity 1.0 Sneakers',
            brand: 'VELORA ORIGINALS',
            price: '₹12,999',
            size: 'UK 9',
            qty: 1,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200'
        },
        {
            id: '2',
            name: 'Performance Running Tee',
            brand: 'VELORA TRAINING',
            price: '₹3,299',
            size: 'L',
            qty: 1,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200'
        }
    ],
    address: 'Snehal Pinjari, 123, Luxury Heights, Palm Beach Road, Navi Mumbai - 400703',
    billing: {
        subtotal: '₹16,298',
        shipping: '₹499',
        total: '₹16,797'
    }
};

const OrderDetailsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color={theme.colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ORDER #{ORDER_DATA.id}</Text>
                <View style={{ width: 26 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Status Tracker */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ORDER STATUS</Text>
                    <View style={styles.timelineContainer}>
                        {ORDER_DATA.timeline.map((step, index) => (
                            <View key={index} style={styles.timelineItem}>
                                <View style={styles.timelineLeft}>
                                    <View style={[
                                        styles.dot,
                                        { backgroundColor: step.completed ? theme.colors.black : theme.colors.lightGray }
                                    ]} />
                                    {index !== ORDER_DATA.timeline.length - 1 && (
                                        <View style={[
                                            styles.line,
                                            { backgroundColor: step.completed ? theme.colors.black : theme.colors.gray }
                                        ]} />
                                    )}
                                </View>
                                <View style={styles.timelineRight}>
                                    <Text style={[
                                        styles.stepStatus,
                                        { color: step.completed ? theme.colors.black : theme.colors.darkGray }
                                    ]}>{step.status}</Text>
                                    <Text style={styles.stepDate}>{step.date}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Items List */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ITEMS ({ORDER_DATA.items.length})</Text>
                    {ORDER_DATA.items.map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                            <Image source={{ uri: item.image }} style={styles.itemImg} />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemBrand}>{item.brand}</Text>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemMeta}>Size: {item.size} | Qty: {item.qty}</Text>
                                <Text style={styles.itemPrice}>{item.price}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Shipping Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SHIPPING TO</Text>
                    <View style={styles.card}>
                        <Text style={styles.cardText}>{ORDER_DATA.address}</Text>
                    </View>
                </View>

                {/* Payment Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PAYMENT SUMMARY</Text>
                    <View style={styles.billBox}>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Subtotal</Text>
                            <Text style={styles.billValue}>{ORDER_DATA.billing.subtotal}</Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Shipping</Text>
                            <Text style={styles.billValue}>{ORDER_DATA.billing.shipping}</Text>
                        </View>
                        <View style={[styles.billRow, styles.grandTotalRow]}>
                            <Text style={styles.grandTotalLabel}>Grand Total</Text>
                            <Text style={styles.grandTotalValue}>{ORDER_DATA.billing.total}</Text>
                        </View>
                    </View>
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
        padding: 24,
    },
    section: {
        marginBottom: 40,
    },
    sectionTitle: {
        ...theme.typography.subHeader,
        fontSize: 12,
        letterSpacing: 1.5,
        color: theme.colors.darkGray,
        marginBottom: 20,
    },
    timelineContainer: {
        paddingLeft: 10,
    },
    timelineItem: {
        flexDirection: 'row',
        height: 60,
    },
    timelineLeft: {
        alignItems: 'center',
        marginRight: 20,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        zIndex: 1,
    },
    line: {
        width: 2,
        flex: 1,
        marginTop: -2,
    },
    timelineRight: {
        flex: 1,
        marginTop: -4,
    },
    stepStatus: {
        ...theme.typography.body,
        fontSize: 14,
        fontWeight: 'bold',
    },
    stepDate: {
        ...theme.typography.body,
        fontSize: 12,
        color: theme.colors.darkGray,
        marginTop: 2,
    },
    itemRow: {
        flexDirection: 'row',
        marginBottom: 20,
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
        justifyContent: 'center',
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
        marginTop: 4,
    },
    itemPrice: {
        ...theme.typography.body,
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: theme.colors.gray,
    },
    cardText: {
        ...theme.typography.body,
        fontSize: 13,
        lineHeight: 20,
    },
    billBox: {
        paddingTop: 10,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    billLabel: {
        ...theme.typography.body,
        color: theme.colors.darkGray,
    },
    billValue: {
        ...theme.typography.body,
        fontWeight: '600',
    },
    grandTotalRow: {
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray,
    },
    grandTotalLabel: {
        ...theme.typography.body,
        fontSize: 16,
        fontWeight: 'bold',
    },
    grandTotalValue: {
        ...theme.typography.body,
        fontSize: 18,
        fontWeight: '900',
    },
    helpBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: theme.colors.gray,
        borderRadius: 12,
        marginBottom: 30,
    },
    helpText: {
        ...theme.typography.subHeader,
        fontSize: 12,
        marginLeft: 10,
    }
});

export default OrderDetailsScreen;
