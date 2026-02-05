import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Dimensions
} from 'react-native';
import { theme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import VeloraButton from '../components/VeloraButton';

const { width } = Dimensions.get('window');

const OrderSuccessScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="check-all" size={80} color={theme.colors.white} />
                </View>

                <Text style={styles.title}>ORDER PLACED SUCCESSFULLY!</Text>
                <Text style={styles.subtitle}>
                    Your order #VL-2026-001 has been confirmed and will be shipped soon.
                </Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>WHAT'S NEXT?</Text>
                    <Text style={styles.cardText}>
                        You can track your order status in the "My Orders" section of your profile.
                    </Text>
                </View>

                <VeloraButton
                    title="MY ORDERS"
                    onPress={() => navigation.navigate('MyOrders')}
                    variant="secondary"
                    style={styles.ordersBtn}
                />

                <VeloraButton
                    title="CONTINUE SHOPPING"
                    onPress={() => navigation.navigate('Home')}
                    style={styles.homeBtn}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
        justifyContent: 'center',
    },
    iconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: theme.colors.black,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        ...theme.typography.header,
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 15,
        letterSpacing: 1,
    },
    subtitle: {
        ...theme.typography.body,
        textAlign: 'center',
        color: theme.colors.darkGray,
        marginBottom: 40,
        lineHeight: 22,
    },
    card: {
        width: '100%',
        backgroundColor: theme.colors.gray,
        padding: 24,
        borderRadius: 16,
        marginBottom: 40,
    },
    cardTitle: {
        ...theme.typography.subHeader,
        fontSize: 12,
        marginBottom: 8,
    },
    cardText: {
        ...theme.typography.body,
        fontSize: 14,
        color: theme.colors.darkGray,
        lineHeight: 20,
    },
    ordersBtn: {
        marginBottom: 15,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.black,
    },
    homeBtn: {
        width: '100%',
    }
});

export default OrderSuccessScreen;
