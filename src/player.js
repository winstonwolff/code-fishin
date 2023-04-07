import * as k from './constants.js'
import { X, Y } from './constants.js'
import * as random from './random.js'
import icepick from 'icepick'

//
//      Player
//
const COLORS = [
  'blue', '#4E9258', '#6CBB3C', '#B2C248', '#EDE275', '#FFA62F',
  '#CD7F32', '#835C3B', '#C47451', '#C35817', '#F62817',
]
const ROT_PER_SEC = 1
const ACC_PER_SEC = 20
export const Player = {
  new: () => {
    return {
      id: random.uniqueId(),
      pos: [ random.randRange(0, k.STAGE_WIDTH),
             random.randRange(0, k.STAGE_WIDTH)],
      direction: random.randRange(0, k.TAU), // in radians 0..6.t8
      speed: 25.0, // stage-units/sec
      color: random.choice(COLORS),
    }
  },

  checkKeys: (player, timeDeltaSec, keyTracker) => {
    let newPlayer = player
    // if (keyTracker.isPressed('a') || keyTracker.isPressed('ArrowLeft')) {
    //   newPlayer = Player.rudderStarboard(newPlayer, timeDeltaSec)
    // }
    // if (keyTracker.isPressed('d') || keyTracker.isPressed('ArrowRight')) {
    //   newPlayer = Player.rudderPort(newPlayer, timeDeltaSec)
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

  rudderPort: (player, timeDeltaSec) => {
      return icepick.assoc(player, 'direction',
        player.direction - ROT_PER_SEC * timeDeltaSec)
  },

  rudderStarboard: (player, timeDeltaSec) => {
      return icepick.assoc(player, 'direction',
        player.direction + ROT_PER_SEC * timeDeltaSec)
  },

  think: (player, timeDeltaSec) => {
    const deltaX = Math.cos(player.direction) * player.speed * timeDeltaSec
    const deltaY = Math.sin(player.direction) * player.speed * timeDeltaSec
    let newPlayer = icepick.assoc(player, 'pos', [
      random.clamp(player.pos[X] + deltaX, 0, k.STAGE_WIDTH),
      random.clamp(player.pos[Y] + deltaY, 0, k.STAGE_WIDTH)
    ])
    return newPlayer
  },
}
