import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { useRewards, REWARD_CARDS } from '../context/RewardsContext';
import GlassRewardCard from './GlassRewardCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

/**
 * Glassmorphic Reward Cards Carousel
 * Optimized for performance
 */
export const RewardCardsCarousel = ({ navigation }) => {
    const scrollRef = useRef(null);
    const { getAllCards, selectCard, selectedCard } = useRewards();

    const cards = getAllCards();

    // Memoize the card press handler to prevent re-creation on every render
    const handleCardPress = useCallback(async (tier, isUnlocked) => {
        if (isUnlocked) {
            // Toggle card selection
            if (selectedCard === tier) {
                // Card is already selected, navigate to rewards screen
                if (navigation) {
                    navigation.navigate('Rewards');
                }
            } else {
                // Select this card
                await selectCard(tier);
            }
        } else {
            // Show unlock requirements
            if (navigation) {
                navigation.navigate('Rewards');
            }
        }
    }, [selectedCard, selectCard, navigation]);

    const handleViewAll = useCallback(() => {
        if (navigation) {
            navigation.navigate('Rewards');
        }
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>REWARD CARDS</Text>
                <TouchableOpacity onPress={handleViewAll}>
                    <Text style={styles.viewAllText}>VIEW ALL</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + 20}
                decelerationRate="fast"
                contentContainerStyle={styles.scrollContent}
                removeClippedSubviews={true} // Performance optimization for large lists
                scrollEventThrottle={16} // Optimize scroll event handling
            >
                {cards.map((card) => (
                    <GlassRewardCard
                        key={card.tier}
                        tier={card.tier}
                        discount={card.discount}
                        progress={card.progress}
                        isUnlocked={card.isUnlocked}
                        cardNumber={card.cardNumber}
                        onPress={() => handleCardPress(card.tier, card.isUnlocked)}
                    />
                ))}
            </ScrollView>

            <Text style={styles.helperText}>
                {selectedCard && REWARD_CARDS[selectedCard]
                    ? `Using ${REWARD_CARDS[selectedCard].title} • ${REWARD_CARDS[selectedCard].discount}% discount active 🎉`
                    : 'Unlock premium cards by shopping • Earn exclusive rewards 💳'
                }
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1.5,
        color: theme.colors.black,
    },
    viewAllText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.black,
        textDecorationLine: 'underline',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    helperText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#666',
        marginTop: 20,
        paddingHorizontal: 20,
    },
});

export default RewardCardsCarousel;
