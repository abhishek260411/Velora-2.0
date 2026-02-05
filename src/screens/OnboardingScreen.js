import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, SafeAreaView } from 'react-native';
import { theme } from '../theme';
import VeloraButton from '../components/VeloraButton';
import GlassCard from '../components/GlassCard';

const { width, height } = Dimensions.get('window');

const onboardingData = [
    {
        id: 1,
        title: 'UNCOMPROMISING STYLE',
        subtitle: 'Experience the perfect blend of athletic performance and high-fashion aesthetics.',
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000', // Placeholder high-end fashion
    },
    {
        id: 2,
        title: 'CRAFTED FOR EXCELLENCE',
        subtitle: 'Every piece in the VELORA collection is designed with precision and premium materials.',
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1000',
    }
];

const OnboardingScreen = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            navigation.navigate('Login');
        }
    };

    const currentItem = onboardingData[currentIndex];

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: currentItem.image }}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <SafeAreaView style={styles.overlay}>
                    <View style={styles.progressContainer}>
                        {onboardingData.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dash,
                                    { backgroundColor: index === currentIndex ? theme.colors.white : 'rgba(255,255,255,0.3)' }
                                ]}
                            />
                        ))}
                    </View>

                    <View style={styles.bottomSection}>
                        <GlassCard style={styles.card}>
                            <Text style={styles.title}>{currentItem.title}</Text>
                            <Text style={styles.subtitle}>{currentItem.subtitle}</Text>

                            <VeloraButton
                                title={currentIndex === onboardingData.length - 1 ? "ENTER VELORA" : "NEXT"}
                                onPress={handleNext}
                                variant="secondary"
                                style={styles.button}
                            />
                        </GlassCard>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        width: width,
        height: height,
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    dash: {
        width: 30,
        height: 3,
        marginHorizontal: 5,
        borderRadius: 2,
    },
    bottomSection: {
        marginBottom: 40,
    },
    card: {
        alignItems: 'center',
    },
    title: {
        ...theme.typography.header,
        color: theme.colors.black,
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        ...theme.typography.body,
        color: theme.colors.darkGray,
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        marginTop: 10,
    }
});

export default OnboardingScreen;
