// screens/HomeScreen.js
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext"; // This context should provide verifiedUser
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import BottomMenu from "./BottomMenu";

export default function HomeScreen({ navigation }) {
  const { theme, toggleTheme } = useTheme();
  const { verifiedUser, setVerifiedUser } = useAuth();
  // Create the styles inside the component using the current theme.
  const styles = createStyles(theme);
  const isLightTheme = theme.background === "#FFFFFF";
  
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
    <LinearGradient
      colors={[theme.primary, theme.background]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.appHeader}>
          <Image source={require("../assets/icon.png")} style={styles.logo} />
          <Text style={styles.appTitle}>Food Wallet</Text>
        </View>
        <TouchableOpacity
          style={styles.themeToggleButton}
        >
          <Ionicons
            name={isLightTheme ? "moon-outline" : "sunny-outline"}
            size={28}
            color={theme.background}
            onPress={toggleTheme}
          />
          <Ionicons
            name="log-out-outline"
            size={28}
            color={theme.background}
            onPress={handleLogout} 
          />
        </TouchableOpacity>
        
        {/* Header: Greeting */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {verifiedUser?.name}</Text>
          <Text style={styles.email}>{verifiedUser?.email}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Scanner")}
          >
            <Ionicons
              name="scan-outline"
              size={24}
              color={theme.background}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Scan Food</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("FoodPantry")}
          >
            <Ionicons
              name="restaurant-outline"
              size={24}
              color={theme.background}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Your Pantry</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Scanner")}
          >
            <Ionicons
              name="hardware-chip-outline"
              size={24}
              color={theme.background}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>AI Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("FoodPantry")}
          >
            <Ionicons
              name="sparkles-outline"
              size={24}
              color={theme.background}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Recipes</Text>
          </TouchableOpacity>
        </View>

        {/* Impact Card */}
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Your Impact</Text>
          <Text style={styles.featureText}>
            Track how much food waste you&apos;ve prevented, money saved, and
            your contribution to a greener planet.
          </Text>
        </View>
      </ScrollView>
      <BottomMenu />
    </LinearGradient>
  );
}

// Define a function that creates styles based on the current theme.
const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      padding: 20,
      paddingTop: 100,
      alignItems: "center",
    },
    appHeader: {
      position: "absolute",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "flex-start",
      alignItems: "center",
      top: 60,
      left: 20,
      zIndex: 1,
      padding: 5,
    },
    appTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      // textAlign: "center",
    },
    logo: {
      width: 32,
      height: 32,
      resizeMode: "contain",
    },
    themeToggleButton: {
      position: "absolute",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      top: 60,
      right: 20,
      zIndex: 1,
      padding: 5,
    },
    header: {
      backgroundColor: "rgba(255,255,255,0.2)", // Translucent overlay for readability
      width: "100%",
      paddingVertical: 20,
      paddingHorizontal: 15,
      borderRadius: 10,
      marginBottom: 10,
      alignItems: "center",
      color: theme.text,
    },
    greeting: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.text,
      textAlign: "center",
    },
    email: {
      fontSize: 16,
      color: theme.text,
      marginTop: 5,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 10,
    },
    button: {
      flex: 1,
      backgroundColor: theme.buttonBackground,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 15,
      borderRadius: 10,
      marginHorizontal: 5,
    },
    buttonIcon: {
      marginRight: 8,
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: "bold",
    },
    featureCard: {
      backgroundColor: "rgba(255,255,255,0.9)",
      width: "100%",
      borderRadius: 10,
      padding: 20,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 3,
    },
    featureTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.primary,
      marginBottom: 10,
      textAlign: "center",
    },
    featureText: {
      fontSize: 16,
      color: "#333",
      textAlign: "center",
    },
  });
