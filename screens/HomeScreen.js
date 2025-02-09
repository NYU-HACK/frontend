// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import BottomMenu from "./BottomMenu";
import { Svg, Circle, G, Text as SvgText } from "react-native-svg";

export default function HomeScreen({ navigation }) {
  const { theme, toggleTheme } = useTheme();
  const { verifiedUser, setVerifiedUser } = useAuth();
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const styles = createStyles(theme);
  const isLightTheme = theme.background === "#FFFFFF";

  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        const response = await axios.get(
          `http://10.253.215.20:3000/kpis/${verifiedUser._id}`
        );
        setKpiData(response.data);
      } catch (error) {
        console.error("Error fetching KPI data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (verifiedUser?._id) fetchKpiData();
  }, [verifiedUser?._id]);
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

  const DonutChart = ({ value, max, label, color }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / max) * circumference;

    return (
      <View style={styles.chartContainer}>
        <Svg height="120" width="120">
          <G rotation="-90" origin="60, 60">
            <Circle
              cx="60"
              cy="60"
              r={radius}
              stroke={theme.buttonBackground + "30"}
              fill="transparent"
              strokeWidth="10"
            />
            <Circle
              cx="60"
              cy="60"
              r={radius}
              stroke={color}
              fill="transparent"
              strokeWidth="10"
              strokeDasharray={`${progress} ${circumference}`}
              strokeLinecap="round"
            />
          </G>
          <SvgText
            x="60"
            y="60"
            textAnchor="middle"
            alignmentBaseline="middle"
            fill={theme.text}
            fontSize="20"
            fontWeight="bold"
          >
            {value}
          </SvgText>
          <SvgText
            x="60"
            y="80"
            textAnchor="middle"
            alignmentBaseline="middle"
            fill={theme.text}
            fontSize="12"
          >
            {label}
          </SvgText>
        </Svg>
      </View>
    );
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[theme.primary, theme.background]}
        style={styles.container}
      >
        <Text style={styles.loadingText}>Loading your food insights...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[theme.primary, theme.background]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Existing Header and Buttons... */}
        <View style={styles.appHeader}>
          <Image source={require("../assets/icon.png")} style={styles.logo} />
          <Text style={styles.appTitle}>Food Wallet</Text>
        </View>
        <TouchableOpacity style={styles.themeToggleButton}>
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

        {/* KPI Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <View style={styles.kpiCard}>
              <Ionicons name="cash-outline" size={24} color={theme.text} />
              <Text style={styles.kpiValue}>{kpiData.totalFridgeValue}</Text>
              <Text style={styles.kpiLabel}>Pantry Value</Text>
            </View>

            <View style={styles.kpiCard}>
              <Ionicons
                name="alert-circle-outline"
                size={24}
                color={theme.text}
              />
              <Text style={styles.kpiValue}>{kpiData.totalWastedValue}</Text>
              <Text style={styles.kpiLabel}>Wasted Value</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.kpiCard}>
              <Ionicons name="wallet-outline" size={24} color={theme.text} />
              <Text style={styles.kpiValue}>
                {kpiData.recommendedGroceryBudget}
              </Text>
              <Text style={styles.kpiLabel}>Recommended Budget</Text>
            </View>

            <View style={styles.kpiCard}>
              <Ionicons name="leaf-outline" size={24} color={theme.text} />
              <Text style={styles.kpiValue}>{kpiData.environmentalImpact}</Text>
              <Text style={styles.kpiLabel}>CO2 Emitted</Text>
            </View>
          </View>
        </View>

        {/* Savings Visualization */}
        <View style={styles.visualizationCard}>
          <Text style={styles.vizTitle}>Savings Progress</Text>
          <View style={styles.chartRow}>
            <DonutChart
              value={
                kpiData.potentialSavings
                  ? parseFloat(kpiData.potentialSavings.replace(/[^0-9.]/g, ""))
                  : 0
              }
              max={
                kpiData.totalFridgeValue
                  ? parseFloat(kpiData.totalFridgeValue.replace(/[^0-9.]/g, ""))
                  : 0
              }
              label="Saved"
              color={theme.secondary}
            />

            <View style={styles.savingsTextContainer}>
              <Text style={styles.savingsAmount}>
                {kpiData.potentialSavings}
              </Text>
              <Text style={styles.savingsSubtext}>Potential Savings</Text>
              <Text style={styles.savingsTip}>
              That's {Math.floor(parseFloat(kpiData.potentialSavings.replace(/[^0-9.]/g, "")) / 15)} meal(s) saved this week! 🎉
              </Text>
            </View>
          </View>
        </View>

        {/* Existing Impact Card... */}
      </ScrollView>
      <BottomMenu />
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
    gridContainer: {
      width: "100%",
      marginVertical: 15,
    },
    gridRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    kpiCard: {
      backgroundColor: theme.background + "40",
      width: "48%",
      padding: 15,
      borderRadius: 12,
      alignItems: "center",
    },
    kpiValue: {
      fontSize: 22,
      fontWeight: "800",
      color: theme.text,
      marginVertical: 8,
    },
    kpiLabel: {
      fontSize: 14,
      color: theme.text,
      opacity: 0.8,
      textAlign: "center",
    },
    visualizationCard: {
      backgroundColor: theme.background + "80",
      width: "100%",
      borderRadius: 16,
      padding: 20,
      marginVertical: 10,
    },
    vizTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 15,
    },
    chartRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    savingsTextContainer: {
      flex: 1,
      marginLeft: 20,
    },
    savingsAmount: {
      fontSize: 28,
      fontWeight: "900",
      color: theme.text,
      marginBottom: 5,
    },
    savingsSubtext: {
      fontSize: 16,
      color: theme.text,
      opacity: 0.8,
      marginBottom: 10,
    },
    savingsTip: {
      fontSize: 14,
      color: theme.text,
      opacity: 0.7,
      fontStyle: "italic",
    },
    chartContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    loadingText: {
      color: theme.text,
      fontSize: 18,
      textAlign: "center",
      marginTop: 50,
    },
  });
