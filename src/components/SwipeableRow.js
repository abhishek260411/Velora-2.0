import React, { useRef } from 'react';
import {
    View,
    Animated,
    PanResponder,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DELETE_THRESHOLD = 80;

const SwipeableRow = ({ children, onRemove, enabled = true }) => {
    const pan = useRef(new Animated.ValueXY()).current;

    // Track if we are currently handling a swipe to avoid conflicts
    const isSwiping = useRef(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (e, gestureState) => {
                if (!enabled) return false;
                const { dx, dy } = gestureState;
                // Only activate on horizontal swipe
                return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
            },
            onPanResponderGrant: () => {
                isSwiping.current = true;
                pan.setOffset({
                    x: pan.x._value,
                    y: 0
                });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event(
                [
                    null,
                    { dx: pan.x }
                ],
                { useNativeDriver: false } // pan.x is not native driven here
            ),
            onPanResponderRelease: (e, gestureState) => {
                pan.flattenOffset();
                isSwiping.current = false;

                if (gestureState.dx < -DELETE_THRESHOLD) {
                    // Swiped left enough to maybe trigger delete
                    // Snap to open position or trigger delete immediately?
                    // Let's snap to open delete button position (-80)
                    Animated.spring(pan, {
                        toValue: { x: -DELETE_THRESHOLD, y: 0 },
                        useNativeDriver: false
                    }).start();
                } else if (gestureState.dx > 0) {
                    // Swiped right -> Reset
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false
                    }).start();
                } else {
                    // Didn't swipe enough -> Reset
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false
                    }).start();
                }
            }
        })
    ).current;

    const handleDelete = () => {
        // Animate off screen then call onRemove
        Animated.timing(pan, {
            toValue: { x: -SCREEN_WIDTH, y: 0 },
            duration: 250,
            useNativeDriver: false
        }).start(() => {
            if (onRemove) onRemove();
            // Reset position for reuse implicitly handled by removal from list
            // But if list doesn't remove it, we should reset:
            // pan.setValue({ x: 0, y: 0 });
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.deleteButtonContainer}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDelete}
                    activeOpacity={0.8}
                >
                    <MaterialCommunityIcons name="trash-can-outline" size={24} color={theme.colors.white} />
                </TouchableOpacity>
            </View>

            <Animated.View
                style={[
                    styles.content,
                    { transform: [{ translateX: pan.x }] }
                ]}
                {...panResponder.panHandlers}
            >
                {children}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginBottom: 25, // Extracted from CartScreen styles.cartItem
        backgroundColor: theme.colors.white, // Match Cart background
    },
    content: {
        backgroundColor: theme.colors.white,
    },
    deleteButtonContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: DELETE_THRESHOLD,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    }
});

export default SwipeableRow;
