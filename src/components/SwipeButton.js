import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    PanResponder,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

const SwipeButton = ({ onSwipeSuccess, title = "SLIDE TO ADD" }) => {
    const [swiped, setSwiped] = useState(false);
    const translateX = useRef(new Animated.Value(0)).current;

    // We use a ref for maxDrag to avoid closure staleness in PanResponder
    const maxDragRef = useRef(0);
    const BUTTON_SIZE = 48;
    const PADDING = 4;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Only claim if horizontal movement is dominant
                return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
            },
            onPanResponderGrant: () => {
                // Optional: visual feedback on touch start
            },
            onPanResponderMove: (_, gestureState) => {
                const maxDrag = maxDragRef.current;
                if (!swiped && maxDrag > 0) {
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

                if (!swiped && gestureState.dx > swipeThreshold && maxDrag > 0) {
                    // Success: Snap to end
                    Animated.timing(translateX, {
                        toValue: maxDrag,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        setSwiped(true);
                        onSwipeSuccess && onSwipeSuccess();

                        // Reset after delay
                        setTimeout(() => {
                            setSwiped(false);
                            Animated.spring(translateX, {
                                toValue: 0,
                                useNativeDriver: true,
                            }).start();
                        }, 2000);
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
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            }
        })
    ).current;

    const handleLayout = (e) => {
        const width = e.nativeEvent.layout.width;
        // Update the ref so PanResponder sees the correct value immediately
        maxDragRef.current = Math.max(0, width - BUTTON_SIZE - (PADDING * 2));
    };

    return (
        <View
            style={styles.container}
            onLayout={handleLayout}
        >
            <View style={styles.track}>
                <Text style={styles.title}>{swiped ? "CONFIRMED" : title}</Text>
            </View>
            <Animated.View
                style={[
                    styles.thumb,
                    {
                        transform: [{ translateX }],
                        backgroundColor: swiped ? theme.colors.black : theme.colors.black
                    }
                ]}
                {...panResponder.panHandlers}
            >
                <MaterialCommunityIcons
                    name={swiped ? "check" : "chevron-right"}
                    size={28}
                    color={theme.colors.white}
                />
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
