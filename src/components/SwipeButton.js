import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    PanResponder,
    ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

const SwipeButton = ({ onSwipeSuccess, title = "SLIDE TO ADD", isLoading }) => {
    const [swiped, setSwiped] = useState(false);
    const translateX = useRef(new Animated.Value(0)).current;

    // We use a ref for maxDrag to avoid closure staleness in PanResponder
    const maxDragRef = useRef(0);
    const BUTTON_SIZE = 48;
    const PADDING = 4;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !isLoading && !swiped,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Only claim if horizontal movement is dominant
                return !isLoading && !swiped && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
            },
            onPanResponderGrant: () => {
                // Optional: visual feedback on touch start
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            },
            onPanResponderMove: (_, gestureState) => {
                const maxDrag = maxDragRef.current;
                if (!swiped && maxDrag > 0 && !isLoading) {
                    // newX calculation:
                    // Clamp between 0 and maxDrag
                    let newX = gestureState.dx;
                    if (newX < 0) newX = 0;
                    if (newX > maxDrag) newX = maxDrag;

                    translateX.setValue(newX);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                const maxDrag = maxDragRef.current;
                const swipeThreshold = maxDrag * 0.7; // 70% threshold

                if (!swiped && gestureState.dx > swipeThreshold && maxDrag > 0 && !isLoading) {
                    // Success: Snap to end
                    Animated.timing(translateX, {
                        toValue: maxDrag,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        setSwiped(true);
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        onSwipeSuccess && onSwipeSuccess();
                    });
                } else {
                    // Failure: Snap back to start
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                        bounciness: 10
                    }).start();
                }
            },
            // Handle cancellation (e.g. scrolling takes over)
            onPanResponderTerminate: () => {
                if (!swiped && !isLoading) {
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            }
        })
    ).current;

    // Handle auto-reset when not loading
    useEffect(() => {
        let timeout;
        if (swiped && !isLoading) {
            timeout = setTimeout(() => {
                setSwiped(false);
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            }, 2000);
        }
        return () => clearTimeout(timeout);
    }, [swiped, isLoading]);

    // Ensure slider stays at end if loading
    useEffect(() => {
        if (isLoading && maxDragRef.current > 0) {
            translateX.setValue(maxDragRef.current);
            setSwiped(true);
        }
    }, [isLoading]);

    const handleLayout = (e) => {
        const width = e.nativeEvent.layout.width;
        const maxDrag = Math.max(0, width - BUTTON_SIZE - (PADDING * 2));
        // Update the ref so PanResponder sees the correct value immediately
        maxDragRef.current = maxDrag;

        if (isLoading && maxDrag > 0) {
            translateX.setValue(maxDrag);
            setSwiped(true);
        }
    };

    return (
        <View
            style={styles.container}
            onLayout={handleLayout}
        >
            <View style={styles.track}>
                <Text style={styles.title}>
                    {isLoading ? "PROCESSING..." : (swiped ? "CONFIRMED" : title)}
                </Text>
            </View>
            <Animated.View
                style={[
                    styles.thumb,
                    {
                        transform: [{ translateX }],
                        backgroundColor: theme.colors.black
                    }
                ]}
                {...panResponder.panHandlers}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color={theme.colors.white} />
                ) : (
                    <MaterialCommunityIcons
                        name={swiped ? "check" : "chevron-right"}
                        size={28}
                        color={theme.colors.white}
                    />
                )}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 56,
        backgroundColor: theme.colors.gray,
        borderRadius: 28,
        justifyContent: 'center',
        padding: 4,
        position: 'relative',
        overflow: 'hidden'
    },
    track: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20
    },
    title: {
        ...theme.typography.subHeader,
        fontSize: 10,
        letterSpacing: 2,
        color: theme.colors.darkGray,
        fontWeight: 'bold'
    },
    thumb: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }
});

export default SwipeButton;
