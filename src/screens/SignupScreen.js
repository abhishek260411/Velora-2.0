import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    TextInput,
    ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import VeloraModal from '../components/VeloraModal';
import { useVeloraModal } from '../hooks/useVeloraModal';

const SignupScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const modal = useVeloraModal();

    const handleSignup = async () => {
        if (!name || !email || !password) {
            modal.showError('Missing Information', 'Please fill in all fields to create an account.');
            return;
        }

        if (password.length < 6) {
            modal.showError('Weak Password', 'Password must be at least 6 characters long.');
            return;
        }

        setIsLoading(true);
        try {
            const nameParts = name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            await register(email, password, {
                displayName: name,
                firstName,
                lastName
            });
            modal.showSuccess('Welcome to Velora', 'Your account has been created successfully.', () => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                });
            });
        } catch (error) {
            console.error(error);
            modal.showError('Registration Failed', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Sign up</Text>
                    <Text style={styles.subtitle}>Create your account to get started.</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Name Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor="#8E8E93"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            placeholderTextColor="#8E8E93"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#8E8E93"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                size={20}
                                color="#8E8E93"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.signupBtn}
                        onPress={handleSignup}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.signupBtnText}>Create Account</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginText}>Log In</Text>
                    </TouchableOpacity>
                </View>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        marginTop: 40,
        marginBottom: 40,
    },
    backBtn: {
        marginBottom: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    title: {
        fontSize: 34,
        fontWeight: '700',
        color: '#000',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        letterSpacing: 0.2,
    },
    form: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7', // iOS Grouped
        borderRadius: 12,
        height: 56,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        height: '100%',
    },
    signupBtn: {
        height: 56,
        backgroundColor: '#000000',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    signupBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    footerText: {
        fontSize: 14,
        color: '#8E8E93',
    },
    loginText: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '600',
    },
});

export default SignupScreen;
