import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDaxK6dce3pc5WnDREiYl0aAqnw16EUfyQ",
  authDomain: "vela-clinic.firebaseapp.com",
  projectId: "vela-clinic",
  storageBucket: "vela-clinic.firebasestorage.app",
  messagingSenderId: "85581317368",
  appId: "1:85581317368:web:cd30bc0e97b9edb4f1670d"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);