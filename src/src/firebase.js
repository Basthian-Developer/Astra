import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCOgBfWaINc_Tv8p6Zxh4vwTzusnQzUEjA",
    authDomain: "novestella-3c66c.firebaseapp.com",
    projectId: "novestella-3c66c",
    storageBucket: "novestella-3c66c.firebasestorage.app",
    messagingSenderId: "419639137712",
    appId: "1:419639137712:web:da7c3f5c27b9fedcf67275",
    measurementId: "G-DKS8LLFG7J"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)