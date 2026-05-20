import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace these placeholders with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBejbVVpQJaNLehIhVK_Nyn78lAZ6KXUy0",
  authDomain: "omnitask-496621.firebaseapp.com",
  projectId: "omnitask-496621",
  storageBucket: "omnitask-496621.firebasestorage.app",
  messagingSenderId: "238789075812",
  appId: "1:238789075812:web:0ff725e97a9662697d5071",
  measurementId: "G-5PZJHWV5G2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, auth };
