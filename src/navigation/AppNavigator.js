import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProductListingScreen from '../screens/ProductListingScreen';
import SearchScreen from '../screens/SearchScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import MyOrdersScreen from '../screens/MyOrdersScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import WishlistScreen from '../screens/WishlistScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RewardsScreen from '../screens/RewardsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SubCategoryScreen from '../screens/SubCategoryScreen';
import BrandCollectionScreen from '../screens/BrandCollectionScreen';
import NewArrivalsScreen from '../screens/NewArrivalsScreen';
import TrendingScreen from '../screens/TrendingScreen';
import OffersScreen from '../screens/OffersScreen';
import RecentlyViewedScreen from '../screens/RecentlyViewedScreen';
import RewardCardsScreen from '../screens/RewardCardsScreen';
import PointsHistoryScreen from '../screens/PointsHistoryScreen';
import ReferralScreen from '../screens/ReferralScreen';
import CouponsScreen from '../screens/CouponsScreen';
import AddressBookScreen from '../screens/AddressBookScreen';
import AddEditAddressScreen from '../screens/AddEditAddressScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import ChatSupportScreen from '../screens/ChatSupportScreen';
import ReportIssueScreen from '../screens/ReportIssueScreen';
import TrackOrderScreen from '../screens/TrackOrderScreen';
import ReturnRefundScreen from '../screens/ReturnRefundScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#007BFF',
                tabBarInactiveTintColor: '#8E8E93',
                tabBarStyle: styles.tabBar,
                tabBarBackground: () => (
                    Platform.OS === 'ios' ? (
                        <BlurView tint="light" intensity={80} style={StyleSheet.absoluteFill} />
                    ) : (
                        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255, 255, 255, 0.95)' }]} />
                    )
                ),
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'HomeTab') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'SearchTab') {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name === 'WishlistTab') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'CartTab') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    } else if (route.name === 'ProfileTab') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    // Add a subtle pop effect or custom sizing if needed, 
                    // for now keeping it standard but premium clean
                    return <Ionicons name={iconName} size={24} color={color} style={{ marginBottom: -3 }} />;
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '500',
                    marginBottom: 4,
                }
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{ title: 'Home' }}
            />
            <Tab.Screen
                name="SearchTab"
                component={SearchScreen}
                options={{ title: 'Search' }}
            />
            <Tab.Screen
                name="WishlistTab"
                component={WishlistScreen}
                options={{ title: 'Wishlist' }}
            />
            <Tab.Screen
                name="CartTab"
                component={CartScreen}
                options={{ title: 'Cart' }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />

            {/* Main App with Tabs */}
            <Stack.Screen name="Main" component={TabNavigator} />

            {/* Screens that hide the tab bar */}
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="ProductListing" component={ProductListingScreen} />
            {/* Note: Search is in tabs, but if we need a separate full screen search we can keep this alias */}
            <Stack.Screen name="Search" component={SearchScreen} />
            {/* Note: Cart is in tabs, but keeping this alias for direct navigation if needed */}
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
            <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
            <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
            <Stack.Screen name="Wishlist" component={WishlistScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Rewards" component={RewardsScreen} />
            <Stack.Screen name="RewardCards" component={RewardCardsScreen} />
            <Stack.Screen name="PointsHistory" component={PointsHistoryScreen} />
            <Stack.Screen name="Referral" component={ReferralScreen} />
            <Stack.Screen name="Coupons" component={CouponsScreen} />
            <Stack.Screen name="AddressBook" component={AddressBookScreen} />
            <Stack.Screen name="AddEditAddress" component={AddEditAddressScreen} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            <Stack.Screen name="ChatSupport" component={ChatSupportScreen} />
            <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />

            {/* Discovery & Engagement Screens */}
            <Stack.Screen name="SubCategory" component={SubCategoryScreen} />
            <Stack.Screen name="BrandCollection" component={BrandCollectionScreen} />
            <Stack.Screen name="NewArrivals" component={NewArrivalsScreen} />
            <Stack.Screen name="Trending" component={TrendingScreen} />
            <Stack.Screen name="Offers" component={OffersScreen} />
            <Stack.Screen name="RecentlyViewed" component={RecentlyViewedScreen} />

            {/* Order Management Screens */}
            <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
            <Stack.Screen name="ReturnRefund" component={ReturnRefundScreen} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,
        borderTopWidth: 0,
        height: Platform.OS === 'ios' ? 85 : 60,
        paddingBottom: Platform.OS === 'ios' ? 20 : 8,
        paddingTop: 8,
        backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#ffffff', // Fallback for android
    }
});

export default AppNavigator;
