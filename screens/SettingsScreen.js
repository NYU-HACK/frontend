// screens/SettingsScreen.js
import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Slider from "@react-native-community/slider";

export default function SettingsScreen({ navigation }) {
  const { theme, toggleTheme } = useTheme();
  const { verifiedUser, setVerifiedUser } = useAuth();

  // State for reminder days before expiry (default to 2 days)
  const [reminderDays, setReminderDays] = useState(2);

  // Actual logout function using Firebase auth or your own method.
  const handleLogout = async () => {
    try {
      // await logoutUser(); // Call your logout function if needed.
      setVerifiedUser(null);
      Alert.alert("Logged out successfully!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error logging out: " + error.message);
    }
  };

  const isLightTheme = theme.background === "#FFFFFF";
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.background} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.background }]}>
          Settings
        </Text>
      </View>

      {/* Account Info Card */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.cardHeader}>
          <Ionicons 
            name="person-circle-outline" 
            size={28} 
            color={theme.primary} 
            style={styles.cardIcon} 
          />
          <Text style={[styles.cardTitle, { color: theme.primary }]}>
            Account Info
          </Text>
        </View>
        <Text style={[styles.cardContent, { color: theme.text }]}>
          {verifiedUser?.name || "User"}{"\n"}
          {verifiedUser?.email || "No email provided"}
        </Text>
      </View>

      {/* Reminder Settings Card */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.cardHeader}>
          <Ionicons 
            name="alarm-outline" 
            size={28} 
            color={theme.primary} 
            style={styles.cardIcon} 
          />
          <Text style={[styles.cardTitle, { color: theme.primary }]}>
            Reminder Settings
          </Text>
        </View>
        <Text style={[styles.cardContent, { color: theme.text, marginBottom: 10 }]}>
          Remind me {reminderDays} day{reminderDays > 1 ? "s" : ""} before expiry.
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={14}
          step={1}
          value={reminderDays}
          onValueChange={(value) => setReminderDays(value)}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.text}
          thumbTintColor={theme.primary}
        />
      </View>

      {/* Theme Settings Card */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.cardHeader}>
          <Ionicons 
            name="color-palette-outline" 
            size={28} 
            color={theme.primary} 
            style={styles.cardIcon} 
          />
          <Text style={[styles.cardTitle, { color: theme.primary }]}>
            Theme Settings
          </Text>
        </View>
        <View style={styles.themeSwitchContainer}>
          <Text style={[styles.cardContent, { color: theme.text }]}>
          {isLightTheme ? "Light" : "Dark"}
          </Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Ionicons 
              name={isLightTheme ? "moon-outline" : "sunny-outline"}
              size={24} 
              color={theme.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: theme.danger }]} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color={theme.buttonText} />
          <Text style={[styles.logoutText, { color: theme.buttonText }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  headerButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardIcon: {
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardContent: {
    fontSize: 16,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  themeSwitchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  themeToggle: {
    padding: 10,
  },
  logoutContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
