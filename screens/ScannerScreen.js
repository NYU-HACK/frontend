import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTheme } from '../context/ThemeContext';

export default function ScannerScreen({ navigation }) {
  const { theme } = useTheme();
  const [facing, setFacing] = useState('back');
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanAnimation] = useState(new Animated.Value(0));

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.message, { color: theme.text }]}>We need your permission to access the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" color={theme.buttonBackground} />
      </View>
    );
  }

  const handleBarcodeScanned = async ({ type, data }) => {
    if (scanned) return;
    setScanned(true);
    setLoading(true);

    try {
      const foodDetails = {
        barcodeData: data,
        name: 'Scanned Food Item',
        category: 'beverages',
        expirationDate: '',
        nutrition: 'Calories: 250, Protein: 10g',
        ingredients: 'Sample Ingredient List',
      };

      navigation.navigate('AddFood', { product: foodDetails });
    } catch (error) {
      alert("Failed to fetch food details");
    } finally {
      setLoading(false);
      setScanned(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ['qr', 'ean13', 'upc_a'] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      >
        {/* Camera Overlay */}
        <View style={[styles.overlay, { backgroundColor: theme.cameraOverlay }]}>
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonBackground }]} onPress={toggleCameraFacing}>
            <Text style={[styles.buttonText, { color: theme.buttonText }]}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color={theme.loaderColor} style={styles.loader} />}

      {/* Scan Again Button */}
      {scanned && (
        <View style={styles.buttonContainer}>
          <Button title="Scan Again" onPress={() => setScanned(false)} color={theme.buttonBackground} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  message: { 
    textAlign: 'center', 
    paddingBottom: 10, 
    fontSize: 18,
  },
  camera: { 
    flex: 1, 
    width: '100%',
  },
  overlay: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    width: '100%',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  button: { 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 10, 
    elevation: 3,
  },
  buttonText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
  },
  loader: { 
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    marginLeft: -20, 
    marginTop: -20,
  },
});

