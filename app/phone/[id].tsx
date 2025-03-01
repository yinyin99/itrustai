import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Linking, 
  useColorScheme, 
  SafeAreaView 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import PhoneService from '@/services/PhoneService';
import Phone from '@/components/phones/Phone';
import { Colors } from '@/constants/Colors';

export default function PhoneDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string; }>();
  const [phone, setPhone] = useState<Phone | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadPhone = () => {
      const allPhones = PhoneService.getAllPhones();
      const foundPhone = allPhones.find(p => p.id === id);
      if (foundPhone) {
        setPhone(foundPhone);
      }
    };
    
    const checkIfFavorite = async () => {
      const favorites = await PhoneService.getFavorites();
      setIsFavorite(favorites.includes(id));
    };
    
    loadPhone();
    checkIfFavorite();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!phone) return;
    
    const favorites = await PhoneService.getFavorites();
    const newFavorites = await PhoneService.toggleFavorite(phone.id, favorites);
    setIsFavorite(newFavorites.includes(phone.id));
  };

  const handleCall = () => {
    if (phone) {
      Linking.openURL(`tel:${phone.phone}`);
    }
  };

  if (!phone) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView style={styles.scrollView}>
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
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <FontAwesome
              name={isFavorite ? 'heart' : 'heart-o'}
              size={28}
              color={isFavorite ? '#ff6b6b' : (colorScheme === 'dark' ? '#fff' : '#000')}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.avatarSection}>
          {!imageError ? (
            <Image
              source={{ uri: phone.salerAvatar }}
              style={styles.avatar}
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.fallbackAvatar}>
              <FontAwesome 
                name={phone.salerGender.toLowerCase() === 'female' ? 'female' : 'male'} 
                size={80} 
                color="#666" 
              />
            </View>
          )}
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={[styles.title, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            {phone.model} ({phone.releaseDate})
          </Text>
          
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>Manufacturer:</Text>
            <Text style={[styles.value, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
              {phone.constructor}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>Operating System:</Text>
            <Text style={[styles.value, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
              {phone.os}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>Price:</Text>
            <Text style={[styles.value, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
              ${phone.price.toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.sellerSection}>
            <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
              Seller Information
            </Text>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>Name:</Text>
              <Text style={[styles.value, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                {phone.saler}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>Location:</Text>
              <Text style={[styles.value, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                {phone.salerCity}, {phone.salerCountry}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>Contact:</Text>
              <TouchableOpacity onPress={handleCall}>
                <Text style={[styles.phoneNumber, { color: Colors[colorScheme ?? 'light'].tint }]}>
                  {phone.phone}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.descriptionSection}>
            <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>
              {phone.description}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  backButton: {
    padding: 10,
  },
  favoriteButton: {
    padding: 10,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  avatar: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  fallbackAvatar: {
    width: 200,
    height: 200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  detailsContainer: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    width: 120,
  },
  value: {
    fontSize: 16,
    flex: 1,
  },
  sellerSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  phoneNumber: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
});
