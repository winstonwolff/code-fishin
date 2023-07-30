'use strict'

import React, { useState, useEffect, useRef, useReducer } from "react"
import { Player } from './player.js'
import { updateConsole } from './UserConsole.js'

const r = React.createElement

export const INIT_PLAYER_SCRIPT = {
  playerScript: {
    script: 'if (isKeyPressed("ArrowRight")) rudderStarboard()\n'
            + '// if (isKeyPressed("ArrowLeft")) rudderPort()\n',
  }
}

/*
    Execute user's script, returning a list of 'updatePlayer' functions the user has
    called.  Those functions take 'player' and return a modified Player
 */
export const evalPlayerScript = ({timeDeltaSec, playerScript, keyTracker, updateState}) => {
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
    console.error('evalPlayerScript:', e)
    updateConsole( e, updateState )
  }

  return playerUpdates
}

const updatePlayerScript = (newScript, updateState) => {
  updateState( () => ({
    playerScript: {
      script: newScript
    }
  }))
}

export const ScriptEditor = ({playerScript, updateState}) => {

  return (
    r('div',
      { class: 'ScriptEditor hack-panel' },
      [
        r('textarea',
          { rows: 10,
            value: playerScript.script,
            onChange: event => updatePlayerScript( event.target.value, updateState ),
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
