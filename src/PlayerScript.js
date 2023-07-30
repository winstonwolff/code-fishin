'use strict'

import React, { useState, useEffect, useRef, useReducer } from "react"
import { Player } from './Player.js'
import { ConsoleMessages } from './UserConsole.js'

const r = React.createElement


export class PlayerScript {

  static INITIAL_STATE = {
    playerScript: {
      script: 'if (isKeyPressed("ArrowRight")) rudderStarboard()\n'
              + '// if (isKeyPressed("ArrowLeft")) rudderPort()\n',
      scriptHash: 0,
      lastEval: 0,
    }
  }

  /*
      Execute user's script, returning a list of 'updatePlayer' functions the user has
      called.  Those functions take 'player' and return a modified Player
   */
  static eval({timeDeltaSec, playerScript, keyTracker, updateState}) {
    let playerUpdates = []

    const isKeyPressed = key => keyTracker.isPressed(key)

    const rudderPort = () => {
      playerUpdates.push( player => Player.rudderPort(player, timeDeltaSec) )
    }

    const rudderStarboard = () => {
      playerUpdates.push( player => Player.rudderStarboard(player, timeDeltaSec) )
    }

    try {
      // Provide a scope for user's script with the relevant functions and symbols
      // exposed, but not other symbols.
      // console.log('script=', script)
      const scriptContainer = ({ isKeyPressed, rudderPort, rudderStarboard }) => {
        eval(playerScript.script)
      }

      scriptContainer({ isKeyPressed, rudderPort, rudderStarboard })
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

  // Update state with the new user's script
  static update(newScript, updateState) {
    updateState( (oldState) => ({
      playerScript: {
        script: newScript,
        scriptHash: hashCode(newScript),
        lastEval: oldState.playerScript.lastEval,
      }
    }))
  }
}

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
