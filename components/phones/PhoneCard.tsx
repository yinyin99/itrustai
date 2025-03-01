import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Phone from './Phone';
import { getCountryFlag } from '@/utils/countryUtils';

interface PhoneCardProps {
  phone: Phone;
  onPress: () => void;
  isFavorite: boolean;
  onToggleFavorite: (phoneId: string) => void;
}

const PhoneCard: React.FC<PhoneCardProps> = ({ 
  phone, 
  onPress, 
  isFavorite, 
  onToggleFavorite 
}) => {
  const [imageError, setImageError] = useState(false);
  const colorScheme = useColorScheme();
  const countryFlag = getCountryFlag(phone.salerCountry);

  return (
    <TouchableOpacity
      style={styles.phoneCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
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
              size={40} 
              color="#666" 
            />
          </View>
        )}
      </View>
      <View style={styles.phoneInfo}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            {phone.model} ({phone.releaseDate})
          </Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite(phone.id);
            }}
          >
            <FontAwesome
              name={isFavorite ? 'heart' : 'heart-o'}
              size={24}
              color={isFavorite ? '#ff6b6b' : '#666'}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.manufacturer, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
          {phone.constructor} | {phone.os}
        </Text>
        <Text style={[styles.price, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
          Price: ${phone.price.toLocaleString()}
        </Text>
        <View style={styles.salerInfo}>
          <Text style={[styles.saler, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>
            Seller: {phone.saler} ({phone.salerCity}, {countryFlag} {phone.salerCountry})
          </Text>
          <Text style={[styles.contact, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>
            Contact: {phone.phone}
          </Text>
        </View>
        <Text 
          style={[styles.description, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}
          numberOfLines={2}
        >
          {phone.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  phoneCard: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatarContainer: {
    width: 100,
    height: 150,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 150,
    resizeMode: 'cover',
  },
  fallbackAvatar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  phoneInfo: {
    flex: 1,
    padding: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  manufacturer: {
    fontSize: 14,
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  salerInfo: {
    marginBottom: 5,
  },
  saler: {
    fontSize: 13,
  },
  contact: {
    fontSize: 13,
  },
  description: {
    fontSize: 14,
  },
  favoriteButton: {
    padding: 5,
  },
});

export default PhoneCard;
