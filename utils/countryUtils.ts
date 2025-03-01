// Map of country names to ISO 3166-1 alpha-2 country codes
const countryToCode: Record<string, string> = {
  'USA': 'US',
  'United States': 'US',
  'United Kingdom': 'GB',
  'UK': 'GB',
  'Canada': 'CA',
  'Australia': 'AU',
  'Germany': 'DE',
  'France': 'FR',
  'Italy': 'IT',
  'Spain': 'ES',
  'Japan': 'JP',
  'China': 'CN',
  'India': 'IN',
  'Brazil': 'BR',
  'Mexico': 'MX',
  // Add more countries as needed
};

/**
 * Convert country name to flag emoji
 * @param country Country name
 * @returns Flag emoji or empty string if country code not found
 */
export const getCountryFlag = (country: string): string => {
  // If direct match found
  const code = countryToCode[country];
  
  // If no direct match, try to match part of the country name
  if (!code) {
    for (const [key, value] of Object.entries(countryToCode)) {
      if (country.toLowerCase().includes(key.toLowerCase())) {
        return getFlagEmoji(value);
      }
    }
    
    // If all fails, return empty string
    return '';
  }
  
  return getFlagEmoji(code);
};

/**
 * Convert country code to flag emoji
 * @param countryCode ISO 3166-1 alpha-2 country code
 * @returns Flag emoji
 */
const getFlagEmoji = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
};
