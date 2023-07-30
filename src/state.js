import { Player } from './Player.js'
import { ConsoleMessages } from './UserConsole.js'
import { PlayerScript } from './PlayerScript.js'

export const initialState = () => {
  const myPlayer = Player.new()

  return {
    frameDeltaMillis: 0,
    myPlayer,
    players: [myPlayer],
    ...ConsoleMessages.INITIAL_STATE,
    ...PlayerScript.INITIAL_STATE,
  }
}

/*
 want:
  combine state & actions in a decoupled way

    player + rudderStarboard
    player + rudderPort
    player + adjustMixture
    player + adjustThrottle
    codePanel + setCode
    codePanel + hasSyntaxError
    animation + setFrameTimeMillis
    players + setPlayerList
*/
