'use strict'

console.debug('loading src/index.js')

import React, { useState, useEffect, useRef, useReducer, createElement as r } from "react"
import ReactDOM from 'react-dom'
import icepick from 'icepick'
import * as storage from './storage.js'
import * as k from './constants.js'
import { X, Y } from './constants.js'
import { Ship } from './Ship.js'
import { KeyTracker } from './KeyTracker.js'
import { ScriptEditor, PlayerScript } from './PlayerScript.js'
import { useAnimationFrame } from './useAnimationFrame.js'
import { initialState } from './state.js'
import { UserConsole } from './UserConsole.js'
import * as util from './util.js'

const MIN_FRAME_MILLIS = 33

export const main = (arena_elem) => {
  ReactDOM.render(r(TheApp), arena_elem)
}

const keyTracker = new KeyTracker()

// handle updating things in the game
const onAnimationFrame = updateState => timeDeltaMillis => {
  const timeDeltaSec = timeDeltaMillis / 1000.0

  updateState( oldState => {
    let newShip = oldState.myShip

    // Run all the playerUpdate funcs
    newShip = Ship.think(newShip, timeDeltaSec)

    // Including the user's playerUpdates
    const playerUpdates = PlayerScript.eval({timeDeltaSec, keyTracker, playerScript: oldState.playerScript, updateState })
    newShip = playerUpdates.reduce(
      ((oldPlayer, playerUpdate) => playerUpdate(oldPlayer)),
      newShip
    )

    storage.writeShip(newShip)

    const stateChanges = {
      frameDeltaMillis: timeDeltaMillis,
      myShip: newShip,
    }
    return stateChanges
  })
}


// The game
const TheApp = () => {
  //
  //    Refs
  //
  // const animationHandle = useRef(null)
  const arenaRef = useRef(null)

  //
  //    State
  //
  //    'updateState' takes a function which modifies state. E.g.:
  //      updateState( oldState => ({...oldState, newValue: 999}))
  //    your mutation function's return value will be merged into 'oldState'
  //    so you can just return the parts you care about.
  //
  const [state, updateState] = useReducer(
    ((oldState, mergeFunc) => ({...oldState, ...mergeFunc(oldState)})),
    null,
    initialState)

  // Animation
  useAnimationFrame( onAnimationFrame(updateState), MIN_FRAME_MILLIS )

  const setup = () => {
    storage.writeShip(state.myShip)
    storage.listenShips(onPlayerChange)
    setTimeout(
      () => keyTracker.listen(arenaRef.current),
      10)
    return shutdown
  }
  useEffect(setup, [])

  const shutdown = () => {
    storage.removePlayer(mhyPlayer)
  }

  const onPlayerChange = ({playersDict}) => {
    const shipsList = Object.values(playersDict)
    // console.log('onPlayerchange ships=', shipsList)
    updateState( () => ({ ships: shipsList }))
  }

  const onClearPlayers = event => {
    storage.clearShips()
  }

  return (
    r('div', {class: "TheApp"}, [
      r(Arena, { ships: state.ships, ref: arenaRef }, [
        r(UserConsole, {consoleMessages: state.consoleMessages, updateState}),
      ]),
      r('div', { class: 'button-bar' }, [
        r('button',
          { onClick: onClearPlayers },
          [ 'Clear Stale Ships' ]),
        r('div', {},
          [`heading: ${Ship.heading(state.myShip)}`,
          ]),
        r('div', {},
          [`thr: ${util.round(state.myShip.throttle, 2)
          } mix: ${util.round(state.myShip.mixture, 2)
          } pow: ${util.round(Ship.power(state.myShip), 2)
          } spd: ${util.round(Ship.speed(state.myShip), 2)
          }`,
          ]),
      ]),
      r(ScriptEditor, {
        playerScript: state.playerScript,
        updateState
        // onChange: event => updateState( () => ({ script: event.target.value })),
        // onChange: event => updatePlayerScript( event.target.value, updateState ),
      }),
      r('div',
        { class: 'debug-info' }, [
        r('div', {}, [
          `frame millis: ${Math.floor(state.frameDeltaMillis)}`,
        ]),
      ])
    ])
  )
}


// The sea where the player's ship and other ships appear
const Arena = React.forwardRef(({ships, children}, ref) => {
  // console.log('Arena called. ships=', ships)
  return (
    r('div',
      {class: "Arena", tabIndex: 0, autofocus: 1, ref},
      [
        r('svg',
          { xmlns:"http://www.w3.org/2000/svg",
            viewBox: `0 0 ${k.ARENA_WIDTH} ${k.ARENA_WIDTH}`,
            width: "400",
            height: "400",
          },
          ships.map( ship => r(PlayerView, {ship}) )
        ),
        ...children,
      ]
    )
  )
})


// The player's ship
const PlayerView = ({ship}) => {
  return r('ellipse',
    { rx: 30,
      ry: 10,
      fill: ship.color,
      transform: (
        `translate(${Math.round(ship.pos[X])} ${Math.round(ship.pos[Y])}) `
        + ` rotate(${Math.round(ship.direction * k.RAD_TO_DEG)})`
      )
    }
  )
}



