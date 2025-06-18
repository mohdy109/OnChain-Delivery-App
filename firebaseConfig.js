// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
function initializeFirebase(){    
  var config = {
     apiKey: "myApiKey",
     authDomain: "myAuthDomain",
     databaseURL: "myDatabaseUrl",
     storageBucket: "myStorageBocket",
     messagingSenderId: "idhere"   
    };   
    //initialize firebase  
    firebase.initializeApp(config);  
 }

