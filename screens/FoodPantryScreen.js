// screens/FoodPantryScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

// Helper function to check if an expiration date is within 2 days (or already expired)
const isExpiringSoon = (expirationDate) => {
  const now = new Date();
  const expDate = new Date(expirationDate);
  if (isNaN(expDate)) return false;
  const diffDays = (expDate - now) / (1000 * 60 * 60 * 24);
  return diffDays <= 2;
};

// Helper: choose an icon based on category.
const getCategoryIcon = (category) => {
  if (!category || category.toLowerCase() === "unknown")
    return "fast-food-outline";
  if (category.toLowerCase().includes("beverage")) return "wine-outline";
  if (
    category.toLowerCase().includes("baking") ||
    category.toLowerCase().includes("flour")
  )
    return "cube-outline";
  return "restaurant-outline";
};

export default function FoodPantryScreen() {
  const { theme } = useTheme();
  const { verifiedUser } = useAuth();
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [consumed, setConsumed] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  // For demonstration, we load sample data.
  useEffect(() => {
    axios.get(`http://10.253.215.20:3000/getItems/${verifiedUser._id}`).then((response) => {
        setItems(response.data);
    }).catch((error) => {
      console.log(error)
        setItems([]);
    });

    return () => {
      setItems([]);
    };
  }, []);

  // Open the modal for an item.
  const openModal = (item) => {
    let totalQuantity = 0;
    if (typeof item.quantity === "number") {
      totalQuantity = item.quantity;
    } else {
      totalQuantity = parseInt(item.quantity, 10) || 0;
    }
    setSelectedItem({ ...item, totalQuantity });
    setConsumed(0);
    setModalVisible(true);
  };

  // Handle updating consumption.
  const handleUpdateConsumption = async () => {
    if (!selectedItem) return;
    const remaining = selectedItem.totalQuantity - consumed;
    try {
      // Replace with your actual API endpoint.
      const url = `http://10.253.215.20:3000/updateItem/${verifiedUser._id}/${selectedItem._id}`;
      const { totalQuantity, ...item } = selectedItem;
      item.quantity = remaining;
      axios.put(url, { itemData: item }).then((response) => {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === selectedItem._id
              ? { ...item, quantity: remaining }
              : item
          )
        );

        Alert.alert("Success", "Food consumption updated successfully.");
        setModalVisible(false);
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Update Error", "Failed to update consumption.");
    } finally {
      setUpdating(false);
    }
  };

  // Render each food item as a modern card.
  const renderItem = ({ item }) => {
    const expiringSoon = isExpiringSoon(item.expirationDate);
    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            // backgroundColor: theme.cardBackground || "#fff",
            borderColor: theme.primary,
          },
        ]}
        onPress={() => openModal(item)}
      >
        <View style={styles.cardHeader}>
          <Ionicons
            name={getCategoryIcon(item.category)}
            size={28}
            color={theme.primary}
            style={styles.cardIcon}
          />
          <View style={styles.cardHeaderText}>
            <Text
              style={[styles.cardTitle, { color: theme.text }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.cardExpiry,
                {
                  backgroundColor: expiringSoon ? theme.danger : theme.primary,
                },
              ]}
            >
              {item.expirationDate}
            </Text>
          </View>
        </View>
        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.text }]}>
              Brand:{" "}
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {item.brand}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.text }]}>
              Category:{" "}
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {item.category}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.text }]}>
              Quantity:{" "}
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {item.quantity}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Custom Header with Back Button */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.background} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.background }]}>
          My Food Pantry
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Interactive Consumption Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.background },
            ]}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={theme.primary} />
              </TouchableOpacity>
              <Text style={[styles.modalHeaderTitle, { color: theme.primary }]}>
                Update Consumption
              </Text>
            </View>
            {selectedItem && (
              <>
                <Text style={[styles.modalItemTitle, { color: theme.text }]}>
                  {selectedItem.name}
                </Text>
                <Text style={[styles.modalText, { color: theme.text }]}>
                  Total Quantity: {selectedItem.totalQuantity}
                </Text>
                <Text style={[styles.modalText, { color: theme.text }]}>
                  Consumed: {consumed}
                </Text>
                <Text style={[styles.modalText, { color: theme.text }]}>
                  Remaining: {selectedItem.totalQuantity - consumed}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={selectedItem.totalQuantity}
                  step={1}
                  value={consumed}
                  onValueChange={setConsumed}
                  minimumTrackTintColor={theme.primary}
                  maximumTrackTintColor="#ccc"
                  thumbTintColor={theme.primary}
                />
                <View style={styles.modalButtonRow}>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      { backgroundColor: theme.buttonBackground },
                    ]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text
                      style={[
                        styles.modalButtonText,
                        { color: theme.buttonText },
                      ]}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      { backgroundColor: theme.buttonBackground },
                    ]}
                    onPress={handleUpdateConsumption}
                  >
                    <Text
                      style={[
                        styles.modalButtonText,
                        { color: theme.buttonText },
                      ]}
                    >
                      {updating ? "Updating..." : "Confirm"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  },
  headerButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 20,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    paddingBottom: 5,
    paddingTop: 5,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardIcon: {
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardExpiry: {
    marginTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 14,
    color: "#fff",
    alignSelf: "flex-start",
  },
  cardDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: "600",
  },
  detailValue: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  modalHeaderTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalItemTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 20,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
