import firebase from "firebase/app";
import "firebase/firestore";

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCr_BBvf0e3eUxvys7hqqJ5Zzoml8SXu_8",
  authDomain: "practicetest-11480.firebaseapp.com",
  databaseURL: "https://practicetest-11480.firebaseio.com",
  projectId: "practicetest-11480",
  storageBucket: "practicetest-11480.appspot.com",
  messagingSenderId: "688749418650",
  appId: "1:688749418650:web:e5515ee157c64a4f786723",
  measurementId: "G-Y8GSNBMZ3M"
});

export default firebase.firestore();
