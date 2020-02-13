import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  Button,
  KeyboardAvoidingView,
  TextInput,
  ScrollView
} from "react-native";
import db from "../db";

import firebase from "firebase/app";
import "firebase/auth";
import { map } from "rxjs/operator/map";
import { setWorldAlignment } from "expo/build/AR";

export default function Friends() {
  const [user, setUser] = useState(null);
  const [friend, setFriend] = useState("");
  const [friendId, setFriendId] = useState("");
  const [friendObj, setFriendObj] = useState("");
  const [del, setDel] = useState(true);
  useEffect(() => {
    handleUser();
  }, []);

  useEffect(() => {}, [friendObj]);
  const handleFindFriend = async () => {
    var myao = await db.collection("users").where("nickname", "==", friend);
    await myao.onSnapshot(snapshot => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        setFriendObj("");
        return;
      }
      snapshot.forEach(doc => {
        console.log(doc.id, "=>", doc.data());
        setFriendId(doc.id);
        setFriendObj(doc.data());
      });
    });

    var temp = await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("friends")
      .doc(friendId)
      .get();
    if (temp) {
      setDel(!del);
    }
    //console.log("found a friend?: ", myao);
  };
  const handleAddfriend = () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("friends")
      .doc(friendId)
      .set({
        friendUID: friendId
      });
    setDel(!del);
  };
  const handleDeleteFriend = () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("friends")
      .doc(friendId)
      .delete();

    setDel(!del);
  };
  const handleUser = () => {
    const snap = db
      .collection(`users`)
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(docSnapshot => {
        setUser(docSnapshot.data());
      });
  };
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.header}>
        {user ? (
          <View>
            <Image
              style={{ width: 50, height: 50 }}
              source={{ uri: user.photoURL }}
            />
            <Text>{user.displayName}</Text>
          </View>
        ) : null}
      </View>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          placeholder="hello"
          type="text"
          width="70%"
          onChangeText={text => setFriend(text)}
        />
        <Button title="Find a Friend" onPress={handleFindFriend} />
      </View>
      <ScrollView>
        {friendObj ? (
          <View
            style={{ justifyContent: "space-between", flexDirection: "row" }}
          >
            <Text>{friendObj.displayName}</Text>
            {del ? (
              <Button title="Add" onPress={handleAddfriend} />
            ) : (
              <Button title="Delete" onPress={handleDeleteFriend} />
            )}
          </View>
        ) : (
          <Text>No one was found</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

Friends.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray"
  },
  header: {
    backgroundColor: "#685B58",
    borderBottomColor: "darkorange",
    borderBottomWidth: 1,
    height: "15%",
    alignItems: "center",
    flexDirection: "row"
  }
});
