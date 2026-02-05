import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const RECENT_SEARCHES = ['Velocity Sneakers', 'Cargo Pants', 'Running', 'Hoodies'];
const TRENDING_NOW = [
    { id: '1', name: 'Originals', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=400' },
    { id: '2', name: 'Performance', image: 'https://images.unsplash.com/photo-1512403714442-70434fc25792?auto=format&fit=crop&q=80&w=400' },
    { id: '3', name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400' },
];

const SearchScreen = ({ navigation, isTab = false }) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Search Header */}
            <View style={styles.header}>
                {!isTab && (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <MaterialCommunityIcons name="arrow-left" size={26} color={theme.colors.black} />
                    </TouchableOpacity>
                )}
                <View style={styles.searchBar}>
                    <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.darkGray} />
                    <TextInput
                        placeholder="Search Velora"
                        style={styles.input}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={!isTab}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <MaterialCommunityIcons name="close-circle" size={20} color={theme.colors.darkGray} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, isTab && { paddingBottom: 100 }]}>
                {/* Recent Searches */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>RECENT SEARCHES</Text>
                        <TouchableOpacity><Text style={styles.clearAll}>CLEAR ALL</Text></TouchableOpacity>
                    </View>
                    <View style={styles.recentWrap}>
                        {RECENT_SEARCHES.map((item) => (
                            <TouchableOpacity key={item} style={styles.recentItem}>
                                <MaterialCommunityIcons name="history" size={18} color={theme.colors.darkGray} />
                                <Text style={styles.recentText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>


            </ScrollView>
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
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray,
    },
    backBtn: {
        marginRight: 15,
    },
    searchBar: {
        flex: 1,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.gray,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: theme.colors.black,
    },
    content: {
        paddingBottom: 40,
    },
    section: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        ...theme.typography.subHeader,
        fontSize: 12,
        letterSpacing: 1.5,
        color: theme.colors.darkGray,
    },
    clearAll: {
        fontSize: 10,
        color: theme.colors.darkGray,
        textDecorationLine: 'underline',
    },
    recentWrap: {
        marginTop: 5,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray,
    },
    recentText: {
        ...theme.typography.body,
        marginLeft: 12,
        fontSize: 14,
    },
    trendingGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    trendingCard: {
        width: '31%',
        height: 120,
        borderRadius: 8,
        overflow: 'hidden',
    },
    trendingImg: {
        width: '100%',
        height: '100%',
    },
    trendingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    trendingName: {
        ...theme.typography.header,
        fontSize: 10,
        color: theme.colors.white,
    },
    catLink: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray,
    },
    catLinkText: {
        ...theme.typography.body,
        fontSize: 16,
        fontWeight: '600',
    }
});

export default SearchScreen;
