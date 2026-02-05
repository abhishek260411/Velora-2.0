/**
 * User Data Utilities
 * Helper functions for working with user data throughout the app
 */

/**
 * Get user's full display name
 */
export const getUserDisplayName = (userData) => {
    if (!userData) return 'Guest';

    if (userData.displayName) return userData.displayName;
    if (userData.firstName && userData.lastName) {
        return `${userData.firstName} ${userData.lastName}`;
    }
    if (userData.firstName) return userData.firstName;
    if (userData.email) return userData.email.split('@')[0];

    return 'User';
};

/**
 * Get user's initials for avatar
 */
export const getUserInitials = (userData) => {
    if (!userData) return 'G';

    if (userData.firstName && userData.lastName) {
        return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
    }

    if (userData.displayName) {
        const parts = userData.displayName.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
        }
        return userData.displayName.substring(0, 2).toUpperCase();
    }

    if (userData.email) {
        return userData.email.substring(0, 2).toUpperCase();
    }

    return 'U';
};

/**
 * Get formatted address
 */
export const getFormattedAddress = (userData) => {
    if (!userData || !userData.address) return '';

    const { street, city, state, zipCode, country } = userData.address;
    const parts = [street, city, state, zipCode, country].filter(Boolean);

    return parts.join(', ');
};

/**
 * Check if user has completed profile
 */
export const isProfileComplete = (userData) => {
    if (!userData) return false;

    const requiredFields = ['displayName', 'email', 'phone'];
    return requiredFields.every(field => userData[field] && userData[field].trim() !== '');
};

/**
 * Check if user is admin
 */
export const isAdmin = (userData) => {
    return userData?.role === 'admin';
};

/**
 * Check if user is active
 */
export const isUserActive = (userData) => {
    return userData?.isActive === true;
};

/**
 * Format last login date
 */
export const getLastLoginFormatted = (userData) => {
    if (!userData?.metadata?.lastLogin) return 'Never';

    // If it's a Firestore Timestamp, convert it
    const lastLogin = userData.metadata.lastLogin.toDate ?
        userData.metadata.lastLogin.toDate() :
        new Date(userData.metadata.lastLogin);

    const now = new Date();
    const diff = now - lastLogin;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return lastLogin.toLocaleDateString();
};

/**
 * Format user data for admin panel
 */
export const formatUserDataForAdmin = (userData) => {
    if (!userData) return null;

    return {
        id: userData.uid,
        name: getUserDisplayName(userData),
        email: userData.email,
        phone: userData.phone || 'Not provided',
        role: userData.role || 'customer',
        status: userData.isActive ? 'Active' : 'Inactive',
        provider: userData.provider || 'email',
        lastLogin: getLastLoginFormatted(userData),
        loginCount: userData.metadata?.loginCount || 0,
        totalOrders: userData.stats?.totalOrders || 0,
        totalSpent: userData.stats?.totalSpent || 0,
        createdAt: userData.metadata?.createdAt,
        address: getFormattedAddress(userData)
    };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number
    return phoneRegex.test(phone);
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Get user stats summary
 */
export const getUserStatsSummary = (userData) => {
    if (!userData?.stats) return null;

    return {
        orders: userData.stats.totalOrders || 0,
        spent: `₹${(userData.stats.totalSpent || 0).toLocaleString('en-IN')}`,
        wishlist: userData.stats.wishlistCount || 0,
        cart: userData.stats.cartCount || 0
    };
};
