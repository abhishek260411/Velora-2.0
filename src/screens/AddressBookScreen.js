import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, query, getDocs, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { theme } from '../theme';

const AddressBookScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Check if we are selecting an address for checkout
    const isSelectionMode = route.params?.isSelectionMode || false;
    const { onSelectAddress } = route.params || {};

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            if (!user?.uid) {
                setLoading(false);
                return;
            }
            const q = query(collection(db, 'users', user.uid, 'addresses'));
            const querySnapshot = await getDocs(q);
            const addrList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort: default address first
            addrList.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
            setAddresses(addrList);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Address",
            "Are you sure you want to remove this address?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'users', user.uid, 'addresses', id));
                            setAddresses(prev => prev.filter(a => a.id !== id));
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete address');
                        }
                    }
                }
            ]
        );
    };

    const handleSetDefault = async (address) => {
        if (!user?.uid) return;
        try {
            // Optimistic Update
            setAddresses(prev => prev.map(a => ({
                ...a,
                isDefault: a.id === address.id
            })));

            const batch = writeBatch(db);
            const previousDefault = addresses.find(a => a.isDefault);

            if (previousDefault) {
                batch.update(doc(db, 'users', user.uid, 'addresses', previousDefault.id), { isDefault: false });
            }

            batch.update(doc(db, 'users', user.uid, 'addresses', address.id), { isDefault: true });

            await batch.commit();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to update default address');
            fetchAddresses(); // Revert on failure
        }
    };

    const handleSelectAddress = (item) => {
        if (isSelectionMode) {
            if (onSelectAddress) {
                onSelectAddress(item.id);
                navigation.goBack();
            } else {
                navigation.navigate({
                    name: 'Checkout',
                    params: { selectedAddressId: item.id },
                    merge: true
                });
            }
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.addressCard}
            onPress={() => handleSelectAddress(item)}
            activeOpacity={isSelectionMode ? 0.7 : 1}
        >
            <View style={styles.cardHeader}>
                <View style={styles.typeTag}>
                    <Ionicons
                        name={item.type === 'Home' ? 'home' : item.type === 'Work' ? 'briefcase' : 'location'}
                        size={14}
                        color="#666"
                    />
                    <Text style={styles.typeText}>{item.type}</Text>
                </View>
                {item.isDefault && (
                    <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                    </View>
                )}
            </View>

            <Text style={styles.nameText}>{item.name}</Text>
            <Text style={styles.addressText}>
                {item.street}, {item.city}, {item.state} - {item.zipCode}
            </Text>
            <Text style={styles.phoneText}>Phone: {item.phone}</Text>

            {!isSelectionMode && (
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate('AddEditAddress', { address: item })}
                    >
                        <Ionicons name="pencil-outline" size={18} color="#007AFF" />
                        <Text style={[styles.actionBtnText, { color: '#007AFF' }]}>Edit</Text>
                    </TouchableOpacity>

                    {!item.isDefault && (
                        <TouchableOpacity style={styles.actionBtn} onPress={() => handleSetDefault(item)}>
                            <Ionicons name="checkmark-circle-outline" size={18} color="#34C759" />
                            <Text style={[styles.actionBtnText, { color: '#34C759' }]}>Set Default</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
                        <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                        <Text style={[styles.actionBtnText, { color: '#FF3B30' }]}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Address Book</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={theme.colors.black} />
                </View>
            ) : (
                <FlatList
                    data={addresses}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="map-marker-off-outline" size={80} color="#CCC" />
                            <Text style={styles.emptyTitle}>No Addresses Saved</Text>
                            <Text style={styles.emptySub}>Add a new address for faster checkout.</Text>
                        </View>
                    }
                />
            )}

            <TouchableOpacity
                style={[styles.addBtn, { bottom: insets.bottom + 20 }]}
                onPress={() => navigation.navigate('AddEditAddress')}
            >
                <Ionicons name="add" size={24} color="#FFF" />
                <Text style={styles.addBtnText}>Add New Address</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#C6C6C8',
    },
    backBtn: { width: 40 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
    listContent: { padding: 16, paddingBottom: 100 },
    addressCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    typeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    typeText: { fontSize: 12, fontWeight: '600', color: '#666', marginLeft: 4 },
    defaultBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    defaultBadgeText: { fontSize: 10, fontWeight: '800', color: '#34C759' },
    nameText: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 4 },
    addressText: { fontSize: 14, color: '#666', lineHeight: 20 },
    phoneText: { fontSize: 14, color: '#666', marginTop: 8 },
    actions: {
        flexDirection: 'row',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#F2F2F7',
        justifyContent: 'space-between'
    },
    actionBtn: { flexDirection: 'row', alignItems: 'center' },
    actionBtnText: { fontSize: 14, fontWeight: '600', marginLeft: 6 },
    addBtn: {
        position: 'absolute',
        left: 20,
        right: 20,
        backgroundColor: '#000',
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5
    },
    addBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', marginLeft: 8 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginTop: 16 },
    emptySub: { fontSize: 14, color: '#8E8E93', marginTop: 8 }
});

export default AddressBookScreen;
