import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function AIChatScreen({ navigation }) {
  const { theme } = useTheme();
  const { verifiedUser } = useAuth();
  const styles = createStyles(theme);
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I am your AI assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const flatListRef = useRef();

  // Load previous messages when component mounts
  useEffect(() => {
    const userId = verifiedUser._id; // Get userId from verifiedUser context
    loadPreviousMessages(userId);
  }, []);

  const loadPreviousMessages = async (userId) => {
    try {
      const response = await axios.get(`http://10.253.215.20:3000/getChats/${userId}`);
      const loadedMessages = response.data || [];
      if (loadedMessages.length === 0) {
        setMessages([
          {
            id: "1",
            text: "Hello! I am your AI assistant. How can I help you today?",
            sender: "bot",
          },
        ]);
      } else {
        setMessages(loadedMessages);
      }
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true); // Show loading spinner
    scrollToEnd();

    try {
      const response = await axios.post("http://10.253.215.20:3000/chat", {
        userId: verifiedUser._id,
        message: inputText,
      });

      console.log(response.data);

      setMessages((prev) => [...response.data]);
      scrollToEnd();
      setLoading(false); // Hide loading spinner
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false); // Hide loading spinner
    }
  };

  const scrollToEnd = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const renderMessageItem = ({ item }) => {
    const isUser = item.role === "user";
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.botMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: isUser ? theme.background : theme.text },
          ]}
        >
          {item.text || item.content} {/* Ensure the content is displayed */}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={theme.background} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.background }]}>AI Chat</Text>
      </View>

      {/* Messages Area */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id} 
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => scrollToEnd()} // Scroll when content size changes
        keyboardShouldPersistTaps="handled"
        inverted={false} // Inverts the list so that newer messages come at the bottom
      />

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      )}

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
          <TouchableOpacity onPress={sendMessage} style={styles.retryButton}>
            <Text style={[styles.retryText, { color: theme.primary }]}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input Area */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={80}>
        <View style={[styles.inputContainer, { backgroundColor: theme.cardBackground || theme.background, borderColor: theme.text }]}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Type your message..."
            placeholderTextColor={theme.text}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity onPress={sendMessage} style={[styles.sendButton, { backgroundColor: theme.primary }]}>
            <Ionicons name="send" size={24} color={theme.background} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
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
    messagesContainer: {
      padding: 15,
      paddingBottom: 80, // Ensure space for input
    },
    messageContainer: {
      maxWidth: "80%",
      padding: 10,
      borderRadius: 15,
      marginVertical: 5,
    },
    userMessage: {
      alignSelf: "flex-end",
      backgroundColor: theme.primary,
      borderTopRightRadius: 0,
    },
    botMessage: {
      alignSelf: "flex-start",
      backgroundColor: theme.secondary,
      borderTopLeftRadius: 0,
    },
    messageText: {
      fontSize: 16,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderTopWidth: 1,
    },
    input: {
      flex: 1,
      fontSize: 16,
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    sendButton: {
      padding: 10,
      borderRadius: 25,
      marginLeft: 5,
    },
    loadingContainer: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: [{ translateX: -25 }, { translateY: -25 }],
    },
    errorContainer: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: [{ translateX: -50 }, { translateY: -25 }],
      alignItems: "center",
    },
    errorText: {
      fontSize: 18,
      fontWeight: "bold",
    },
    retryButton: {
      marginTop: 10,
    },
    retryText: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });
