// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vingo-fb5f0.firebaseapp.com",
  projectId: "vingo-fb5f0",
  storageBucket: "vingo-fb5f0.firebasestorage.app",
  messagingSenderId: "992742225706",
  appId: "1:992742225706:web:0819d3888059bf03019053"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app);
export{app,auth}