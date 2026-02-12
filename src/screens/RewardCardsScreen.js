import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRewards } from '../context/RewardsContext';
import VeloraModal from '../components/VeloraModal';
import { useVeloraModal } from '../hooks/useVeloraModal';
import GlassRewardCard from '../components/GlassRewardCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

const RewardCardsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { getAllCards, selectCard, deselectCard, totalSpent } = useRewards();
    const modal = useVeloraModal();

    const cards = getAllCards();

    const handleUseCard = useCallback(async (tier, isSelected) => {
        if (isSelected) {
            await deselectCard();
            modal.showSuccess('Card Removed', 'Reward card discount removed from checkout.');
        } else {
            const success = await selectCard(tier);
            if (success) {
                modal.showSuccess('Card Selected!', 'This reward card will be applied at checkout.');
            }
        }
    }, [deselectCard, selectCard, modal]);

    const renderCard = (card) => {
        const isSelected = card.isSelected;
        return (
            <View key={card.tier} style={styles.cardSection}>
                <GlassRewardCard
                    tier={card.tier}
                    discount={card.discount}
                    progress={card.progress}
                    isUnlocked={card.isUnlocked}
                    cardNumber={card.cardNumber}
                    isSelected={isSelected}
                    width={CARD_WIDTH}
                    style={{ marginBottom: 20 }}
                />

                <View style={styles.cardDetails}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{card.title}</Text>
                        <View style={[styles.statusBadge, card.isUnlocked && styles.statusBadgeUnlocked]}>
                            <Text style={[styles.statusText, card.isUnlocked && styles.statusTextUnlocked]}>
                                {card.isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.discountRow}>
                        <MaterialCommunityIcons name="tag" size={20} color={theme.colors.black} />
                        <Text style={styles.discountText}>{card.discount}% OFF on all purchases</Text>
                    </View>

                    {!card.isUnlocked && (
                        <View style={styles.requirementRow}>
                            <MaterialCommunityIcons name="information" size={20} color="#666" />
                            <Text style={styles.requirementText}>
                                Spend ₹{(card.requirement - totalSpent).toLocaleString()} more to unlock
                            </Text>
                        </View>
                    )}

                    <View style={styles.benefitsSection}>
                        <Text style={styles.benefitsTitle}>Benefits:</Text>
                        {card.benefits.map((benefit, index) => (
                            <View key={index} style={styles.benefitRow}>
                                <MaterialCommunityIcons name="check-circle" size={16} color={card.isUnlocked ? '#4CAF50' : '#999'} />
                                <Text style={[styles.benefitText, !card.isUnlocked && styles.benefitTextLocked]}>{benefit}</Text>
                            </View>
                        ))}
                    </View>

                    {card.isUnlocked && (
                        <TouchableOpacity
                            style={[styles.useButton, isSelected && styles.useButtonSelected]}
                            onPress={() => handleUseCard(card.tier, isSelected)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.useButtonText}>
                                {isSelected ? 'Remove Card' : 'Use This Card'}
                            </Text>
                            <MaterialCommunityIcons
                                name={isSelected ? "close-circle" : "arrow-right"}
                                size={20}
                                color="#FFF"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Member Cards</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
            >
                <View style={styles.introSection}>
                    <Text style={styles.introTitle}>Exclusive Benefits</Text>
                    <Text style={styles.introText}>
                        Your current tier is based on your total lifetime spending at Velora.
                    </Text>
                </View>

                {cards.map(card => renderCard(card))}
            </ScrollView>

            <VeloraModal
                visible={modal.modalState.visible}
                type={modal.modalState.type}
                title={modal.modalState.title}
                message={modal.modalState.message}
                onClose={modal.hide}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.white },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.black },
    scrollContent: { padding: 20 },
    introSection: { marginBottom: 30 },
    introTitle: { fontSize: 24, fontWeight: 'bold', color: theme.colors.black, marginBottom: 8 },
    introText: { fontSize: 14, color: '#666', lineHeight: 20 },
    cardSection: { marginBottom: 40 },
    cardDetails: { backgroundColor: '#F9F9F9', borderRadius: 12, padding: 20 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    cardTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.black },
    statusBadge: { backgroundColor: '#E0E0E0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    statusBadgeUnlocked: { backgroundColor: '#4CAF50' },
    statusText: { fontSize: 11, fontWeight: 'bold', color: '#666' },
    statusTextUnlocked: { color: '#FFF' },
    discountRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    discountText: { fontSize: 16, fontWeight: '600', color: theme.colors.black, marginLeft: 8 },
    requirementRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    requirementText: { fontSize: 14, color: '#666', marginLeft: 8 },
    benefitsSection: { marginTop: 8 },
    benefitsTitle: { fontSize: 14, fontWeight: 'bold', color: theme.colors.black, marginBottom: 8 },
    benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    benefitText: { fontSize: 13, color: '#333', marginLeft: 8 },
    benefitTextLocked: { color: '#999' },
    useButton: {
        backgroundColor: theme.colors.black,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 16,
    },
    useButtonSelected: { backgroundColor: '#D32F2F' },
    useButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginRight: 8 },
});

export default RewardCardsScreen;
