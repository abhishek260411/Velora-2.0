import { Image } from 'expo-image';
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const MyOrdersScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userData } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [userData]);

    const fetchOrders = async () => {
        const currentUserId = userData?.uid || 'guest';

        try {
            setError(null);
            const ordersRef = collection(db, 'orders');

            const q = query(
                ordersRef,
                where('userId', '==', currentUserId),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const orderList = [];
            querySnapshot.forEach((doc) => {
                orderList.push({ id: doc.id, ...doc.data() });
            });
            setOrders(orderList);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError(err.message || String(err));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const getStatusColor = (status) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('delivered')) return '#2E7D32'; // Green
        if (s.includes('cancel')) return '#C62828'; // Red
        if (s.includes('process')) return '#E65100'; // Orange
        if (s.includes('ship')) return '#1976D2'; // Blue
        if (s.includes('transit')) return '#512DA8'; // Purple
        return '#757575'; // Gray default
    };

    const getStatusBg = (status) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('delivered')) return '#E8F5E9';
        if (s.includes('cancel')) return '#FFEBEE';
        if (s.includes('process')) return '#FFF3E0';
        if (s.includes('ship')) return '#E3F2FD';
        if (s.includes('transit')) return '#EDE7F6';
        return '#EEEEEE';
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Orders</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {loading ? (
                    <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 50 }} />
                ) : error ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#FF3B30" />
                        <Text style={[styles.emptyText, { color: '#FF3B30' }]}>Failed to load orders</Text>
                        <Text style={styles.emptySub}>{error}</Text>
                        <TouchableOpacity
                            style={[styles.shopBtn, { backgroundColor: '#000' }]}
                            onPress={() => {
                                setLoading(true);
                                fetchOrders();
                            }}
                        >
                            <Text style={styles.shopBtnText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                ) : orders.length > 0 ? (
                    orders.map((order) => {
                        // Formatting logic
                        const rawTotal = order.total || order.billing?.total || 0;
                        const numericTotal = typeof rawTotal === 'number'
                            ? rawTotal
                            : parseFloat(String(rawTotal).replace(/[^\d.-]/g, '')) || 0;

                        const formattedTotal = new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0
                        }).format(numericTotal);

                        const itemsCount = order.items?.length || 0;
                        const date = order.createdAt?.toDate ? order.createdAt.toDate().toDateString() : order.date || 'Unknown Date';
                        const firstImage = order.items?.[0]?.image || 'https://via.placeholder.com/100';

                        return (
                            <TouchableOpacity
                                key={order.id}
                                style={styles.orderCard}
                                onPress={() => navigation.navigate('OrderDetails', { order })}
                                activeOpacity={0.9}
                            >
                                <View style={styles.cardTop}>
                                    <Image source={{ uri: firstImage }} style={styles.orderImage} contentFit="cover" />
                                    <View style={styles.orderInfo}>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</Text>
                                            <Text style={styles.orderDate}>{date}</Text>
                                        </View>
                                        <Text style={styles.itemsText}>{itemsCount} {itemsCount === 1 ? 'Item' : 'Items'} • {formattedTotal}</Text>
                                        <View style={[
                                            styles.statusPill,
                                            { backgroundColor: getStatusBg(order.status) }
                                        ]}>
                                            <View style={[
                                                styles.statusDot,
                                                { backgroundColor: getStatusColor(order.status) }
                                            ]} />
                                            <Text style={[
                                                styles.statusText,
                                                { color: getStatusColor(order.status) }
                                            ]}>{order.status}</Text>
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                                </View>
                            </TouchableOpacity>
                        );
                    })
                ) : (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="shopping-outline" size={64} color="#C7C7CC" />
                        <Text style={styles.emptyText}>No orders yet</Text>
                        <Text style={styles.emptySub}>Start shopping to see your orders here.</Text>
                        <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('HomeTab')}>
                            <Text style={styles.shopBtnText}>Start Shopping</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7'
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
        padding: 16,
        paddingBottom: 50
    },
    orderCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    orderImage: {
        width: 64,
        height: 64,
        borderRadius: 8,
        backgroundColor: '#F2F2F7',
    },
    orderInfo: {
        flex: 1,
        marginLeft: 16,
        marginRight: 8
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4
    },
    orderId: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000'
    },
    orderDate: {
        fontSize: 12,
        color: '#8E8E93'
    },
    itemsText: {
        fontSize: 13,
        color: '#3C3C43',
        marginBottom: 8
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
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginTop: 16
    },
    emptySub: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 8,
        marginBottom: 20
    },
    shopBtn: {
        paddingHorizontal: 25,
        paddingVertical: 12,
        backgroundColor: '#007BFF',
        borderRadius: 25
    },
    shopBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600'
    }
});

export default MyOrdersScreen;
