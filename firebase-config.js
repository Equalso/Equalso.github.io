
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDr4rq4VQWckXTj4K9m49s3eLWv-M87LgU",
    authDomain: "qwwq-33a6d.firebaseapp.com",
    projectId: "qwwq-33a6d",
    storageBucket: "qwwq-33a6d.firebasestorage.app",
    messagingSenderId: "366860961218",
    appId: "1:366860961218:web:35cfcbf3ec84a26e47825b",
    measurementId: "G-ZZQ8LEHTZ8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, addDoc, updateDoc, doc };
