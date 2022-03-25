import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import BlogStack from "../components/BlogStack";
import AccountStack from "../components/AccountStack";

import ListingEditScreen from "../screens/ListingEditScreen";
import NewListingButton from "../components/NewListingButton";
import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator();

export default function LoggedInStack() {
  const isDark = useSelector((state) => state.accountPrefs.isDark);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Listing") {
            iconName = "image-search-outline";
          } else if (route.name === "ListingEdit") {
            iconName = "camera-outline";
          } else if (route.name === "User") {
            iconName = "face-recognition";
          }
          // You can return any component that you like here!
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
        style: {
          backgroundColor: isDark ? "#181818" : "white",
        },
      }}
    >
      <Tab.Screen name="Listing" component={BlogStack} />
      <Tab.Screen name="ListingEdit" component={ListingEditScreen} />
      <Tab.Screen name="User" component={AccountStack} />
    </Tab.Navigator>
  );
}
