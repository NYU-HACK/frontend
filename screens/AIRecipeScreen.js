// screens/RecipesScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function AIRecipeScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { verifiedUser } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);

  // State for the modal that shows full recipe details
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Define a list of catchy loading prompts.
  const loadingPrompts = [
    "Whipping up something delicious...",
    "Fetching your chef’s secrets...",
    "Stirring the pot of creativity...",
    "Your recipe is being cooked up...",
    "Brewing AI magic...",
    "Mixing flavors just for you...",
  ];

  // Fetch recipes from the backend
  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    // Choose a random loading prompt
    setLoadingMessage(loadingPrompts[Math.floor(Math.random() * loadingPrompts.length)]);
    try {
      // Call your backend route to fetch suggestions.
      // Here we send the userId from verifiedUser.
      const response = await axios.post('http://10.253.215.20:3000/getSuggestions', { userId: verifiedUser._id });
      // Assuming response.data is an array of recipe objects.
      setRecipes(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Render a single recipe card (shows title and ingredients only)
  const renderRecipe = ({ item }) => {
    return (
      <View style={[styles.recipeCard, { backgroundColor: theme.cardBackground || theme.accentLight }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="fast-food-outline" size={24} color={theme.primary} style={styles.cardIcon} />
          <Text style={[styles.recipeTitle, { color: theme.text }]} numberOfLines={1}>
            {item.title || "Untitled Recipe"}
          </Text>
        </View>
        <Text style={[styles.recipeIngredients, { color: theme.text }]}>
          Ingredients:{" "}
          {Array.isArray(item.ingredients)
            ? item.ingredients.join(', ')
            : item.ingredients}
        </Text>
        <TouchableOpacity
          style={[styles.viewButton, { backgroundColor: theme.primary }]}
          onPress={() => {
            setSelectedRecipe(item);
            setModalVisible(true);
          }}
        >
          <Text style={[styles.viewButtonText, { color: theme.background }]}>
            View Recipe
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Custom Header */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.background} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.background }]}>
          Recipes
        </Text>
        <TouchableOpacity onPress={fetchRecipes} style={styles.headerButton}>
          <Ionicons name="refresh-outline" size={24} color={theme.background} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.loaderColor} />
          <Text style={[styles.loadingText, { color: theme.text }]}>{loadingMessage}</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
          <TouchableOpacity onPress={fetchRecipes} style={[styles.retryButton, { backgroundColor: theme.primary }]}>
            <Text style={[styles.retryButtonText, { color: theme.background }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderRecipe}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal for full recipe details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.primary }]}>
                {selectedRecipe?.title || "Recipe Details"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                <Ionicons name="close" size={28} color={theme.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <Text style={[styles.modalSectionTitle, { color: theme.primary }]}>Ingredients:</Text>
              <Text style={[styles.modalText, { color: theme.text }]}>
                {Array.isArray(selectedRecipe?.ingredients)
                  ? selectedRecipe.ingredients.join(', ')
                  : selectedRecipe?.ingredients || "N/A"}
              </Text>
              <Text style={[styles.modalSectionTitle, { color: theme.primary, marginTop: 10 }]}>Instructions:</Text>
              <Text style={[styles.modalText, { color: theme.text }]}>
                {selectedRecipe?.instructions || "No instructions provided."}
              </Text>
            </ScrollView>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 10,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  recipeCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    marginRight: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  recipeIngredients: {
    fontSize: 14,
    marginBottom: 8,
  },
  viewButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    padding: 5,
  },
  modalContent: {
    maxHeight: 300,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
