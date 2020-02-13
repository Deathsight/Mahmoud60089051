import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState, useEffect } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  KeyboardAvoidingView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppNavigator from "./navigation/AppNavigator";

import firebase from "firebase/app";
import "firebase/auth";
import db from "./db";

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [v, setV] = useState(true);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(setUser);
  }, []);

  const handleRegister = async () => {
    if (email && password && nickname) {
      console.log("Regestering!..");

      var f = db.collection("users").where("nickname", "==", nickname);

      await firebase.auth().createUserWithEmailAndPassword(email, password);
      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .set({
          displayName: email,
          photoURL:
            "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
          nickname: nickname
        });

      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("friends")
        .doc(firebase.auth().currentUser.uid)
        .set({
          friendUID: firebase.auth().currentUser.uid
        });
      console.log("Done regestering....", "User id: ");
    } else {
      console.log("Empty fields....");
    }
  };

  const handleLogin = () => {
    if (email && password) {
      firebase.auth().signInWithEmailAndPassword(email, password);
    } else {
      console.log("Empty fields....");
    }
  };

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else if (!user) {
    return v ? (
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        style={styles.containerSet}
      >
        <Text>Please Login.</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Email"
          type="text"
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          type="password"
          secureTextEntry
          onChangeText={setPassword}
          style={styles.inputBox}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button title="Sign In" onPress={handleLogin} />
          <Button title="Need an Account? Register" onPress={() => setV(!v)} />
        </View>
      </KeyboardAvoidingView>
    ) : (
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        style={styles.containerSet}
      >
        <Text>Please Register.</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Email"
          type="text"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Nick Name"
          type="Text"
          onChangeText={setNickname}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Password"
          type="password"
          secureTextEntry
          onChangeText={setPassword}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button title="Sign Up" onPress={handleRegister} />
          <Button title="Got an account? Login" onPress={() => setV(!v)} />
        </View>
      </KeyboardAvoidingView>
    );
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require("./assets/images/robot-dev.png"),
      require("./assets/images/robot-prod.png")
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
    })
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    paddingTop: 30,
    flex: 1,
    alignContent: "center",
    justifyContent: "center"
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  containerSet: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "gray",
    width: 400
  }
});
