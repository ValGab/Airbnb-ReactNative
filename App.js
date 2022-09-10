import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";

import HomeScreen from "./containers/HomeScreen";
import ProfileScreen from "./containers/ProfileScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import RoomScreen from "./containers/RoomScreen";
import { Platform, SafeAreaView, StyleSheet } from "react-native";
import ArrowLeft from "./components/ArrowLeft";
import Logo from "./components/Logo";
import AroundMeScreen from "./containers/AroundMeScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const setToken = async (token, id) => {
    if (token) {
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userId", id);
    } else {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userId");
    }

    setUserToken(token);
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      const userToken = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setUserToken(userToken);
      setUserId(userId);

      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading === true) {
    // We haven't finished checking for the token yet
    return null;
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeView}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {userToken === null ? (
            // No token found, user isn't signed in
            <>
              <Stack.Screen name="SignIn">
                {(props) => <SignInScreen {...props} setToken={setToken} />}
              </Stack.Screen>
              <Stack.Screen name="SignUp">
                {(props) => <SignUpScreen {...props} setToken={setToken} />}
              </Stack.Screen>
            </>
          ) : (
            // User is signed in ! 🎉
            <Stack.Screen name="Tab" options={{ headerShown: false }}>
              {() => (
                <Tab.Navigator
                  screenOptions={{
                    headerTitle: () => <Logo />,
                    headerTitleAlign: "center",
                    tabBarActiveTintColor: "#f9595e",
                    tabBarInactiveTintColor: "black",
                    activeTintColor: "#f9595e",
                    inactiveTintColor: "black",
                    tabBarStyle: {
                      height: 55,
                      paddingBottom: 5,
                    },
                    tabBarLabelStyle: {
                      fontSize: 14,
                    },
                  }}
                >
                  <Tab.Screen
                    name="Home"
                    options={{
                      headerShown: false,
                      tabBarIcon: ({ color }) => (
                        <Ionicons name="home-sharp" size={24} color={color} />
                      ),
                    }}
                  >
                    {() => (
                      <Stack.Navigator
                        screenOptions={{
                          headerTitle: () => <Logo />,
                          title: "Aligned Center",
                          headerTitleAlign: "center",
                        }}
                      >
                        <Stack.Screen
                          name="Homescreen"
                          component={HomeScreen}
                        />
                        <Stack.Screen
                          name="Room"
                          options={{
                            headerLeft: () => {
                              <ArrowLeft />;
                            },
                          }}
                          component={RoomScreen}
                        />
                      </Stack.Navigator>
                    )}
                  </Tab.Screen>
                  <Tab.Screen
                    name="Around me"
                    component={AroundMeScreen}
                    options={{
                      tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                          name="map-marker"
                          size={24}
                          color={color}
                        />
                      ),
                    }}
                  ></Tab.Screen>
                  <Tab.Screen
                    name="My profile"
                    options={{
                      tabBarIcon: ({ color }) => (
                        <FontAwesome
                          name="user-circle-o"
                          size={24}
                          color={color}
                        />
                      ),
                    }}
                  >
                    {(props) => (
                      <ProfileScreen
                        {...props}
                        setToken={setToken}
                        userId={userId}
                        userToken={userToken}
                      />
                    )}
                  </Tab.Screen>
                </Tab.Navigator>
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
  },
});
