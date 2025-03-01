import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import PhoneCard from './PhoneCard';
import Phone from './Phone';

interface PhoneListProps {
  phones: Phone[];
  onPhonePress: (phone: Phone) => void;
  favorites: string[];
  onToggleFavorite: (phoneId: string) => void;
}

const PhoneList: React.FC<PhoneListProps> = ({ 
  phones, 
  onPhonePress, 
  favorites, 
  onToggleFavorite 
}) => (
  <FlatList
    data={phones}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <PhoneCard 
        phone={item} 
        onPress={() => onPhonePress(item)} 
        isFavorite={favorites.includes(item.id)}
        onToggleFavorite={onToggleFavorite}
      />
    )}
    contentContainerStyle={styles.listContainer}
  />
);

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  }
});

export default PhoneList;
