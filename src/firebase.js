import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDtXFlfY4firBTgceOXu9LPYYKsEraETXI",
  authDomain: "apology-b4f72.firebaseapp.com",
  databaseURL: "https://apology-b4f72-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "apology-b4f72",
  storageBucket: "apology-b4f72.firebasestorage.app",
  messagingSenderId: "571395763809",
  appId: "1:571395763809:web:f45a109e42fb9979b94420",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Anonymous auth keeps the chat protected by Firebase rules without
// forcing a login screen onto this small private site.
export const authReady = signInAnonymously(auth);
