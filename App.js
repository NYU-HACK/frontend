// App.js
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  View,
  Text,
  StyleSheet
} from "react-native";
// Import your screens
import HomeScreen from "./screens/HomeScreen";
import ScannerScreen from "./screens/ScannerScreen";
import AddFoodScreen from "./screens/AddFoodScreen";
import { ThemeProvider } from "./context/ThemeContext";
import SettingsScreen from "./screens/SettingsScreen";
import { app } from "./services/config";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

const Stack = createStackNavigator();

export default function App() {
  const auth = getAuth(app);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  const onAuthStateChangedHandler = (user) => {
    console.log("User",user);
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHandler(
      auth,
      onAuthStateChangedHandler
    );

    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  console.log("Current",user);
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator options={{ headerShown: false }} initialRouteName={user.currentUser ? "Home" : "Login"}>
          {user.currentUser ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Scanner" component={ScannerScreen} />
              <Stack.Screen
                name="AddFood"
                component={AddFoodScreen}
              />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </>
          ) : (
            <>
              <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
              <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});