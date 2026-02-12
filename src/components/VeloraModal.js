import React, { useEffect, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

/**
 * VeloraModal - Clean, minimal modal component matching reference design
 */
const VeloraModal = ({
    visible = false,
    type = 'info',
    title = '',
    message = '',
    onClose,
    primaryButtonText = 'OK',
    onPrimaryPress,
    secondaryButtonText,
    onSecondaryPress,
}) => {
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 80,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0.95,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const getTypeConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: 'check-circle-outline',
                    iconBgColor: '#D4EDDA',
                    iconColor: '#28A745',
                };
            case 'error':
                return {
                    icon: 'alert-circle-outline',
                    iconBgColor: '#F8D7DA',
                    iconColor: '#DC3545',
                };
            case 'warning':
                return {
                    icon: 'alert-outline',
                    iconBgColor: '#FFF3CD',
                    iconColor: '#FFC107',
                };
            case 'info':
            default:
                return {
                    icon: 'information-outline',
                    iconBgColor: '#D1ECF1',
                    iconColor: '#17A2B8',
                };
        }
    };

    const config = getTypeConfig();

    const handlePrimaryPress = () => {
        if (onPrimaryPress) {
            onPrimaryPress();
        }
        if (onClose) {
            onClose();
        }
    };

    const handleSecondaryPress = () => {
        if (onSecondaryPress) {
            onSecondaryPress();
        }
        if (onClose) {
            onClose();
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.modalContainer,
                                {
                                    transform: [{ scale: scaleAnim }],
                                    opacity: fadeAnim,
                                },
                            ]}
                        >
                            <View style={styles.modalContent}>
                                {/* Close Button */}
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={onClose}
                                    activeOpacity={0.6}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <MaterialCommunityIcons
                                        name="close"
                                        size={18}
                                        color="#999"
                                    />
                                </TouchableOpacity>

                                {/* Icon */}
                                <View style={[styles.iconContainer, { backgroundColor: config.iconBgColor }]}>
                                    <MaterialCommunityIcons
                                        name={config.icon}
                                        size={24}
                                        color={config.iconColor}
                                    />
                                </View>

                                {/* Title */}
                                {title ? (
                                    <Text style={styles.title}>{title}</Text>
                                ) : null}

                                {/* Message */}
                                {message ? (
                                    <Text style={styles.message}>{message}</Text>
                                ) : null}

                                {/* Buttons */}
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={styles.primaryButton}
                                        onPress={handlePrimaryPress}
                                        activeOpacity={0.85}
                                        accessibilityLabel={primaryButtonText}
                                        accessibilityRole="button"
                                    >
                                        <Text style={styles.primaryButtonText}>
                                            {primaryButtonText}
                                        </Text>
                                    </TouchableOpacity>

                                    {secondaryButtonText && (
                                        <TouchableOpacity
                                            style={styles.secondaryButton}
                                            onPress={handleSecondaryPress}
                                            activeOpacity={0.6}
                                            accessibilityLabel={secondaryButtonText}
                                            accessibilityRole="button"
                                        >
                                            <Text style={styles.secondaryButtonText}>
                                                {secondaryButtonText}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: width * 0.8,
        maxWidth: 320,
    },
    modalContent: {
        borderRadius: 16,
        padding: 24,
        paddingTop: 32,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 13,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 19,
        marginBottom: 24,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    primaryButton: {
        width: '100%',
        height: 44,
        borderRadius: 10,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    secondaryButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    secondaryButtonText: {
        color: '#666666',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default VeloraModal;
