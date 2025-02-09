// SettingsScreen.js
import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { lightTheme } from "../theme";
import { logoutUser } from "../services/auth";
import { useAuth } from "../context/AuthContext";

export default function SettingsScreen({ navigation }) {
  const { theme, toggleTheme } = useTheme();
  const { setVerifiedUser } = useAuth();

  // Actual logout function using Firebase auth
  const handleLogout = async () => {
    try {
      // await logoutUser(); // Calls Firebase's signOut function from your auth service
      setVerifiedUser(null); // Set the verified user to null in the context
      alert("Logged out successfully!");
      // navigation.navigate('Login'); // Navigate to the Login screen after logout
    } catch (error) {
      alert("Error logging out: " + error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      <Button
        title={`Switch to ${theme === lightTheme ? "Dark" : "Light"} Mode`}
        onPress={toggleTheme}
        color={theme.buttonBackground}
      />

      <View style={styles.logoutContainer}>
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logoutContainer: {
    marginTop: 20,
  },
});
