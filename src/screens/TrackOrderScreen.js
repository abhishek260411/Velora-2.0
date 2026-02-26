
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const TrackOrderScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { order } = route.params || {};

    // Fallback data if order is missing properties
    const defaultTimeline = [
        { title: 'Order Placed', date: 'Feb 10, 10:30 AM', completed: true, location: 'Mumbai, IN' },
        { title: 'Order Confirmed', date: 'Feb 10, 11:15 AM', completed: true, location: 'Mumbai, IN' },
        { title: 'Shipped', date: 'Feb 11, 09:00 AM', completed: true, location: 'Bhiwandi Hub' },
        { title: 'In Transit', date: 'Feb 12, 02:30 PM', completed: false, location: 'Pune Logistics Center' },
        { title: 'Out for Delivery', date: 'Pending', completed: false, location: '-' },
        { title: 'Delivered', date: 'Pending', completed: false, location: '-' },
    ];

    if (!order?.id) {
        return (
            <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="alert-circle-outline" size={64} color="#8E8E93" />
                <Text style={{ marginTop: 16, fontSize: 16, fontWeight: 'bold' }}>Order data unavailable</Text>
                <TouchableOpacity
                    style={{ marginTop: 20, paddingHorizontal: 30, paddingVertical: 12, backgroundColor: '#000', borderRadius: 8 }}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const orderData = {
        ...order,
        id: order.id,
        status: order.status || 'Shipped',
        estimatedDelivery: order.estimatedDelivery || '--',
        trackingNumber: order.trackingNumber || '--',
        courier: order.courier || '--',
        timeline: order.timeline || defaultTimeline
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Track Order</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* Map Visual Placeholder */}
                <View style={styles.mapPlaceholder}>
                    <MaterialCommunityIcons name="map-marker-radius" size={48} color="#007BFF" />
                    <Text style={styles.mapText}>Map View Placeholder</Text>
                </View>

                {/* Order Info Card */}
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Order ID</Text>
                        <Text style={styles.value}>#{orderData.id.slice(0, 8).toUpperCase()}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Estimated Delivery</Text>
                        <Text style={[styles.value, { color: '#2E7D32' }]}>{orderData.estimatedDelivery}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Tracking ID</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Text style={styles.value}>{orderData.trackingNumber}</Text>
                            <Ionicons name="copy-outline" size={14} color="#007BFF" />
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Courier</Text>
                        <Text style={styles.value}>{orderData.courier}</Text>
                    </View>
                </View>

                {/* Timeline */}
                <View style={styles.timelineSection}>
                    <Text style={styles.sectionTitle}>Timeline</Text>

                    <View style={styles.timelineContainer}>
                        {orderData.timeline.map((item, index) => (
                            <View key={index} style={styles.timelineItem}>
                                <View style={styles.leftColumn}>
                                    <View style={[
                                        styles.dot,
                                        { backgroundColor: item.completed ? '#007BFF' : '#E5E5EA' }
                                    ]} />
                                    {index !== orderData.timeline.length - 1 && (
                                        <View style={[
                                            styles.line,
                                            { backgroundColor: item.completed ? '#007BFF' : '#E5E5EA' }
                                        ]} />
                                    )}
                                </View>
                                <View style={styles.rightColumn}>
                                    <Text style={[
                                        styles.stepTitle,
                                        { color: item.completed ? '#000' : '#8E8E93' }
                                    ]}>{item.title}</Text>
                                    <Text style={styles.stepDate}>{item.date}</Text>
                                    {item.location !== '-' && (
                                        <Text style={styles.stepLoc}>{item.location}</Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

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
        paddingHorizontal: 20,
        paddingBottom: 15,
        paddingTop: 10,
        backgroundColor: '#FFFFFF'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000'
    },
    content: {
        paddingBottom: 40
    },
    mapPlaceholder: {
        height: 200,
        backgroundColor: '#E1F5FE',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#B3E5FC'
    },
    mapText: {
        marginTop: 10,
        color: '#0288D1',
        fontWeight: '600'
    },
    card: {
        backgroundColor: '#FFFFFF',
        margin: 20,
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4
    },
    label: {
        fontSize: 14,
        color: '#8E8E93',
        fontWeight: '500'
    },
    value: {
        fontSize: 14,
        color: '#000',
        fontWeight: '600'
    },
    divider: {
        height: 1,
        backgroundColor: '#F2F2F7',
        marginVertical: 12
    },
    timelineSection: {
        paddingHorizontal: 20
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 15,
        color: '#000'
    },
    timelineContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20
    },
    timelineItem: {
        flexDirection: 'row',
        minHeight: 60
    },
    leftColumn: {
        alignItems: 'center',
        marginRight: 15,
        width: 20
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        zIndex: 1
    },
    line: {
        width: 2,
        flex: 1,
        marginTop: -2,
        marginBottom: -2
    },
    rightColumn: {
        flex: 1,
        paddingBottom: 20
    },
    stepTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4
    },
    stepDate: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 2
    },
    stepLoc: {
        fontSize: 12,
        color: '#8E8E93',
        fontStyle: 'italic'
    }
});

export default TrackOrderScreen;
