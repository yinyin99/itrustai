import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import PhoneService from '@/services/PhoneService';
import PhoneList from '@/components/phones/PhoneList';
import Phone from '@/components/phones/Phone';
import Loader from '@/components/Loader';
import { Colors } from '@/constants/Colors';

type TabType = 'phones';

export default function FavoritesScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('phones');
  const [favoritePhones, setFavoritePhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
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
    } as any);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
          Favorites
        </Text>
      </View>
      
      <ScrollView style={styles.scrollContent}>
        {favoritePhones.length > 0 ? (
          <PhoneList
            phones={favoritePhones}
            onPhonePress={handlePhonePress}
            favorites={favoritePhones.map(p => p.id)}
            onToggleFavorite={togglePhoneFavorite}
          />
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
