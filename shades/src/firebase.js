import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBGSNXe9WvL0z2Vsw9yHOJUWxXheVIr5tI",
    authDomain: "cityshades.firebaseapp.com",
    projectId: "cityshades",
    storageBucket: "cityshades.firebasestorage.app",
    messagingSenderId: "144129408966",
    appId: "1:144129408966:web:a88f3050271e7110043cc7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
