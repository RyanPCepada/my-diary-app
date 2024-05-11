// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB062lsTLP5vJsmQ9EMO0ZeCyZzdkS_6vI",
  authDomain: "my-diary-app-676fd.firebaseapp.com",
  projectId: "my-diary-app-676fd",
  storageBucket: "my-diary-app-676fd.appspot.com",
  messagingSenderId: "177337493183",
  appId: "1:177337493183:web:0cf308a7d29c586209c80a",
  measurementId: "G-PFQGMQZKL5"
};


// Initialize Firebase

const firebaseApp = initializeApp(firebaseConfig);

// 
const db = getFirestore(firebaseApp);

export{db}