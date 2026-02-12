import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const RewardsContext = createContext();

// Card configurations
export const REWARD_CARDS = {
    bronze: {
        tier: 'bronze',
        discount: 5,
        requirement: 5000,
        title: 'Bronze Card',
        cardNumber: '2585 2327 1786 1234',
        gradientColors: ['#CD7F32', '#8B4513', '#D2691E'],
        orbColor: '#FF6B35',
        benefits: ['5% off on all purchases', 'Early access to sales', 'Birthday rewards']
    },
    silver: {
        tier: 'silver',
        discount: 10,
        requirement: 15000,
        title: 'Silver Card',
        cardNumber: '2585 2327 1786 5678',
        gradientColors: ['#C0C0C0', '#A8A8A8', '#D3D3D3'],
        orbColor: '#E0E0E0',
        benefits: ['10% off on all purchases', 'Free shipping', 'Priority support', 'Exclusive previews']
    },
    gold: {
        tier: 'gold',
        discount: 15,
        requirement: 30000,
        title: 'Gold Card',
        cardNumber: '2585 2327 1786 9012',
        gradientColors: ['#FFD700', '#FFA500', '#FF6347'],
        orbColor: '#FF4757',
        benefits: ['15% off on all purchases', 'Free express shipping', 'VIP support', 'Gift wrapping', 'Seasonal gifts']
    },
    platinum: {
        tier: 'platinum',
        discount: 20,
        requirement: 50000,
        title: 'Platinum Card',
        cardNumber: '2585 2327 1786 3456',
        gradientColors: ['#E5E4E2', '#B8B8B8', '#D3D3D3'],
        orbColor: '#A8A8A8',
        benefits: ['20% off on all purchases', 'Free premium shipping', 'Dedicated concierge', 'Exclusive events', 'Personal stylist', 'Luxury packaging']
    }
};

