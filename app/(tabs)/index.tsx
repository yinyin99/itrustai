import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  useColorScheme,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import PhoneList from '@/components/phones/PhoneList';
import Phone from '@/components/phones/Phone';
import Loader from '@/components/Loader';
import PhoneService from '@/services/PhoneService';
import PhoneFilters, { PhoneFilterOptions } from '@/components/phones/PhoneFilters';

export default function PhonesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [phones, setPhones] = useState<Phone[]>([]);
  const [filterOptions, setFilterOptions] = useState<PhoneFilterOptions>({});
  const colorScheme = useColorScheme();
  const router = useRouter();

  // Load phones on initial render
  useEffect(() => {
    const allPhones = PhoneService.getAllPhones();
    setPhones(allPhones);
    setLoading(false);
  }, []);

  // Filter phones based on search query and filters
  const filteredPhones = PhoneService.filterPhones(searchQuery, phones, filterOptions);

  // Load favorites when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    const favs = await PhoneService.getFavorites();
    setFavorites(favs);
  };

  const toggleFavorite = async (phoneId: string) => {
    const newFavorites = await PhoneService.toggleFavorite(phoneId, favorites);
    setFavorites(newFavorites);
  };

  const handlePhonePress = (phone: Phone) => {
    router.push({
      pathname: "/phone/[id]",
      params: { id: phone.id, from: 'phones' }
    } as any);
  };

  const applyFilters = (filters: PhoneFilterOptions) => {
    setFilterOptions(filters);
  };

  const clearFilters = () => {
    setFilterOptions({});
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
          Ads
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, {
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
            color: colorScheme === 'dark' ? '#fff' : '#000'
          }]}
          placeholder="Search phones..."
          placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <PhoneFilters 
          onApplyFilters={applyFilters}
          activeFilters={filterOptions}
          clearFilters={clearFilters}
          phones={phones}
        />
      </View>
      
      {filteredPhones.length > 0 && (
        <View style={styles.countContainer}>
          <Text style={[styles.countText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            {filteredPhones.length} {filteredPhones.length === 1 ? 'phone ad' : 'phone ads'} found
          </Text>
        </View>
      )}
      
      {filteredPhones.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            No matches found
          </Text>
          {searchQuery || Object.keys(filterOptions).length > 0 ? (
            <Text style={[styles.searchQuery, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>
              Try adjusting your search or filters
            </Text>
          ) : null}
        </View>
      ) : (
        <PhoneList 
          phones={filteredPhones}
          onPhonePress={handlePhonePress}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  searchQuery: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});
