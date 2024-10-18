import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Importar AsyncStorage solo si planeas usarlo en otros módulos.
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAqNj_yYaDffWYCvsRd9jlhE_m5MlUHrcI",
  authDomain: "servitrade-e388b.firebaseapp.com",
  projectId: "servitrade-e388b",
  storageBucket: "servitrade-e388b.appspot.com",
  messagingSenderId: "650781860658",
  appId: "1:650781860658:android:aabbe7d0c7ef530cd9ad2b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default firebaseConfig;
