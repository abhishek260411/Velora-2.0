import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import VeloraInput from '../components/VeloraInput';
import VeloraButton from '../components/VeloraButton';
import { validatePhone, validateEmail } from '../utils/userUtils';
import VeloraModal from '../components/VeloraModal';
import { useVeloraModal } from '../hooks/useVeloraModal';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../config/firebase';
import { Image } from 'expo-image';

const EditProfileScreen = ({ navigation }) => {
    const { userData, updateUserProfile } = useAuth();
    const modal = useVeloraModal();

    // Form state
    const [displayName, setDisplayName] = useState(userData?.displayName || '');
    const [phone, setPhone] = useState(userData?.phone || '');
    const [street, setStreet] = useState(userData?.address?.street || '');
    const [city, setCity] = useState(userData?.address?.city || '');
    const [state, setState] = useState(userData?.address?.state || '');
    const [zipCode, setZipCode] = useState(userData?.address?.zipCode || '');
    const [isLoading, setIsLoading] = useState(false);
    const [imageUri, setImageUri] = useState(userData?.photoURL || null);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            modal.showError('Error', 'Failed to pick image.');
        }
    };

    const handleSave = async () => {
        // Validation
        if (!displayName.trim()) {
            modal.showError('Error', 'Please enter your name');
            return;
        }

        if (phone && !validatePhone(phone)) {
            modal.showError('Error', 'Please enter a valid 10-digit phone number');
            return;
        }

        setIsLoading(true);

        try {
            let photoUrlToSave = userData?.photoURL;
            if (imageUri && imageUri !== userData?.photoURL) {
                // TODO: Upload imageUri to Firebase Storage and use getDownloadURL() here
                // instead of saving the local device URI directly. Local URIs are not
                // portable across devices. This requires firebase/storage to be configured.
                // For now, save the local URI as a temporary solution.
                photoUrlToSave = imageUri;
            }

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

            if (photoUrlToSave) updates.photoURL = photoUrlToSave;

            const result = await updateUserProfile(updates);

            if (result.error) {
                modal.showError('Error', result.message);
            } else {
                modal.showSuccess('Success', 'Profile updated successfully!', () => {
                    navigation.goBack();
                });
            }
        } catch (error) {
            console.error('Update error:', error);
            modal.showError('Error', 'Failed to update profile. Please try again.');
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
                    {/* Profile Image Section */}
                    <View style={styles.imageSection}>
                        <TouchableOpacity style={{ alignItems: 'center' }} onPress={pickImage}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: imageUri || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' }}
                                    style={styles.profileImage}
                                    contentFit="cover"
                                />
                                <View style={styles.editImageBadge}>
                                    <MaterialCommunityIcons name="camera" size={16} color="#FFF" />
                                </View>
                            </View>
                            <Text style={{ marginTop: 12, color: '#007AFF', fontSize: 16, fontWeight: '500' }}>
                                Change Profile Photo
                            </Text>
                        </TouchableOpacity>
                    </View>

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



                    {/* Save Button */}
                    <View style={styles.actionContainer}>
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
                    </View>

                    <View style={styles.bottomSpacer} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Modal */}
            <VeloraModal
                visible={modal.modalState.visible}
                type={modal.modalState.type}
                title={modal.modalState.title}
                message={modal.modalState.message}
                primaryButtonText={modal.modalState.primaryButtonText}
                secondaryButtonText={modal.modalState.secondaryButtonText}
                onPrimaryPress={modal.modalState.onPrimaryPress}
                onSecondaryPress={modal.modalState.onSecondaryPress}
                onClose={modal.hide}
            />
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
    imageSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    imageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E1E1E1',
    },
    editImageBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: theme.colors.black,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.white,
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

    actionContainer: {
        marginHorizontal: 24,
    },
    saveButton: {
        marginBottom: 12,
    },
    cancelButton: {
        alignItems: 'center',
        padding: 16,
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
