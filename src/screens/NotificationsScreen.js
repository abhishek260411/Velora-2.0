
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNotifications } from '../context/NotificationContext';

// Since I haven't checked package.json for date-fns, I'll fall back to simple Date logic

const NotificationsScreen = ({ navigation }) => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

    // Auto-mark notifications as read after 2 seconds on the screen?
    // Or just on tap. Let's do on tap for now or "Mark all as read" button.

    const renderNotification = ({ item }) => {
        const isRead = item.read;
        const timeAgo = Math.floor((new Date() - new Date(item.timestamp)) / 60000); // minutes
        let timeString = '';
        if (timeAgo < 60) {
            timeString = `${timeAgo}m ago`;
        } else if (timeAgo < 1440) {
            timeString = `${Math.floor(timeAgo / 60)}h ago`;
        } else {
            timeString = `${Math.floor(timeAgo / 1440)}d ago`;
        }

        return (
            <TouchableOpacity
                style={[styles.notifCard, !isRead && styles.unreadCard]}
                onPress={() => markAsRead(item.id)}
            >
                <View style={[styles.iconBox, { backgroundColor: getIconColor(item.type) }]}>
                    <MaterialCommunityIcons name={getIconName(item.type)} size={24} color="#fff" />
                </View>
                <View style={styles.content}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.title, !isRead && styles.unreadText]}>{item.title}</Text>
                        <Text style={styles.time}>{timeString}</Text>
                    </View>
                    <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                </View>
                {!isRead && <View style={styles.dot} />}
            </TouchableOpacity>
        );
    };

    const getIconName = (type) => {
        switch (type) {
            case 'order': return 'package-variant-closed';
            case 'reward': return 'gift';
            case 'system': return 'information-outline';
            default: return 'bell-outline';
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case 'order': return '#007BFF'; // Blue
            case 'reward': return '#FF9500'; // Orange
            case 'system': return '#34C759'; // Green
            default: return '#8E8E93'; // Gray
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>

                {unreadCount > 0 && (
                    <TouchableOpacity onPress={markAllAsRead}>
                        <Text style={styles.markReadText}>Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="bell-off-outline" size={64} color="#C7C7CC" />
                        <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    backBtn: {
        width: 40,
        alignItems: 'flex-start'
    },
    markReadText: {
        fontSize: 14,
        color: '#007BFF',
        fontWeight: '600',
    },
    listContent: {
        paddingVertical: 10,
    },
    notifCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
        backgroundColor: '#fff',
    },
    unreadCard: {
        backgroundColor: '#F0F8FF', // Light blue tint
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    content: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        flex: 1,
        marginRight: 10,
    },
    unreadText: {
        fontWeight: '800',
    },
    time: {
        fontSize: 12,
        color: '#8E8E93',
    },
    message: {
        fontSize: 14,
        color: '#3C3C43',
        lineHeight: 20,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#007BFF',
        marginLeft: 10,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 20,
        fontSize: 16,
        color: '#8E8E93',
    },
});

export default NotificationsScreen;
