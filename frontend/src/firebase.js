import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBTO-hV-phVt1PIbCxSlxZfDPw4pXFx6wo",
    authDomain: "gestor-estudiantil-cc5d7.firebaseapp.com",
    projectId: "gestor-estudiantil-cc5d7",
    storageBucket: "gestor-estudiantil-cc5d7.firebasestorage.app",
    messagingSenderId: "174141752061",
    appId: "1:174141752061:web:a34144aa9b9c7097817494",
    measurementId: "G-MJLFEDG51Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, GoogleAuthProvider, signInWithPopup };