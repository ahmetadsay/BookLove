
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC94UzZOsEM68AIeWzk2-5MWofI0AQ1YBU",
  authDomain: "booklove-2a0b9.firebaseapp.com",
  projectId: "booklove-2a0b9",
  storageBucket: "booklove-2a0b9.appspot.com",
  messagingSenderId: "579880523945",
  appId: "1:579880523945:android:79e6ff883edb24f6ebb1b8",
  measurementId: "G-HW9370PX5V"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);



export { db, auth };