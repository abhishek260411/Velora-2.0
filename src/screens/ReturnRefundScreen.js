import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const REASONS = [
    'Size Issue - Too Small',
    'Size Issue - Too Large',
    'Damaged / Defective',
    'Received Wrong Item',
    'Quality Not as Expected',
    'Other'
];

const REFUND_METHODS = [
    { id: 'wallet', title: 'Velora Wallet', subtitle: 'Instant refund, usable on next purchase', icon: 'wallet-outline' },
    { id: 'source', title: 'Original Payment Mode', subtitle: '5-7 business days', icon: 'card-outline' },
];

const ReturnRefundScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { order } = route.params || {};

    // Mock item if no order passed
    const itemToReturn = order?.items?.[0] || {
        name: 'Velocity 1.0 Sneakers',
        brand: 'VELORA ORIGINALS',
        size: 'UK 9',
        price: '₹12,999',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200'
    };

    const [selectedReason, setSelectedReason] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('');
    const [comments, setComments] = useState('');

    const handleSubmit = () => {
        if (!selectedReason || !selectedMethod) {
            Alert.alert("Missing Info", "Please select a reason and refund method.");
            return;
        }

        // Logic to update Firestore would go here

        Alert.alert(
            "Return Requested",
            "Your return request has been submitted successfully. We will pick up the item within 24-48 hours.",
            [{ text: "OK", onPress: () => navigation.popToTop() }]
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Return / Exchange</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* Item Card */}
                <Text style={styles.sectionTitle}>ITEM TO RETURN</Text>
                <View style={styles.itemCard}>
                    <Image source={{ uri: itemToReturn.image }} style={styles.itemImage} />
                    <View style={styles.itemInfo}>
                        <Text style={styles.brand}>{itemToReturn.brand}</Text>
                        <Text style={styles.name}>{itemToReturn.name}</Text>
                        <Text style={styles.meta}>Size: {itemToReturn.size} • {itemToReturn.price}</Text>
                    </View>
                </View>

                {/* Reasons */}
                <Text style={styles.sectionTitle}>WHY ARE YOU RETURNING THIS?</Text>
                <View style={styles.card}>
                    {REASONS.map((reason) => (
                        <TouchableOpacity
                            key={reason}
                            style={styles.optionRow}
                            onPress={() => setSelectedReason(reason)}
                        >
                            <Text style={styles.optionText}>{reason}</Text>
                            <View style={[styles.radio, selectedReason === reason && styles.radioSelected]}>
                                {selectedReason === reason && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    ))}

                    {selectedReason === 'Other' && (
                        <TextInput
                            style={styles.textInput}
                            placeholder="Please explain (optional)"
                            value={comments}
                            onChangeText={setComments}
                            multiline
                        />
                    )}
                </View>

                {/* Refund Method */}
                <Text style={styles.sectionTitle}>REFUND METHOD</Text>
                <View style={styles.card}>
                    {REFUND_METHODS.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            style={styles.methodRow}
                            onPress={() => setSelectedMethod(method.id)}
                        >
                            <View style={styles.methodIcon}>
                                <Ionicons name={method.icon} size={24} color="#000" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.methodTitle}>{method.title}</Text>
                                <Text style={styles.methodSub}>{method.subtitle}</Text>
                            </View>
                            <View style={[styles.radio, selectedMethod === method.id && styles.radioSelected]}>
                                {selectedMethod === method.id && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <TouchableOpacity
                    style={[
                        styles.submitBtn,
                        (!selectedReason || !selectedMethod) && styles.disabledBtn
                    ]}
                    onPress={handleSubmit}
                    disabled={!selectedReason || !selectedMethod}
                >
                    <Text style={styles.submitText}>Submit Request</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 15,
        paddingTop: 10,
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        padding: 20,
        paddingBottom: 120,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6D6D72',
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 4
    },
    itemCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#F2F2F7'
    },
    itemInfo: {
        marginLeft: 15,
        justifyContent: 'center'
    },
    brand: {
        fontSize: 10,
        color: '#8E8E93',
        fontWeight: '600',
        marginBottom: 2
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2
    },
    meta: {
        fontSize: 12,
        color: '#3C3C43'
    },
    card: {
        backgroundColor: '#FFF',
        paddingVertical: 5,
        borderRadius: 12,
        marginBottom: 20,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#F2F2F7'
    },
    optionText: {
        fontSize: 15,
        color: '#000'
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#C7C7CC',
        justifyContent: 'center',
        alignItems: 'center'
    },
    radioSelected: {
        borderColor: '#007BFF'
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#007BFF'
    },
    textInput: {
        margin: 15,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        borderRadius: 8,
        padding: 10,
        height: 80,
        textAlignVertical: 'top'
    },
    methodRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#F2F2F7'
    },
    methodIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center'
    },
    methodTitle: {
        fontSize: 15,
        fontWeight: '600'
    },
    methodSub: {
        fontSize: 12,
        color: '#8E8E93',
        marginTop: 2
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 20,
        borderTopWidth: 0.5,
        borderTopColor: '#C7C7CC'
    },
    submitBtn: {
        backgroundColor: '#000',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center'
    },
    disabledBtn: {
        backgroundColor: '#C7C7CC'
    },
    submitText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16
    }
});

export default ReturnRefundScreen;
