import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  LayoutAnimation,
  ActivityIndicator,
  Keyboard,
  Image,
  ImageBackground,
} from "react-native";
import { API, API_LOGIN, API_SIGNUP } from "../constants/API";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logInAction } from "../redux/ducks/blogAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
} //Needs to be manually enabled for android

export default function SignInSignUpScreen({ navigation }) {
  //const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [isLogIn, setIsLogIn] = useState(true);

  const dispatch = useDispatch();

  async function login() {
    console.log("---- Login time ----");
    Keyboard.dismiss();

    try {
      setLoading(true);
      const response = await axios.post(API + API_LOGIN, {
        //id,
        username,
        password,
      });
      console.log("Success logging in!");
      console.log(response.data.access_token);
      dispatch({ ...logInAction(), payload: response.data.access_token });
      setLoading(false);
      setUsername("");
      setPassword("");
      navigation.navigate("Logged In");
    } catch (error) {
      setLoading(false);
      console.log("Error logging in!");
      console.log(error);
      setErrorText(error.response.data.description);
    }
  }

  async function signUp() {
    if (password != confirmPassword) {
      setErrorText("Your passwords don't match. Check and try again.");
    } else {
      try {
        setLoading(true);
        const response = await axios.post(API + API_SIGNUP, {
          //id,
          username,
          password,
        });
        if (response.data.Error) {
          // We have an error message for if the user already exists
          setErrorText(response.data.Error);
          setLoading(false);
        } else {
          console.log("Success signing up!");
          setLoading(false);
          login();
        }
      } catch (error) {
        setLoading(false);
        console.log("Error logging in!");
        console.log(error.response);
        setErrorText(error.response.data.description);
        if ((error.response.status = 404)) {
          setErrorText("User does not exist");
        }
      }
    }
  }
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <Text style={styles.title}>{isLogIn ? "LOGIN" : "REGISTER"}</Text>

      <View style={styles.inputView1}>
        <MaterialCommunityIcons name="email" color="white" size={35} />
        <TextInput
          style={styles.textInput}
          //placeholder="Username:"
          //placeholderTextColor="#FBF8F1"
          onChangeText={(username) => setUsername(username)}
          value={username}
        />
      </View>

      <View style={styles.inputView2}>
        <MaterialCommunityIcons name="lock-check" color="white" size={35} />
        <TextInput
          style={styles.textInput}
          // placeholder="Password:"
          // placeholderTextColor="#FBF8F1"
          secureTextEntry={true}
          onChangeText={(pw) => setPassword(pw)}
          value={password}
        />
      </View>

      {isLogIn ? (
        <View />
      ) : (
        <View style={styles.inputView3}>
          <MaterialCommunityIcons name="lock-check" color="white" size={35} />
          <TextInput
            style={styles.textInput}
            // placeholder="confirm password"
            // placeholderTextColor="#FBF8F1"
            secureTextEntry={true}
            onChangeText={(pw) => setConfirmPassword(pw)}
            value={confirmPassword}
          />
        </View>
      )}

      <View />
      <View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.button}
            onPress={isLogIn ? login : signUp}
          >
            <Text style={styles.buttonText}>
              {" "}
              {isLogIn ? "Log In" : "Sign Up"}{" "}
            </Text>
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator style={{ marginLeft: 10 }} />
          ) : (
            <View />
          )}
        </View>
      </View>
      <Text style={styles.errorText}>{errorText}</Text>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext({
            duration: 700,
            create: { type: "linear", property: "opacity" },
            update: { type: "spring", springDamping: 0.8 },
          });
          setIsLogIn(!isLogIn);
          setErrorText("");
        }}
      >
        <Text style={styles.switchText}>
          {" "}
          {isLogIn
            ? "No account? Sign up now."
            : "Already have an account? Log in here."}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    margin: 20,
  },
  switchText: {
    fontWeight: "400",
    fontSize: 15,
    marginTop: 20,
    color: "#05445E",
  },
  inputView1: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingTop: 3,
    borderColor: "#000",
    backgroundColor: "#05445E",
    borderRadius: 30,
    width: "85%",
    height: 45,
    marginBottom: 20,
  },
  inputView2: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingTop: 3,
    paddingBottom: 5,
    borderColor: "#000",
    backgroundColor: "#189AB4",
    borderRadius: 30,
    width: "85%",
    height: 45,
    marginBottom: 20,
    //alignItems: "center",
  },
  inputView3: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingTop: 3,
    paddingBottom: 5,
    borderColor: "#000",
    backgroundColor: "#75E6DA",
    borderRadius: 30,
    width: "85%",
    height: 45,
    marginBottom: 20,
    // alignItems: "center",
  },
  textInput: {
    color: "white",
    fontSize: 15,
    height: 50,
    flex: 1,
    padding: 10,
  },
  button: {
    backgroundColor: "#D4F1F4",
    borderRadius: 25,
  },
  buttonText: {
    fontWeight: "400",
    fontSize: 20,
    margin: 20,
    color: "#05445E",
  },
  errorText: {
    fontSize: 15,
    color: "red",
    marginTop: 20,
  },
  logo: {
    width: 300,
    height: 168,
  },
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
