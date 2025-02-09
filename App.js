// AppWrapper.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomeScreen from "./screens/HomeScreen";
import AddFoodScreen from "./screens/AddFoodScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MainTabNavigator from "./screens/MainTabNavigator";
import AIRecipeScreen from "./screens/AIRecipeScreen";
import AIChatScreen from "./screens/AIChatScreen";

const Stack = createStackNavigator();

function AuthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* MainTabNavigator displays the 5 primary screens with static bottom menu */}
      <Stack.Screen name="Main" component={MainTabNavigator} />
      {/* Other screens without bottom menu */}
      <Stack.Screen name="AddFood" component={AddFoodScreen} />
      <Stack.Screen name="AIChat" component={AIChatScreen} />
      <Stack.Screen name="AIRecipe" component={AIRecipeScreen} />
    </Stack.Navigator>
  );
}

function UnauthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { verifiedUser } = useAuth();
  return (
    <NavigationContainer>
      {verifiedUser ? <AuthenticatedStack /> : <UnauthenticatedStack />}
    </NavigationContainer>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}
