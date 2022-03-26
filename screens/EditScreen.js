import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { commonStyles, lightStyles, darkStyles } from "../styles/commonStyles";
import { API, API_POSTS } from "../constants/API";
import axios from "axios";
import { useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";

export default function EditScreen({ navigation, route }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [user_id, setUser_id] = useState("");
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };

  useEffect(() => {
    const post = route.params.post;
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    // Added 6 March 2022
    setUser_id(post.user_id);
  }, []);

  async function editPost() {
    const post = {
      title: title,
      category: category,
      content: content,
      user_id: user_id,
    };
    const id = route.params.post.id;
    try {
      console.log(token);
      const response = await axios.put(API + API_POSTS + "/" + id, post, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response.data);
      navigation.navigate("Index");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ margin: 20 }}>
        <Text style={[additionalStyles.label, styles.headertext]}>
          Edit Title:
        </Text>
        <TextInput
          style={additionalStyles.input}
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <Text style={[additionalStyles.label, styles.headertext]}>
          Edit Category:
        </Text>

        <Picker
          selectedValue={category}
          onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
        >
          <Picker.Item label="English" value="English" />
          <Picker.Item label="Chinese" value="Chinese" />
          <Picker.Item label="Malay" value="Malay" />
          <Picker.Item label="Tamil" value="Tamil" />
          <Picker.Item label="Number" value="Number" />
          <Picker.Item label="Others" value="Others" />
        </Picker>

        <TextInput
          style={additionalStyles.input}
          value={category}
          onChangeText={(text) => setCategory(text)}
        />
        <Text style={[additionalStyles.label, styles.headertext]}>
          Edit Content:
        </Text>
        <TextInput
          style={additionalStyles.inputContent}
          value={content}
          onChangeText={(text) => setContent(text)}
        />
        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={editPost}
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
    height: 50,
    borderWidth: 2,
    //borderColor: "#488FB1",
    borderColor: "#EFFFFD",
    marginBottom: 15,
    borderRadius: 180 / 10,
    padding: 8,
  },
  inputContent: {
    fontSize: 20,
    height: 100,
    borderWidth: 2,
    //borderColor: "#488FB1",
    borderColor: "#EFFFFD",
    marginBottom: 15,
    borderRadius: 180 / 10,
    padding: 8,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 24,
    marginBottom: 10,
    marginLeft: 5,
  },
});
