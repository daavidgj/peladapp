import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getReactNativePersistence,
  initializeAuth
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyACzovLTB6_GkSu3KHzHUDX3HKHGDmG90E",
  authDomain: "fir-app-8515f.firebaseapp.com",
  projectId: "fir-app-8515f",
  storageBucket: "fir-app-8515f.firebasestorage.app",
  messagingSenderId: "375548005184",
  appId: "1:375548005184:web:81969e34a0598ebb2c88a5",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// ✅ Inicializa o Auth com persistência usando AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { db, auth };
