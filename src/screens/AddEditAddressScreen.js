import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Switch,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, updateDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { theme } from '../theme';

const AddEditAddressScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const editingAddress = route.params?.address;

    const [form, setForm] = useState({
        name: editingAddress?.name || '',
        phone: editingAddress?.phone || '',
        street: editingAddress?.street || '',
        city: editingAddress?.city || '',
        state: editingAddress?.state || '',
        zipCode: editingAddress?.zipCode || '',
        type: editingAddress?.type || 'Home',
        isDefault: editingAddress?.isDefault || false
    });

    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!form.name || !form.phone || !form.street || !form.city || !form.state || !form.zipCode) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        if (!user?.uid) {
            Alert.alert('Error', 'User sessions expired. Please log in again.');
            return;
        }

        try {
            setLoading(true);
            const addressRef = collection(db, 'users', user.uid, 'addresses');

            // If setting as default, unset others first
            if (form.isDefault) {
                const q = query(addressRef, where('isDefault', '==', true));
                const querySnapshot = await getDocs(q);
                const updates = querySnapshot.docs.map(d => {
                    if (editingAddress && d.id === editingAddress.id) return Promise.resolve();
                    return updateDoc(doc(db, 'users', user.uid, 'addresses', d.id), { isDefault: false });
                });
                await Promise.all(updates);
            }

            if (editingAddress) {
                await updateDoc(doc(db, 'users', user.uid, 'addresses', editingAddress.id), form);
            } else {
                await addDoc(addressRef, form);
            }

            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save address');
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (label, value, key, keyboard = 'default', required = true) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label} {required && '*'}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={(text) => setForm(prev => ({ ...prev, [key]: text }))}
                placeholder={`Enter ${label.toLowerCase()}`}
                keyboardType={keyboard}
            />
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{editingAddress ? 'Edit Address' : 'New Address'}</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading}>
                    <Text style={[styles.saveBtn, loading && { opacity: 0.5 }]}>SAVE</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {renderInput('Full Name', form.name, 'name')}
                {renderInput('Phone Number', form.phone, 'phone', 'phone-pad')}
                <View style={styles.divider} />
                {renderInput('Street Address', form.street, 'street')}
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        {renderInput('City', form.city, 'city')}
                    </View>
                    <View style={{ flex: 1 }}>
                        {renderInput('State', form.state, 'state')}
                    </View>
                </View>
                {renderInput('Zip Code', form.zipCode, 'zipCode', 'numeric')}

                <View style={styles.typeSection}>
                    <Text style={styles.label}>Address Type</Text>
                    <View style={styles.typeGrid}>
                        {['Home', 'Work', 'Other'].map(t => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.typeBtn, form.type === t && styles.typeBtnActive]}
                                onPress={() => setForm(prev => ({ ...prev, type: t }))}
                            >
                                <Text style={[styles.typeBtnText, form.type === t && styles.typeBtnTextActive]}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.switchRow}>
                    <View>
                        <Text style={styles.switchLabel}>Set as Default Address</Text>
                        <Text style={styles.switchSub}>Use this as your primary shipping address</Text>
                    </View>
                    <Switch
                        value={form.isDefault}
                        onValueChange={(val) => setForm(prev => ({ ...prev, isDefault: val }))}
                        trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#F2F2F7',
    },
    backBtn: { width: 40 },
    headerTitle: { fontSize: 17, fontWeight: '700', color: '#000' },
    saveBtn: { fontSize: 15, fontWeight: '700', color: '#007AFF' },
    scrollContent: { padding: 20 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 13, fontWeight: '600', color: '#8E8E93', marginBottom: 8, textTransform: 'uppercase' },
    input: {
        backgroundColor: '#F2F2F7',
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000'
    },
    row: { flexDirection: 'row' },
    divider: { height: 1, backgroundColor: '#F2F2F7', marginVertical: 10 },
    typeSection: { marginTop: 10, marginBottom: 30 },
    typeGrid: { flexDirection: 'row', marginTop: 10 },
    typeBtn: {
        flex: 1,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5
    },
    typeBtnActive: { backgroundColor: '#000' },
    typeBtnText: { fontSize: 14, fontWeight: '600', color: '#666' },
    typeBtnTextActive: { color: '#FFF' },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7'
    },
    switchLabel: { fontSize: 16, fontWeight: '600', color: '#000' },
    switchSub: { fontSize: 13, color: '#8E8E93', marginTop: 2 }
});

export default AddEditAddressScreen;
