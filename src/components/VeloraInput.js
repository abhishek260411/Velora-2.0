import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

const VeloraInput = ({ label, placeholder, secureTextEntry, value, onChangeText }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    isFocused ? styles.inputFocused : null
                ]}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.lightGray}
                secureTextEntry={!!secureTextEntry}
                value={value}
                onChangeText={onChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        ...theme.typography.button,
        marginBottom: 8,
        fontSize: 12,
        color: theme.colors.black,
    },
    input: {
        height: 48,
        borderBottomWidth: 1.5,
        borderBottomColor: theme.colors.lightGray,
        fontSize: 16,
        color: theme.colors.black,
        paddingVertical: 8,
    },
    inputFocused: {
        borderBottomColor: theme.colors.black,
    },
});

export default VeloraInput;
