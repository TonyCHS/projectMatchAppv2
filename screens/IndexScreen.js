import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { API, API_POSTS } from "../constants/API";
import { darkStyles, lightStyles } from "../styles/commonStyles";
import { useSelector } from "react-redux";
//Amend
import { Divider } from "react-native-elements";
import { Button } from "react-native-web";

//This will be our footer component
const endComponent = () => {
  return (
    <View>
      <Divider orientation="vertical" />
      <Text style={styles.text}> End of list</Text>
    </View>
  );
};

const data = []; //empty array

const handleEmpty = () => {
  return (
    <Text style={styles.text}>
      {" "}
      Click on camera{" "}
      <MaterialCommunityIcons
        name="camera-outline"
        size={25}
        style={{ color: "#122c91", marginRight: 15 }}

        //style={{ color: styles.headerTint, marginRight: 15 }} //#122c91
      />{" "}
      to add picture to convert to text.
    </Text>
  );
};

export default function IndexScreen({ navigation, route }) {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = isDark ? darkStyles : lightStyles;
  const token = useSelector((state) => state.auth.token);

  // This is to set up the top right button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addPost}>
          <MaterialCommunityIcons
            name="camera-outline"
            size={40}
            style={{ color: "#122c91", marginRight: 15 }}

            //style={{ color: styles.headerTint, marginRight: 15 }} //#122c91
          />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    console.log("Setting up nav listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      getPosts();
    });
    getPosts();
    return removeListener;
  }, []);

  async function getPosts() {
    try {
      const response = await axios.get(API + API_POSTS, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response.data);
      setPosts(response.data);
      return "completed";
    } catch (error) {
      console.log(error.response.data);
      console.log(token);
      if ((error.response.data.error = "Invalid token")) {
        navigation.navigate("SignInSignUp");
      }
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    const response = await getPosts();
    setRefreshing(false);
  }

  function addPost() {
    navigation.navigate("Add");
  }

  async function deletePost(id) {
    // Added 3 March 2022
    // const token = await AsyncStorage.getItem("token");
    console.log("Deleting " + id);
    try {
      const response = await axios.delete(API + API_POSTS + `/${id}`, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response);
      setPosts(posts.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  // The function to render each row in our FlatList
  function renderItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Details", { id: item.id })}
      >
        <Text style={styles.container}> </Text>
        <Image
          style={{
            height: 180,
            width: 400,
            borderRadius: 180 / 3,
            overflow: "hidden",
            shadowColor: "grey",
          }}
          //Amend now - renders images from file system:
          source={require("../assets/word1.png")}
          //Amend now - renders images from the network:
          //source={{ uri: item.image }}
          resizeMode="contain"
        />

        <View
          style={{
            padding: 30,
            paddingTop: 10,
            paddingBottom: 20,
            borderBottomColor: "#EFFFFD",
            borderBottomWidth: 1,
            borderRadius: 30,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.text}>
            {item.title}
            {"\n"}
            {item.content} [ID:{item.user_id}]
          </Text>
          {/* Amend now */}
          <TouchableOpacity onPress={() => deletePost(item.id)}>
            <MaterialCommunityIcons name="shredder" size={30} color="#122c91" />
          </TouchableOpacity>

          {/* <View>
            <Image
              style={styles.logo}
              source={require("../assets/word1.png")}
            />
          </View> */}
        </View>
      </TouchableOpacity>
    );
  }

  const list = useRef(null);

  const press = () => {
    list.current.scrollToEnd({ animated: true });
  };
  const header = () => {
    return <Button onPress={() => press()} title="Go to end" />;
  };

  //Amend here
  return (
    <View style={styles.container}>
      {!data && <Text> Loading</Text>}
      {data && (
        <FlatList
          ref={list}
          ListEmptyComponent={handleEmpty}
          //ListFooterComponent={endComponent}
          ListFooterComponent={endComponent}
          data={posts}
          renderItem={renderItem}
          style={{ width: "100%" }}
          keyExtractor={(item) => item.id.toString()}
          //inverted
          refreshControl={
            <RefreshControl
              colors={["#9Bd35A", "#689F38"]}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  text: {
    fontSize: 13,
    color: "#769FCD",
    padding: 5,
    //textAlign: "center",
  },
});
