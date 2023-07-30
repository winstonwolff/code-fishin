import { Player } from './player.js'
import { INIT_USER_CONSOLE } from './UserConsole.js'
import { INIT_PLAYER_SCRIPT } from './playerScript.js'

export const initialState = () => {
  const myPlayer = Player.new()

  return {
    frameDeltaMillis: 0,
    myPlayer,
    players: [myPlayer],
    script: 'if (isKeyPressed("ArrowRight")) rudderStarboard()\n'
          + '// if (isKeyPressed("ArrowLeft")) rudderPort()\n',
    ...INIT_USER_CONSOLE,
    ...INIT_PLAYER_SCRIPT,
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
