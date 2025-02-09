// components/BottomMenu.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const BottomMenu = (props) => {
  const { theme } = useTheme();

  // If there is no state (i.e. not used in a TabNavigator), return null.
  if (!props.state || !props.navigation) {
    return null;
  }

  const { state, navigation } = props;

  // Define your static 5-menu configuration.
  const menuItems = [
    { label: 'Home', icon: 'home-outline', route: 'Home' },
    { label: 'Pantry', icon: 'restaurant-outline', route: 'FoodPantry' },
    // { label: 'Recipes', icon: 'sparkles-outline', route: 'Recipes' },
    { label: 'Scanner', icon: 'scan-outline', route: 'Scanner', isCentral: true },
    { label: 'AI Tools', icon: 'hardware-chip-outline', route: 'AITools' },
    { label: 'Settings', icon: 'settings-outline', route: 'Settings' },
  ];

  return (
    <View style={[styles.menuContainer, { backgroundColor: theme.cardBackground || theme.background }]}>
      {state.routes.map((route, index) => {
        const isActive = state.index === index; // Check if current route is active
        const item = menuItems[index];

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              item.isCentral && styles.centralMenuItem,
              { 
                backgroundColor: item.isCentral ? theme.primary : 'transparent',
                // Add active background for non-central items
                ...(!item.isCentral && isActive && { backgroundColor: theme.activeBackground }),
              },
            ]}
            onPress={() => navigation.navigate(item.route)}
          >
            <Ionicons
              name={item.icon}
              size={item.isCentral ? 32 : 24}
              // Change color for active state
              color={isActive ? theme.activeTint : (item.isCentral ? theme.background : theme.primary)}
            />
            <Text style={[
              styles.menuLabel,
              { 
                color: isActive ? theme.activeTint : (item.isCentral ? theme.background : theme.primary),
                // Make text bold for active item
                fontWeight: isActive ? 'bold' : 'normal' 
              }
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    // Optionally add elevation or shadow for iOS/Android.
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centralMenuItem: {
    borderRadius: 30,
    padding: 10,
    marginBottom: 20,
  },
  menuLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default BottomMenu;
