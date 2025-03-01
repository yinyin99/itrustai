import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  useColorScheme,
  TextInput,
  Platform,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import PhoneService from '@/services/PhoneService';
import PhoneList from '@/components/phones/PhoneList';
import Phone from '@/components/phones/Phone';
import Loader from '@/components/Loader';
import PhoneFilters, { PhoneFilterOptions } from '@/components/phones/PhoneFilters';
import Header from '@/components/Header';

export default function FavoritesScreen() {
  const [favoritePhones, setFavoritePhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState<PhoneFilterOptions>({});
  const colorScheme = useColorScheme();
  const router = useRouter();

  // Load favorites when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    setLoading(true);
    
    const phonesFavs = await PhoneService.getFavorites();
    const allPhones = PhoneService.getAllPhones();
    const phonesWithFavorites = allPhones.filter(phone => phonesFavs.includes(phone.id));
    setFavoritePhones(phonesWithFavorites);
    
    setLoading(false);
  };
  
  const togglePhoneFavorite = async (phoneId: string) => {
    const phonesFavs = await PhoneService.getFavorites();
    const newPhoneFavorites = await PhoneService.toggleFavorite(phoneId, phonesFavs);
    
    const allPhones = PhoneService.getAllPhones();
    const updatedFavoritePhones = allPhones.filter(phone => newPhoneFavorites.includes(phone.id));
    setFavoritePhones(updatedFavoritePhones);
  };
  
  const handlePhonePress = (phone: Phone) => {
    router.push({
      pathname: "/phone/[id]",
      params: { id: phone.id, from: 'favorites' }
    } as Parameters<typeof router.push>[0]);
  };

  const applyFilters = (filters: PhoneFilterOptions) => {
    setFilterOptions(filters);
  };

  const clearFilters = () => {
    setFilterOptions({});
  };

  // Filter favorite phones based on search query and filter options
  const filteredFavorites = PhoneService.filterPhones(searchQuery, favoritePhones, filterOptions);

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
      <Header />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
          Favorites
        </Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, {
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
            color: colorScheme === 'dark' ? '#fff' : '#000'
          }]}
          placeholder="Search favorites..."
          placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <PhoneFilters 
          onApplyFilters={applyFilters}
          activeFilters={filterOptions}
          clearFilters={clearFilters}
          phones={favoritePhones}
        />
      </View>
      
      {filteredFavorites.length > 0 && (
        <View style={styles.countContainer}>
          <Text style={[styles.countText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            {filteredFavorites.length} {filteredFavorites.length === 1 ? 'favorite' : 'favorites'} found
          </Text>
        </View>
      )}
      
      <ScrollView style={styles.scrollContent}>
        {favoritePhones.length > 0 ? (
          filteredFavorites.length > 0 ? (
            <PhoneList
              phones={filteredFavorites}
              onPhonePress={handlePhonePress}
              favorites={favoritePhones.map(p => p.id)}
              onToggleFavorite={togglePhoneFavorite}
            />
          ) : (searchQuery || Object.keys(filterOptions).length > 0) ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                No matches found
              </Text>
              <Text style={[styles.emptySubtext, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : null
        ) : (
          <View style={styles.emptyContainer}>
            <FontAwesome name="heart-o" size={60} color={colorScheme === 'dark' ? '#666' : '#ccc'} />
            <Text style={[styles.emptyText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
              No favorites yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>
              Add items to your favorites by tapping the heart icon
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    paddingBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
    flexDirection: 'column',
  },
  searchInput: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  countContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  countText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});
