// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCmeD0WzSjs7ctIWuzSIkkvRjSo2jFippU",
    authDomain: "swish-todo-app.firebaseapp.com",
    projectId: "swish-todo-app",
    storageBucket: "swish-todo-app.appspot.com",
    messagingSenderId: "934715776301",
    appId: "1:934715776301:web:7b23804382cd07fff107a4",
    measurementId: "G-HJE6HT8SXD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
