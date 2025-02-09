import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme(); // Get current theme

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Welcome to FoodPrint</Text>

      <View style={styles.buttonContainer}>
        <Button title="Go to Scanner" onPress={() => navigation.navigate('Scanner')} color={theme.buttonBackground} />
      </View>
      {/* <View style={styles.buttonContainer}>
        <Button title="Go to Add Food" onPress={() => navigation.navigate('AddFood')} color={theme.buttonBackground} />
      </View> */}
      <View style={styles.buttonContainer}>
        <Button title="Settings" onPress={() => navigation.navigate('Settings')} color={theme.accentMedium} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 30, 
    textAlign: 'center',
  },
  buttonContainer: { 
    width: '80%', 
    marginVertical: 10,
  },
});
