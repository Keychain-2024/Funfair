import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBjgoF0vRnU0x4bTRgO9evmJ1JD0k-39Zc",
  authDomain: "e-e60ae.firebaseapp.com",
  projectId: "e-e60ae",
  storageBucket: "e-e60ae.firebasestorage.app",
  messagingSenderId: "869284020508",
  appId: "1:869284020508:web:91f9102019fa9d3bc93ad9",
  measurementId: "G-9R70RSE6QH",
  databaseURL: "https://e-e60ae-default-rtdb.firebaseio.com" 
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

