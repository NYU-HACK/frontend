// screens/RegisterScreen.js
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
import { registerUser } from "../services/auth";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function RegisterScreen() {
  const { theme, toggleTheme } = useTheme();
  const styles = createStyles(theme);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Registration Error", "Passwords do not match.");
      return;
    }
    try {
      // Assuming your registerUser function accepts an object with these fields.
      await registerUser({ firstName, lastName, email, password });
      Alert.alert(
        "Registration Successful",
        "Welcome aboard! You can now log in with your new credentials."
      );
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    }
  };

  // Check if the current theme is light (based on background color)
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
          <Text style={styles.heroTitle}>Join Food Wallet</Text>
          <Text style={styles.heroSubtitle}>
            Sign up now and become part of a community dedicated to reducing food waste,
            saving money, and making our world a greener place.
          </Text>
        </View>

        {/* Registration Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Create Your Account</Text>
          <RNTextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#666"
            value={firstName}
            onChangeText={setFirstName}
          />
          <RNTextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#666"
            value={lastName}
            onChangeText={setLastName}
          />
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
          <RNTextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#666"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>

        {/* Persuasive Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.primary }]}>
            Your journey towards a sustainable future starts here. Together, we can make a
            difference—one meal at a time.
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
      paddingTop: 20,
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
      marginTop: 40,
      marginBottom: 20,
    },
    logo: {
      width: 120,
      height: 120,
      resizeMode: "contain",
      marginBottom: 0,
    },
    heroTitle: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.background,
      textAlign: "center",
      marginBottom: 0,
    },
    heroSubtitle: {
      fontSize: 18,
      color: theme.background,
      textAlign: "center",
      paddingHorizontal: 20,
    },
    formCard: {
      width: "100%",
      backgroundColor: theme.background,
      borderRadius: 10,
      padding: 20,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 3,
      marginBottom: 10,
    },
    formTitle: {
      fontSize: 28,
      color: theme.primary,
      textAlign: "center",
      marginBottom: 20,
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
