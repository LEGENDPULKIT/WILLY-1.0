import * as firebase from 'firebase'
require('@firebase/firestore')

const firebaseConfig = {
    apiKey: "AIzaSyB6Ul17pCDYHbWZ9O_wcJlZpIsjwmTUZYU",
    authDomain: "willy-app-7e38d.firebaseapp.com",
    databaseURL: "https://willy-app-7e38d.firebaseio.com",
    projectId: "willy-app-7e38d",
    storageBucket: "willy-app-7e38d.appspot.com",
    messagingSenderId: "244173383301",
    appId: "1:244173383301:web:6494b3cf6976d7737e2bec"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();