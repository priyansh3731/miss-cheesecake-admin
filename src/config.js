import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set,remove } from "firebase/database";
import { getStorage } from "firebase/storage"; // Add storage service
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHuClSnvyJbXoskYiDjzvOK-fME53Dirc",
  authDomain: "khushbujewellers-b006f.firebaseapp.com",
  projectId: "khushbujewellers-b006f",
  storageBucket: "khushbujewellers-b006f.appspot.com",
  messagingSenderId: "256307636577",
  appId: "1:256307636577:web:4078b3ef2a0ab4dee1fd20",
  databaseURL: "https://khushbujewellers-b006f-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();



export { database, ref, onValue, set, storage, auth, provider ,remove};
