import { uniqueId } from './storage.js'
import * as k from './constants.js'

export const Player = {
  new: () => {
    return {
      id: uniqueId(),
      pos: [ Math.random() * k.STAGE_WIDTH, Math.random() * k.STAGE_WIDTH ],
      color: "blue",
    }
  }
}
