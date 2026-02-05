import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

const GlassCard = ({ children, style, containerStyle }) => {
    return (
        <View style={[styles.outer, containerStyle]}>
            {Platform.OS === 'ios' ? (
                <BlurView intensity={40} tint="light" style={[styles.inner, style]}>
                    {children}
                </BlurView>
            ) : (
                <View style={[styles.inner, styles.androidFallback, style]}>
                    {children}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    outer: {
        borderRadius: 24,
        overflow: 'hidden',
    },
    inner: {
        padding: 24,
    },
    androidFallback: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    }
});

export default GlassCard;
