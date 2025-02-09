// navigation/MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AIChatScreen from '../screens/AIChatScreen';
import FoodPantryScreen from '../screens/FoodPantryScreen';
import ScannerScreen from '../screens/ScannerScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RecipesScreen from './AIRecipeScreen';
import BottomMenu from './BottomMenu';
import HomeScreen from './HomeScreen';
import AIToolsScreen from './AIToolsScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomMenu {...props} />}
    >
      {/* <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} /> */}
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="FoodPantry" component={FoodPantryScreen} options={{ tabBarLabel: 'Pantry' }} />
      <Tab.Screen name="Scanner" component={ScannerScreen} options={{ tabBarLabel: 'Scanner' }} />
      <Tab.Screen name="AITools" component={AIToolsScreen} options={{ tabBarLabel: 'AI Tools' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Settings' }} />
    </Tab.Navigator>
  );
}
