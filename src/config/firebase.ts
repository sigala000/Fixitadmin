import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAa1YO7ZZGz4NcuFfOmi0csa5_QigwQivE",
    authDomain: "fixit-f7e24.firebaseapp.com",
    projectId: "fixit-f7e24",
    storageBucket: "fixit-f7e24.firebasestorage.app",
    messagingSenderId: "268559208117",
    appId: "1:268559208117:web:382714488669f3bd2fb8fc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
