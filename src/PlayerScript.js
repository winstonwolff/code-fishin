'use strict'

import { createElement as r } from "react"
import { Ship } from './Ship.js'
import { ConsoleMessages } from './UserConsole.js'

const INITIAL_SCRIPT = `
if (isKeyPressed("ArrowRight")) rudderStarboard()
// if (isKeyPressed("ArrowLeft")) rudderPort()
if (isKeyPressed("=")) throttle(+1)
if (isKeyPressed("-")) throttle(-1)
if (isKeyPressed("]")) mixture(+1)
if (isKeyPressed("[")) mixture(-1)
`.trim()

export class PlayerScript {

  static INITIAL_STATE = {
    playerScript: {
      script: INITIAL_SCRIPT,
      scriptHash: 0,
      lastEval: 0,
    }
  }

  // Change state with the new user's script
  static update(newScript, updateState) {
    updateState( (oldState) => ({
      playerScript: {
        script: newScript,
        scriptHash: hashCode(newScript),
        lastEval: oldState.playerScript.lastEval,
      }
    }))
  }

  /*
      Execute user's script, returning a list of 'updatePlayer' functions the user has
      called.  Those functions take 'ship' and return a modified Ship
   */
  static eval({timeDeltaSec, playerScript, keyTracker, updateState}) {
    let playerUpdates = []

    const PLAYER_COMMANDS = {
      isKeyPressed: key => keyTracker.isPressed(key),

      rudderPort: () => {
        playerUpdates.push( ship => Ship.rudderPort(ship, timeDeltaSec) )
      },

      rudderStarboard: () => {
        playerUpdates.push( ship => Ship.rudderStarboard(ship, timeDeltaSec) )
      },

      // direction = +1 or -1
      throttle: (direction) => {
        playerUpdates.push(
          ship => Ship.changeThrottle(ship, Ship.THROTTLE_PER_SEC * timeDeltaSec * Math.sign(direction))
        )
      },

      // direction = +1 or -1
      mixture: (direction) => {
        playerUpdates.push(
          ship => Ship.changeMixture(ship, Ship.MIXTURE_PER_SEC * timeDeltaSec * Math.sign(direction))
        )
      },
    }

    try {
      // Provide a scope for user's script with the relevant functions and symbols
      // exposed, but not other symbols.
      // console.log('script=', script)
      const scriptContainer = ({
        isKeyPressed,
        rudderPort,
        rudderStarboard,
        throttle,
        mixture,
      }) => {
        eval(playerScript.script)
      }

      scriptContainer(PLAYER_COMMANDS)
    } catch(e) {
      playerUpdates = []
      if (playerScript.lastEval !== playerScript.scriptHash) {
        console.error('evalPlayerScript:', e)
        ConsoleMessages.print( e, updateState )

        // Remember that we've already shown error for this version of script
        updateState( oldState => ({
          playerScript: {
            ...oldState.playerScript,
            lastEval: oldState.playerScript.scriptHash,
          }
        }))
      }
    }

    return playerUpdates
  }
}


// React view to show and edit the player's script
export const ScriptEditor = ({playerScript, updateState}) => {

  return (
    r('div',
      { class: 'ScriptEditor hack-panel' },
      [
        r('textarea',
          { rows: 10,
            value: playerScript.script,
            onChange: event => PlayerScript.update( event.target.value, updateState ),
            autocomplete: "off",
            autocorrect: "off",
            autocapitalize: "off",
            spellcheck: "false",
          }
        ),
      ]
    )
  )
}

// Returns 32 bit hash of a string. Not as good as MD5 or SHA-*
// see https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
const hashCode = str => {
  return str.split("").reduce(function(a, b) {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0)
}
