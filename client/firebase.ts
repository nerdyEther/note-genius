    import {initializeApp, getApps, getApp} from "firebase/app"
    import {getFirestore} from "firebase/firestore";

    const firebaseConfig = {
        apiKey: "AIzaSyBjhm-dQ47g7IK7wnhZX9qL9-xXvaSewE0",
        authDomain: "note-genius-1bdd7.firebaseapp.com",
        projectId: "note-genius-1bdd7",
        storageBucket: "note-genius-1bdd7.appspot.com",
        messagingSenderId: "103420619977",
        appId: "1:103420619977:web:e91199592415b7fd44f118"
      };

      const app= getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

      const db = getFirestore(app);

      export{db};