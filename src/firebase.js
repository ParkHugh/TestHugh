// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // ← 이 줄 꼭 필요!

const firebaseConfig = {
  apiKey: "AIzaSyDNaL6BDxJk5BFw7tu0J7OTXwEWMYYlBD0",
  authDomain: "testhugh-f4d62.firebaseapp.com",
  projectId: "testhugh-f4d62",
  storageBucket: "testhugh-f4d62.firebasestorage.app",
  messagingSenderId: "281812609314",
  appId: "1:281812609314:web:fbabeb166b9c8de2e1dd7b",
  measurementId: "G-DRF9F8DNXE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // ← 이 export도 꼭 있어야 SocioTest에서 불러올 수 있음
