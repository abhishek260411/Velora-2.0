import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SortModal = ({ visible, onClose, onApply, currentSort }) => {
    const insets = useSafeAreaInsets();
    const sortOptions = [
        { label: 'Popular', value: 'popular' },
        { label: 'Newest', value: 'newest' },
        { label: 'Price: Low to High', value: 'price_asc' },
        { label: 'Price: High to Low', value: 'price_desc' },
    ];

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.modalView, { paddingBottom: insets.bottom + 20 }]}>
                            <View style={styles.header}>
                                <Text style={styles.title}>Sort By</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>

                            {sortOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={styles.optionItem}
                                    onPress={() => {
                                        onApply(option.value);
                                        onClose();
                                    }}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        currentSort === option.value && styles.selectedOptionText
                                    ]}>
                                        {option.label}
                                    </Text>
                                    {currentSort === option.value && (
                                        <Ionicons name="checkmark" size={20} color="#007BFF" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E5EA',
        paddingBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#F2F2F7',
    },
    optionText: {
        fontSize: 16,
        color: '#000',
    },
    selectedOptionText: {
        color: '#007BFF',
        fontWeight: '600',
    },
});

export default SortModal;
