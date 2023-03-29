'use strict'
/*
   Here's the console for our firebase:
     https://console.firebase.google.com/u/0/project/coding-competition-ww2023/database/coding-competition-ww2023-default-rtdb/data
   See: https://firebase.google.com/docs/web/learn-more#config-object
 **/

console.debug('loading src/storage.js')
import { initializeApp } from "firebase/app"
import { getDatabase, ref, onValue } from "firebase/database"


const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://coding-competition-ww2023-default-rtdb.firebaseio.com/",
};

let version = "unknown"

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('firebase app=', app)


// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
console.log('firebase db=', database)


export const fetchVersion = () => {
  onValue(ref(database, 'foo'), (snapshot) => {
    version = snapshot.val();
    console.log('version = ', version)
  })
}
