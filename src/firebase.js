// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics'; // 👈 이 줄 추가!

const firebaseConfig = {
  apiKey: "AIzaSyDNaL6BDxJk5BFw7tu0J7OTXwEWMYYlBD0",
  authDomain: "testhugh-f4d62.firebaseapp.com",
  projectId: "testhugh-f4d62",
  storageBucket: "testhugh-f4d62.firebasestorage.app",
  messagingSenderId: "281812609314",
  appId: "1:281812609314:web:fbabeb166b9c8de2e1dd7b",
  measurementId: "G-DRF9F8DNXE" // 👈 GA4 ID, 이미 잘 들어가 있음
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 👇 GA4 연결 코드 추가
export const analytics = isSupported().then((supported) =>
  supported ? getAnalytics(app) : null
);
