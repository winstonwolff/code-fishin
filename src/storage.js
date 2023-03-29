'use strict'
/*
   Here's the console for our firebase:
     https://console.firebase.google.com/u/0/project/coding-competition-ww2023/database/coding-competition-ww2023-default-rtdb/data
   Docs:
     https://firebase.google.com/docs/database
 **/

console.debug('loading src/storage.js')
import { initializeApp } from "firebase/app"
import { getDatabase, ref, onValue, set } from "firebase/database"


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
  console.log('writePlayer playerId=', player.id)
  set(ref(db,`players/${player.id}`), player)
}

// Register a callback when players change
export const listenPlayers = (callback) => {
  onValue(ref(db, 'players/'), snapshot => {
    callback({
      playersDict: snapshot.val()
    })
  })
}

// Returns string with 128 bits of randomness, e.g. "212gxxdjm2hn"
export const uniqueId = () => {
 return (
   (Math.random()*0xffffffff | 0).toString(36) +
   (Math.random()*0xffffffff | 0).toString(36)
 )
}
