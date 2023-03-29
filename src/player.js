import * as k from './constants.js'
import * as random from './random.js'

const COLORS = [
  'blue', '#4E9258', '#6CBB3C', '#B2C248', '#EDE275', '#FFA62F',
  '#CD7F32', '#835C3B', '#C47451', '#C35817', '#F62817',
]
export const Player = {
  new: () => {
    return {
      id: random.uniqueId(),
      pos: [ random.randRange(0, k.STAGE_WIDTH),
             random.randRange(0, k.STAGE_WIDTH)],
      color: random.choice(COLORS),
    }
  }
}
