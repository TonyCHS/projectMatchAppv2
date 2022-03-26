import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import * as Yup from "yup";

import {
  Form,
  FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import CategoryPickerItem from "../components/CategoryPickerItem";
import Screen from "../components/Screen";
import FormImagePicker from "../components/forms/FormImagePicker";
import listingsApi from "../api/listings";
import useLocation from "../hooks/useLocation";
import UploadScreen from "./UploadScreen";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  content: Yup.string().label("Content"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(1, "Please select at least one image."),
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

function ListingEditScreen() {
  const location = useLocation();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (listing, { resetForm }) => {
    setProgress(0);
    setUploadVisible(true);
    const result = await listingsApi.addListing(
      { ...listing, location },
      (progress) => setProgress(progress)
    );

    if (!result.ok) {
      setUploadVisible(false);
      //return alert("Could not save the listing");
    }

    resetForm();
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
          category: null,
          images: [],
          //Amend
          //price: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormImagePicker name="images" />
        <FormField maxLength={255} name="title" placeholder="Title" />
        <Picker
          items={categories}
          name="category"
          numberOfColumns={3}
          PickerItemComponent={CategoryPickerItem}
          placeholder="Category"
          width="100%"
        />
        <FormField
          maxLength={255}
          multiline
          name={<Text>"content"</Text>}
          icon="google-translate"
          numberOfLines={3}
          placeholder="Converted text"
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
