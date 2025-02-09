// screens/ScannerScreen.js
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function ScannerScreen({ navigation }) {
  const { theme } = useTheme();
  const [facing, setFacing] = useState("back");
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const scannedRef = useRef(false);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.message, { color: theme.text }]}>
          We need your permission to access the camera
        </Text>
        <Button
          onPress={requestPermission}
          title="Grant Permission"
          color={theme.buttonBackground}
        />
      </View>
    );
  }

  const handleBarcodeScanned = async ({ type, data }) => {
    if (scannedRef.current) return;
    scannedRef.current = true;
    setLoading(true);

    try {
      // Replace with your actual backend URL
      const url = `http://10.253.215.20:3000/getInfo`;
      const response = await axios.post(url, {
        qrCode: encodeURIComponent(data),
      });
      const result = response.data;

      if (result.productFound) {
        const product = result.product;
        const prod = {
          code: product.code,
          name: product.name || "Unknown",
          brand: product.brand || "Unknown",
          category: product.category,
        };
        navigation.navigate("AddFood", { product: prod });
      } else {
        Alert.alert(
          "Product Not Found",
          "The scanned product could not be found."
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to fetch food details");
    } finally {
      setLoading(false);
      scannedRef.current = false;
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

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
          Barcode Scanner
        </Text>
        <TouchableOpacity onPress={toggleCameraFacing} style={styles.headerButton}>
          <Ionicons name="camera-reverse-outline" size={24} color={theme.background} />
        </TouchableOpacity>
      </View>
      {/* Camera with central scanner box overlay */}
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "upc_a"] }}
        onBarcodeScanned={scannedRef.current ? undefined : handleBarcodeScanned}
      >
        {/* Central Scanner Box */}
        <View style={[styles.scannerBox, { borderColor: theme.primary }]} />
      </CameraView>
      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator
          size="large"
          color={theme.loaderColor}
          style={styles.loader}
        />
      )}
      {/* Scan Again Button */}
      {scannedRef.current && (
        <View style={styles.buttonContainer}>
          <Button
            title="Scan Again"
            onPress={() => {
              scannedRef.current = false;
            }}
            color={theme.buttonBackground}
          />
        </View>
      )}
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
    flex: 1,
    textAlign: "center",
  },
  iconButton: {
    padding: 10,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 18,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  // The scanning box overlay in the center of the camera view.
  scannerBox: {
    position: "absolute",
    top: "30%",
    left: "10%",
    width: "80%",
    height: "40%",
    borderWidth: 3,
    borderRadius: 10,
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -20,
    marginTop: -20,
  },
  buttonContainer: {
    marginTop: 20,
    width: "80%",
  },
});
