import { Ship } from './Ship.js'
import { ConsoleMessages } from './UserConsole.js'
import { PlayerScript } from './PlayerScript.js'

export const initialState = () => {
  const myShip = Ship.new()

  return {
    frameDeltaMillis: 0,
    myShip,
    ships: [myShip],
    ...ConsoleMessages.INITIAL_STATE,
    ...PlayerScript.INITIAL_STATE,
  }
}

/*
 want:
  combine state & actions in a decoupled way

    ship + rudderStarboard
    ship + rudderPort
    ship + adjustMixture
    ship + adjustThrottle
    codePanel + setCode
    codePanel + hasSyntaxError
    animation + setFrameTimeMillis
    ships + setPlayerList
*/
