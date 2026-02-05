import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import VeloraButton from '../components/VeloraButton';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2;

const SAVED_ITEMS = [
    {
        id: '1',
        name: 'Velocity 1.0 Sneakers',
        brand: 'VELORA ORIGINALS',
        price: '₹12,999',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    },
    {
        id: '3',
        name: 'Oversized Editorial Hoodie',
        brand: 'VELORA EDITORIAL',
        price: '₹8,499',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600',
    }
];

const WishlistScreen = ({ navigation, isTab = false }) => {
    const insets = useSafeAreaInsets();

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <TouchableOpacity style={styles.removeBtn}>
                    <MaterialCommunityIcons name="close" size={18} color={theme.colors.black} />
                </TouchableOpacity>
            </View>
            <View style={styles.info}>
                <Text style={styles.brand}>{item.brand}</Text>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.price}>{item.price}</Text>
                <VeloraButton
                    title="ADD TO BAG"
                    onPress={() => navigation.navigate('Cart')}
                    style={styles.addBtn}
                />
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                {!isTab && (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="arrow-left" size={26} color={theme.colors.black} />
                    </TouchableOpacity>
                )}
                <Text style={styles.headerTitle}>WISHLIST ({SAVED_ITEMS.length})</Text>
                <View style={{ width: 26 }} />
            </View>

            {SAVED_ITEMS.length > 0 ? (
                <FlatList
                    data={SAVED_ITEMS}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={[styles.listContent, isTab && { paddingBottom: 100 }]}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="heart-outline" size={80} color={theme.colors.gray} />
                    <Text style={styles.emptyText}>YOUR WISHLIST IS EMPTY</Text>
                    <Text style={styles.emptySub}>Save items that you love to find them later.</Text>
                    <VeloraButton
                        title="SHOP NOW"
                        onPress={() => navigation.navigate('Home')}
                        style={styles.shopBtn}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray,
    },
    headerTitle: {
        ...theme.typography.header,
        fontSize: 16,
        letterSpacing: 2,
    },
    listContent: {
        padding: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    card: {
        width: COLUMN_WIDTH,
    },
    imageContainer: {
        width: COLUMN_WIDTH,
        height: COLUMN_WIDTH * 1.3,
        backgroundColor: theme.colors.gray,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        paddingHorizontal: 4,
    },
    brand: {
        ...theme.typography.subHeader,
        fontSize: 9,
        color: theme.colors.darkGray,
    },
    name: {
        ...theme.typography.body,
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 2,
    },
    price: {
        ...theme.typography.body,
        fontSize: 13,
        marginTop: 4,
        marginBottom: 10,
    },
    addBtn: {
        height: 40,
        borderRadius: 20,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        marginTop: -50,
    },
    emptyText: {
        ...theme.typography.header,
        fontSize: 20,
        marginTop: 20,
        textAlign: 'center',
    },
    emptySub: {
        ...theme.typography.body,
        color: theme.colors.darkGray,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 30,
        lineHeight: 22,
    },
    shopBtn: {
        width: 200,
    }
});

export default WishlistScreen;
