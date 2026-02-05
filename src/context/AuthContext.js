import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import * as WebBrowser from 'expo-web-browser';
import { auth, db } from '../config/firebase';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user data from Firestore
    const fetchUserData = async (uid) => {
        try {
            const userDocRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                setUserData(userDoc.data());
                return userDoc.data();
            }
            return null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    // Create user profile in Firestore
    const createUserProfile = async (uid, email, additionalData = {}) => {
        try {
            const userDocRef = doc(db, 'users', uid);
            const userData = {
                uid,
                email,
                displayName: additionalData.displayName || '',
                firstName: additionalData.firstName || '',
                lastName: additionalData.lastName || '',
                phone: additionalData.phone || '',
                photoURL: additionalData.photoURL || '',
                address: {
                    street: additionalData.street || '',
                    city: additionalData.city || '',
                    state: additionalData.state || '',
                    zipCode: additionalData.zipCode || '',
                    country: additionalData.country || 'India'
                },
                role: additionalData.role || 'customer', // customer, admin, etc.
                isActive: true,
                isEmailVerified: false,
                provider: additionalData.provider || 'email', // email, google, etc.
                metadata: {
                    createdAt: serverTimestamp(),
                    lastLogin: serverTimestamp(),
                    lastUpdated: serverTimestamp(),
                    loginCount: 1
                },
                preferences: {
                    notifications: true,
                    newsletter: true,
                    language: 'en',
                    currency: 'INR'
                },
                stats: {
                    totalOrders: 0,
                    totalSpent: 0,
                    wishlistCount: 0,
                    cartCount: 0
                }
            };

            await setDoc(userDocRef, userData, { merge: true });
            setUserData(userData);
            return userData;
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    };

    // Update last login timestamp and metadata
    const updateLastLogin = async (uid) => {
        try {
            const userDocRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userDocRef);

            const currentLoginCount = userDoc.exists() ? (userDoc.data().metadata?.loginCount || 0) : 0;

            await setDoc(userDocRef, {
                'metadata.lastLogin': serverTimestamp(),
                'metadata.lastUpdated': serverTimestamp(),
                'metadata.loginCount': currentLoginCount + 1
            }, { merge: true });
        } catch (error) {
            console.error('Error updating last login:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            if (user) {
                // Fetch user data from Firestore when user is authenticated
                await fetchUserData(user.uid);
            } else {
                setUserData(null);
            }

            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Update last login and fetch user data
        await updateLastLogin(userCredential.user.uid);
        await fetchUserData(userCredential.user.uid);
        return userCredential;
    };

    const register = async (email, password, additionalData = {}) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create user profile in Firestore
        await createUserProfile(userCredential.user.uid, email, additionalData);
        return userCredential;
    };

    const logout = async () => {
        setUserData(null);
        return signOut(auth);
    };

    const signInWithGoogle = async () => {
        try {
            // For Expo/React Native, Google Sign-In requires native modules or expo-auth-session
            // This is a simplified message - full implementation requires proper OAuth setup
            return {
                error: true,
                message: 'Google Sign-In requires additional setup. Please use email/password authentication for now, or contact support for assistance with Google authentication.'
            };
        } catch (error) {
            console.error('Google Sign-In error:', error);
            return {
                error: true,
                message: error.message || 'Failed to sign in with Google'
            };
        }
    };

    // Update user profile
    const updateUserProfile = async (updates) => {
        try {
            if (!user) {
                throw new Error('No user logged in');
            }

            const userDocRef = doc(db, 'users', user.uid);

            // Add metadata
            const updateData = {
                ...updates,
                'metadata.lastUpdated': serverTimestamp()
            };

            await setDoc(userDocRef, updateData, { merge: true });

            // Fetch updated user data
            await fetchUserData(user.uid);

            return { success: true };
        } catch (error) {
            console.error('Error updating user profile:', error);
            return {
                error: true,
                message: error.message || 'Failed to update profile'
            };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            userData,
            loading,
            login,
            register,
            logout,
            signInWithGoogle,
            updateUserProfile,
            fetchUserData,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};
