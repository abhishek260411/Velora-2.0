import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { theme } from '../theme';
import VeloraButton from '../components/VeloraButton';
import VeloraInput from '../components/VeloraInput';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setIsLoading(true);
        try {
            await login(email, password);
            // Navigation handled by successful login
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (error) {
            console.error(error);
            Alert.alert('Login Failed', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>LOG IN</Text>
                </View>

                <View style={styles.formCard}>
                    <VeloraInput
                        label="EMAIL ADDRESS"
                        placeholder="name@example.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <VeloraInput
                        label="PASSWORD"
                        placeholder="••••••••"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <VeloraButton
                        title={isLoading ? "LOGGING IN..." : "ENTER VELORA"}
                        onPress={handleLogin}
                        style={styles.button}
                        disabled={isLoading}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>New to VELORA? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.signUpText}>Create Account</Text>
                    </TouchableOpacity>
                </View>
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
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
    },
    title: {
        ...theme.typography.header,
        fontSize: 48,
        color: theme.colors.black,
    },
    formCard: {
        backgroundColor: theme.colors.white,
        padding: 2,
    },
    forgotPassword: {
        alignSelf: 'flex-start',
        marginBottom: 32,
    },
    forgotText: {
        ...theme.typography.body,
        textDecorationLine: 'underline',
    },
    button: {
        marginTop: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
    },
    footerText: {
        ...theme.typography.body,
    },
    signUpText: {
        ...theme.typography.body,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    }
});

export default LoginScreen;
