import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { lightTheme } from '../theme';

export default function SettingsScreen({ navigation }) {
  const { theme, toggleTheme } = useTheme();

  // Logout function (mocked)
  const handleLogout = () => {
    alert("Logged out successfully!");
    navigation.navigate('Home'); // Redirect to Home screen after logout
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      <Button 
        title={`Switch to ${theme === lightTheme ? 'Dark' : 'Light'} Mode`} 
        onPress={toggleTheme} 
        color={theme.buttonBackground}
      />

      <View style={styles.logoutContainer}>
        <Button 
          title="Logout" 
          onPress={handleLogout} 
          color="red"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  logoutContainer: { marginTop: 20 },
});
