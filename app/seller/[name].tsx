import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  useColorScheme, 
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import PhoneService from '@/services/PhoneService';
import Phone from '@/components/phones/Phone';
import PhoneList from '@/components/phones/PhoneList';
import Loader from '@/components/Loader';
import Header from '@/components/Header';

export default function SellerDetailsScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [phones, setPhones] = useState<Phone[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const loadData = async () => {
      // Get phones from this seller
      const sellerPhones = PhoneService.getPhonesBySeller(name);
      
      // Get favorites
      const favs = await PhoneService.getFavorites();
      
      setPhones(sellerPhones);
      setFavorites(favs);
      setLoading(false);
    };
    
    loadData();
  }, [name]);

  const handlePhonePress = (phone: Phone) => {
    router.push({
      pathname: "/phone/[id]",
      params: { id: phone.id }
    });
  };

  const toggleFavorite = async (phoneId: string) => {
    const newFavorites = await PhoneService.toggleFavorite(phoneId, favorites);
    setFavorites(newFavorites);
  };

  const handleFilterByThisSeller = () => {
    // Navigate to main screen with seller filter applied
    router.navigate({
      pathname: "/",
      params: { applySeller: name }
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Header />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome 
            name="arrow-left" 
            size={20} 
            color={colorScheme === 'dark' ? '#fff' : '#000'} 
          />
          <Text style={[styles.backText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
          {name}'s Listings
        </Text>
        
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            { backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0' }
          ]}
          onPress={handleFilterByThisSeller}
        >
          <FontAwesome name="filter" size={16} color={colorScheme === 'dark' ? '#fff' : '#000'} />
          <Text style={[styles.filterText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Filter by this seller
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.countContainer}>
        <Text style={[styles.countText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
          {phones.length} {phones.length === 1 ? 'listing' : 'listings'} found
        </Text>
      </View>
      
      {phones.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            No listings found for this seller
          </Text>
        </View>
      ) : (
        <PhoneList 
          phones={phones}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
  },
  titleContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
  },
  filterText: {
    marginLeft: 5,
    fontSize: 14,
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
  },
});
