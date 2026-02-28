import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { theme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const VeloraImage = ({ source, style, ...props }) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        setHasError(false);
        setIsLoading(true);
    }, [source?.uri]);

    const handleError = () => {
        if (isMounted.current) {
            setHasError(true);
            setIsLoading(false);
        }
    };

    const handleLoadEnd = () => {
        if (isMounted.current) {
            setIsLoading(false);
        }
    };

    // If no source is provided, treat it as an error/empty state
    if (!source || (!source.uri && !source)) {
        return (
            <View style={[styles.container, styles.errorContainer, style]}>
                <MaterialCommunityIcons name="image-off-outline" size={24} color={theme.colors.darkGray} />
                <Text style={styles.errorText}>No available image</Text>
            </View>
        );
    }

    if (hasError) {
        return (
            <View style={[styles.container, styles.errorContainer, style]}>
                <MaterialCommunityIcons name="image-broken-variant" size={24} color={theme.colors.darkGray} />
                <Text style={styles.errorText}>No available image</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <Image
                source={source}
                style={[StyleSheet.absoluteFill, styles.image]}
                contentFit="cover"
                transition={300}
                cachePolicy="memory-disk"
                placeholder={{ blurhash: 'L9AB*A%N00~q~q-;M{t700~q00Rj' }}
                onError={handleError}
                onLoad={handleLoadEnd}
                {...props}
            />
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={theme.colors.gray} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: theme.colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    errorText: {
        ...theme.typography.body,
        fontSize: 10,
        color: theme.colors.darkGray,
        marginTop: 4,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.3)',
    }
});

export default VeloraImage;
