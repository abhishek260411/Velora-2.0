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

const ORDERS = [
    {
        id: 'VL-2026-001',
        date: '23 Jan 2026',
        total: '₹16,797',
        status: 'Processing',
        itemsCount: 2,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200'
    },
    {
        id: 'VL-2025-452',
        date: '15 Dec 2025',
        total: '₹8,499',
        status: 'Delivered',
        itemsCount: 1,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=200'
    }
];

const MyOrdersScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color={theme.colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>MY ORDERS</Text>
                <View style={{ width: 26 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {ORDERS.length > 0 ? (
                    ORDERS.map((order) => (
                        <TouchableOpacity
                            key={order.id}
                            style={styles.orderCard}
                            onPress={() => navigation.navigate('OrderDetails')}
                        >
                            <View style={styles.orderHeader}>
                                <View>
                                    <Text style={styles.orderId}>Order {order.id}</Text>
                                    <Text style={styles.orderDate}>{order.date}</Text>
                                </View>
                                <View style={[
                                    styles.statusBadge,
                                    { backgroundColor: order.status === 'Delivered' ? '#E8F5E9' : '#FFF3E0' }
                                ]}>
                                    <Text style={[
                                        styles.statusText,
                                        { color: order.status === 'Delivered' ? '#2E7D32' : '#EF6C00' }
                                    ]}>{order.status.toUpperCase()}</Text>
                                </View>
                            </View>

                            <View style={styles.orderBody}>
                                <Image source={{ uri: order.image }} style={styles.orderImg} />
                                <View style={styles.orderInfo}>
                                    <Text style={styles.itemsLabel}>{order.itemsCount} Items</Text>
                                    <View style={styles.priceRow}>
                                        <Text style={styles.totalLabel}>Grand Total</Text>
                                        <Text style={styles.totalValue}>{order.total}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.orderFooter}>
                                <Text style={styles.viewDetails}>VIEW DETAILS</Text>
                                <MaterialCommunityIcons name="chevron-right" size={18} color={theme.colors.black} />
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="package-variant" size={80} color={theme.colors.gray} />
                        <Text style={styles.emptyText}>NO ORDERS YET</Text>
                        <Text style={styles.emptySub}>You haven't placed any orders with us yet.</Text>
                    </View>
                )}
            </ScrollView>

        </View >
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
    },
    orderCard: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: theme.colors.white,
        borderWidth: 1,
        borderColor: theme.colors.gray,
        marginBottom: 20,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray,
        marginBottom: 15,
    },
    orderId: {
        ...theme.typography.body,
        fontSize: 14,
        fontWeight: 'bold',
    },
    orderDate: {
        ...theme.typography.body,
        fontSize: 12,
        color: theme.colors.darkGray,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        ...theme.typography.subHeader,
        fontSize: 10,
        fontWeight: '900',
    },
    orderBody: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderImg: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: theme.colors.gray,
    },
    orderInfo: {
        flex: 1,
        marginLeft: 15,
    },
    itemsLabel: {
        ...theme.typography.body,
        fontSize: 13,
        color: theme.colors.darkGray,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    totalLabel: {
        ...theme.typography.body,
        fontSize: 12,
    },
    totalValue: {
        ...theme.typography.body,
        fontSize: 15,
        fontWeight: 'bold',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray,
    },
    viewDetails: {
        ...theme.typography.subHeader,
        fontSize: 12,
        letterSpacing: 1,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        ...theme.typography.header,
        fontSize: 18,
        marginTop: 20,
    },
    emptySub: {
        ...theme.typography.body,
        color: theme.colors.darkGray,
        marginTop: 8,
    }
});

export default MyOrdersScreen;
