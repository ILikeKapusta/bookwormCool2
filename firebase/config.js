import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyBouwMuI2bQIvpcyIMT82d9dYBsZ-arbEg",
  authDomain: "bookworm-site.firebaseapp.com",
  projectId: "bookworm-site",
  storageBucket: "bookworm-site.appspot.com",
  messagingSenderId: "30422907816",
  appId: "1:30422907816:web:eac3a57d4f2eebd0c9bb9d",
  measurementId: "G-47MBYXCM17"
};

  
//init firebase  
const app = initializeApp(firebaseConfig)

//init firestore
const db = getFirestore(app)

//init authentication
const auth = getAuth(app)

//init cloud storage
const storage = getStorage(app)

export { db, auth, app, storage }