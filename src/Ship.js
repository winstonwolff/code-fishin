import icepick from 'icepick'
import { X, Y } from './constants.js'
import * as k from './constants.js'
import * as util from './util.js'
import { clamp } from './util.js'

//
//      Ship
//
const COLORS = [
  'blue', '#4E9258', '#6CBB3C', '#B2C248', '#EDE275', '#FFA62F',
  '#CD7F32', '#835C3B', '#C47451', '#C35817', '#F62817',
]
export const ROT_PER_SEC = 1
export const SPEED_FACTOR = 200
export const Ship = {
  THROTTLE_PER_SEC: 0.2,
  MIXTURE_PER_SEC: 0.1,

  new: () => {
    return {
      id: util.uniqueId(),
      pos: [ util.randRange(0, k.ARENA_WIDTH),
             util.randRange(0, k.ARENA_WIDTH)],
      direction: util.randRange(0, k.TAU), // in radians 0..6.28
      color: util.choice(COLORS),
      throttle: 0.10, // 0..1
      mixture: 0.50, // 0..1
    }
  },

  heading: (ship) => Math.round(ship.direction * k.RAD_TO_DEG),

  rudderPort: (ship, timeDeltaSec) => {
      return icepick.assoc(
        ship,
        'direction',
        util.wrap(ship.direction - ROT_PER_SEC * timeDeltaSec, 0, k.TAU))
  },

  rudderStarboard: (ship, timeDeltaSec) => {
      return icepick.assoc(
        ship,
        'direction',
        util.wrap(ship.direction + ROT_PER_SEC * timeDeltaSec, 0, k.TAU))
  },

  // Returns new Ship with throttle value changed
  // amount = How much to adjust throttle, e.g. +5 or -10
  changeThrottle: (ship, amount) => {
    const newThrottle = util.clamp(ship.throttle + amount, 0, 1)
    return icepick.assoc(ship, 'throttle', newThrottle)
  },

  // Returns new Ship with mixture value changed
  // amount = How much to adjust mixture, e.g. 0.1 or -0.2
  changeMixture: (ship, amount) => {
    const newMixture = util.clamp(ship.mixture + amount, 0, 1)
    return icepick.assoc(ship, 'mixture', newMixture)
  },

  // How much power the motor is generating
  power: ({throttle, mixture}) => {
    return throttle
  },

  // returns speed through water
  speed: (ship) => {
    const p = Ship.power(ship)
    return (2 * p - Math.pow(p, 2)) * SPEED_FACTOR
  },

  think: (ship, timeDeltaSec) => {
    const speed = Ship.speed(ship)
    const deltaX = Math.cos(ship.direction) * speed * timeDeltaSec
    const deltaY = Math.sin(ship.direction) * speed * timeDeltaSec
    let newPlayer = icepick.assoc(ship, 'pos', [
      util.wrap(ship.pos[X] + deltaX, 0, k.ARENA_WIDTH),
      util.wrap(ship.pos[Y] + deltaY, 0, k.ARENA_WIDTH)
      // util.clamp(ship.pos[X] + deltaX, 0, k.ARENA_WIDTH),
      // util.clamp(ship.pos[Y] + deltaY, 0, k.ARENA_WIDTH)
    ])
    return newPlayer
  },
}
