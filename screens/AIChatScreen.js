import React, { useState, useEffect, useRef, useCallback, memo } from "react";
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
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

// Memoized message item component
const MessageItem = memo(({ item, theme, typingEffect }) => {
  const styles = createStyles(theme);
  const isUser = item.role === "user";
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (typingEffect && !isUser && item.content) {
      const interval = setInterval(() => {
        if (currentIndex < item.content.length) {
          setDisplayText(prev => prev + item.content[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        } else {
          clearInterval(interval);
        }
      }, 20);

      return () => clearInterval(interval);
    } else {
      setDisplayText(item.content);
    }
  }, [item.content, currentIndex, isUser, typingEffect]);

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
        {displayText}
      </Text>
      {item.isTyping && (
        <View style={styles.typingIndicator}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      )}
    </View>
  );
});

export default function AIChatScreen({ navigation }) {
  const { theme } = useTheme();
  const { verifiedUser } = useAuth();
  const styles = createStyles(theme);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load previous messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await axios.get(
          `http://10.253.215.20:3000/getChats/${verifiedUser._id}`
        );
        setMessages(response.data.messages || []);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };
    
    loadMessages();
  }, [verifiedUser._id]);

  // Scroll handling
  const handleContentSizeChange = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  const handleLayout = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  // Message sending logic
  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      content: inputText,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    setInputText("");
    setError(null);
    
    // Add user message and typing indicator
    setMessages(prev => [
      ...prev,
      userMessage,
      {
        id: `typing-${Date.now()}`,
        content: "",
        role: "assistant",
        isTyping: true,
      }
    ]);

    try {
      setIsLoading(true);
      const response = await axios.post("http://10.253.215.20:3000/chat", {
        userId: verifiedUser._id,
        message: inputText,
      });

      // Remove typing indicator and add bot response
      setMessages(prev => [
        ...prev.filter(msg => !msg.isTyping),
        {
          id: `bot-${Date.now()}`,
          content: response.data.response[response.data.response.length - 1].content,
          role: "assistant",
          timestamp: new Date().toISOString(),
        }
      ]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
      // Remove typing indicator on error
      setMessages(prev => prev.filter(msg => !msg.isTyping));
    } finally {
      setIsLoading(false);
    }
  }, [inputText, verifiedUser._id, isLoading]);

  // Optimized message rendering
  const renderItem = useCallback(({ item, index }) => (
    <MessageItem
      item={item}
      theme={theme}
      typingEffect={index === messages.length - 1 && item.role === "assistant"}
    />
  ), [messages.length, theme]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.background} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Chat</Text>
      </View>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        keyboardDismissMode="interactive"
        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Start a conversation with your AI assistant!</Text>
          </View>
        }
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputWrapper}>
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor={theme.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              editable={!isLoading}
              onSubmitEditing={sendMessage}
            />
            
            <TouchableOpacity
              onPress={sendMessage}
              disabled={isLoading}
              style={styles.sendButton}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.background} />
              ) : (
                <Ionicons name="send" size={24} color={theme.background} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.primary,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.background,
      marginLeft: 16,
    },
    messageContainer: {
      maxWidth: '80%',
      padding: 12,
      borderRadius: 16,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: theme.primary,
    },
    botMessage: {
      alignSelf: 'flex-start',
      backgroundColor: theme.secondary,
    },
    messageText: {
      fontSize: 16,
      lineHeight: 24,
    },
    inputWrapper: {
      padding: 16,
      backgroundColor: theme.cardBackground,
      borderTopWidth: 1,
      borderColor: theme.border,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 24,
      backgroundColor: theme.inputBackground,
      paddingHorizontal: 16,
    },
    input: {
      flex: 1,
      fontSize: 16,
      paddingVertical: 12,
      color: theme.text,
    },
    sendButton: {
      marginLeft: 8,
      padding: 12,
      borderRadius: 24,
      backgroundColor: theme.primary,
    },
    typingIndicator: {
      flexDirection: 'row',
      marginTop: 8,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.textSecondary,
      marginHorizontal: 2,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    emptyText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    errorText: {
      color: theme.error,
      fontSize: 14,
      marginBottom: 8,
    },
  });