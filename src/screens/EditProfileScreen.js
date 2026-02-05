import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import VeloraInput from '../components/VeloraInput';
import VeloraButton from '../components/VeloraButton';
import { validatePhone, validateEmail } from '../utils/userUtils';

const EditProfileScreen = ({ navigation }) => {
    const { userData, updateUserProfile } = useAuth();

    // Form state
    const [displayName, setDisplayName] = useState(userData?.displayName || '');
    const [phone, setPhone] = useState(userData?.phone || '');
    const [street, setStreet] = useState(userData?.address?.street || '');
    const [city, setCity] = useState(userData?.address?.city || '');
    const [state, setState] = useState(userData?.address?.state || '');
    const [zipCode, setZipCode] = useState(userData?.address?.zipCode || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        // Validation
        if (!displayName.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        if (phone && !validatePhone(phone)) {
            Alert.alert('Error', 'Please enter a valid 10-digit phone number');
            return;
        }

        setIsLoading(true);

        try {
            // Split name into first and last name
            const nameParts = displayName.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            const updates = {
                displayName: displayName.trim(),
                firstName,
                lastName,
                phone: phone.trim(),
                'address.street': street.trim(),
                'address.city': city.trim(),
                'address.state': state.trim(),
                'address.zipCode': zipCode.trim(),
            };

            const result = await updateUserProfile(updates);

            if (result.error) {
                Alert.alert('Error', result.message);
            } else {
                Alert.alert('Success', 'Profile updated successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error) {
            console.error('Update error:', error);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color={theme.colors.black} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>EDIT PROFILE</Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Personal Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>

                        <VeloraInput
                            label="FULL NAME"
                            placeholder="John Doe"
                            value={displayName}
                            onChangeText={setDisplayName}
                            autoCapitalize="words"
                        />

                        <VeloraInput
                            label="PHONE NUMBER"
                            placeholder="9876543210"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    </View>

                    {/* Address */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>ADDRESS</Text>

                        <VeloraInput
                            label="STREET ADDRESS"
                            placeholder="123 Main Street"
                            value={street}
                            onChangeText={setStreet}
                        />

                        <VeloraInput
                            label="CITY"
                            placeholder="Mumbai"
                            value={city}
                            onChangeText={setCity}
                            autoCapitalize="words"
                        />

                        <VeloraInput
                            label="STATE"
                            placeholder="Maharashtra"
                            value={state}
                            onChangeText={setState}
                            autoCapitalize="words"
                        />

                        <VeloraInput
                            label="ZIP CODE"
                            placeholder="400001"
                            value={zipCode}
                            onChangeText={setZipCode}
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                    </View>

                    {/* Account Info (Read-only) */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>ACCOUNT INFORMATION</Text>

                        <View style={styles.readOnlyField}>
                            <Text style={styles.readOnlyLabel}>Email</Text>
                            <Text style={styles.readOnlyValue}>{userData?.email}</Text>
                        </View>

                        <View style={styles.readOnlyField}>
                            <Text style={styles.readOnlyLabel}>Role</Text>
                            <Text style={styles.readOnlyValue}>{userData?.role?.toUpperCase() || 'CUSTOMER'}</Text>
                        </View>

                        <View style={styles.readOnlyField}>
                            <Text style={styles.readOnlyLabel}>Provider</Text>
                            <Text style={styles.readOnlyValue}>{userData?.provider?.toUpperCase() || 'EMAIL'}</Text>
                        </View>
                    </View>

                    {/* Save Button */}
                    <VeloraButton
                        title={isLoading ? "SAVING..." : "SAVE CHANGES"}
                        onPress={handleSave}
                        style={styles.saveButton}
                        disabled={isLoading}
                    />

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.cancelButtonText}>CANCEL</Text>
                    </TouchableOpacity>

                    <View style={styles.bottomSpacer} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 24,
        paddingTop: 12,
    },
    headerTitle: {
        ...theme.typography.header,
        fontSize: 24,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    section: {
        marginHorizontal: 24,
        marginBottom: 32,
    },
    sectionTitle: {
        ...theme.typography.header,
        fontSize: 14,
        marginBottom: 16,
        opacity: 0.6,
    },
    readOnlyField: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.lightGray,
        borderRadius: 8,
        marginBottom: 12,
    },
    readOnlyLabel: {
        ...theme.typography.body,
        fontSize: 12,
        opacity: 0.6,
        marginBottom: 4,
    },
    readOnlyValue: {
        ...theme.typography.body,
        fontWeight: '600',
    },
    saveButton: {
        marginHorizontal: 24,
        marginBottom: 12,
    },
    cancelButton: {
        alignItems: 'center',
        padding: 16,
        marginHorizontal: 24,
    },
    cancelButtonText: {
        ...theme.typography.button,
        color: theme.colors.black,
    },
    bottomSpacer: {
        height: 20,
    },
});

export default EditProfileScreen;
