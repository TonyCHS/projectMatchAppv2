import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import BlogStack from "../components/BlogStack";
import AccountStack from "../components/AccountStack";

import ListingEditScreen from "../screens/ListingEditScreen";
import NewListingButton from "../components/NewListingButton";
import { useSelector } from "react-redux";

import routes from "../navigation/routes";

const Tab = createBottomTabNavigator();

export default function LoggedInStack() {
  const isDark = useSelector((state) => state.accountPrefs.isDark);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Listing"
        component={BlogStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="image-search-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ListingEdit"
        component={ListingEditScreen}
        //options={{
        options={({ navigation }) => ({
          tabBarButton: () => (
            <NewListingButton
              onPress={() => navigation.navigate(routes.LISTING_EDIT)}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="camera-outline"
              color={color}
              size={size}
            />
          ),
        })}
      />

      <Tab.Screen
        name="User"
        component={AccountStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="face-recognition"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
