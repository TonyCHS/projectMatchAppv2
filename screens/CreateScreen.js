import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { API, API_CREATE, API_WHOAMI } from "../constants/API";
import { lightStyles, darkStyles, commonStyles } from "../styles/commonStyles";
import { useSelector } from "react-redux";

export default function CreateScreen({ navigation }) {
  const token = useSelector((state) => state.auth.token);

  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  //Added on April 2022
  const [category, setCategory] = useState("");
  //Added on 9 March 2022
  const [user_id, setUser_id] = useState("");

  // Added 9 March 2022
  async function getUserid() {
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      setUser_id(response.data.user_id);
    } catch (error) {}
  }

  async function savePost() {
    const post = {
      title: title,
      content: content,
      // Added April 2022
      image: image,
      category: category,
      // Added 6 March 2022
      user_id: user_id,
    };

    // Added 3 March 2022
    //const token = await AsyncStorage.getItem("token");
    try {
      console.log(token);
      const response = await axios.post(API + API_CREATE, post, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response.data);
      navigation.navigate("Index", { post: post });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log("Setting up nav listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      setUser_id(<ActivityIndicator />);
      getUserid();
    });
    getUserid();
    return removeListener;
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ margin: 20 }}>
        <Text style={[additionalStyles.label, styles.text]}>Title:</Text>
        <TextInput
          style={additionalStyles.input}
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <Text style={[additionalStyles.label, styles.text]}>
          Converted text:
        </Text>
        <TextInput
          style={additionalStyles.input}
          value={content}
          onChangeText={(text) => setContent(text)}
        />
        <Text style={[additionalStyles.label, styles.text]}>Category:</Text>
        <TextInput
          style={additionalStyles.input}
          value={category}
          onChangeText={(text) => setCategory(text)}
        />
        <Text style={[additionalStyles.label, styles.text]}>Image path:</Text>
        <TextInput
          style={additionalStyles.input}
          value={image}
          onChangeText={(text) => setImage(text)}
        />
        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={savePost}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const additionalStyles = StyleSheet.create({
  input: {
    fontSize: 20,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 15,
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 5,
  },
});
