import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { theme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const VeloraButton = ({ title, onPress, variant = 'primary', style, disabled }) => {
    const isPrimary = variant === 'primary';

    return (
        <TouchableOpacity
            style={[
                styles.button,
                isPrimary ? styles.primaryButton : styles.secondaryButton,
                disabled && styles.disabledButton,
                style
            ]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled}
        >
            <View style={styles.content}>
                <Text style={[
                    styles.text,
                    isPrimary ? styles.primaryText : styles.secondaryText,
                    disabled && styles.disabledText
                ]}>
                    {title}
                </Text>
                {!disabled && (
                    <MaterialCommunityIcons
                        name="arrow-right"
                        size={18}
                        color={isPrimary ? theme.colors.white : theme.colors.black}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 56,
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderRadius: 28,
        // Modern Depth
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    primaryButton: {
        backgroundColor: theme.colors.black,
    },
    secondaryButton: {
        backgroundColor: theme.colors.white,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        ...theme.typography.button,
    },
    primaryText: {
        color: theme.colors.white,
    },
    secondaryText: {
        color: theme.colors.black,
    },
    disabledButton: {
        opacity: 0.5,
    },
    disabledText: {
        color: theme.colors.gray, // Assuming gray exists or fallback
    },
});

export default VeloraButton;
