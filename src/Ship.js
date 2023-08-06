import * as k from './constants.js'
import { X, Y } from './constants.js'
import * as random from './random.js'
import icepick from 'icepick'

//
//      Ship
//
const COLORS = [
  'blue', '#4E9258', '#6CBB3C', '#B2C248', '#EDE275', '#FFA62F',
  '#CD7F32', '#835C3B', '#C47451', '#C35817', '#F62817',
]
const ROT_PER_SEC = 1
const ACC_PER_SEC = 20
export const Ship = {
  new: () => {
    return {
      id: random.uniqueId(),
      pos: [ random.randRange(0, k.ARENA_WIDTH),
             random.randRange(0, k.ARENA_WIDTH)],
      direction: random.randRange(0, k.TAU), // in radians 0..6.t8
      speed: 25.0, // arena-units/sec
      color: random.choice(COLORS),
    }
  },

  checkKeys: (ship, timeDeltaSec, keyTracker) => {
    let newPlayer = ship
    // if (keyTracker.isPressed('a') || keyTracker.isPressed('ArrowLeft')) {
    //   newPlayer = Ship.rudderStarboard(newPlayer, timeDeltaSec)
    // }
    // if (keyTracker.isPressed('d') || keyTracker.isPressed('ArrowRight')) {
    //   newPlayer = Ship.rudderPort(newPlayer, timeDeltaSec)
    // }
    if (keyTracker.isPressed('w') || keyTracker.isPressed('ArrowUp')) {
      // accelerate
      newPlayer = icepick.assoc(newPlayer, 'speed',
        newPlayer.speed + ACC_PER_SEC * timeDeltaSec)
    }
    if (keyTracker.isPressed('s') || keyTracker.isPressed('ArrowDown')) {
      // decelerate
      newPlayer = icepick.assoc(newPlayer, 'speed',
        newPlayer.speed - ACC_PER_SEC * timeDeltaSec)
    }
    return newPlayer
  },

  rudderPort: (ship, timeDeltaSec) => {
      return icepick.assoc(ship, 'direction',
        ship.direction - ROT_PER_SEC * timeDeltaSec)
  },

  rudderStarboard: (ship, timeDeltaSec) => {
      return icepick.assoc(ship, 'direction',
        ship.direction + ROT_PER_SEC * timeDeltaSec)
  },

  think: (ship, timeDeltaSec) => {
    const deltaX = Math.cos(ship.direction) * ship.speed * timeDeltaSec
    const deltaY = Math.sin(ship.direction) * ship.speed * timeDeltaSec
    let newPlayer = icepick.assoc(ship, 'pos', [
      random.wrap(ship.pos[X] + deltaX, 0, k.ARENA_WIDTH),
      random.wrap(ship.pos[Y] + deltaY, 0, k.ARENA_WIDTH)
      // random.clamp(ship.pos[X] + deltaX, 0, k.ARENA_WIDTH),
      // random.clamp(ship.pos[Y] + deltaY, 0, k.ARENA_WIDTH)
    ])
    return newPlayer
  },
}
