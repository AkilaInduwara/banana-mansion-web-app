// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication

// Your Firebase configuration (Replace this with your actual Firebase config)
const firebaseConfig = {
  apiKey: "AIzaSyAOzEXXmKGNWYePQP1lR9zCdKBKt-_GVSo",
  authDomain: "my-banana-game.firebaseapp.com",
  projectId: "my-banana-game",
  storageBucket: "my-banana-game.appspot.com",
  messagingSenderId: "785367378325",
  appId: "1:785367378325:web:737b1e18ab7698a77cee9c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app); // Firebase Authentication instance

// Export Firestore and Auth so you can use them in other components
export { db, auth };
