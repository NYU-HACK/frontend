// screens/AIToolsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AIToolsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={theme.background} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.background }]}>
          AI Assistant
        </Text>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={[styles.descriptionText, { color: theme.text }]}>
          Harness the power of AI to chat, discover personalized recipes, and plan your grocery shopping.
        </Text>
      </View>

      {/* AI Tools Cards */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.cardBackground || theme.accentLight, borderColor: theme.primary }]}
          onPress={() => navigation.navigate('AIChat')}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={32}
            color={theme.primary}
            style={styles.cardIcon}
          />
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: theme.primary }]}>
              AI Chat
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.text }]}>
              Chat with our smart assistant for cooking tips, ingredient substitutions, and more.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.cardBackground || theme.accentLight, borderColor: theme.primary }]}
          onPress={() => navigation.navigate('AIRecipe')}
        >
          <Ionicons
            name="fast-food-outline"
            size={32}
            color={theme.primary}
            style={styles.cardIcon}
          />
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: theme.primary }]}>
              AI Recipe Suggestions
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.text }]}>
              Get personalized recipes based on your available ingredients.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.cardBackground || theme.accentLight, borderColor: theme.primary }]}
          onPress={() => navigation.navigate('AIGrocery')}
        >
          <Ionicons
            name="cart-outline"
            size={32}
            color={theme.primary}
            style={styles.cardIcon}
          />
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: theme.primary }]}>
              Upcoming Grocery List
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.text }]}>
              Plan your shopping with AI-curated grocery recommendations.
            </Text>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  headerButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  cardsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    // Use shadow properties as needed; these are static values
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardIcon: {
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
});
