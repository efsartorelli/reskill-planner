// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDmUluLSFijF299u43w-LxPNI6uGh9caoU",
  authDomain: "reskill-planner.firebaseapp.com",
  databaseURL: "https://reskill-planner-default-rtdb.firebaseio.com",
  projectId: "reskill-planner",
  storageBucket: "reskill-planner.firebasestorage.app",
  messagingSenderId: "653224832624",
  appId: "1:653224832624:web:20b1ada0746b26e9c08eb5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
