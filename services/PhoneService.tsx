import AsyncStorage from '@react-native-async-storage/async-storage';
import Phone from '@/components/phones/Phone';
import phones from '@/assets/data/phone.json';
import { PhoneFilterOptions } from '@/components/phones/PhoneFilters';

export class PhoneService {
    static getAllPhones(): Phone[] {
        return [...phones];
    }
    
    static filterPhones(query: string, phones: Phone[], filters?: PhoneFilterOptions): Phone[] {
        let filtered = [...phones];
        
        // Apply text search if query exists
        if (query) {
            const lowercaseQuery = query.toLowerCase();
            filtered = filtered.filter(phone => 
                phone.model.toLowerCase().includes(lowercaseQuery) ||
                phone.description.toLowerCase().includes(lowercaseQuery)
            );
        }
        
        // Apply advanced filters if they exist
        if (filters) {
            // Filter by model
            if (filters.model) {
                const modelQuery = filters.model.toLowerCase();
                filtered = filtered.filter(phone => 
                    phone.model.toLowerCase().includes(modelQuery)
                );
            }

            // Filter by constructor
            if (filters.phoneConstructor) {
                const constructorQuery = filters.phoneConstructor.toLowerCase();
                filtered = filtered.filter(phone => 
                    phone.model.toLowerCase().includes(constructorQuery)
                );
            }
            
            // Filter by price range
            if (filters.priceMin !== undefined) {
                filtered = filtered.filter(phone => 
                    phone.price >= filters.priceMin!
                );
            }
            
            if (filters.priceMax !== undefined) {
                filtered = filtered.filter(phone => 
                    phone.price <= filters.priceMax!
                );
            }
            
            // Filter by country
            if (filters.country) {
                const countryQuery = filters.country.toLowerCase();
                filtered = filtered.filter(phone => 
                    phone.salerCountry.toLowerCase().includes(countryQuery)
                );
            }
        }
        
        return filtered;
    }
    
    static async getFavorites(): Promise<string[]> {
        try {
          const storedFavorites = await AsyncStorage.getItem('favorites');
          return storedFavorites ? JSON.parse(storedFavorites) : [];
        } catch (error) {
          console.error('Error loading favorites:', error);
          return [];
        }
    }
    
    static async toggleFavorite(phoneId: string, currentFavorites: string[]): Promise<string[]> {
        try {
          const newFavorites = currentFavorites.includes(phoneId)
            ? currentFavorites.filter(id => id !== phoneId)
            : [...currentFavorites, phoneId];
    
          await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
          return newFavorites;
        } catch (error) {
          console.error('Error updating favorites:', error);
          return currentFavorites;
        }
    }
}

export default PhoneService;
