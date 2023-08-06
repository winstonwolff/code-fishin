'use strict'
console.debug('loading src/storage.js')
/*
   Here's the console for our firebase:
     https://console.firebase.google.com/u/0/project/coding-competition-ww2023/database/coding-competition-ww2023-default-rtdb/data
   Docs:
     https://firebase.google.com/docs/database
 **/


import { initializeApp } from "firebase/app"
import { getDatabase, ref, onValue, set, remove } from "firebase/database"


const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://coding-competition-ww2023-default-rtdb.firebaseio.com/",
};

let version = "unknown"

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);

export const writeShip = ( ship ) => {
  // console.log('writeShip shipId=', ship.id)
  set(ref(db, `ships/${ship.id}`), ship)
}

export const removeShip = ( ship ) => {
  remove(ref(db, `ships/${ship.id}`))
}

// Register a callback when ships change
export const listenShips = (callback) => {
  onValue(ref(db, 'ships/'), snapshot => {
    callback({
      playersDict: snapshot.val() || []
    })
  })
}

export const clearShips = () => {
  remove( ref(db, 'ships'))
}
