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

export const writePlayer = ( player ) => {
  // console.log('writePlayer playerId=', player.id)
  set(ref(db, `players/${player.id}`), player)
}

export const removePlayer = ( player ) => {
  remove(ref(db, `players/${player.id}`))
}

// Register a callback when players change
export const listenPlayers = (callback) => {
  onValue(ref(db, 'players/'), snapshot => {
    callback({
      playersDict: snapshot.val() || []
    })
  })
}

export const clearPlayers = () => {
  remove( ref(db, 'players'))
}
