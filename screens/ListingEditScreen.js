//Amend from CreateScreen.js
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

//Amend from CreateScreen.js
import axios from "axios";
import { API, API_CREATE, API_WHOAMI } from "../constants/API";
import { useSelector } from "react-redux";
import * as Yup from "yup";

import {
  Form,
  FormField,
  //Amend
  //FormPicker as Picker,
  FormPicker,
  SubmitButton,
} from "../components/forms";

//Amend
import { Picker } from "@react-native-picker/picker";

import CategoryPickerItem from "../components/CategoryPickerItem";
import Screen from "../components/Screen";
import FormImagePicker from "../components/forms/FormImagePicker";
import listingsApi from "../api/listings";
import useLocation from "../hooks/useLocation";
import UploadScreen from "./UploadScreen";

const validationSchema = Yup.object().shape({
  //title: Yup.string().required().min(1).label("Title"),
  title: Yup.string().min(1).label("Title"),
  content: Yup.string().label("Content"),
  category: Yup.object().nullable().label("Category"),
  //Amend from CreateScreen.js
  //images: Yup.array().min(1, "Please select at least one image."),
  //Amend
  // price: Yup.number().required().min(1).max(10000).label("Price"),
});

const categories = [
  {
    backgroundColor: "#9ADCFF",
    icon: "circle-slice-1",
    label: "English",
    value: 1,
  },
  {
    backgroundColor: "#FFD365",
    icon: "circle-slice-2",
    label: "Chinese",
    value: 2,
  },
  {
    backgroundColor: "#FFB2A6",
    icon: "circle-slice-3",
    label: "Malay",
    value: 3,
  },
  {
    backgroundColor: "#FF8AAE",
    icon: "circle-slice-4",
    label: "Tamil",
    value: 4,
  },
  {
    backgroundColor: "#E2DEA9",
    icon: "circle-slice-5",
    label: "Numbers",
    value: 5,
  },
  {
    backgroundColor: "#61A4BC",
    icon: "cube-scan",
    label: "Others",
    value: 6,
  },
];

function ListingEditScreen({ navigation }) {
  //Amend from CreateScreen.js
  const token = useSelector((state) => state.auth.token);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [user_id, setUser_id] = useState("");

  //Amend
  const [selectedLanguage, setSelectedLanguage] = useState();

  const location = useLocation();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  //Amend from CreateScreen.js
  async function getUserid() {
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      setUser_id(response.data.user_id);
    } catch (error) {}
  }

  //Amend from CreateScreen.js
  // async function savePost() {
  //   const post = {
  //     title: title,
  //     content: content,
  //     //Amend from CreateScreen.js
  //     //image: image,
  //     image: "",
  //     category: category,
  //     user_id: user_id,
  //   };
  //   try {
  //     console.log(token);
  //     const response = await axios.post(API + API_CREATE, post, {
  //       headers: { Authorization: `JWT ${token}` },
  //     });
  //     console.log(response.data);
  //     navigation.navigate("Index", { post: post });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  //Amend from CreateScreen.js
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

  const handleSubmit = async (listing, { resetForm }) => {
    const post = {
      title: title,
      content: content,
      category: category,
      image: "",
      user_id: user_id,
    };

    try {
      console.log(token);
      const response = await axios.post(API + API_CREATE, post, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response.data);
      navigation.navigate("Index", { post: post });

      setProgress(0);
      setUploadVisible(true);

      const result = await listingsApi.addListing(
        { ...listing, location },
        (progress) => setProgress(progress)
      );
      if (!result.ok) {
        //alert("Success");
        setUploadVisible(false);
        //return alert("Could not save the listing");
      }
    } catch (error) {
      console.log(error);
    }

    //resetForm();
  };

  return (
    <Screen style={styles.container}>
      <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      />
      <Form
        initialValues={{
          title: "",
          content: "",
          //category: null,
          category: "",
          images: [],
          //Amend
          //price: "",
        }}
        //Amend from CreateScreen.js
        enableReinitialize={true}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormImagePicker
          name="images"
          value="word1.png"
          onChangeText={(text) => setImage(text)}
        />
        <FormField
          maxLength={255}
          name="title"
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />

        {/* Amend: Commented because cannot make it pass value into db */}
        {/* <FormPicker
          items={categories}
          name="category"
          numberOfColumns={3}
          PickerItemComponent={CategoryPickerItem}
          placeholder="Category"
          width="100%"
          // Amend by Sebastian
          // onSelectItem={(item) => {
          //   console.log("please work " + item);
          //   setCategory(item.label);
          // }}
          selectedValue={category}
          onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
        /> */}

        <Picker
          selectedValue={category}
          onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
        >
          <Picker.Item label="Please select category" value="" />
          <Picker.Item label="English" value="English" />
          <Picker.Item label="Chinese" value="Chinese" />
          <Picker.Item label="Malay" value="Malay" />
          <Picker.Item label="Tamil" value="Tamil" />
          <Picker.Item label="Number" value="Number" />
          <Picker.Item label="Others" value="Others" />
        </Picker>

        <FormField
          maxLength={255}
          multiline
          name={<Text>"content"</Text>}
          icon="google-translate"
          numberOfLines={3}
          placeholder="Converted text"
          value={content}
          onChangeText={(text) => setContent(text)}
        />
        {/* Amend */}
        {/* <FormField
          keyboardType="numeric"
          maxLength={8}
          name="price"
          placeholder="Price"
          width={120}
        /> */}
        {/* Amend now */}
        <SubmitButton title="Save" />
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
  },
});
export default ListingEditScreen;
