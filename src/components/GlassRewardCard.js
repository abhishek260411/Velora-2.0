import React, { memo } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = CARD_WIDTH / 1.586; // Standard credit card aspect ratio

/**
 * Optimized Glassmorphic Reward Card Component
 * Uses React.memo to prevent unnecessary re-renders
 */
const GlassRewardCard = memo(({ tier, discount, progress, isUnlocked, onPress, cardNumber, isSelected, style, width: customWidth }) => {
    const finalWidth = customWidth || CARD_WIDTH;
    const finalHeight = finalWidth / 1.586;

    const cardConfig = {
        bronze: {
            gradientColors: ['#CD7F32', '#8B4513', '#D2691E'],
            icon: 'star-outline',
            title: 'Bronze Card',
            requirement: 'Spend ₹5,000',
            orbColor: '#FF6B35'
        },
        silver: {
            gradientColors: ['#C0C0C0', '#A8A8A8', '#D3D3D3'],
            icon: 'star-half-full',
            title: 'Silver Card',
            requirement: 'Spend ₹15,000',
            orbColor: '#E0E0E0'
        },
        gold: {
            gradientColors: ['#FFD700', '#FFA500', '#FF6347'],
            icon: 'star',
            title: 'Gold Card',
            requirement: 'Spend ₹30,000',
            orbColor: '#FF4757'
        },
        platinum: {
            gradientColors: ['#E5E4E2', '#B8B8B8', '#D3D3D3'],
            icon: 'crown',
            title: 'Platinum Card',
            requirement: 'Spend ₹50,000',
            orbColor: '#A8A8A8'
        }
    };

    const config = cardConfig[tier];
    const gradients = isUnlocked ? config.gradientColors : ['#757575', '#616161', '#424242'];

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[styles.cardWrapper, style]}
            disabled={!onPress}
        >
            <View style={[
                styles.cardContainer,
                { width: finalWidth, height: finalHeight },
                isSelected && styles.selectedCardContainer
            ]}>
                {/* Background Gradient */}
                <LinearGradient
                    colors={gradients}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBackground}
                >
                    {/* Decorative Orbs */}
                    <View style={[styles.orbLarge, { backgroundColor: isUnlocked ? config.orbColor : '#9E9E9E' }]} />
                    <View style={[styles.orbSmall, { backgroundColor: isUnlocked ? config.orbColor : '#9E9E9E' }]} />

                    {/* Glass Card Overlay */}
                    <View style={styles.glassCard}>
                        {/* Top Section - Logo & Contactless */}
                        <View style={styles.cardTop}>
                            <View style={styles.logoContainer}>
                                <View style={styles.logoCircle}>
                                    <Text style={styles.logoText}>V</Text>
                                </View>
                            </View>
                            <View style={styles.contactlessIcon}>
                                <MaterialCommunityIcons
                                    name="contactless-payment"
                                    size={28}
                                    color="rgba(255,255,255,0.9)"
                                />
                            </View>
                        </View>

                        {/* Center Section - Decorative Circle */}
                        <View style={styles.centerDecoration}>
                            <View style={styles.decorativeCircle}>
                                <View style={styles.decorativeCircleInner} />
                            </View>
                        </View>

                        {/* Card Number */}
                        <View style={styles.cardNumberSection}>
                            <Text style={styles.cardNumber}>
                                {cardNumber || '2585 2327 1786 0000'}
                            </Text>
                        </View>

                        {/* Bottom Section - Bank Name & Progress */}
                        <View style={styles.cardBottom}>
                            <View style={styles.bankInfo}>
                                <Text style={styles.bankName}>Velora Bank</Text>
                                {!isUnlocked && (
                                    <View style={styles.progressMini}>
                                        <View style={[styles.progressMiniFill, { width: `${progress}%` }]} />
                                    </View>
                                )}
                            </View>
                            <View style={styles.wifiIcon}>
                                <MaterialCommunityIcons
                                    name="wifi"
                                    size={20}
                                    color="rgba(255,255,255,0.8)"
                                />
                            </View>
                        </View>

                        {/* Lock Overlay for Locked Cards */}
                        {!isUnlocked && (
                            <View style={styles.lockOverlay}>
                                <MaterialCommunityIcons
                                    name="lock"
                                    size={32}
                                    color="rgba(255,255,255,0.9)"
                                />
                                <Text style={styles.lockText}>{progress}% to unlock</Text>
                            </View>
                        )}

                        {/* Selected Badge */}
                        {isSelected && (
                            <View style={styles.selectedBadge}>
                                <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
                                <Text style={styles.selectedBadgeText}>ACTIVE</Text>
                            </View>
                        )}
                    </View>
                </LinearGradient>
            </View>
        </TouchableOpacity>
    );
}, (prevProps, nextProps) => {
    // Custom comparison for memo
    return (
        prevProps.tier === nextProps.tier &&
        prevProps.discount === nextProps.discount &&
        prevProps.progress === nextProps.progress &&
        prevProps.isUnlocked === nextProps.isUnlocked &&
        prevProps.tier === nextProps.tier &&
        prevProps.discount === nextProps.discount &&
        prevProps.progress === nextProps.progress &&
        prevProps.isUnlocked === nextProps.isUnlocked &&
        prevProps.cardNumber === nextProps.cardNumber &&
        prevProps.isSelected === nextProps.isSelected
    );
});

GlassRewardCard.displayName = 'GlassRewardCard';

const styles = StyleSheet.create({
    cardWrapper: {
        marginRight: 20,
    },
    cardContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },
    gradientBackground: {
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
    },
    // Decorative Orbs
    orbLarge: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        bottom: -50,
        right: -30,
        opacity: 0.6,
    },
    orbSmall: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        top: 20,
        left: -20,
        opacity: 0.4,
    },
    // Glass Card
    glassCard: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        padding: 20,
        justifyContent: 'space-between',
    },
    // Top Section
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    logoText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFF',
    },
    contactlessIcon: {
        opacity: 0.9,
    },
    // Center Decoration
    centerDecoration: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    decorativeCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    decorativeCircleInner: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    // Card Number
    cardNumberSection: {
        marginVertical: 8,
    },
    cardNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        letterSpacing: 3,
        textAlign: 'center',
    },
    // Bottom Section
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    bankInfo: {
        flex: 1,
    },
    bankName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 4,
    },
    progressMini: {
        height: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        overflow: 'hidden',
        width: '80%',
    },
    progressMiniFill: {
        height: '100%',
        backgroundColor: '#FFF',
        borderRadius: 2,
    },
    wifiIcon: {
        opacity: 0.8,
    },
    // Lock Overlay
    lockOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    lockText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFF',
        marginTop: 8,
    },
    selectedCardContainer: {
        borderWidth: 3,
        borderColor: '#4CAF50',
    },
    selectedBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    selectedBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginLeft: 4,
    },
});

export default GlassRewardCard;