export const RewardsProvider = ({ children }) => {
    const [totalSpent, setTotalSpent] = useState(0);
    const [selectedCard, setSelectedCard] = useState(null);
    const [unlockedCards, setUnlockedCards] = useState(['bronze']);
    const [points, setPoints] = useState(0);
    const [pointsHistory, setPointsHistory] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [referralCode, setReferralCode] = useState('');
    const [loading, setLoading] = useState(true);

    // Load user rewards data from Firestore
    useEffect(() => {
        loadRewardsData();
    }, []);

    const loadRewardsData = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const rewardsRef = doc(db, 'userRewards', user.uid);
                const rewardsDoc = await getDoc(rewardsRef);

                if (rewardsDoc.exists()) {
                    const data = rewardsDoc.data();
                    setTotalSpent(data.totalSpent || 0);
                    setUnlockedCards(data.unlockedCards || ['bronze']);
                    setSelectedCard(data.selectedCard || null);
                    setPoints(data.points || 0);
                    setPointsHistory(data.pointsHistory || []);
                    setCoupons(data.coupons || []);
                    setReferralCode(data.referralCode || `VEL${user.uid.slice(0, 6).toUpperCase()} `);
                } else {
                    const initialReferralCode = `VEL${user.uid.slice(0, 6).toUpperCase()} `;
                    // Initialize rewards data for new user
                    await setDoc(rewardsRef, {
                        totalSpent: 0,
                        unlockedCards: ['bronze'],
                        selectedCard: null,
                        points: 100, // Sign up bonus
                        referralCode: initialReferralCode,
                        pointsHistory: [
                            { id: '1', type: 'earn', title: 'Sign up Bonus', amount: 100, date: new Date() }
                        ],
                        coupons: [
                            { id: 'WELCOME20', code: 'WELCOME20', title: 'Welcome Offer', discount: 20, description: '20% off on your first order', expiryDate: '2026-12-31', used: false }
                        ],
                        createdAt: serverTimestamp()
                    });
                    setPoints(100);
                    setReferralCode(initialReferralCode);
                    setCoupons([{ id: 'WELCOME20', code: 'WELCOME20', title: 'Welcome Offer', discount: 20, description: '20% off on your first order', expiryDate: '2026-12-31', used: false }]);
                }
            }
        } catch (error) {
            console.error('Error loading rewards data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addPoints = async (amount, title) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;

            const newPoints = points + amount;
            const historyItem = {
                id: Date.now().toString(),
                type: amount > 0 ? 'earn' : 'spent',
                title: title || (amount > 0 ? 'Generic Earn' : 'Generic Spent'),
                amount: Math.abs(amount),
                date: new Date()
            };

            const nextPoints = points + amount;
            setPoints(nextPoints);
            setPointsHistory(prev => [historyItem, ...prev]);

            const rewardsRef = doc(db, 'userRewards', user.uid);
            await updateDoc(rewardsRef, {
                points: nextPoints,
                pointsHistory: arrayUnion(historyItem)
            });
        } catch (error) {
            console.error('Error adding points:', error);
        }
    };

    const addSpending = async (amount) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;

            setTotalSpent(prev => prev + amount);

            setUnlockedCards(prev => {
                const newTotal = totalSpent + amount;
                return Object.keys(REWARD_CARDS).filter(tier => {
                    return newTotal >= REWARD_CARDS[tier].requirement;
                });
            });

            const rewardsRef = doc(db, 'userRewards', user.uid);
            const newTotal = totalSpent + amount;
            const newUnlocked = Object.keys(REWARD_CARDS).filter(tier => {
                return newTotal >= REWARD_CARDS[tier].requirement;
            });

            await updateDoc(rewardsRef, {
                totalSpent: newTotal,
                unlockedCards: newUnlocked,
                lastUpdated: serverTimestamp()
            });

            // Award points for spending (1 point for every ₹100)
            const ptsEarned = Math.floor(amount / 100);
            if (ptsEarned > 0) {
                await addPoints(ptsEarned, 'Order Purchase');
            }

        } catch (error) {
            console.error('Error updating spending:', error);
        }
    };

    const selectCard = async (tier) => {
        if (!unlockedCards.includes(tier)) return false;
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return false;
            setSelectedCard(tier);
            const rewardsRef = doc(db, 'userRewards', user.uid);
            await updateDoc(rewardsRef, { selectedCard: tier, lastUpdated: serverTimestamp() });
            return true;
        } catch (error) {
            console.error('Error selecting card:', error);
            return false;
        }
    };

    const deselectCard = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;
            setSelectedCard(null);
            const rewardsRef = doc(db, 'userRewards', user.uid);
            await updateDoc(rewardsRef, { selectedCard: null, lastUpdated: serverTimestamp() });
        } catch (error) {
            console.error('Error deselecting card:', error);
        }
    };

    const calculateDiscount = (subtotal) => {
        if (!selectedCard || !unlockedCards.includes(selectedCard)) {
            return { discount: 0, discountPercent: 0 };
        }
        const card = REWARD_CARDS[selectedCard];
        const discountPercent = card.discount;
        const discount = Math.round((subtotal * discountPercent) / 100);
        return { discount, discountPercent };
    };

    const getCardProgress = (tier) => {
        const card = REWARD_CARDS[tier];
        if (!card) return 100;
        if (unlockedCards.includes(tier)) return 100;
        return Math.min(100, Math.round((totalSpent / card.requirement) * 100));
    };

    const getAllCards = () => {
        return Object.keys(REWARD_CARDS).map(tier => ({
            ...REWARD_CARDS[tier],
            isUnlocked: unlockedCards.includes(tier),
            progress: getCardProgress(tier),
            isSelected: selectedCard === tier
        }));
    };

    const value = {
        totalSpent,
        selectedCard,
        unlockedCards,
        points,
        pointsHistory,
        coupons,
        referralCode,
        loading,
        addSpending,
        addPoints,
        selectCard,
        deselectCard,
        calculateDiscount,
        getCardProgress,
        getAllCards,
        REWARD_CARDS
    };

    return (
        <RewardsContext.Provider value={value}>
            {children}
        </RewardsContext.Provider>
    );
};

export const useRewards = () => {
    const context = useContext(RewardsContext);
    if (!context) throw new Error('useRewards must be used within RewardsProvider');
    return context;
};
