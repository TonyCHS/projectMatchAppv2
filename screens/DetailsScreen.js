import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { commonStyles, lightStyles, darkStyles } from "../styles/commonStyles";
import axios from "axios";
import { API, API_POSTS } from "../constants/API";
import { useSelector } from "react-redux";

export default function ShowScreen({ navigation, route }) {
  const [post, setPost] = useState({ title: "", content: "", user_id: "" });

  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={editPost} style={{ marginRight: 10 }}>
          <MaterialCommunityIcons
            //name="pencil-square-o"
            name="image-edit-outline"
            size={40}
            //color={styles.headerTint}
            color="#122c91"
          />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    getPost();
  }, []);

  async function getPost() {
    // Added 3 March 2022
    // const token = await AsyncStorage.getItem("token");

    const id = route.params.id;
    console.log(id);
    try {
      const response = await axios.get(API + API_POSTS + "/" + id, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response.data);
      setPost(response.data);
    } catch (error) {
      console.log(error.response.data);
      if ((error.response.data.error = "Invalid token")) {
        navigation.navigate("SignInSignUp");
      }
    }
  }

  function editPost() {
    navigation.navigate("Edit", { post: post });
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.titletext, { margin: 10 }]}>
        {post.title}
      </Text>

      <Image
        style={{
          height: 210,
          width: 400,
          borderRadius: 180 / 8,
          overflow: "hidden",
          shadowColor: "grey",
        }}
        source={require(`../assets/word1.png`)} //works*
        //source={{ uri: item.image }}
        //resizeMode="contain"
        resizeMode="contain"
      />

      <Text style={[styles.categorytext, { marginTop: 10, marginLeft: 20 }]}>
        Category:
      </Text>
      <Text style={[styles.detailtext, { marginLeft: 10 }]}>
        {post.category}
      </Text>
      <Text
        style={[
          styles.content,
          styles.contenttext,
          { marginTop: 10, marginLeft: 20 },
        ]}
      >
        Converted text:
      </Text>
      <Text style={[styles.content, styles.detailtext, { marginLeft: 10 }]}>
        {post.content}
      </Text>
    </View>
  );
}
