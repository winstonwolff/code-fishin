'use strict'

import { Player } from './player.js'

/*
    Execute user's script, returning a list of 'actions' the user has called.
    Those actions will be functions that take 'player' and return a modified Player
 */
export const evalPlayerScript = ({timeDeltaSec, script, keyTracker}) => {
  let actions = []
  const isKeyPressed = key => keyTracker.isPressed(key)
  const rudderPort = () => {
    actions.push( player => Player.rudderPort(player, timeDeltaSec) )
  }
  const rudderStarboard = () => {
    actions.push( player => Player.rudderStarboard(player, timeDeltaSec) )
  }

  console.log('script=', script)
  const scriptContainer = ({ isKeyPressed, rudderPort, rudderStarboard }) => {
    eval(script)
  }
  try {
    scriptContainer({ isKeyPressed, rudderPort, rudderStarboard })
  } catch(e) {
    actions = []
    console.error('evalPlayerScript:', e)
  }

  return actions
}
