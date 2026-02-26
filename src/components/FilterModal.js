import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FilterModal = ({ visible, onClose, onApply, initialFilters }) => {
    const insets = useSafeAreaInsets();
    const [selectedSize, setSelectedSize] = useState(initialFilters?.size || []);
    const [selectedColor, setSelectedColor] = useState(initialFilters?.color || []);
    const [priceRange, setPriceRange] = useState(initialFilters?.price || null);

    // Mock Data for Filters
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const colors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#800080'];
    // Price ranges in INR to match the product catalog currency
    const prices = [
        { label: 'Under ₹2,000', value: '0-2000' },
        { label: '₹2,000 - ₹5,000', value: '2000-5000' },
        { label: '₹5,000 - ₹10,000', value: '5000-10000' },
        { label: 'Over ₹10,000', value: '10000+' },
    ];

    const toggleSelection = (item, list, setList) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const handleApply = () => {
        onApply({
            size: selectedSize,
            color: selectedColor,
            price: priceRange
        });
        onClose();
    };

    const handleReset = () => {
        setSelectedSize([]);
        setSelectedColor([]);
        setPriceRange(null);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, { paddingBottom: insets.bottom + 20 }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Filters</Text>
                        <TouchableOpacity onPress={handleReset}>
                            <Text style={styles.resetText}>Reset</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        {/* Price Section */}
                        <Text style={styles.sectionTitle}>Price Range</Text>
                        <View style={styles.optionsContainer}>
                            {prices.map((price) => (
                                <TouchableOpacity
                                    key={price.value}
                                    style={[
                                        styles.optionChip,
                                        priceRange === price.value && styles.selectedOptionChip
                                    ]}
                                    onPress={() => setPriceRange(priceRange === price.value ? null : price.value)}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        priceRange === price.value && styles.selectedOptionText
                                    ]}>{price.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Size Section */}
                        <Text style={styles.sectionTitle}>Size</Text>
                        <View style={styles.optionsContainer}>
                            {sizes.map((size) => (
                                <TouchableOpacity
                                    key={size}
                                    style={[
                                        styles.sizeChip,
                                        selectedSize.includes(size) && styles.selectedOptionChip
                                    ]}
                                    onPress={() => toggleSelection(size, selectedSize, setSelectedSize)}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        selectedSize.includes(size) && styles.selectedOptionText
                                    ]}>{size}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Color Section */}
                        <Text style={styles.sectionTitle}>Color</Text>
                        <View style={styles.optionsContainer}>
                            {colors.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorCircle,
                                        { backgroundColor: color },
                                        selectedColor.includes(color) && styles.selectedColorCircle
                                    ]}
                                    onPress={() => toggleSelection(color, selectedColor, setSelectedColor)}
                                >
                                    {selectedColor.includes(color) && (
                                        <Ionicons
                                            name="checkmark"
                                            size={16}
                                            color={color === '#FFFFFF' ? '#000' : '#FFF'}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Apply Button */}
                    <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                        <Text style={styles.applyButtonText}>Apply Filters</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: '80%', // Occupy 80% screen height
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    resetText: {
        color: '#FF3B30',
        fontSize: 16,
    },
    scrollView: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionChip: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F2F2F7',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedOptionChip: {
        backgroundColor: '#007BFF',
        borderColor: '#007BFF',
    },
    optionText: {
        color: '#000',
    },
    selectedOptionText: {
        color: '#FFF',
    },
    sizeChip: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    selectedColorCircle: {
        borderWidth: 2,
        borderColor: '#007BFF',
    },
    applyButton: {
        backgroundColor: '#007BFF',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    applyButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default FilterModal;
