'use strict'

import { Player } from './player.js'

/*
    Execute user's script, returning a list of 'updatePlayer' functions the user has
    called.  Those functions take 'player' and return a modified Player
 */
export const evalPlayerScript = ({timeDeltaSec, script, keyTracker}) => {
  let playerUpdates = []

  const isKeyPressed = key => keyTracker.isPressed(key)

  const rudderPort = () => {
    playerUpdates.push( player => Player.rudderPort(player, timeDeltaSec) )
  }

  const rudderStarboard = () => {
    playerUpdates.push( player => Player.rudderStarboard(player, timeDeltaSec) )
  }

  // Provide a scope for user's script with the relevant functions and symbols
  // exposed, but not other symbols.
  console.log('script=', script)
  const scriptContainer = ({ isKeyPressed, rudderPort, rudderStarboard }) => {
    eval(script)
  }

  try {
    scriptContainer({ isKeyPressed, rudderPort, rudderStarboard })
  } catch(e) {
    playerUpdates = []
    console.error('evalPlayerScript:', e)
  }

  return playerUpdates
}
