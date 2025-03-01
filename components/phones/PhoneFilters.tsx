import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  useColorScheme,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Phone from './Phone';

export interface PhoneFilterOptions {
  model?: string;
  phoneConstructor?: string;
  priceMin?: number;
  priceMax?: number;
  country?: string;
}

interface PhoneFiltersProps {
  onApplyFilters: (filters: PhoneFilterOptions) => void;
  activeFilters: PhoneFilterOptions;
  clearFilters: () => void;
  phones: Phone[];
}

const PhoneFilters: React.FC<PhoneFiltersProps> = ({
  onApplyFilters,
  activeFilters,
  clearFilters,
  phones,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempFilters, setTempFilters] = useState<PhoneFilterOptions>({ ...activeFilters });
  const colorScheme = useColorScheme();

  // Extract unique values for dropdown options
  const uniqueConstructors = Array.from(new Set(phones.map(p => p.constructor))).sort();
  const uniqueCountries = Array.from(new Set(phones.map(p => p.salerCountry))).sort();
  
  // Calculate min and max values for price range
  const prices = phones.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const handleInputChange = (field: keyof PhoneFilterOptions, value: any) => {
    setTempFilters({
      ...tempFilters,
      [field]: value,
    });
  };

  const applyFilters = () => {
    onApplyFilters(tempFilters);
    setModalVisible(false);
  };

  const resetFilters = () => {
    setTempFilters({} as PhoneFilterOptions);
    clearFilters();
    setModalVisible(false);
  };

  // Count active filters
  const activeFilterCount = Object.keys(activeFilters).filter(
    k => activeFilters[k as keyof PhoneFilterOptions] !== undefined
  ).length;

  return (
    <View>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome name="filter" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        <Text style={[styles.filterButtonText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
          Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff' },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                Filter Phones
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome name="close" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filtersScrollView}>
              {/* Model Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                  Model
                </Text>
                <TextInput
                  style={[
                    styles.filterInput,
                    {
                      backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
                      color: colorScheme === 'dark' ? '#fff' : '#000',
                    },
                  ]}
                  value={tempFilters.model || ''}
                  onChangeText={(text) => handleInputChange('model', text)}
                  placeholder="Filter by model..."
                  placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                />
              </View>

              {/* Manufacturer Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                  Manufacturer
                </Text>
                <TextInput
                  style={[
                    styles.filterInput,
                    {
                      backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
                      color: colorScheme === 'dark' ? '#fff' : '#000',
                    },
                  ]}
                  value={tempFilters.phoneConstructor || ''}
                  onChangeText={(text) => handleInputChange('phoneConstructor', text)}
                  placeholder="Filter by manufacturer..."
                  placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                />
                <ScrollView horizontal style={styles.tagsContainer}>
                  {uniqueConstructors.map((constructor) => (
                    <TouchableOpacity
                      key={constructor}
                      style={[
                        styles.tagButton,
                        {
                          backgroundColor: tempFilters.phoneConstructor === constructor 
                            ? (colorScheme === 'dark' ? '#4285F4' : '#CFE8FF') 
                            : (colorScheme === 'dark' ? '#333' : '#f0f0f0'),
                        },
                      ]}
                      onPress={() => handleInputChange('phoneConstructor', constructor)}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          {
                            color: tempFilters.phoneConstructor === constructor
                              ? (colorScheme === 'dark' ? '#fff' : '#0066CC')
                              : (colorScheme === 'dark' ? '#fff' : '#000'),
                          },
                        ]}
                      >
                        {constructor}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Price Range Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                  Price ($)
                </Text>
                <View style={styles.rangeContainer}>
                  <View style={styles.rangeInput}>
                    <TextInput
                      style={[
                        styles.filterInput,
                        {
                          backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
                          color: colorScheme === 'dark' ? '#fff' : '#000',
                        },
                      ]}
                      value={tempFilters.priceMin?.toString() || ''}
                      onChangeText={(text) => handleInputChange('priceMin', text ? parseInt(text) : undefined)}
                      placeholder="Min"
                      placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                      keyboardType="number-pad"
                    />
                    <Text style={[styles.rangeSeparator, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>to</Text>
                    <TextInput
                      style={[
                        styles.filterInput,
                        {
                          backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
                          color: colorScheme === 'dark' ? '#fff' : '#000',
                        },
                      ]}
                      value={tempFilters.priceMax?.toString() || ''}
                      onChangeText={(text) => handleInputChange('priceMax', text ? parseInt(text) : undefined)}
                      placeholder="Max"
                      placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
              </View>

              {/* Country Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                  Seller Country
                </Text>
                <TextInput
                  style={[
                    styles.filterInput,
                    {
                      backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
                      color: colorScheme === 'dark' ? '#fff' : '#000',
                    },
                  ]}
                  value={tempFilters.country || ''}
                  onChangeText={(text) => handleInputChange('country', text)}
                  placeholder="Filter by country..."
                  placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                />
                <ScrollView horizontal style={styles.tagsContainer}>
                  {uniqueCountries.map((country) => (
                    <TouchableOpacity
                      key={country}
                      style={[
                        styles.tagButton,
                        {
                          backgroundColor: tempFilters.country === country 
                            ? (colorScheme === 'dark' ? '#4285F4' : '#CFE8FF') 
                            : (colorScheme === 'dark' ? '#333' : '#f0f0f0'),
                        },
                      ]}
                      onPress={() => handleInputChange('country', country)}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          {
                            color: tempFilters.country === country
                              ? (colorScheme === 'dark' ? '#fff' : '#0066CC')
                              : (colorScheme === 'dark' ? '#fff' : '#000'),
                          },
                        ]}
                      >
                        {country}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  filterButtonText: {
    marginLeft: 5,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filtersScrollView: {
    flex: 1,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterInput: {
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tagButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  tagText: {
    fontSize: 14,
  },
  rangeContainer: {
    marginBottom: 10,
  },
  rangeInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeSeparator: {
    marginHorizontal: 10,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  resetButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  resetButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  applyButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#4285F4',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PhoneFilters;
