import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

// Generic Food Categories with iOS Emojis 🍗🥦🥛🥤🍪
const categoryEmojis = {
  poultry: "🍗",
  dairy: "🥛",
  veggies: "🥦",
  beverages: "🥤",
  snacks: "🍪",
  grains: "🍞",
  seafood: "🦞",
  default: "🍽",
};

export default function AddFoodScreen({ route }) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { verifiedUser } = useAuth();
  const { product } = route.params || {};

  // Shared inputs
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Manual entry state
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [productName, setProductName] = useState(product?.name || "");
  const [barcodeData, setBarcodeData] = useState(product?.code || "");
  const [manualCategory, setManualCategory] = useState(
    product?.category || "default"
  );
  const [price, setPrice] = useState("");

  // Handle input change and format to two decimal points
  const handlePriceChange = (value) => {
    // Allow numbers and decimal point, restrict to 2 decimal places
    const formattedValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/^(\d*\.?\d{0,2}).*/, "$1");
    setPrice(formattedValue);
  };

  // For scanned flow, use product.category; for manual, use manualCategory
  const category = isManualEntry
    ? manualCategory
    : product?.category || "default";

  // Function to save food item (works for both flows)
  const handleSaveFood = useCallback( async () => {
    let foodData;
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      Alert.alert("Invalid Price", "Please enter a valid price.");
      return;
    }
    if (isManualEntry) {
      if (!productName || !barcodeData || !expirationDate || !quantity) {
        Alert.alert("Missing Fields", "Please enter all details.");
        return;
      }
      foodData = {
        name: productName,
        code: product.code,
        brand: product.brand || "Unknown",
        category: manualCategory,
        expirationDate: expirationDate.toISOString().split("T")[0],
        quantity,
        manualEntry: isManualEntry,
        price: parsedPrice,
      };
    } else {
      if (!product?.name || !expirationDate || !quantity) {
        Alert.alert("Missing Fields", "Please enter all details.");
        return;
      }
      foodData = {
        code: product.code,
        name: product.name,
        brand: product.brand,
        category: product.category || "default",
        expirationDate: expirationDate.toISOString().split("T")[0],
        quantity,
        manualEntry: isManualEntry,
        price: parsedPrice,
      };
    }
    axios
      .post(`http://10.253.215.20:3000/addItem/${verifiedUser._id}`, foodData)
      .then((response) => {
        Alert.alert("Success", "Food item saved successfully!");
        navigation.navigate("Main", { screen: "Home" });
      });
  }, [price, product, productName, barcodeData, expirationDate, quantity, manualCategory, isManualEntry, verifiedUser, navigation, axios]);

  // Function to update quantity
  const updateQuantity = (value) => {
    if (value >= 1 && value <= 10) {
      setQuantity(value);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      {/* CUSTOM NAVIGATION BAR */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSaveFood} style={styles.iconButton}>
          <Ionicons name="checkmark" size={32} color={theme.buttonBackground} />
        </TouchableOpacity>
      </View>

      {/* Conditional Rendering: Scanned Details vs. Manual Entry Form */}
      {isManualEntry ? (
        <View style={styles.manualForm}>
          <TextInput
            label="Product Name"
            value={productName}
            onChangeText={setProductName}
            placeholder="Enter product name"
            style={[styles.input, { backgroundColor: theme.background }]}
            activeOutlineColor={theme.primary} // Outline color when focused
            outlineColor={theme.primary} // Outline color when not focused
            selectionColor={theme.primary} // Cursor and selection color
            theme={{
              colors: {
                text: theme.text,
                primary: theme.primary,
              },
            }}
          />
          <TextInput
            label="Barcode Data"
            disabled
            value={barcodeData}
            onChangeText={setBarcodeData}
            style={[styles.input, { backgroundColor: theme.background }]}
            activeOutlineColor={theme.primary} // Outline color when focused
            outlineColor={theme.primary} // Outline color when not focused
            selectionColor={theme.primary} // Cursor and selection color
            theme={{
              colors: {
                text: theme.text,
                primary: theme.primary,
              },
            }}
            placeholder="Enter barcode data"
          />
          <Text style={[styles.label, { color: theme.text, marginTop: 10 }]}>
            Category:
          </Text>
          <View
            style={[styles.pickerContainer, { borderColor: theme.secondary }]}
          >
            <Picker
              selectedValue={manualCategory}
              onValueChange={(itemValue) => setManualCategory(itemValue)}
              itemStyle={{ color: theme.text }}
              dropdownIconColor={theme.text}
            >
              {Object.keys(categoryEmojis).map((cat) => (
                <Picker.Item key={cat} label={cat.toUpperCase()} value={cat} />
              ))}
            </Picker>
          </View>
        </View>
      ) : (
        <View style={[styles.foodCard, { backgroundColor: theme.secondary }]}>
          <Text style={styles.foodEmoji}>
            {categoryEmojis[category] || categoryEmojis.default}
          </Text>
          <Text style={[styles.foodName, { color: theme.text }]}>
            {product?.name || "Unknown Food Item"}
          </Text>
          <Text style={[styles.foodCategory, { color: theme.text }]}>
            Category: {(product?.category || "default").toUpperCase()}
          </Text>
          <Text style={[styles.foodDetails, { color: theme.text }]}>
            Barcode: {product?.code || "N/A"}
          </Text>
        </View>
      )}

      {/* EXPIRATION DATE INPUT */}
      <Text style={[styles.label, { color: theme.text }]}>
        Expiration Date:
      </Text>
      <TouchableOpacity
        onPress={() => setDatePickerVisibility(true)}
        style={[
          styles.datePicker,
          { borderColor: theme.primary, backgroundColor: theme.secondary },
        ]}
      >
        <Text style={{ color: theme.buttonText, fontWeight: "bold" }}>
          {expirationDate.toDateString()} 🗓
        </Text>
      </TouchableOpacity>

      <Text style={[styles.label, { color: theme.text }]}>Price (USD):</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: theme.text,
            borderColor: theme.primary,
            backgroundColor: theme.secondary,
          },
        ]}
        placeholder="Enter price in USD"
        placeholderTextColor={theme.placeholderText}
        keyboardType="numeric"
        value={price}
        onChangeText={handlePriceChange}
      />

      {/* Date Picker Modal with custom iOS styles and a custom cancel button */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        minimumDate={new Date()}
        onConfirm={(selectedDate) => {
          setDatePickerVisibility(false);
          setExpirationDate(selectedDate);
        }}
        onCancel={() => setDatePickerVisibility(false)}
        textColor={theme.text}
        pickerContainerStyleIOS={[
          styles.datePickerContainerIOS,
          { backgroundColor: theme.background, borderColor: theme.secondary },
        ]}
        pickerStyleIOS={styles.datePickerStyleIOS}
        pickerComponentStyleIOS={[
          styles.datePickerComponentStyleIOS,
          { color: theme.text },
        ]}
        customCancelButtonIOS={() => (
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: theme.danger }]}
            onPress={() => setDatePickerVisibility(false)}
          >
            <Text style={[styles.cancelButtonText, { color: theme.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* QUANTITY SELECTOR */}
      <Text style={[styles.label, { color: theme.text }]}>Quantity:</Text>
      <View
        style={[styles.quantityContainer, { borderColor: theme.secondary }]}
      >
        <TouchableOpacity
          style={[
            styles.quantityButton,
            { backgroundColor: theme.buttonBackground },
          ]}
          onPress={() => updateQuantity(quantity - 1)}
        >
          <Ionicons name="remove-circle" size={28} color={theme.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.quantityText, { color: theme.text }]}>
          {quantity}
        </Text>
        <TouchableOpacity
          style={[
            styles.quantityButton,
            { backgroundColor: theme.buttonBackground },
          ]}
          onPress={() => updateQuantity(quantity + 1)}
        >
          <Ionicons name="add-circle" size={28} color={theme.buttonText} />
        </TouchableOpacity>
      </View>

      {/* ACTION BUTTONS */}
      <Button
        mode="contained"
        onPress={handleSaveFood}
        style={[styles.saveButton, { backgroundColor: theme.secondary }]}
        labelStyle={{ color: theme.text, fontSize: 18 }}
      >
        Save Food
      </Button>
      {/* Only show the Enter Manually button if not already in manual mode */}
      {!isManualEntry && (
        <Button
          mode="contained"
          onPress={() => setIsManualEntry(true)}
          style={[styles.saveButton, { backgroundColor: theme.secondary }]}
          labelStyle={{ color: theme.text, fontSize: 18 }}
        >
          Enter Manually
        </Button>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 40,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  iconButton: {
    padding: 10,
  },
  foodCard: {
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  foodEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  foodName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  foodCategory: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  foodDetails: {
    fontSize: 16,
    textAlign: "center",
  },
  manualForm: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  datePicker: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "60%",
    alignSelf: "center",
    marginBottom: 20,
  },
  quantityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  datePickerContainerIOS: {
    borderRadius: 10,
    borderWidth: 1,
    margin: 10,
  },
  datePickerStyleIOS: {
    height: 200,
    justifyContent: "center",
  },
  datePickerComponentStyleIOS: {
    fontSize: 18,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
