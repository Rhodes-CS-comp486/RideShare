// frontend/LynxLiftsApp/firebaseConfig.js

import { getReactNativePersistence, initializeAuth } from 'firebase/auth/react-native';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage'; // ✅ ADD THIS LINE
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAnxS9oz0ypR3md6bU4th1rPpKEHNG64SU",
  authDomain: "lynxliftsapp.firebaseapp.com",
  projectId: "lynxliftsapp",
  storageBucket: "lynxliftsapp.appspot.com",
  messagingSenderId: "229328914717",
  appId: "1:229328914717:web:b6b73fcc92e77be35ab9f4",
  measurementId: "G-SMLD7JB5WI"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Optional: Initialize Firebase Auth
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// ✅ Export storage instance
export const storage = getStorage(app); 

export default app;
