import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCT927cLdUMXOlJ1UnVTDrwp-N_b5A3MB8",
  authDomain: "instagram-chat0.firebaseapp.com",
  projectId: "instagram-chat0",
  storageBucket: "instagram-chat0.appspot.com",
  messagingSenderId: "1071763078105",
  appId: "1:1071763078105:web:0c33310cfd55e954b7b7c8",
  measurementId: "G-FFYL48Z11B"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db , auth , storage };