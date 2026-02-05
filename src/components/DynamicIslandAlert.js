import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    Image
} from 'react-native';
import { theme } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const DynamicIslandAlert = ({ visible, message, image, onClose }) => {
    const insets = useSafeAreaInsets();
    // Start collapsed (small width, small height)
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const widthAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Expand animation
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 12,
                    tension: 50,
                    useNativeDriver: false // width/height not supported by native driver
                }),
                Animated.timing(widthAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false
                })
            ]).start();

            // Auto-hide after 3 seconds
            const timer = setTimeout(() => {
                closeAnimation();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const closeAnimation = () => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false
            }),
            Animated.timing(widthAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false
            })
        ]).start(() => onClose && onClose());
    };

    if (!visible) return null;

    const dynamicUnfold = {
        transform: [{ scale: scaleAnim }],
        width: widthAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [120, width - 40]
        }),
    };

    return (
        <View style={[styles.container, { top: insets.top + 10 }]}>
            <Animated.View style={[styles.island, dynamicUnfold]}>
                <View style={styles.content}>
                    {image && <Image source={{ uri: image }} style={styles.thumb} />}
                    <View style={styles.textContainer}>
                        <Text style={styles.message} numberOfLines={1}>{message}</Text>
                        <Text style={styles.subtext}>Added to bag</Text>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
    },
    island: {
        height: 60,
        backgroundColor: 'black',
        borderRadius: 30,
        justifyContent: 'center',
        paddingHorizontal: 8,
        overflow: 'hidden'
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingLeft: 4,
    },
    thumb: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: '#333'
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    subtext: {
        color: '#888',
        fontSize: 12,
    }
});

export default DynamicIslandAlert;
