import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = "itrustai" }: HeaderProps) {
  const colorScheme = useColorScheme();
  
  return (
    <View style={[
      styles.container, 
      { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }
    ]}>
      <Text style={[
        styles.title, 
        { color: colorScheme === 'dark' ? '#fff' : '#000' }
      ]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
