
import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Simulated initial data
    useEffect(() => {
        // In a real app, fetch from API here
        const initialNotifications = [
            {
                id: '1',
                title: 'Order Shipped!',
                message: 'Your order #12345 has been shipped and is on its way.',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
                read: false,
                type: 'order'
            },
            {
                id: '2',
                title: 'New Reward Unlocked',
                message: 'Congratulations! You have unlocked the Bronze Tier.',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
                read: false,
                type: 'reward'
            },
            {
                id: '3',
                title: 'Welcome to Velora',
                message: 'Thanks for joining us! Enjoy exclusive deals on your first purchase.',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
                read: true,
                type: 'system'
            }
        ];
        setNotifications(initialNotifications);
    }, []);

    // Update unread count whenever notifications change
    useEffect(() => {
        const count = notifications.filter(n => !n.read).length;
        setUnreadCount(count);
    }, [notifications]);

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const addNotification = (notification) => {
        const newNotif = {
            id: Date.now().toString(),
            timestamp: new Date(),
            read: false,
            ...notification
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            addNotification,
            deleteNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
