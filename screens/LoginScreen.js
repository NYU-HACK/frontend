// screens/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../services/auth";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen() {
  const { theme, toggleTheme } = useTheme();
  const styles = createStyles(theme);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      // On successful login, the auth state listener in App.js will update the UI.
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  // Check if the current theme is light based on its background color.
  const isLightTheme = theme.background === "#FFFFFF";

  return (
    <LinearGradient
      colors={[theme.primary, theme.background]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Theme Toggle Button */}
        <TouchableOpacity style={styles.themeToggleButton} onPress={toggleTheme}>
          <Ionicons
            name={isLightTheme ? "moon-outline" : "sunny-outline"}
            size={28}
            color={theme.background}
          />
        </TouchableOpacity>

        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image source={require("../assets/icon.png")} style={styles.logo} />
          <Text style={styles.heroTitle}>Welcome to Food Wallet</Text>
          <Text style={styles.heroSubtitle}>
            A smart solution to reduce food waste, manage your expenses, and protect
            our environment.
          </Text>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Ionicons name="fast-food-outline" size={32} color={theme.background} />
            <Text style={styles.benefitText}>Reduce Waste</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="wallet-outline" size={32} color={theme.background} />
            <Text style={styles.benefitText}>Save Money</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="leaf-outline" size={32} color={theme.background} />
            <Text style={styles.benefitText}>Protect Earth</Text>
          </View>
        </View>

        {/* Login Form Card */}
        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>Login</Text>
          <RNTextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <RNTextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.primary }]}>
            Join us in making a difference. Together, we can reduce food waste, save money,
            and protect our planet for future generations.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      padding: 20,
      paddingTop: 60,
      alignItems: "center",
    },
    themeToggleButton: {
      position: "absolute",
      top: 80,
      right: 20,
      zIndex: 1,
      padding: 5,
    },
    heroContainer: {
      alignItems: "center",
      marginTop: 60,
      marginBottom: 20,
    },
    logo: {
      width: 120,
      height: 120,
      resizeMode: "contain",
      marginBottom: 10,
    },
    heroTitle: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.background,
      textAlign: "center",
      marginBottom: 5,
    },
    heroSubtitle: {
      fontSize: 18,
      color: theme.background,
      textAlign: "center",
      paddingHorizontal: 20,
    },
    benefitsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
      width: "100%",
    },
    benefitItem: {
      alignItems: "center",
      flex: 1,
    },
    benefitText: {
      marginTop: 5,
      fontSize: 14,
      color: theme.background,
      textAlign: "center",
      fontWeight: "600",
    },
    loginCard: {
      width: "100%",
      backgroundColor: theme.background,
      borderRadius: 10,
      padding: 20,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 3,
      marginBottom: 30,
    },
    loginTitle: {
      fontSize: 28,
      color: theme.primary,
      marginBottom: 20,
      textAlign: "center",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      height: 50,
      borderColor: "#ccc",
      borderWidth: 1,
      paddingHorizontal: 15,
      marginBottom: 15,
      borderRadius: 5,
      backgroundColor: "#fff",
      color: "#333",
    },
    button: {
      width: "100%",
      height: 50,
      backgroundColor: theme.primary,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 15,
    },
    buttonText: {
      color: theme.background,
      fontSize: 18,
      fontWeight: "bold",
    },
    linkText: {
      color: theme.primary,
      textDecorationLine: "underline",
      textAlign: "center",
      fontSize: 16,
    },
    footer: {
      marginTop: 20,
      paddingHorizontal: 10,
    },
    footerText: {
      fontSize: 16,
      color: theme.background,
      textAlign: "center",
    },
  });
