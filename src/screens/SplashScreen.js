import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const textAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Animate Tagline after logo appears
            Animated.timing(textAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        });

        // Navigate
        const timer = setTimeout(() => {
            navigation.replace('Onboarding');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[
                styles.logoContainer,
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
            ]}>
                <Text style={styles.logo}>VELORA</Text>
            </Animated.View>

            <Animated.View style={[styles.taglineContainer, { opacity: textAnim }]}>
                <Text style={styles.tagline}>Luxury Redefined</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Premium White
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 20,
    },
    logo: {
        fontSize: 48,
        fontWeight: '900',
        letterSpacing: 8,
        color: '#000000',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    taglineContainer: {
        marginTop: 10,
    },
    tagline: {
        fontSize: 14,
        letterSpacing: 3,
        color: '#8E8E93', // iOS Gray
        textTransform: 'uppercase',
        fontWeight: '500',
    },
});

export default SplashScreen;
